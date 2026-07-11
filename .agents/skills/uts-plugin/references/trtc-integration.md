# TRTC 集成经验总结

## 版本选择

| SDK | Maven 坐标 | Maven Central 状态 | TRTCParams 是否可用 |
|-----|-----------|-------------------|-------------------|
| LiteAVSDK_TRTC | `com.tencent.liteav:LiteAVSDK_TRTC:latest.release` | ❌ 无公开版本记录 | ❌ 不可用 |
| **LiteAVSDK_Professional** | **`com.tencent.liteav:LiteAVSDK_Professional:13.3.0.20247`** | ✅ 有明确发布记录 | ✅ 可用 **← 推荐** |

**结论**：使用 `LiteAVSDK_Professional` 替代 `LiteAVSDK_TRTC`。全功能版包含 TRTC 所有类，Maven Central 上有完整版本记录。

## config.json 配置

```json
{
  "abis": ["arm64-v8a", "armeabi-v7a"],
  "minSdkVersion": 24,
  "dependencies": ["com.tencent.liteav:LiteAVSDK_Professional:13.3.0.20247"]
}
```

- `abiFilters` 保留 `arm64-v8a` 和 `armeabi-v7a` 即可
- `minSdkVersion` 建议 ≥ 24（Android 7.0）
- **每次修改 `config.json` 后必须重新打自定义基座才能生效**

## Kotlin 桥接层架构

```
utssdk/
├── index.uts                         # UTS 入口，TrtcService 对外 API
└── app-android/
    ├── config.json                   # Maven 依赖配置
    └── TRTCBridge.kt                 # Kotlin 桥接类，直接继承 SDK 类
```

**关键设计原则**（自定义基座模式）：
1. 直接 `import com.tencent.trtc.*` — **编译时依赖 SDK 类**（自定义基座云端打包时 Maven 依赖在 classpath 上）
2. 监听器通过匿名类 `object : TRTCCloudListener()` 实现，重写 `onRemoteUserEnterRoom` 等回调
3. 所有 SDK 方法直接调用：`c.startLocalPreview(frontCamera, view)` — 无需反射
4. 注意：此方式**仅适用于自定义基座**（标准基座 classpath 无 Maven 类）

## 运行时诊断日志

成功的 TRTC 本地预览日志序列：

```
TRTCBridge: init 成功, cloud=true              ← sharedInstance 成功
TRTCBridge: SDK 版本号=13.3.0.20247           ← getSDKVersion
TRTCBridge: setListener 成功                   ← setListener 注册回调
TRTCBridge: isCloudReady=true                    ← 初始化完成
TRTCBridge: stopLocalPreview 成功                ← 停止旧预览
TRTCBridge: TXCloudVideoView 创建成功            ← new TXCloudVideoView
TRTCBridge: TXCloudVideoView 已添加到目标容器     ← addView 成功
TRTCBridge: startLocalPreview SDK 调用成功        ← SDK 实际调用成功
```

## 视频画面链路

| 环节 | 本地画面 | 远端画面 |
|------|---------|---------|
| **视图类型** | `TXCloudVideoView`（SDK 自带的 SurfaceView） | `android.view.TextureView`（UTS 手动创建） |
| **管理方** | `TRTCBridge.kt` 单例持有 | uvue 页面变量持有 |
| **创建时机** | `startLocalPreviewInContainer` 时自动创建 | `createVideoViews()` 时创建 |
| **SDK 调用** | `startLocalPreview(boolean, TXCloudVideoView)` | `startRemoteView(String, TextureView)` |
| **容器切换** | `startLocalPreviewInContainer` 自动 removeView + addView | 需手动解绑再绑到新 TextureView |

## 常见问题排查

1. **`TRTCParams 类加载失败`** → config.json 配的是 `LiteAVSDK_TRTC`，需改为 `LiteAVSDK_Professional`
2. **`TRTCCloud 类加载失败`** → 自定义基座未包含 SDK，检查 `config.json` 的 `dependencies`
3. **`init 成功, cloud=true` 但无画面** → TXCloudVideoView 未添加到容器，检查 `addView` 是否执行
4. **`startLocalPreview SDK 调用成功` 但画面黑屏** → 检查容器尺寸是否为 0（MATCH_PARENT 未生效）
5. **配置 `config.json` 后本地编译不过** → 标准基座不包含 Maven 依赖，需用云端打包自定义基座

## 自定义基座工作流

```
修改代码 → 提交云端打包 → 等待打包完成 → 安装自定义基座 → 选择"自定义基座运行" → 测试
```

- 不需要在本地配置 Gradle、Android SDK
- 每次修改 `config.json`（新增/修改 Maven 依赖）必须重新打包
- 只修改 UTS/uvue 代码不需要重新打包，直接标准基座运行即可
- `libs/classes.jar` 被 `.gitignore` 排除，拉取代码后需运行脚本下载：
  - Windows: `uni_modules/hs-trtc/scripts/init-libs.bat`
  - macOS/Linux: `bash uni_modules/hs-trtc/scripts/init-libs.sh`

## TRTC SDK 原生事件监听

TRTC SDK 通过 `TRTCCloud.setListener(TRTCCloudListener)` 提供房间事件回调。

**⚠️ 关键坑点：`TRTCCloudListener` 是抽象类（class），不是接口（interface）！**

这意味着：
- ❌ **不能用** `Proxy.newProxyInstance()` 动态代理（那只能用于 interface）
- ✅ **必须用** `object : TRTCCloudListener()` 匿名类继承方式

```kotlin
// ✅ 正确方式：匿名类继承
private val listener = object : TRTCCloudListener() {
    override fun onRemoteUserEnterRoom(userId: String?) {
        console.log("onRemoteUserEnterRoom, userId=" + userId)
        _onRemoteUserEnter?.invoke(userId)
    }
    override fun onRemoteUserLeaveRoom(userId: String?, reason: Int) {
        _onRemoteUserLeave?.invoke(userId)
    }
    override fun onEnterRoom(result: Long) {
        _onEnterRoom?.invoke(result)
    }
    override fun onExitRoom(reason: Int) {
        _onExitRoom?.invoke(reason)
    }
    override fun onUserVideoAvailable(userId: String?, available: Boolean) {
        _onUserVideoAvailable?.invoke(userId, available)
    }
    override fun onError(errCode: Int, errMsg: String?, extraInfo: Bundle?) { }
    override fun onFirstVideoFrame(userId: String?, streamType: Int, width: Int, height: Int) { }
    override fun onConnectionLost() { }
    override fun onTryToReconnect() { }
    override fun onConnectionRecovery() { }
}
cloud?.setListener(listener)
```

**注意**：此方式要求编译时 `com.tencent.trtc.*` 类在 classpath 上。在自定义基座模式下，需在 `libs/` 放置 `classes.jar`（从 AAR 提取）供本地编译通过，实际运行时由云打包的自定义基座提供。

**支持的回调事件：**

| SDK 方法 | 参数 | 说明 |
|---------|------|------|
| `onRemoteUserEnterRoom` | `(String userId)` | 远端用户进入房间 |
| `onRemoteUserLeaveRoom` | `(String userId, int reason)` | 远端用户离开房间 |
| `onEnterRoom` | `(long result)` | 本端进入房间结果（≥0 成功） |
| `onExitRoom` | `(int reason)` | 本端离开房间 |
| `onUserVideoAvailable` | `(String userId, boolean available)` | 远端视频可用状态 |
| `onFirstVideoFrame` | `(String userId, int streamType, int w, int h)` | 首帧视频渲染 |
| `onError` | `(int errCode, String errMsg, Bundle extra)` | SDK 错误 |
| `onConnectionLost` / `onTryToReconnect` / `onConnectionRecovery` | — | 网络状态变化 |

**优势**：完全替代 STOMP 信令的房间通知。两个设备只要 sdkAppId/roomId 一致、userSig 有效、userId 不同，TRTC SDK 自身就能通知对端进入/离开，无需额外消息通道。

**UTS 层调用方式：**
```typescript
TrtcService.onRemoteUserEnter((userId) => {
  // 绑定远端视频
  TrtcService.setRemoteVideoView(userId, container)
})
TrtcService.onRemoteUserLeave((userId) => {
  // 清理远端画面
})
```

## TRTC SDK 类结构坑点

### 1. `TRTCParams` 是 `TRTCCloudDef` 的内部类

```kotlin
// ❌ 错误 — TRTCParams 不是顶层类
val params = TRTCParams()

// ✅ 正确 — TRTCParams 是 TRTCCloudDef 的内部类
val params = TRTCCloudDef.TRTCParams()
```

`TRTCParams`、`TRTCVideoEncParam`、`TRTCAudioEffectParam` 等均为 `TRTCCloudDef` 的内部类。

### 2. 远端视频渲染也用 `TXCloudVideoView`

```kotlin
// ❌ 错误 — startRemoteView 签名不是 (String, TextureView)
c.startRemoteView(userId, textureView)

// ✅ 正确 — 签名是 (String, TXCloudVideoView)
val remoteView = TXCloudVideoView(context)
remoteViewMap[userId] = remoteView
container.addView(remoteView)
c.startRemoteView(userId, remoteView)
```

`startLocalPreview(boolean, TXCloudVideoView)` 和 `startRemoteView(String, TXCloudVideoView)` 都接受 `TXCloudVideoView`。建议统一在桥接层管理 TXCloudVideoView 的生命周期。

### 3. 数值房间号 vs 字符串房间号（TRTC 经典坑）

```kotlin
val params = TRTCCloudDef.TRTCParams()

// 数值房间（TRTC SDK 房间 = 888, int roomId 类型）
params.roomId = 888

// 字符串房间（TRTC SDK 房间 = "888", String 类型）
params.strRoomId = "888"
```

**⚠️ 关键：这两个是完全不同的房间！** 两端分别用一个进房间会分别在各自的房间，互相不可见。

| 端 | roomId 类型 | 实际房间 |
|----|------------|---------|
| Web SDK (trtc-sdk-v5) | `{ roomId: 888 }` → 数值 | 房间「888」（int）|
| Android SDK | `params.roomId = 888` | 房间「888」（int）✅ |
| Android SDK | `params.strRoomId = "888"` | 房间「"888"」（String）❌ |

**规则**：
- Web TRTC SDK 只支持数值 roomId
- 纯数字房间（如 `888`）用 `params.roomId`，两端都保持数值
- 包含字母的房间（如 `"room_abc"`）才用 `strRoomId`

## 内存泄漏：静态 View 持有已销毁 Activity

TRTCBridge 使用静态 companion object 管理 TXCloudVideoView。页面离开时，这些 View 仍然持有已销毁 Activity 的 Context：

```
static TRTCBridge.localPreviewView → TXCloudVideoView → mContext(已销毁 Activity)
```

**修复方式**：增加 `destroy()` 静态方法，在离开房间时清空所有静态引用：

```kotlin
@JvmStatic
fun destroy() {
    // 1. 释放 SDK 资源
    cloud?.exitRoom()
    cloud?.stopLocalPreview()
    cloud?.stopLocalAudio()
    TRTCCloud.destroySharedInstance()

    // 2. 清理本地 View
    localPreviewView?.parent?.let { (it as? ViewGroup)?.removeView(localPreviewView) }
    localPreviewView = null

    // 3. 清理远端 View
    remoteViewMap.forEach { (_, view) ->
        (view.parent as? ViewGroup)?.removeView(view)
    }
    remoteViewMap.clear()

    // 4. 清空回调引用
    _onRemoteUserEnter = null
    _onRemoteUserLeave = null
    _onEnterRoom = null
    _onExitRoom = null

    // 5. 清空 cloud
    cloud = null
}
```

## 本地编译依赖（libs/classes.jar）

`config.json` 的 Maven 依赖只在**云端打包**时生效。本地 HBuilderX 编译时需要 `com.tencent.trtc.*` 类在 classpath 上，否则报错：

```
error: 找不到名称"tencent"
  import com.tencent.trtc.TRTCCloud
```

**解决方案**：下载 AAR 并提取 `classes.jar` 放到 `utssdk/app-android/libs/`：

```bash
# 1. 下载 AAR
curl -L -o libs/LiteAVSDK_Professional-13.3.0.20247.aar \
  https://repo1.maven.org/maven2/com/tencent/liteav/LiteAVSDK_Professional/13.3.0.20247/LiteAVSDK_Professional-13.3.0.20247.aar

# 2. 提取 classes.jar
unzip -o libs/LiteAVSDK_Professional-13.3.0.20247.aar classes.jar -d libs/

# 3. 将 libs/ 加入 .gitignore（其他开发者需手动下载）
```

项目已提供一键脚本：
- Windows: `uni_modules/hs-trtc/scripts/init-libs.bat`
- macOS/Linux: `bash uni_modules/hs-trtc/scripts/init-libs.sh`

---

## 实战坑点总结（基于实际修复经验）

### 坑1：TextureView Surface 销毁导致白屏

**现象**：页面从后台返回或从悬浮窗返回视频页时，视频画面白屏，需要回退一页再进入才有画面。

**根因**：
- `TXCloudVideoView` 内部使用 `TextureView`，当 View 从 Window 移除时，TextureView 的 Surface 会被销毁
- 重新 `addView` 后，Surface 需要重新创建，但 SDK 的渲染管道还指向旧的 Surface
- 如果 `stopLocalPreview()` 中销毁了 `localPreviewView`（`localPreviewView = null`），重新创建的新 View 需要重新走初始化流程

**解决方案**（View 复用模式）：
```kotlin
// ✅ 正确：stopLocalPreview 只停止预览，不销毁 View
fun stopLocalPreview() {
    cloud?.stopLocalPreview()           // 停止 SDK 渲染
    localPreviewView?.removeAllViews()  // 清空子 View
    // ❌ 不要 localPreviewView = null，保留 View 供复用
}

// ✅ 正确：重新开始预览时，复用同一个 TXCloudVideoView
fun startLocalPreviewInContainer(frontCamera: Boolean, container: ViewGroup) {
    if (localPreviewView == null) {
        localPreviewView = TXCloudVideoView(container.context)  // 首次创建
    }
    val view = localPreviewView ?: return
    // 从旧容器移除
    val parent = view.parent
    if (parent is ViewGroup && parent !== container) {
        parent.removeView(view)
    }
    // 添加到新容器（如果尚未添加）
    if (view.parent == null) {
        container.addView(view)
    }
    // 重新开始预览（SDK 会重新绑定 Surface）
    cloud?.startLocalPreview(frontCamera, view)
}
```

**关键**：`TXCloudVideoView` 实例保持单例，只移除父容器不销毁，避免 Surface 重建。

### 坑2：FLAG_ACTIVITY_NEW_TASK 导致空白 Activity

**现象**：从悬浮窗点击返回视频页时，出现空白页面，需要回退才能看到画面。

**根因**：使用 `startActivity` 且添加了 `FLAG_ACTIVITY_NEW_TASK`，这会创建一个**新的 Activity 实例**而不是把已有的 Activity 带到前台。新实例的 TRTC 状态未初始化，导致白屏。返回上一页实际上是关闭了新实例，露出了旧实例的画面。

**解决方案**：使用 `FLAG_ACTIVITY_REORDER_TO_FRONT` 替代 `FLAG_ACTIVITY_NEW_TASK`：
```kotlin
// ✅ 正确：将已有 Activity 带到前台，不创建新实例
intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
context.startActivity(intent)
```

> **注意**：`FLAG_ACTIVITY_REORDER_TO_FRONT` 如果 Activity 不在栈顶，会把已有的实例 reorder 到栈顶。

### 坑3：UTS 中无法调用 moveTaskToFront

**现象**：编译报错 `找不到名称"moveTaskToFront"`。

**根因**：UTS 编译器不知道 `moveTaskToFront` 是 `android.app.Activity` 的方法，因为 UTS 中 Android API 的可见性有限制。

**解决方案**：改用 `startActivity` + `FLAG_ACTIVITY_REORDER_TO_FRONT`：
```typescript
// ❌ 编译报错
actRef.moveTaskToFront(true)

// ✅ 正确
const intent = new android.content.Intent(context, act.getClass())
intent.addFlags(android.content.Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
context.startActivity(intent)
```

### 坑4：回调注册状态未重置导致连接状态卡死

**现象**：挂断后重新进入房间，一直显示"正在连接"，即使远端画面已渲染。

**根因**：`_callbacksRegistered` 标志位在 `leaveRoom()` 时没有重置为 `false`，导致再次 `enterRoom()` 时 `ensureBridgeInit()` 判断 `_callbacksRegistered == true`，跳过 `registerNativeCallbacks()`，TRTC SDK 原生回调（onEnterRoom、onRemoteUserEnterRoom 等）没有被注册，状态无法更新。

```typescript
// ❌ leaveRoomImpl 中未重置标志位
function leaveRoomImpl() {
    TRTCBridge.exitRoom()
    TRTCBridge.destroy()
    // _callbacksRegistered 未重置，下一次 enterRoom 不注册回调
}

// ✅ 正确：重置标志位
function leaveRoomImpl() {
    TRTCBridge.exitRoom()
    TRTCBridge.destroy()
    _callbacksRegistered = false  // ← 关键：允许下一次重新注册回调
}
```

### 坑5：悬浮窗圆角导致画面不显示

**现象**：给悬浮窗容器设置 `GradientDrawable` 圆角背景后，整个悬浮窗不显示了。

**根因**：使用了 `setClipToOutline(true)` 尝试让容器裁剪圆角，但 `FrameLayout` 没有设置 `ViewOutlineProvider`，导致渲染异常。

```kotlin
// ❌ 错误组合：setClipToOutline(true) 导致不显示
val bgDrawable = GradientDrawable()
bgDrawable.setCornerRadius(radius)
bgDrawable.setColor(Color.parseColor("#CC1A1A1A"))
container.setBackground(bgDrawable)
container.setClipToOutline(true)  // 没有 OutlineProvider 时导致异常
```

**解决方案**：移除 `setClipToOutline(true)`，只靠 `GradientDrawable` 背景的圆角即可：
```kotlin
// ✅ 正确：只设置 GradientDrawable 背景
val bgDrawable = GradientDrawable()
bgDrawable.setShape(GradientDrawable.RECTANGLE)
bgDrawable.setCornerRadius(radius)
bgDrawable.setColor(Color.parseColor("#CC1A1A1A"))
container.setBackground(bgDrawable)
// ❌ 不需要 setClipToOutline(true)
```

### 坑6：悬浮窗拖拽误触点击

**现象**：拖动悬浮窗后总会触发点击事件，跳转到视频页。

**根因**：点击检测使用了 `_dragLastX/Y`（在 `ACTION_MOVE` 中持续更新），拖拽后抬起时 `_dragLastX/Y` 与当前坐标的差很小，误判为点击。

```typescript
// ❌ 错误：使用被 MOVE 更新的变量判断
let _dragLastX = 0, _dragLastY = 0
// ACTION_DOWN: _dragLastX = rawX, _dragLastY = rawY
// ACTION_MOVE: _dragLastX = rawX, _dragLastY = rawY  ← 不断更新
// ACTION_UP: 用 _dragLastX/Y 算距离 → 距离 ≈ 0 → 误判为点击

// ✅ 正确：用 ACTION_DOWN 时保存的 _downX/Y 计算
let _downX = 0, _downY = 0
// ACTION_DOWN: _downX = rawX, _downY = rawY
// ACTION_UP: 用 _downX/_downY 算距离 → 距离 > 阈值 → 判定为拖动
```

### 坑7：TRTC SDK 废弃 API 升级

**现象**：编译时出现 `'fun xxx' is deprecated. Deprecated in Java.` 警告。

**根因**：TRTC SDK 在 v8.0+ / v11.4+ 中废弃了一些旧 API，改用新签名。

| 废弃 API | 替代 API | 引入版本 |
|----------|----------|---------|
| `setListener(listener)` | `addListener(listener)` | v11.4 |
| `startRemoteView(userId, view)` | `startRemoteView(userId, streamType, view)` | v8.0 |
| `stopRemoteView(userId)` | `stopRemoteView(userId, streamType)` | v8.0 |
| `startLocalAudio()` | `startLocalAudio(quality)` | v8.0 |

```kotlin
// 旧 API
cloud?.setListener(listener)
c.startRemoteView(userId, view)
c.stopRemoteView(userId)
c.startLocalAudio()

// 新 API
cloud?.addListener(listener)
c.startRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, view)
c.stopRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG)
c.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT)
```

### 坑8：UTS 中参数类型不匹配（Int vs Float）

**现象**：编译报错 `参数类型不匹配：实际类型为 'Int'，预期类型为 'Float'`。

**解决方案**：UTS 中数值字面量默认是 `Int` 类型，需要 Float 参数时需显式转换：
```typescript
// ❌ 错误：radius 是 Int
bgDrawable.setCornerRadius(radius)

// ✅ 正确：转换为 Float
bgDrawable.setCornerRadius(radius as Float)
```

### 坑9：内存泄漏 — 静态 View 引用已销毁 Activity

**参考**：本文档「内存泄漏」章节已覆盖。核心要点：
- `TRTCBridge` 的 `companion object` 中持有的 `TXCloudVideoView` 或 UTS 层的 `_localVideoView` 视图
- 页面销毁时必须调用 `destroy()` 清空所有静态引用
- UTS 层的 `_localVideoView` 也要在 `leaveRoom()` 时置 `null`

### 坑10：安卓蓝牙 adapter.enable() 在 Android 12+ 废弃

**现象**：`adapter.enable()` 编译警告 `'fun enable(): Boolean' is deprecated`。

**根因**：Android 12（API 31）开始禁用静默开启蓝牙。

**解决方案**：判断系统版本，API 31+ 引导用户手动开启：
```typescript
if (android.os.Build.VERSION.SDK_INT >= 31) {
    // 弹出系统蓝牙授权对话框
    const intent = new android.content.Intent(android.bluetooth.BluetoothAdapter.ACTION_REQUEST_ENABLE)
    intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
    UTSAndroid.getUniActivity()?.startActivity(intent)
} else {
    adapter.enable()
}
```

### 坑11：getParcelableExtra 在 UTS 中无法使用新 API

**现象**：`intent.getParcelableExtra(key, BluetoothDevice::class.java)` 在 UTS 中编译报错。

**根因**：UTS 中 `UTSAndroid.getJavaClass()` 对 `BluetoothDevice` 这类 Kotlin 类不可用，`class BluetoothDevice : Any, Parcelable` 没有 `companion object`，不能直接作为表达式引用。

**解决方案**：只能在 UTS 中保持旧 API（带泛型参数），编译警告可忽略：
```typescript
// ✅ UTS 中唯一可用的写法（仅编译警告，不影响运行）
const raw = intent.getParcelableExtra<android.bluetooth.BluetoothDevice>(
    android.bluetooth.BluetoothDevice.EXTRA_DEVICE
)
// 原生的新 API（需要 ::class.java）在 UTS 中不可编译
```

### 坑12：悬浮窗窗口类型兼容性

**现象**：`android.view.WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY` 在 API 26+ 引入。

**解决方案**：
```typescript
let type: number
try {
    type = android.view.WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
} catch (_e: any) {
    type = 2038  // TYPE_PHONE 的旧值
}
```
