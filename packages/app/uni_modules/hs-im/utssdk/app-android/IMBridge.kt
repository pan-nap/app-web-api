package hs.im

import android.content.Context
import com.tencent.imsdk.v2.V2TIMMessageReceipt
import io.dcloud.uts.console
import com.tencent.imsdk.v2.V2TIMManager
import com.tencent.imsdk.v2.V2TIMSDKConfig
import com.tencent.imsdk.v2.V2TIMCallback
import com.tencent.imsdk.v2.V2TIMMessage
import com.tencent.imsdk.v2.V2TIMSDKListener
import com.tencent.imsdk.v2.V2TIMAdvancedMsgListener
import com.tencent.imsdk.v2.V2TIMSendCallback
import com.tencent.imsdk.v2.V2TIMOfflinePushInfo
import com.tencent.imsdk.v2.V2TIMValueCallback

/**
 * 腾讯 IM SDK 桥接类
 * 直接使用 V2TIMManager SDK 类（自定义基座下编译通过）。
 * UTS 端直接调用本类的静态方法，无需反射。
 *
 * 包名 hs.im —— UTS 中通过 import { IMBridge } from 'hs.im' 导入。
 */
class IMBridge private constructor() {

    companion object {

        // ========== 消息类型常量 ==========
        const val MSG_TYPE_TEXT = 0
        const val MSG_TYPE_IMAGE = 1
        const val MSG_TYPE_VIDEO = 2
        const val MSG_TYPE_VOICE = 3
        const val MSG_TYPE_CUSTOM = 4

        private var manager: V2TIMManager? = null
        private var _isLoggedIn: Boolean = false
        private var _currentUserId: String = ""
        private var _context: Context? = null

        // 本地消息缓存（用于 loadMessages / getMessageList 返回历史记录）
        private val _localMessages = mutableListOf<V2TIMMessage>()
        // 消息 ID → V2TIMMessage 映射（用于删除/撤回/已读回执）
        private val _messageCache = mutableMapOf<String, V2TIMMessage>()
        // 分页游标：userId → lastMsg
        private val _lastMsgForPagination = mutableMapOf<String, V2TIMMessage>()

        // ========== 回调 ==========
        private var _onKickedOffline: (() -> Unit)? = null
        private var _onUserSigExpired: (() -> Unit)? = null
        private var _onConnecting: (() -> Unit)? = null
        private var _onConnectSuccess: (() -> Unit)? = null
        private var _onConnectFailed: ((Int, String) -> Unit)? = null
        // (msgId, sender, type, text, extra, timestamp, isSelf)
        private var _onMessageReceived: ((String, String, Int, String, String, Long, Boolean) -> Unit)? = null
        // (msgId, sender, type, text, extra, timestamp, isSelf)
        private var _onMessageRevoked: ((String) -> Unit)? = null
        private var _onLoginSuccess: (() -> Unit)? = null
        private var _onLoginFailed: ((Int, String) -> Unit)? = null
        private var _onLogoutSuccess: (() -> Unit)? = null
        private var _onMessageSendSuccess: ((String, String) -> Unit)? = null
        // 最近一次视频消息的封面路径（供 UTS 层在创建本地消息时使用）
        private var _lastVideoSnapshotPath: String = ""

        // ---------- 回调注册方法 ----------

        @JvmStatic
        fun setOnKickedOffline(cb: (() -> Unit)?) { _onKickedOffline = cb }

        @JvmStatic
        fun setOnUserSigExpired(cb: (() -> Unit)?) { _onUserSigExpired = cb }

        @JvmStatic
        fun setOnConnecting(cb: (() -> Unit)?) { _onConnecting = cb }

        @JvmStatic
        fun setOnConnectSuccess(cb: (() -> Unit)?) { _onConnectSuccess = cb }

        @JvmStatic
        fun setOnConnectFailed(cb: ((Int, String) -> Unit)?) { _onConnectFailed = cb }

        @JvmStatic
        fun setOnMessageReceived(cb: ((String, String, Int, String, String, Long, Boolean) -> Unit)?) {
            _onMessageReceived = cb
        }

        @JvmStatic
        fun setOnMessageRevoked(cb: ((String) -> Unit)?) { _onMessageRevoked = cb }

        @JvmStatic
        fun setOnLoginSuccess(cb: (() -> Unit)?) { _onLoginSuccess = cb }

        @JvmStatic
        fun setOnLoginFailed(cb: ((Int, String) -> Unit)?) { _onLoginFailed = cb }

        @JvmStatic
        fun setOnLogoutSuccess(cb: (() -> Unit)?) { _onLogoutSuccess = cb }

        @JvmStatic
        fun setOnMessageSendSuccess(cb: ((String, String) -> Unit)?) { _onMessageSendSuccess = cb }

        // ========== 工具方法 ==========

        private fun getMessageType(msg: V2TIMMessage): Int {
            return when {
                msg.textElem != null -> MSG_TYPE_TEXT
                msg.imageElem != null -> MSG_TYPE_IMAGE
                msg.videoElem != null -> MSG_TYPE_VIDEO
                msg.soundElem != null -> MSG_TYPE_VOICE
                msg.customElem != null -> MSG_TYPE_CUSTOM
                else -> MSG_TYPE_TEXT
            }
        }

        private fun getMessageText(msg: V2TIMMessage): String {
            val elem = msg.textElem ?: return ""
            return elem.text ?: ""
        }

        /** 获取消息的附加数据（图片路径/视频路径/语音路径/自定义数据等） */
        private fun getMessageExtra(msg: V2TIMMessage): String {
            return when {
                msg.imageElem != null -> {
                    val img = msg.imageElem
                    img.path ?: ""
                }
                msg.videoElem != null -> {
                    val v = msg.videoElem
                    (v.videoPath ?: "") + "|" + (v.snapshotPath ?: "") + "|" + v.duration
                }
                msg.soundElem != null -> {
                    val s = msg.soundElem
                    (s.path ?: "") + "|" + s.dataSize
                }
                msg.customElem != null -> {
                    val c = msg.customElem
                    val bytes = c.data
                    if (bytes != null) String(bytes, Charsets.UTF_8) else ""
                }
                else -> ""
            }
        }

        /** 缓存消息（用于删除/撤回/已读回执） */
        private fun cacheMessage(msg: V2TIMMessage) {
            val id = msg.msgID ?: return
            _messageCache[id] = msg
            _localMessages.add(msg)
        }

        // ========== 初始化 ==========

        @JvmStatic
        fun init(context: Context, sdkAppId: Long): Boolean {
            if (manager != null) {
                console.log("IMBridge: 已初始化，跳过")
                return true
            }
            try {
                val mgr = V2TIMManager.getInstance()
                val config = V2TIMSDKConfig()
                val ok = mgr.initSDK(context, sdkAppId.toInt(), config)
                manager = mgr
                _context = context
                console.log("IMBridge: init 结果=" + ok + ", sdkAppId=" + sdkAppId)
                registerListeners(mgr)
                return ok
            } catch (e: Exception) {
                console.log("IMBridge: init 异常 - " + e.message)
                return false
            }
        }

        @JvmStatic
        fun isInitialized(): Boolean = manager != null

        // ========== 登录 / 登出 ==========

        @JvmStatic
        fun login(userId: String, userSig: String): Boolean {
            val mgr = manager ?: return false
            if (_isLoggedIn) {
                mgr.logout(null)
                _isLoggedIn = false
                _currentUserId = ""
            }
            mgr.login(userId, userSig, object : V2TIMCallback {
                override fun onSuccess() {
                    console.log("IMBridge: 登录成功 userId=" + userId)
                    _isLoggedIn = true
                    _currentUserId = userId
                    _onLoginSuccess?.invoke()
                }
                override fun onError(code: Int, desc: String?) {
                    val msg = desc ?: "未知错误"
                    console.log("IMBridge: 登录失败 code=" + code + ", desc=" + msg)
                    _onLoginFailed?.invoke(code, msg)
                }
            })
            return true
        }

        @JvmStatic
        fun logout(): Boolean {
            val mgr = manager ?: return false
            mgr.logout(object : V2TIMCallback {
                override fun onSuccess() {
                    console.log("IMBridge: 登出成功")
                    _isLoggedIn = false
                    _currentUserId = ""
                    _onLogoutSuccess?.invoke()
                }
                override fun onError(code: Int, desc: String?) {
                    _isLoggedIn = false
                    _currentUserId = ""
                    _onLogoutSuccess?.invoke()
                }
            })
            return true
        }

        @JvmStatic
        fun isLoggedIn(): Boolean = _isLoggedIn

        @JvmStatic
        fun getCurrentUserId(): String = _currentUserId

        // ========== 消息发送 ==========

        /** 内部：发送 V2TIMMessage，返回 msgId，失败返回空串 */
        private fun sendMessageInternal(msg: V2TIMMessage?, toUserId: String): String {
            val mgr = manager ?: return ""
            if (msg == null || !_isLoggedIn) return ""
            var msgId = msg.msgID ?: ""
            if (msgId.isEmpty()) {
                msgId = java.util.UUID.randomUUID().toString()
                console.log("IMBridge: 生成临时 msgId=" + msgId)
            }
            cacheMessage(msg)
            V2TIMManager.getMessageManager().sendMessage(
                msg, toUserId, "", V2TIMMessage.V2TIM_PRIORITY_DEFAULT, false, null,
                object : V2TIMSendCallback<V2TIMMessage> {
                    override fun onSuccess(message: V2TIMMessage) {
                        val realMsgId = message.msgID ?: ""
                        console.log("IMBridge: 消息发送成功 tempMsgId=" + msgId + ", realMsgId=" + realMsgId)
                        cacheMessage(message)
                        if (realMsgId.isNotEmpty() && realMsgId != msgId) {
                            _onMessageSendSuccess?.invoke(msgId, realMsgId)
                        }
                    }
                    override fun onError(code: Int, desc: String?) {
                        console.log("IMBridge: 消息发送失败 code=" + code + ", desc=" + (desc ?: ""))
                    }
                    override fun onProgress(progress: Int) {}
                })
            return msgId
        }

        @JvmStatic
        fun sendTextMessage(toUserId: String, text: String): String {
            if (text.isEmpty()) return ""
            val msg = V2TIMManager.getMessageManager().createTextMessage(text)
            console.log("IMBridge: 发送文本消息 to=" + toUserId + ", text=" + text)
            return sendMessageInternal(msg, toUserId)
        }

        @JvmStatic
        fun sendImageMessage(toUserId: String, imagePath: String): String {
            console.log("IMBridge: sendImageMessage 开始, to=" + toUserId + ", path=" + imagePath)
            if (imagePath.isEmpty()) {
                console.error("IMBridge: 图片路径为空")
                return ""
            }
            val realPath = if (imagePath.startsWith("file://")) imagePath.substring(7) else imagePath
            val msg = V2TIMManager.getMessageManager().createImageMessage(realPath)
            console.log("IMBridge: createImageMessage 结果, msg=" + msg + ", msgId=" + (msg?.msgID ?: "null"))
            if (msg == null) {
                console.error("IMBridge: createImageMessage 返回 null, 路径可能无效: " + imagePath)
                return ""
            }
            console.log("IMBridge: 发送图片消息=>>> to=" + toUserId + ", path=" + imagePath)
            return sendMessageInternal(msg, toUserId)
        }

        @JvmStatic
        fun sendVideoMessage(toUserId: String, videoPath: String, videoType: Int, duration: Int, snapshotPath: String): String {
            if (videoPath.isEmpty()) return ""
            val realVideoPath = if (videoPath.startsWith("file://")) videoPath.substring(7) else videoPath
            // 验证视频文件存在
            val videoFile = java.io.File(realVideoPath)
            if (!videoFile.exists() || videoFile.length() == 0L) {
                console.log("IMBridge: 视频文件不存在或为空, path=" + realVideoPath)
                return ""
            }
            var realSnapshotPath = if (snapshotPath.startsWith("file://")) snapshotPath.substring(7) else snapshotPath
            if (realSnapshotPath.isEmpty()) {
                realSnapshotPath = generateVideoSnapshot(realVideoPath)
                console.log("IMBridge: 自动生成封面 snapshot=" + realSnapshotPath)
            }
            // 验证封面文件存在
            if (realSnapshotPath.isNotEmpty()) {
                val snapFile = java.io.File(realSnapshotPath)
                if (!snapFile.exists() || snapFile.length() == 0L) {
                    console.log("IMBridge: 封面文件无效（不存在或为空），重新生成")
                    realSnapshotPath = generateVideoSnapshot(realVideoPath)
                }
            }
            // 提取视频文件扩展名作为 type
            val fileExt = videoFile.extension.ifEmpty { "mp4" }
            console.log("IMBridge: createVideoMessage realPath=" + realVideoPath + ", snapshot=" + realSnapshotPath + ", duration=" + duration + ", type=" + fileExt)
            // 参数顺序：(videoFilePath, type, duration, snapshotFilePath)
            val msg = V2TIMManager.getMessageManager().createVideoMessage(realVideoPath, fileExt, duration, realSnapshotPath)
            val msgResult = if (msg == null) "null" else "success"
            console.log("IMBridge: createVideoMessage result=" + msgResult)
            if (msg != null && realSnapshotPath.isNotEmpty()) {
                _lastVideoSnapshotPath = realSnapshotPath
            }
            console.log("IMBridge: 发送视频消息 to=" + toUserId + ", path=" + videoPath)
            return sendMessageInternal(msg, toUserId)
        }

        @JvmStatic
        fun getLastVideoSnapshotPath(): String = _lastVideoSnapshotPath

        private fun generateVideoSnapshot(videoPath: String): String {
            try {
                // 优先使用 MediaMetadataRetriever（兼容 Android 10+）
                var bitmap: android.graphics.Bitmap? = null
                try {
                    val retriever = android.media.MediaMetadataRetriever()
                    retriever.setDataSource(videoPath)
                    bitmap = retriever.frameAtTime
                    if (bitmap == null) {
                        // 尝试指定时间点获取帧
                        bitmap = retriever.getFrameAtTime(0, android.media.MediaMetadataRetriever.OPTION_CLOSEST_SYNC)
                    }
                    retriever.release()
                } catch (e1: Exception) {
                    console.log("IMBridge: MediaMetadataRetriever 失败, fallback ThumbnailUtils: " + e1.message)
                }
                if (bitmap == null) {
                    try {
                        bitmap = android.media.ThumbnailUtils.createVideoThumbnail(
                            videoPath, android.provider.MediaStore.Video.Thumbnails.MINI_KIND
                        )
                    } catch (e2: Exception) {
                        console.log("IMBridge: ThumbnailUtils 也失败: " + e2.message)
                    }
                }
                if (bitmap != null) {
                    val ctx = _context
                    if (ctx != null) {
                        val cacheDir = ctx.externalCacheDir
                        if (cacheDir != null) {
                            val snapshotFile = java.io.File(cacheDir, "video_snapshot_" + System.currentTimeMillis() + ".jpg")
                            val fileOut = java.io.FileOutputStream(snapshotFile)
                            val success = bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, 80, fileOut)
                            fileOut.close()
                            if (success && snapshotFile.exists() && snapshotFile.length() > 0) {
                                console.log("IMBridge: 封面生成成功, size=" + snapshotFile.length())
                                return snapshotFile.getAbsolutePath()
                            } else {
                                console.log("IMBridge: 封面压缩失败或文件无效, compress=" + success + ", exists=" + snapshotFile.exists() + ", size=" + snapshotFile.length())
                                if (snapshotFile.exists() && snapshotFile.length() == 0L) {
                                    snapshotFile.delete()
                                }
                            }
                        }
                    }
                } else {
                    console.log("IMBridge: 两种方式均无法生成视频封面")
                }
            } catch (e: Exception) {
                console.log("IMBridge: 生成视频封面失败: " + e.message)
            }
            return ""
        }

        @JvmStatic
        fun sendVoiceMessage(toUserId: String, voicePath: String, duration: Int): String {
            if (voicePath.isEmpty()) return ""
            val realPath = if (voicePath.startsWith("file://")) voicePath.substring(7) else voicePath
            val msg = V2TIMManager.getMessageManager().createSoundMessage(realPath, duration)
            console.log("IMBridge: 发送语音消息 to=" + toUserId + ", path=" + voicePath)
            return sendMessageInternal(msg, toUserId)
        }

        @JvmStatic
        fun sendCustomMessage(toUserId: String, data: String, desc: String, extension: String): String {
            // TIM SDK createCustomMessage 期望 byte[]，UTS 编译器存在 ByteArray 类型映射问题。
            // 改用 createTextMessage 添加自定义标记前缀来模拟自定义消息。
            val tag = "[CUSTOM:" + desc + "]"
            val content = tag + data
            val msg = V2TIMManager.getMessageManager().createTextMessage(content)
            console.log("IMBridge: 发送自定义消息 to=" + toUserId + ", desc=" + desc)
            return sendMessageInternal(msg, toUserId)
        }

        // ========== 消息历史记录 ==========

        /**
         * 从 SDK 服务端拉取 C2C 历史消息（分页）。
         * @param peerUserId 对方用户 ID
         * @param count 拉取条数
         * @param lastMsgId 上一页最后一条消息的 msgId，首次传空串
         * @param onItem 逐条回调：(msgId, sender, type, text, extra, timestamp, isSelf)
         * @param onComplete 完成回调：(total, error)
         */
        @JvmStatic
        fun getC2CMessageList(
            peerUserId: String,
            count: Int,
            lastMsgId: String,
            onItem: (String, String, Int, String, String, Long, Boolean) -> Unit,
            onComplete: (Int, String) -> Unit
        ) {
            val mgr = manager
            if (mgr == null) { onComplete(0, "未初始化"); return }
            if (!_isLoggedIn) { onComplete(0, "未登录"); return }

            try {
                // 找到 lastMsg 对象用于分页
                val lastMsg = if (lastMsgId.isNotEmpty()) _messageCache[lastMsgId] else null

                V2TIMManager.getMessageManager().getC2CHistoryMessageList(
                    peerUserId, count, lastMsg,
                    object : V2TIMValueCallback<MutableList<V2TIMMessage?>> {
                        override fun onSuccess(list: MutableList<V2TIMMessage?>?) {
                            if (list == null || list.isEmpty()) {
                                onComplete(0, "")
                                return
                            }
                            var idx = 0
                            for (msgObj in list) {
                                val msg = msgObj ?: continue
                                cacheMessage(msg)
                                val msgId = msg.msgID ?: ""
                                val sender = msg.sender ?: ""
                                val type = getMessageType(msg)
                                val text = getMessageText(msg)
                                val extra = getMessageExtra(msg)
                                val ts = msg.timestamp
                                val isSelf = (sender == _currentUserId)
                                onItem(msgId, sender, type, text, extra, ts, isSelf)
                                idx++
                            }
                            // 更新分页游标
                            val last = list[list.size - 1] ?: return
                            _lastMsgForPagination[peerUserId] = last
                            console.log("IMBridge: getC2CMessageList 返回 " + idx + " 条")
                            onComplete(idx, "")
                        }

                        override fun onError(code: Int, desc: String?) {
                            val msg = desc ?: "未知错误"
                            console.log("IMBridge: getC2CMessageList 失败 code=" + code)
                            onComplete(0, msg)
                        }
                    })
            } catch (e: Exception) {
                console.log("IMBridge: getC2CMessageList 异常 - " + e.message)
                onComplete(0, e.message ?: "未知异常")
            }
        }

        /**
         * 从本地缓存中获取消息列表（用于快速展示已有数据）
         */
        @JvmStatic
        fun loadMessages(
            peerUserId: String,
            count: Int,
            onItem: (String, String, Int, String, String, Long, Boolean) -> Unit,
            onComplete: (Int, String) -> Unit
        ) {
            val mgr = manager
            if (mgr == null) { onComplete(0, "未初始化"); return }
            if (!_isLoggedIn) { onComplete(0, "未登录"); return }
            try {
                val matched = mutableListOf<V2TIMMessage>()
                for (m in _localMessages) {
                    val sender = m.sender ?: ""
                    val receiver = m.groupID ?: ""
                    val isPeerMsg = (sender == peerUserId) ||
                        (sender == _currentUserId && receiver == peerUserId)
                    if (isPeerMsg) matched.add(m)
                }
                val result = if (matched.size > count) {
                    matched.subList(matched.size - count, matched.size)
                } else matched

                for (m in result) {
                    val msgId = m.msgID ?: ""
                    val sender = m.sender ?: ""
                    val type = getMessageType(m)
                    val text = getMessageText(m)
                    val extra = getMessageExtra(m)
                    val ts = m.timestamp
                    val isSelf = (sender == _currentUserId)
                    onItem(msgId, sender, type, text, extra, ts, isSelf)
                }
                console.log("IMBridge: loadMessages 返回本地消息 " + result.size + " 条")
                onComplete(result.size, "")
            } catch (e: Exception) {
                console.log("IMBridge: loadMessages 异常 - " + e.message)
                onComplete(0, e.message ?: "未知异常")
            }
        }

        // ========== 消息管理 ==========

        @JvmStatic
        fun deleteMessage(msgId: String): Boolean {
            val msg = _messageCache[msgId] ?: return false
            V2TIMManager.getMessageManager().deleteMessageFromLocalStorage(msg, object : V2TIMCallback {
                override fun onSuccess() {
                    console.log("IMBridge: 消息删除成功 msgId=" + msgId)
                    _messageCache.remove(msgId)
                    _localMessages.removeAll { it.msgID == msgId }
                }
                override fun onError(code: Int, desc: String?) {
                    console.log("IMBridge: 消息删除失败 code=" + code)
                }
            })
            return true
        }

        @JvmStatic
        fun revokeMessage(msgId: String): Boolean {
            val msg = _messageCache[msgId] ?: return false
            V2TIMManager.getMessageManager().revokeMessage(msg, object : V2TIMCallback {
                override fun onSuccess() {
                    console.log("IMBridge: 消息撤回成功 msgId=" + msgId)
                }
                override fun onError(code: Int, desc: String?) {
                    console.log("IMBridge: 消息撤回失败 code=" + code)
                }
            })
            return true
        }

        // ========== 已读标记 ==========

        @JvmStatic
        @Suppress("DEPRECATION")
        fun markC2CMessageAsRead(userId: String): Boolean {
            val mgr = manager ?: return false
            V2TIMManager.getMessageManager().markC2CMessageAsRead(userId, object : V2TIMCallback {
                override fun onSuccess() { console.log("IMBridge: 单聊已读标记成功 userId=" + userId) }
                override fun onError(code: Int, desc: String?) { console.log("IMBridge: 单聊已读标记失败 code=" + code) }
            })
            return true
        }

        @JvmStatic
        @Suppress("DEPRECATION")
        fun markGroupMessageAsRead(groupId: String): Boolean {
            val mgr = manager ?: return false
            V2TIMManager.getMessageManager().markGroupMessageAsRead(groupId, object : V2TIMCallback {
                override fun onSuccess() { console.log("IMBridge: 群聊已读标记成功 groupId=" + groupId) }
                override fun onError(code: Int, desc: String?) { console.log("IMBridge: 群聊已读标记失败 code=" + code) }
            })
            return true
        }

        @JvmStatic
        fun sendMessageReadReceipts(msgIds: String): Boolean {
            val ids = msgIds.split(",").map { it.trim() }.filter { it.isNotEmpty() }
            val msgs = ids.mapNotNull { _messageCache[it] }
            if (msgs.isEmpty()) return false
            V2TIMManager.getMessageManager().sendMessageReadReceipts(msgs, object : V2TIMCallback {
                override fun onSuccess() { console.log("IMBridge: 已读回执发送成功") }
                override fun onError(code: Int, desc: String?) { console.log("IMBridge: 已读回执发送失败") }
            })
            return true
        }

        // ========== SDK 监听器注册 ==========

        private fun registerListeners(mgr: V2TIMManager) {
            // 消息监听
            val msgListener = object : V2TIMAdvancedMsgListener() {
                override fun onRecvNewMessage(msg: V2TIMMessage) {
                    val msgId = msg.msgID ?: ""
                    val sender = msg.sender ?: ""
                    val type = getMessageType(msg)
                    val text = getMessageText(msg)
                    val extra = getMessageExtra(msg)
                    val ts = msg.timestamp
                    val isSelf = (sender == _currentUserId)
                    console.log("IMBridge: 收到消息 msgId=" + msgId + ", from=" + sender + ", type=" + type)
                    cacheMessage(msg)
                    _onMessageReceived?.invoke(msgId, sender, type, text, extra, ts, isSelf)
                }

                override fun onRecvMessageRevoked(msgID: String?) {
                    val id = msgID ?: return
                    console.log("IMBridge: 消息被撤回 msgId=" + id)
                    _onMessageRevoked?.invoke(id)
                }

                override fun onRecvC2CReadReceipt(receiptList: MutableList<V2TIMMessageReceipt>?) {
                    console.log("IMBridge: 收到单聊已读回执 count=" + (receiptList?.size ?: 0))
                }
            }
            V2TIMManager.getMessageManager().addAdvancedMsgListener(msgListener)
            console.log("IMBridge: 消息监听器已注册")

            // 连接状态监听
            val simpleListener = object : V2TIMSDKListener() {
                override fun onConnecting() { _onConnecting?.invoke() }
                override fun onConnectSuccess() { _onConnectSuccess?.invoke() }
                override fun onConnectFailed(code: Int, error: String?) {
                    _onConnectFailed?.invoke(code, error ?: "未知错误")
                }
                override fun onKickedOffline() {
                    _isLoggedIn = false
                    _currentUserId = ""
                    _onKickedOffline?.invoke()
                }
                override fun onUserSigExpired() {
                    _isLoggedIn = false
                    _currentUserId = ""
                    _onUserSigExpired?.invoke()
                }
            }
            mgr.addIMSDKListener(simpleListener)
            console.log("IMBridge: 连接状态监听器已注册")
        }

        // ========== 视频播放 ==========

        @JvmStatic
        fun openVideoPlayer(videoPath: String): Boolean {
            try {
                val realPath = if (videoPath.startsWith("file://")) videoPath.substring(7) else videoPath
                val ctx = _context ?: return false
                val intent = android.content.Intent(android.content.Intent.ACTION_VIEW)
                val uri = android.net.Uri.parse("file://" + realPath)
                intent.setDataAndType(uri, "video/*")
                intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
                ctx.startActivity(intent)
                console.log("IMBridge: 打开系统播放器 path=" + realPath)
                return true
            } catch (e: Exception) {
                console.log("IMBridge: 打开系统播放器失败: " + e.message)
                return false
            }
        }

        // ========== 资源释放 ==========

        @JvmStatic
        fun destroy() {
            val mgr = manager
            if (mgr != null) {
                try { mgr.logout(null) } catch (_: Exception) {}
            }
            _onKickedOffline = null
            _onUserSigExpired = null
            _onConnecting = null
            _onConnectSuccess = null
            _onConnectFailed = null
            _onMessageReceived = null
            _onMessageRevoked = null
            _onLoginSuccess = null
            _onLoginFailed = null
            _onLogoutSuccess = null
            _isLoggedIn = false
            _currentUserId = ""
            manager = null
            _localMessages.clear()
            _messageCache.clear()
            _lastMsgForPagination.clear()
            console.log("IMBridge: 资源已释放")
        }
    }
}

