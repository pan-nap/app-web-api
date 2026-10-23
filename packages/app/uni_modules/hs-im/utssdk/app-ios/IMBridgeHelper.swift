//
//  IMBridgeHelper.swift
//  hs-im UTS 插件 - iOS Swift 混编（TencentCloudIM 桥接）
//
//  说明：
//  1. iOS 原生混编仅支持 Swift 源码，OC 源码（.h/.m）不参与编译，
//     因此 TIM SDK（OC 接口）的桥接必须在 Swift 中完成，Swift 可直接调用 OC SDK。
//  2. UTS 层（app-ios/index.uts）直接调用本类静态方法；为保持 UTS 调用无参数标签，
//     所有对外方法的参数均使用 "_" 省略外部标签。
//  3. 数值参数/回调统一使用 Double，与 UTS number 类型对齐，内部再转换为 Int32/Int64。
//  4. UTS 与 SDK 回调线程不一致，所有回调统一 dispatch 到主线程再触发。
//

import Foundation
import TencentCloudIM

public class IMBridgeHelper: NSObject, V2TIMSDKListener, V2TIMAdvancedMsgListener {

    // ========== 单例与状态 ==========

    private static let shared = IMBridgeHelper()

    private var _isInitialized = false
    private var _isLoggedIn = false
    private var _currentUserId = ""

    // 消息 ID → 消息对象（删除/撤回/已读回执）
    private var _messageCache: [String: V2TIMMessage] = [:]
    // 本地消息列表（loadMessages）
    private var _localMessages: [V2TIMMessage] = []
    // 分页游标：userId → lastMsg（getC2CMessageList）
    private var _lastMsgForPagination: [String: V2TIMMessage] = [:]

    // ========== 回调 ==========

    private var _onLoginSuccess: (() -> Void)?
    private var _onLoginFailed: ((Double, String) -> Void)?
    private var _onLogoutSuccess: (() -> Void)?
    private var _onKickedOffline: (() -> Void)?
    private var _onUserSigExpired: (() -> Void)?
    private var _onConnecting: (() -> Void)?
    private var _onConnectSuccess: (() -> Void)?
    private var _onConnectFailed: ((Double, String) -> Void)?
    private var _onMessageReceived: ((String, String, Double, String, String, Double, Bool) -> Void)?
    private var _onMessageRevoked: ((String) -> Void)?

    // ========== 回调设置 ==========

    public static func setOnLoginSuccess(_ callback: (() -> Void)?) {
        shared._onLoginSuccess = callback
    }

    public static func setOnLoginFailed(_ callback: ((Double, String) -> Void)?) {
        shared._onLoginFailed = callback
    }

    public static func setOnLogoutSuccess(_ callback: (() -> Void)?) {
        shared._onLogoutSuccess = callback
    }

    public static func setOnKickedOffline(_ callback: (() -> Void)?) {
        shared._onKickedOffline = callback
    }

    public static func setOnUserSigExpired(_ callback: (() -> Void)?) {
        shared._onUserSigExpired = callback
    }

    public static func setOnConnecting(_ callback: (() -> Void)?) {
        shared._onConnecting = callback
    }

    public static func setOnConnectSuccess(_ callback: (() -> Void)?) {
        shared._onConnectSuccess = callback
    }

    public static func setOnConnectFailed(_ callback: ((Double, String) -> Void)?) {
        shared._onConnectFailed = callback
    }

    public static func setOnMessageReceived(_ callback: ((String, String, Double, String, String, Double, Bool) -> Void)?) {
        shared._onMessageReceived = callback
    }

    public static func setOnMessageRevoked(_ callback: ((String) -> Void)?) {
        shared._onMessageRevoked = callback
    }

    // ========== 工具方法 ==========

    /// 消息类型：0 文本 / 1 图片 / 2 视频 / 3 语音 / 4 自定义
    private static func messageType(_ msg: V2TIMMessage) -> Double {
        if msg.textElem != nil { return 0 }
        if msg.imageElem != nil { return 1 }
        if msg.videoElem != nil { return 2 }
        if msg.soundElem != nil { return 3 }
        if msg.customElem != nil { return 4 }
        return 0
    }

    private static func messageText(_ msg: V2TIMMessage) -> String {
        return msg.textElem?.text ?? ""
    }

    /// 附加数据：图片路径 / 视频路径|封面|时长 / 语音路径|时长 / 自定义数据
    private static func messageExtra(_ msg: V2TIMMessage) -> String {
        if let image = msg.imageElem {
            return image.path ?? ""
        }
        if let video = msg.videoElem {
            let videoPath = video.videoPath ?? ""
            let snapshotPath = video.snapshotPath ?? ""
            return videoPath + "|" + snapshotPath + "|" + String(video.duration)
        }
        if let sound = msg.soundElem {
            let soundPath = sound.path ?? ""
            return soundPath + "|" + String(sound.duration)
        }
        if let custom = msg.customElem, let data = custom.data {
            return String(data: data, encoding: .utf8) ?? ""
        }
        return ""
    }

    private static func cacheMessage(_ msg: V2TIMMessage) {
        guard let msgId = msg.msgID, !msgId.isEmpty else { return }
        shared._messageCache[msgId] = msg
        shared._localMessages.append(msg)
    }

    /// 去除 file:// 前缀，SDK 只接受本地沙盒路径
    private static func normalizePath(_ path: String) -> String {
        if path.hasPrefix("file://") {
            return String(path.dropFirst(7))
        }
        return path
    }

    // ========== 初始化与登录 ==========

    public static func initWithSdkAppId(_ sdkAppId: Double) -> Bool {
        if shared._isInitialized {
            NSLog("IMBridgeHelper: 已初始化，跳过")
            return true
        }

        let config = V2TIMSDKConfig()
        config.logLevel = .V2TIM_LOG_INFO

        let ok = V2TIMManager.sharedInstance().initSDK(Int32(sdkAppId), config: config, listener: shared)
        if ok {
            shared._isInitialized = true
            // 高级消息监听（文本/自定义/富媒体/撤回）
            V2TIMManager.sharedInstance().addAdvancedMsgListener(listener: shared)
            NSLog("IMBridgeHelper: init 成功 sdkAppId=\(Int32(sdkAppId))")
        } else {
            NSLog("IMBridgeHelper: init 失败")
        }
        return ok
    }

    public static func isInitialized() -> Bool {
        return shared._isInitialized
    }

    public static func login(_ userId: String, _ userSig: String) -> Bool {
        if !shared._isInitialized {
            NSLog("IMBridgeHelper: 未初始化")
            return false
        }

        if shared._isLoggedIn {
            V2TIMManager.sharedInstance().logout(nil, fail: nil)
            shared._isLoggedIn = false
            shared._currentUserId = ""
        }

        V2TIMManager.sharedInstance().login(userID: userId, userSig: userSig, succ: {
            NSLog("IMBridgeHelper: 登录成功 userId=\(userId)")
            shared._isLoggedIn = true
            shared._currentUserId = userId
            DispatchQueue.main.async {
                shared._onLoginSuccess?()
            }
        }, fail: { code, desc in
            NSLog("IMBridgeHelper: 登录失败 code=\(code), desc=\(desc ?? "")")
            DispatchQueue.main.async {
                shared._onLoginFailed?(Double(code), desc ?? "未知错误")
            }
        })

        return true
    }

    public static func logout() -> Bool {
        if !shared._isInitialized { return false }

        V2TIMManager.sharedInstance().logout({
            NSLog("IMBridgeHelper: 登出成功")
            shared._isLoggedIn = false
            shared._currentUserId = ""
            DispatchQueue.main.async {
                shared._onLogoutSuccess?()
            }
        }, fail: { code, desc in
            NSLog("IMBridgeHelper: 登出失败 code=\(code), desc=\(desc ?? "")")
            shared._isLoggedIn = false
            shared._currentUserId = ""
            DispatchQueue.main.async {
                shared._onLogoutSuccess?()
            }
        })

        return true
    }

    public static func isLoggedIn() -> Bool {
        return shared._isLoggedIn
    }

    public static func getCurrentUserId() -> String {
        return shared._currentUserId
    }

    // ========== 消息发送 ==========

    private static func sendMessageInternal(_ msg: V2TIMMessage?, _ toUserId: String) -> String {
        guard let msg = msg, shared._isLoggedIn else { return "" }

        var msgId = msg.msgID ?? ""
        if msgId.isEmpty {
            msgId = UUID().uuidString
            shared._messageCache[msgId] = msg
            shared._localMessages.append(msg)
        } else {
            cacheMessage(msg)
        }

        V2TIMManager.sharedInstance().sendMessage(message: msg, receiver: toUserId, groupID: nil,
                                                  priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false,
                                                  offlinePushInfo: nil, progress: nil, succ: {
            NSLog("IMBridgeHelper: 消息发送成功 tempMsgId=\(msgId)")
            cacheMessage(msg)
        }, fail: { code, desc in
            NSLog("IMBridgeHelper: 消息发送失败 code=\(code), desc=\(desc ?? "")")
        })

        return msgId
    }

    public static func sendTextMessage(_ toUserId: String, _ text: String) -> String {
        if text.isEmpty { return "" }
        let msg = V2TIMManager.sharedInstance().createTextMessage(text: text)
        NSLog("IMBridgeHelper: 发送文本消息 to=\(toUserId), text=\(text)")
        return sendMessageInternal(msg, toUserId)
    }

    public static func sendImageMessage(_ toUserId: String, _ imagePath: String) -> String {
        if imagePath.isEmpty { return "" }
        let msg = V2TIMManager.sharedInstance().createImageMessage(imagePath: normalizePath(imagePath))
        NSLog("IMBridgeHelper: 发送图片消息 to=\(toUserId), path=\(imagePath)")
        return sendMessageInternal(msg, toUserId)
    }

    public static func sendVideoMessage(_ toUserId: String, _ videoPath: String, _ videoType: Double, _ duration: Double, _ snapshotPath: String) -> String {
        if videoPath.isEmpty { return "" }

        let realVideoPath = normalizePath(videoPath)
        let realSnapshotPath = normalizePath(snapshotPath)
        // 视频类型取文件扩展名（videoType 仅为与 Android 端接口对齐，SDK 需要类型字符串）
        let fileExt = (realVideoPath as NSString).pathExtension
        let type = fileExt.isEmpty ? "mp4" : fileExt

        let msg = V2TIMManager.sharedInstance().createVideoMessage(videoFilePath: realVideoPath, type: type,
                                                                   duration: Int32(duration),
                                                                   snapshotPath: realSnapshotPath)
        NSLog("IMBridgeHelper: 发送视频消息 to=\(toUserId), path=\(realVideoPath), type=\(type)")
        return sendMessageInternal(msg, toUserId)
    }

    public static func sendVoiceMessage(_ toUserId: String, _ voicePath: String, _ duration: Double) -> String {
        if voicePath.isEmpty { return "" }
        let realPath = normalizePath(voicePath)
        let msg = V2TIMManager.sharedInstance().createSoundMessage(audioFilePath: realPath, duration: Int32(duration))
        NSLog("IMBridgeHelper: 发送语音消息 to=\(toUserId), path=\(realPath)")
        return sendMessageInternal(msg, toUserId)
    }

    public static func sendCustomMessage(_ toUserId: String, _ data: String, _ desc: String, _ ext: String) -> String {
        let customData = data.data(using: .utf8) ?? Data()
        let msg = V2TIMManager.sharedInstance().createCustomMessage(data: customData, desc: desc, ext: ext)
        NSLog("IMBridgeHelper: 发送自定义消息 to=\(toUserId), desc=\(desc)")
        return sendMessageInternal(msg, toUserId)
    }

    // ========== 消息历史记录 ==========

    public static func getC2CMessageList(_ peerUserId: String, _ count: Double, _ lastMsgId: String,
                                         _ onItem: ((String, String, Double, String, String, Double, Bool) -> Void)?,
                                         _ onComplete: ((Double, String) -> Void)?) {
        if !shared._isInitialized {
            onComplete?(0, "未初始化")
            return
        }
        if !shared._isLoggedIn {
            onComplete?(0, "未登录")
            return
        }

        var lastMsg: V2TIMMessage? = nil
        if !lastMsgId.isEmpty {
            lastMsg = shared._messageCache[lastMsgId]
        }

        V2TIMManager.sharedInstance().getC2CHistoryMessageList(userID: peerUserId, count: Int32(count), lastMsg: lastMsg, succ: { list in
            if list.isEmpty {
                DispatchQueue.main.async {
                    onComplete?(0, "")
                }
                return
            }

            for msg in list {
                cacheMessage(msg)
                let msgId = msg.msgID ?? ""
                let sender = msg.sender ?? ""
                let type = messageType(msg)
                let text = messageText(msg)
                let extra = messageExtra(msg)
                // V2TIMMessage.timestamp 为 NSDate，转为毫秒时间戳（JS new Date(ms)）
                let ts = msg.timestamp.timeIntervalSince1970 * 1000
                let isSelf = sender == shared._currentUserId
                DispatchQueue.main.async {
                    onItem?(msgId, sender, type, text, extra, ts, isSelf)
                }
            }

            // 更新分页游标
            if let last = list.last {
                shared._lastMsgForPagination[peerUserId] = last
            }

            NSLog("IMBridgeHelper: getC2CMessageList 返回 \(list.count) 条")
            DispatchQueue.main.async {
                onComplete?(Double(list.count), "")
            }
        }, fail: { code, desc in
            NSLog("IMBridgeHelper: getC2CMessageList 失败 code=\(code)")
            DispatchQueue.main.async {
                onComplete?(0, desc ?? "未知错误")
            }
        })
    }

    public static func loadMessages(_ peerUserId: String, _ count: Double,
                                    _ onItem: ((String, String, Double, String, String, Double, Bool) -> Void)?,
                                    _ onComplete: ((Double, String) -> Void)?) {
        if !shared._isInitialized {
            onComplete?(0, "未初始化")
            return
        }
        if !shared._isLoggedIn {
            onComplete?(0, "未登录")
            return
        }

        var matched: [V2TIMMessage] = []
        for msg in shared._localMessages {
            let sender = msg.sender ?? ""
            let peer = msg.userID ?? ""
            let isPeerMsg = sender == peerUserId || (sender == shared._currentUserId && peer == peerUserId)
            if isPeerMsg {
                matched.append(msg)
            }
        }

        let limit = max(0, Int(count))
        if matched.count > limit {
            matched = Array(matched.suffix(limit))
        }

        for msg in matched {
            let msgId = msg.msgID ?? ""
            let sender = msg.sender ?? ""
            let type = messageType(msg)
            let text = messageText(msg)
            let extra = messageExtra(msg)
            // V2TIMMessage.timestamp 为 NSDate，转为毫秒时间戳
            let ts = msg.timestamp.timeIntervalSince1970 * 1000
            let isSelf = sender == shared._currentUserId
            DispatchQueue.main.async {
                onItem?(msgId, sender, type, text, extra, ts, isSelf)
            }
        }

        NSLog("IMBridgeHelper: loadMessages 返回本地消息 \(matched.count) 条")
        DispatchQueue.main.async {
            onComplete?(Double(matched.count), "")
        }
    }

    // ========== 消息管理 ==========

    public static func deleteMessage(_ msgId: String) -> Bool {
        guard let msg = shared._messageCache[msgId] else { return false }

        V2TIMManager.sharedInstance().deleteMessageFromLocalStorage(msg: msg, succ: {
            NSLog("IMBridgeHelper: 消息删除成功 msgId=\(msgId)")
            shared._messageCache.removeValue(forKey: msgId)
            shared._localMessages.removeAll { $0.msgID == msgId }
        }, fail: { code, desc in
            NSLog("IMBridgeHelper: 消息删除失败 code=\(code), desc=\(desc ?? "")")
        })

        return true
    }

    public static func revokeMessage(_ msgId: String) -> Bool {
        guard let msg = shared._messageCache[msgId] else { return false }

        V2TIMManager.sharedInstance().revokeMessage(msg: msg, succ: {
            NSLog("IMBridgeHelper: 消息撤回成功 msgId=\(msgId)")
        }, fail: { code, desc in
            NSLog("IMBridgeHelper: 消息撤回失败 code=\(code), desc=\(desc ?? "")")
        })

        return true
    }

    // ========== 已读标记 ==========

    public static func markC2CMessageAsRead(_ userId: String) -> Bool {
        if !shared._isInitialized { return false }

        V2TIMManager.sharedInstance().markC2CMessageAsRead(userId, succ: {
            NSLog("IMBridgeHelper: 单聊已读标记成功 userId=\(userId)")
        }, fail: { code, _ in
            NSLog("IMBridgeHelper: 单聊已读标记失败 code=\(code)")
        })

        return true
    }

    public static func markGroupMessageAsRead(_ groupId: String) -> Bool {
        if !shared._isInitialized { return false }

        V2TIMManager.sharedInstance().markGroupMessageAsRead(groupId, succ: {
            NSLog("IMBridgeHelper: 群聊已读标记成功 groupId=\(groupId)")
        }, fail: { code, _ in
            NSLog("IMBridgeHelper: 群聊已读标记失败 code=\(code)")
        })

        return true
    }

    public static func sendMessageReadReceipts(_ msgIds: String) -> Bool {
        let ids = msgIds.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }
        let messages = ids.compactMap { shared._messageCache[$0] }
        if messages.isEmpty { return false }

        V2TIMManager.sharedInstance().sendMessageReadReceipts(messageList: messages, succ: {
            NSLog("IMBridgeHelper: 已读回执发送成功")
        }, fail: { code, _ in
            NSLog("IMBridgeHelper: 已读回执发送失败 code=\(code)")
        })

        return true
    }

    // ========== 资源释放 ==========

    public static func destroy() {
        if shared._isInitialized {
            V2TIMManager.sharedInstance().logout(nil, fail: nil)
            V2TIMManager.sharedInstance().unInitSDK()
        }

        shared._onLoginSuccess = nil
        shared._onLoginFailed = nil
        shared._onLogoutSuccess = nil
        shared._onKickedOffline = nil
        shared._onUserSigExpired = nil
        shared._onConnecting = nil
        shared._onConnectSuccess = nil
        shared._onConnectFailed = nil
        shared._onMessageReceived = nil
        shared._onMessageRevoked = nil

        shared._isInitialized = false
        shared._isLoggedIn = false
        shared._currentUserId = ""
        shared._messageCache.removeAll()
        shared._localMessages.removeAll()
        shared._lastMsgForPagination.removeAll()

        NSLog("IMBridgeHelper: 已销毁")
    }

    // ========== V2TIMSDKListener ==========

    public func onConnecting() {
        DispatchQueue.main.async {
            IMBridgeHelper.shared._onConnecting?()
        }
    }

    public func onConnectSuccess() {
        DispatchQueue.main.async {
            IMBridgeHelper.shared._onConnectSuccess?()
        }
    }

    public func onConnectFailed(_ code: Int32, err: String?) {
        NSLog("IMBridgeHelper: 连接失败 code=\(code), err=\(err ?? "")")
        DispatchQueue.main.async {
            IMBridgeHelper.shared._onConnectFailed?(Double(code), err ?? "")
        }
    }

    public func onKickedOffline() {
        NSLog("IMBridgeHelper: 被踢下线")
        _isLoggedIn = false
        _currentUserId = ""
        DispatchQueue.main.async {
            IMBridgeHelper.shared._onKickedOffline?()
        }
    }

    public func onUserSigExpired() {
        NSLog("IMBridgeHelper: UserSig 过期")
        _isLoggedIn = false
        _currentUserId = ""
        DispatchQueue.main.async {
            IMBridgeHelper.shared._onUserSigExpired?()
        }
    }

    // ========== V2TIMAdvancedMsgListener ==========

    public func onRecvNewMessage(msg: V2TIMMessage) {
        let msgId = msg.msgID ?? ""
        let sender = msg.sender ?? ""
        let type = IMBridgeHelper.messageType(msg)
        let text = IMBridgeHelper.messageText(msg)
        let extra = IMBridgeHelper.messageExtra(msg)
        // V2TIMMessage.timestamp 为 NSDate，转为毫秒时间戳
        let ts = msg.timestamp.timeIntervalSince1970 * 1000
        let isSelf = sender == _currentUserId

        NSLog("IMBridgeHelper: 收到消息 msgId=\(msgId), from=\(sender), type=\(type)")
        IMBridgeHelper.cacheMessage(msg)

        DispatchQueue.main.async {
            IMBridgeHelper.shared._onMessageReceived?(msgId, sender, type, text, extra, ts, isSelf)
        }
    }

    public func onRecvMessageRevoked(_ msgID: String) {
        NSLog("IMBridgeHelper: 消息被撤回 msgId=\(msgID)")
        DispatchQueue.main.async {
            IMBridgeHelper.shared._onMessageRevoked?(msgID)
        }
    }
}
