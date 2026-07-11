package hs.trtc

import android.content.Context
import android.view.ViewGroup
import android.view.View
import io.dcloud.uts.console
import com.tencent.trtc.TRTCCloud
import com.tencent.trtc.TRTCCloudListener
import com.tencent.trtc.TRTCCloudDef
import com.tencent.rtmp.ui.TXCloudVideoView

/**
 * TRTC SDK 桥接类 — 直接使用 SDK 类（自定义基座下编译通过）。
 * UTS 端直接调用本类的静态方法，无需反射。
 */
class TRTCBridge private constructor() {

    companion object {

        private var cloud: TRTCCloud? = null
        private var localPreviewView: TXCloudVideoView? = null

        // 管理每个远端用户的 TXCloudVideoView
        private val remoteViewMap = mutableMapOf<String, TXCloudVideoView>()

        // TRTC SDK 原生回调
        private var _onRemoteUserEnter: ((String) -> Unit)? = null
        private var _onRemoteUserLeave: ((String) -> Unit)? = null
        private var _onEnterRoom: ((Long) -> Unit)? = null
        private var _onExitRoom: ((Int) -> Unit)? = null
        private var _onUserVideoAvailable: ((String, Boolean) -> Unit)? = null

        @JvmStatic
        fun setOnRemoteUserEnter(callback: ((String) -> Unit)?) {
            _onRemoteUserEnter = callback
        }

        @JvmStatic
        fun setOnRemoteUserLeave(callback: ((String) -> Unit)?) {
            _onRemoteUserLeave = callback
        }

        @JvmStatic
        fun setOnEnterRoom(callback: ((Long) -> Unit)?) {
            _onEnterRoom = callback
        }

        @JvmStatic
        fun setOnExitRoom(callback: ((Int) -> Unit)?) {
            _onExitRoom = callback
        }

        @JvmStatic
        fun setOnUserVideoAvailable(callback: ((String, Boolean) -> Unit)?) {
            _onUserVideoAvailable = callback
        }

        // ========== SDK 事件监听器 ==========

        private val listener = object : TRTCCloudListener() {
            override fun onRemoteUserEnterRoom(userId: String?) {
                console.log("TRTCBridge: ===== onRemoteUserEnterRoom 触发 =====")
                if (userId != null) {
                    console.log("TRTCBridge: onRemoteUserEnterRoom, userId=" + userId + " | 远端用户进入房间")
                    val cb = _onRemoteUserEnter
                    if (cb != null) {
                        cb(userId)
                        console.log("TRTCBridge: onRemoteUserEnterRoom -> UTS 回调已执行")
                    } else {
                        console.log("TRTCBridge: onRemoteUserEnterRoom -> _onRemoteUserEnter 为 null, 未转发")
                    }
                } else {
                    console.log("TRTCBridge: onRemoteUserEnterRoom userId 为 null!")
                }
            }
            override fun onRemoteUserLeaveRoom(userId: String?, reason: Int) {
                console.log("TRTCBridge: ===== onRemoteUserLeaveRoom 触发 =====")
                if (userId != null) {
                    console.log("TRTCBridge: onRemoteUserLeaveRoom, userId=" + userId + ", reason=" + reason)
                    // 清理远端用户的 TXCloudVideoView
                    val view = remoteViewMap.remove(userId)
                    if (view != null) {
                        val parent = view.parent
                        if (parent is ViewGroup) {
                            parent.removeView(view)
                            console.log("TRTCBridge: 已清理远端用户 " + userId + " 的 TXCloudVideoView")
                        }
                    }
                    val cb = _onRemoteUserLeave
                    if (cb != null) {
                        cb(userId)
                    } else {
                        console.log("TRTCBridge: onRemoteUserLeaveRoom -> _onRemoteUserLeave 为 null")
                    }
                }
            }
            override fun onEnterRoom(result: Long) {
                console.log("TRTCBridge: ===== onEnterRoom 触发, result=" + result + " (>=0 成功) =====")
                val cb = _onEnterRoom
                if (cb != null) {
                    cb(result)
                } else {
                    console.log("TRTCBridge: onEnterRoom -> _onEnterRoom 为 null")
                }
            }
            override fun onExitRoom(reason: Int) {
                console.log("TRTCBridge: ===== onExitRoom 触发, reason=" + reason + " =====")
                val cb = _onExitRoom
                if (cb != null) {
                    cb(reason)
                } else {
                    console.log("TRTCBridge: onExitRoom -> _onExitRoom 为 null")
                }
            }
            override fun onUserVideoAvailable(userId: String?, available: Boolean) {
                console.log("TRTCBridge: ===== onUserVideoAvailable 触发 =====")
                if (userId != null) {
                    console.log("TRTCBridge: onUserVideoAvailable, userId=" + userId + ", available=" + available)
                    val cb = _onUserVideoAvailable
                    if (cb != null) {
                        cb(userId, available)
                    } else {
                        console.log("TRTCBridge: onUserVideoAvailable -> _onUserVideoAvailable 为 null")
                    }
                }
            }
            override fun onError(errCode: Int, errMsg: String?, extraInfo: android.os.Bundle?) {
                console.log("TRTCBridge: ===== onError 触发, errCode=" + errCode + ", errMsg=" + (errMsg ?: "null") + " =====")
            }
            override fun onWarning(warningCode: Int, warningMsg: String?, extraInfo: android.os.Bundle?) {
                console.log("TRTCBridge: onWarning, code=" + warningCode + ", msg=" + (warningMsg ?: "null"))
            }
            override fun onFirstVideoFrame(userId: String?, streamType: Int, width: Int, height: Int) {
                console.log("TRTCBridge: onFirstVideoFrame, userId=" + (userId ?: "local") + ", streamType=" + streamType + ", " + width + "x" + height)
            }
            override fun onConnectionLost() {
                console.log("TRTCBridge: ===== onConnectionLost 触发, SDK 与云断开连接 =====")
            }
            override fun onTryToReconnect() {
                console.log("TRTCBridge: onTryToReconnect 正在重连...")
            }
            override fun onConnectionRecovery() {
                console.log("TRTCBridge: onConnectionRecovery 重连成功")
            }
        }

        // ========== 生命周期 ==========

        @JvmStatic
        fun init(context: Any) {
            if (cloud != null) return
            if (context !is Context) return
            try {
                cloud = TRTCCloud.sharedInstance(context)
                console.log("TRTCBridge: init 成功, cloud=" + (cloud != null))

                // 打印 SDK 版本号
                console.log("TRTCBridge: SDK 版本号=" + TRTCCloud.getSDKVersion())

                // 设置 SDK 事件监听
                cloud?.addListener(listener)
                console.log("TRTCBridge: setListener 成功")
            } catch (e: Exception) {
                console.log("TRTCBridge: init 失败 - " + e.message)
            }
        }

        @JvmStatic
        fun isCloudReady(): Boolean {
            val ready = cloud != null
            console.log("TRTCBridge: isCloudReady=" + ready)
            return ready
        }

        // ========== 本地预览视图管理 ==========

        @JvmStatic
        fun getOrCreateLocalView(context: Any): TXCloudVideoView? {
            if (context !is Context) return null
            if (localPreviewView == null) {
                try {
                    localPreviewView = TXCloudVideoView(context)
                    localPreviewView?.layoutParams = ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                    console.log("TRTCBridge: TXCloudVideoView 创建成功")
                } catch (e: Exception) {
                    console.log("TRTCBridge: TXCloudVideoView 创建失败 - " + e.message)
                }
            }
            return localPreviewView
        }

        @JvmStatic
        fun removeLocalViewFromParent() {
            val view = localPreviewView ?: return
            val parent = view.parent
            if (parent is ViewGroup) {
                parent.removeView(view)
                console.log("TRTCBridge: 从父容器移除 TXCloudVideoView")
            }
        }

        // ========== 房间管理 ==========

        @JvmStatic
        fun enterRoom(sdkAppId: Int, userId: String, userSig: String, roomId: Int) {
            val c = cloud ?: run {
                console.log("TRTCBridge: enterRoom 跳过 - cloud 为 null")
                return
            }
            try {
                val params = TRTCCloudDef.TRTCParams()
                params.sdkAppId = sdkAppId
                params.userId = userId
                params.userSig = userSig
                params.roomId = roomId

                c.enterRoom(params, TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL)
                console.log("TRTCBridge: enterRoom SDK 调用成功, sdkAppId=" + sdkAppId + ", roomId=" + roomId + ", userId=" + userId)
            } catch (e: Exception) {
                console.log("TRTCBridge: enterRoom 失败 - " + e.message)
            }
        }

        @JvmStatic
        fun exitRoom() {
            val c = cloud ?: return
            try {
                c.exitRoom()
                console.log("TRTCBridge: exitRoom 成功")
            } catch (e: Exception) {
                console.log("TRTCBridge: exitRoom 失败 - " + e.message)
            }
            // 清理所有远端视图
            for ((uid, view) in remoteViewMap) {
                val parent = view.parent
                if (parent is ViewGroup) {
                    parent.removeView(view)
                }
            }
            remoteViewMap.clear()
        }

        // ========== 本地预览 ==========

        @JvmStatic
        fun startLocalPreview(frontCamera: Boolean) {
            val c = cloud ?: run {
                console.log("TRTCBridge: startLocalPreview 跳过 - cloud 为 null")
                return
            }
            val view = localPreviewView ?: run {
                console.log("TRTCBridge: startLocalPreview 跳过 - localPreviewView 为 null")
                return
            }
            try {
                c.startLocalPreview(frontCamera, view)
                console.log("TRTCBridge: startLocalPreview SDK 调用成功")
            } catch (e: Exception) {
                console.log("TRTCBridge: startLocalPreview 失败 - " + e.message)
            }
        }

        @JvmStatic
        fun startLocalPreviewInContainer(frontCamera: Boolean, container: Any) {
            if (container !is ViewGroup) {
                console.log("TRTCBridge: startLocalPreviewInContainer 跳过 - container 不是 ViewGroup")
                return
            }

            if (localPreviewView == null) {
                try {
                    localPreviewView = TXCloudVideoView(container.context)
                    localPreviewView?.layoutParams = ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                    console.log("TRTCBridge: TXCloudVideoView 创建成功")
                } catch (e: Exception) {
                    console.log("TRTCBridge: TXCloudVideoView 创建失败 - " + e.message)
                    return
                }
            }

            val view = localPreviewView ?: return

            val currentParent = view.parent
            if (currentParent is ViewGroup && currentParent !== container) {
                currentParent.removeView(view)
                console.log("TRTCBridge: 从旧容器移除 TXCloudVideoView")
            }

            if (view.parent == null) {
                container.addView(view)
                console.log("TRTCBridge: TXCloudVideoView 已添加到目标容器")
            }

            startLocalPreview(frontCamera)
        }

        @JvmStatic
        fun stopLocalPreview() {
            val c = cloud ?: return
            try {
                c.stopLocalPreview()
                console.log("TRTCBridge: stopLocalPreview 成功")
            } catch (e: Exception) {
                console.log("TRTCBridge: stopLocalPreview 失败 - " + e.message)
            }
            try {
                localPreviewView?.removeAllViews()
            } catch (_: Exception) {}
        }

        // ========== 远端视频 ==========

        /**
         * 绑定远端用户视频到指定容器
         * @param userId 远端用户ID
         * @param container ViewGroup 容器（挂载 TXCloudVideoView）
         */
        @JvmStatic
        fun startRemoteView(userId: String, container: Any) {
            val c = cloud ?: return
            if (container !is ViewGroup) {
                console.log("TRTCBridge: startRemoteView 跳过 - container 不是 ViewGroup")
                return
            }
            try {
                // 获取或创建该用户的 TXCloudVideoView
                var view = remoteViewMap[userId]
                if (view == null) {
                    view = TXCloudVideoView(container.context)
                    view.layoutParams = ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                    remoteViewMap[userId] = view
                    console.log("TRTCBridge: 为远端用户 " + userId + " 创建 TXCloudVideoView")
                }

                // 如果已在其他容器，先移除
                val currentParent = view.parent
                if (currentParent is ViewGroup && currentParent !== container) {
                    currentParent.removeView(view)
                    console.log("TRTCBridge: 从旧容器移除远端 " + userId + " 的 TXCloudVideoView")
                }

                // 添加到目标容器
                if (view.parent == null) {
                    container.addView(view)
                    console.log("TRTCBridge: 远端 " + userId + " TXCloudVideoView 已添加到容器")
                }

                c.startRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, view)
                console.log("TRTCBridge: startRemoteView SDK 调用成功, userId=" + userId)
            } catch (e: Exception) {
                console.log("TRTCBridge: startRemoteView 失败 - " + e.message)
            }
        }

        @JvmStatic
        fun stopRemoteView(userId: String) {
            val c = cloud ?: return
            try {
                c.stopRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG)
                console.log("TRTCBridge: stopRemoteView SDK 调用成功, userId=" + userId)
            } catch (_: Exception) {}

            // 清理 TXCloudVideoView
            val view = remoteViewMap.remove(userId)
            if (view != null) {
                val parent = view.parent
                if (parent is ViewGroup) {
                    parent.removeView(view)
                    console.log("TRTCBridge: 已移除远端 " + userId + " 的 TXCloudVideoView")
                }
            }
        }

        // ========== 音频 ==========

        @JvmStatic
        fun startLocalAudio() {
            val c = cloud ?: return
            try {
                c.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT)
                console.log("TRTCBridge: startLocalAudio 成功")
            } catch (e: Exception) {
                console.log("TRTCBridge: startLocalAudio 失败 - " + e.message)
            }
        }

        @JvmStatic
        fun stopLocalAudio() {
            val c = cloud ?: return
            try {
                c.stopLocalAudio()
            } catch (_: Exception) {}
        }

        // ========== 资源释放（防止内存泄漏） ==========

        /**
         * 释放所有 TRTC 资源，清空静态引用。
         * 页面销毁 / 离开房间时必须调用。
         */
        @JvmStatic
        fun destroy() {
            console.log("TRTCBridge: destroy 开始释放资源")

            // 1. 停止本地预览和音频
            try {
                cloud?.stopLocalPreview()
                cloud?.stopLocalAudio()
            } catch (_: Exception) {}
            // 2. 销毁 SDK 实例（内部会关闭连接，触发 onExitRoom）
            try {
                TRTCCloud.destroySharedInstance()
            } catch (_: Exception) {}

            // 3. 清理本地预览 View
            try {
                val parent = localPreviewView?.parent
                if (parent is ViewGroup) {
                    parent.removeView(localPreviewView)
                }
                localPreviewView?.removeAllViews()
            } catch (_: Exception) {}
            localPreviewView = null

            // 4. 清理所有远端 View
            for ((_, view) in remoteViewMap) {
                try {
                    val parent = view.parent
                    if (parent is ViewGroup) {
                        parent.removeView(view)
                    }
                    view.removeAllViews()
                } catch (_: Exception) {}
            }
            remoteViewMap.clear()

            // 5. 清空所有回调引用
            _onRemoteUserEnter = null
            _onRemoteUserLeave = null
            _onEnterRoom = null
            _onExitRoom = null
            _onUserVideoAvailable = null

            // 6. 清空 cloud
            cloud = null

            console.log("TRTCBridge: destroy 完成")
        }
    }
}
