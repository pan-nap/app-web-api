# Android 平台混编 (uts for Android)

## 编译流程

UTS 源码保存时同步编译为 Kotlin 代码，真机运行/云打包时编译后的 Kotlin 源码成为 APK 的一部分。

## 类型差异

| 场景 | 默认 UTS 类型 | 需使用原生类型的场景 |
|------|--------------|-------------------|
| Int 参数 | `Number` | 重写 `onStartCommand` 等 Android API 方法时必须用 `Int` |
| MutableList | `Array` | 监听 `onAppActivityRequestPermissionsResult` 时需 `MutableList<string>` |
| String[] | `string[]` | 实现 Java SDK 方法时需 `import KotlinArray from 'kotlin.Array'` 别名引用 |

## 线程管理

```typescript
// 执行耗时任务（IO 线程）
UTSAndroid.getDispatcher("io").async(function(_){
  // 耗时操作
}, null)

// 操作 UI（主线程）
UTSAndroid.getDispatcher("main").async(function(_){
  // UI 操作
}, null)
```

说明：
- uni-app 平台：代码默认执行在 WeexJSBridgeThread
- uni-app x 平台：代码默认执行在 main 线程

## Android 原生资源配置

**AndroidManifest.xml**：放在 `utssdk/app-android/AndroidManifest.xml`，规则与原生一致。插件默认包名规则：
- 根目录 utssdk：`uts.sdk.(插件ID转驼峰)`
- uni_modules 目录：`uts.sdk.modules.(插件ID转驼峰)`

**res 资源**：`utssdk/app-android/res/`，支持 layout/values/anim 等标准目录。

**asset 资源**：通过 `UTSAndroid.getAppContext()!.getAssets()` 获取 AssetManager 访问。

**远程依赖**：`utssdk/app-android/config.json` 的 `dependencies` 字段配置 Maven 坐标。平台内置常用库（androidx.core、okhttp、glide、fastjson 等），无需重复添加。

```json
{
  "dependencies": ["androidx.recyclerview:recyclerview:1.0.0"]
}
```

**本地依赖**：jar/aar 文件放 `utssdk/app-android/libs/` 目录。so 文件：HBuilderX 4.26+ 支持通过混编 Kotlin 集成 so 参与本地调试。

**远程仓库支持**：jcenter()、google()、华为 maven、jitpack、mavenCentral。

**编译 SDK 版本**：uni-app x 本地 SDK 版本为 34（HBuilderX 4.15+）。

## Android 内置 API（UTSAndroid）

| API | 说明 |
|-----|------|
| `UTSAndroid.getAppContext()` | 获取 Application 上下文（可 `as Application` 转型） |
| `UTSAndroid.getUniActivity()` | 获取当前 Activity（返回值全程可空 `Activity?`） |
| `UTSAndroid.requestSystemPermission()` | 请求系统权限，基于 XXPermissions 库 |
| `UTSAndroid.getDispatcher("io"/"main")` | 获取指定线程调度器 |
| `UTSAndroid.getJavaClass(obj)` | 获取实例的 Java Class 对象 |
| `UTSAndroid.getGenericClassName<T>()` | 获取泛型实参的类名字符串 |
| `UTSAndroid.getGenericType<T>()` | 获取泛型实参的 Type 对象 |

**隐私协议 API**：`isPrivacyAgree()`、`setPrivacyAgree()`、`resetPrivacyAgree()`。

## Kotlin → UTS 语法转换速查

| Kotlin 语法 | UTS 语法 |
|-------------|----------|
| `class A : B()` | `class A extends B { constructor() { super() } }` |
| `class A : Interface` | `class A implements Interface` |
| `x!!` 非空断言 | `x!` 或 `if (x == null) return`（推荐） |
| `fun foo(): Void` | `function foo(): void`（全局）或 `foo(): void`（成员） |
| `object : Listener { }` 匿名内部类 | `const v = new (class implements Listener { ... })` |
| `constructor() : super()` | `constructor() { super() }` |
| `System.currentTimeMillis()` | `import System from 'java.lang.System'` 后调用 |
| `class ScreenReceiver : BroadcastReceiver()` 快捷构造 | `class ScreenReceiver extends BroadcastReceiver { constructor() { super() } }` |

## Android 废弃 API 处理

### BluetoothAdapter.enable()

**警告**：`'fun enable(): Boolean' is deprecated. Deprecated in Java.`

**原因**：Android 12（API 31）开始禁止应用静默开启蓝牙，需引导用户手动操作。

**解决方案**（UTS 代码）：
```typescript
if (!adapter.isEnabled()) {
    if (android.os.Build.VERSION.SDK_INT >= 31) {
        const intent = new android.content.Intent(android.bluetooth.BluetoothAdapter.ACTION_REQUEST_ENABLE)
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
        UTSAndroid.getUniActivity()?.startActivity(intent)
    } else {
        adapter.enable()  // 旧版本保留
    }
}
```

### Intent.getParcelableExtra()

**警告**：`'fun <T : Parcelable!> getParcelableExtra(p0: String!): T?' is deprecated. Deprecated in Java.`

**原因**：Android 13（API 33）推荐使用类型安全的重载 `getParcelableExtra(key, Class<T>)`。

**UTS 中的限制**：新 API 需要 `BluetoothDevice::class.java` 形式的类引用，但 `UTSAndroid.getJavaClass()` 对某些 Kotlin 类不可用（如 `BluetoothDevice`），编译报错 `Classifier does not have a companion object`。

**解决方案**：UTS 中保持旧 API 带泛型参数，警告可忽略：
```typescript
// ✅ UTS 中唯一可编译的写法
const raw = intent.getParcelableExtra<android.bluetooth.BluetoothDevice>(key)
```

### Activity.moveTaskToFront()

**警告**：`找不到名称"moveTaskToFront"`（编译错误，非警告）

**原因**：UTS 编译器中部分 Android Activity API 不可见。

**解决方案**：改用 Intent 方式：
```typescript
const intent = new android.content.Intent(context, act.getClass())
intent.addFlags(android.content.Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
context.startActivity(intent)
```

### FLAG_ACTIVITY_NEW_TASK 导致空白 Activity

**问题**：使用 `FLAG_ACTIVITY_NEW_TASK` 会创建新的 Activity 实例而非复用已有实例。

**解决方案**：改为 `FLAG_ACTIVITY_REORDER_TO_FRONT`，将栈内实例带到前台。

### @Suppress("DEPRECATION")

在 Kotlin 代码中抑制过时 API 警告：
```kotlin
@Suppress("DEPRECATION")
fun someMethod() {
    adapter.enable()  // 不再报警告
}
```

## 常见问题

- **新建 Activity/Service/Thread**：参考 Hello UTS 项目的 uts-nativepage 插件
- **生成 byte[]**：`new ByteArray(5)` 直接使用，无需 import
- **R 资源找不到**：`import R from 'io.dcloud.uni_modules.xxx.R'`，包名需与插件默认包名一致
- **无参静态方法调用**：Kotlin 编译后变为属性，用 `Obj.prop` 替代 `Obj.getProp()`
- **过时 API 警告**：`@Suppress("DEPRECATION")` 加在方法上
- **targetMethod error**：export 的 class 实例不能在 vue2 data() 中定义
- **包名含 Kotlin 关键字**：`import X from "com.example.\`object\`.Cls"` 反引号转义
- **Void 对应 Unit**：报错"预期为 Unit"时，实际需要返回 Void
- **结构入参 boolean 默认为 false**：type 结构体内部 boolean 字段默认 false，不支持指定
- **Kotlin 2.0 升级**：HBuilderX 4.81 → Kotlin 2.2.0，编译速度提升 25-40%；open 属性必须初始化；`toLowerCase()`→`lowercase()`；`when` if 需 else 分支；平台类型空检测更严格

### Kotlin 桥接类 + 外部 Android SDK API 不兼容

**场景**：UTS 插件通过 Kotlin 桥接类（`IMBridge.kt`）调用外部 Android SDK（如腾讯云 IM SDK），且通过 `config.json` 的 `dependencies` 声明 Maven 依赖。

**问题**：`ims-sdk-android`（旧版）与 `imsdk-plus`（新版）API 不兼容，但 `config.json` 中声明的版本配套的 API 与 Kotlin 代码使用的 API 不一致，导致大量 "Unresolved reference" 和 "overrides nothing" 编译错误。

**原因**：腾讯云 IM SDK 从旧版 `com.tencent.ims:ims-sdk-android` 迁移到新版 `com.tencent.imsdk:imsdk-plus`，核心 API 类名和方法签名均已改变，不能通过简单升级版本号来兼容旧代码。

**正确写法（kotlin）**：
```kotlin
// ❌ 旧版 API（ims-sdk-android）
val mgr = V2TIMManager.getSharedInstance()
mgr.init(context, sdkAppId, config)
val msg = mgr.createTextMessage(text)
val listener = object : V2TIMMessageListener { ... }
V2TIMManager.getMessageManager().addMessageListener(listener)
mgr.addSimpleListener(listener)

// ✅ 新版 API（imsdk-plus 8.7.7201）
val mgr = V2TIMManager.getInstance()
mgr.initSDK(context, sdkAppId.toInt(), config)
val msg = V2TIMManager.getMessageManager().createTextMessage(text)
V2TIMManager.getMessageManager().sendMessage(msg, receiver, "", priority, false, null,
    object : V2TIMSendCallback<V2TIMMessage> {
        override fun onSuccess(message: V2TIMMessage) { }
        override fun onError(code: Int, desc: String?) { }
        override fun onProgress(progress: Int) { }
    })
val msgListener = object : V2TIMAdvancedMsgListener {
    override fun onRecvNewMessage(msg: V2TIMMessage) { }  // 注意：单条消息，非列表
}
V2TIMManager.getMessageManager().addAdvancedMsgListener(msgListener)
val sdkListener = object : V2TIMSDKListener {
    override fun onConnecting() { }
    override fun onConnectSuccess() { }
    override fun onConnectFailed(code: Int, error: String?) { }
    override fun onKickedOffline() { }
    override fun onUserSigExpired() { }
}
mgr.addIMSDKListener(sdkListener)
```

> ⚠️ `V2TIMSDKListener` 和 `V2TIMAdvancedMsgListener` 是**抽象类**（不是接口），Kotlin 匿名对象必须加 `()`：`object : V2TIMSDKListener()`

**经验法则**：
1. 当 Kotlin 桥接类引用外部 SDK 时，`config.json` 中的 Maven 版本必须与 Kotlin 代码使用的 API 版本精确匹配
2. 升级 SDK 大版本号时，必须检查官方 API 差异文档，而不是盲目修改版本号
3. 腾讯云 IM SDK 的关键迁移：`ims-sdk-android` → `imsdk-plus`，包名不变（`com.tencent.imsdk.v2.*`），但类名和方法名均不同

### UTS 与 Kotlin 桥接类的回调类型兼容

**场景**：UTS 代码调用 Kotlin 桥接类方法，传入回调函数，回调参数涉及 `Array/List` 等集合类型。

**问题**：回调签名使用 `Array<Array<Any>>` 或 `List<List<Any>>` 均导致 "Argument type mismatch"，因为 UTS 编译后产生 `UTSArray<UTSArray<Any>>`。

**原因**：
1. UTS 的 `Array<T>` 编译为 `UTSArray<T>`（实现 Kotlin `List<T>`），与 Kotlin 原生 `Array<T>` 不是同一类型
2. Kotlin 函数类型参数是**不变(invariant)**的，`Function2<UTSArray<UTSArray<Any>>, String, Unit>` 不是 `Function2<List<List<Any>>, String, Unit>` 的子类型
3. 即使 `UTSArray` 实现了 `List`，`UTSArray<UTSArray<Any>> extends List<UTSArray<Any>>` ≠ `List<List<Any>>`

**解决方案**：避免在 Kotlin 桥接回调中使用嵌套泛型，改用平铺的多回调参数逐项传递：
```kotlin
// ❌ 不兼容 — 嵌套泛型
callback: (Array<Array<Any>>, String) -> Unit
callback: (List<List<Any>>, String) -> Unit

// ✅ 兼容 — 平铺参数逐条回调
onItem: (String, String, String, Long, Boolean) -> Unit,  // 每条消息逐条回调
onComplete: (Int, String) -> Unit  // 完成/失败统一回调
```

```typescript
// UTS 侧
const msgs: Array<ChatMessage> = []
IMBridge.loadMessages(userId, count as Int,
  function (msgId: string, sender: string, text: string, ts: Long, isSelf: boolean): void {
    msgs.push({ msgId, sender, text, timestamp: ts as number, isSelf })
  },
  function (totalCount: Int, error: string): void {
    callback(msgs, error)
  })
```

### Kotlin 抽象类匿名对象初始化语法

**场景**：在 Kotlin 桥接类中创建 SDK 监听器的匿名实例。

**错误**：`object : V2TIMSDKListener { ... }` 编译报错 "This type has a constructor, so it must be initialized here"。

**原因**：`V2TIMSDKListener` 和 `V2TIMAdvancedMsgListener` 是 **抽象类(abstract class)**，不是接口(interface)。Kotlin 中初始化抽象类的匿名对象时必须加 `()`。

**正确写法**：
```kotlin
// ❌ 接口风格 — 编译错误
val listener = object : V2TIMSDKListener {
    override fun onConnecting() { }
}

// ✅ 抽象类风格 — 加 ()
val listener = object : V2TIMSDKListener() {
    override fun onConnecting() { }
}
```

### TIM SDK 废弃 API 处理

**场景**：Kotlin 桥接类调用腾讯云 TIM SDK 的 `markC2CMessageAsRead` 和 `markGroupMessageAsRead` 方法。

**警告**：`'fun markC2CMessageAsRead(p0: String!, p1: V2TIMValueCallback<Int>!)' is deprecated`

**原因**：TIM SDK 8.7.x 版本中带回调的 `markC2CMessageAsRead` 和 `markGroupMessageAsRead` 方法已废弃。

**解决方案**：在 Kotlin 桥接类中添加 `@Suppress("DEPRECATION")` 注解：

```kotlin
@Suppress("DEPRECATION")
fun markC2CMessageAsRead(userId: String): Boolean {
    try {
        V2TIMManager.getMessageManager().markC2CMessageAsRead(userId, null)
        return true
    } catch (e: Exception) {
        return false
    }
}
```

**后续优化**：升级 TIM SDK 到 `8.8.x` 或更高版本以支持无回调接口。

### TIM SDK 视频消息发送与封面生成

**场景**：在 Kotlin 桥接类中调用 TIM SDK 的 `createVideoMessage` 发送视频消息。

**问题**：视频消息发送后聊天界面不显示视频信息。

**原因分析**：
1. **路径格式问题**：`uni.chooseVideo` 返回的路径包含 `file://` 前缀，TIM SDK 需要纯文件系统路径
2. **封面图片缺失**：`createVideoMessage` 需要封面图片路径，传入空字符串会导致消息创建失败或无法显示
3. **Duration 类型不匹配**：UTS `number` 在 Android 端可能是 `Float`，而 TIM SDK 需要 `Int`

**解决方案**：

```kotlin
@JvmStatic
fun sendVideoMessage(toUserId: String, videoPath: String, videoType: Int, duration: Int, snapshotPath: String): String {
    if (videoPath.isEmpty()) return ""
    // 去除 file:// 前缀
    val realVideoPath = if (videoPath.startsWith("file://")) videoPath.substring(7) else videoPath
    var realSnapshotPath = if (snapshotPath.startsWith("file://")) snapshotPath.substring(7) else snapshotPath
    
    // 自动生成封面（如果封面路径为空）
    if (realSnapshotPath.isEmpty()) {
        realSnapshotPath = generateVideoSnapshot(realVideoPath)
        console.log("IMBridge: 自动生成封面 snapshot=" + realSnapshotPath)
    }
    
    console.log("IMBridge: createVideoMessage realPath=" + realVideoPath + ", snapshot=" + realSnapshotPath + ", duration=" + duration)
    val msg = V2TIMManager.getMessageManager().createVideoMessage(realVideoPath, realSnapshotPath, duration, "")
    val msgResult = if (msg == null) "null" else "success"
    console.log("IMBridge: createVideoMessage result=" + msgResult)
    console.log("IMBridge: 发送视频消息 to=" + toUserId + ", path=" + videoPath)
    return sendMessageInternal(msg, toUserId)
}

private fun generateVideoSnapshot(videoPath: String): String {
    try {
        val bitmap = android.media.ThumbnailUtils.createVideoThumbnail(
            videoPath, android.provider.MediaStore.Video.Thumbnails.MINI_KIND
        )
        if (bitmap != null) {
            // 使用 Context 获取缓存目录（需在 init 时保存 Context）
            val ctx = _context
            if (ctx != null) {
                val cacheDir = ctx.externalCacheDir
                if (cacheDir != null) {
                    val snapshotFile = java.io.File(cacheDir, "video_snapshot_" + System.currentTimeMillis() + ".jpg")
                    bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, 80, java.io.FileOutputStream(snapshotFile))
                    return snapshotFile.getAbsolutePath()
                }
            }
        }
    } catch (e: Exception) {
        console.log("IMBridge: 生成视频封面失败: " + e.message)
    }
    return ""
}
```

**关键要点**：

1. **路径处理**：始终去除 `file://` 前缀，使用纯文件路径
2. **封面生成**：当封面路径为空时，使用 `ThumbnailUtils.createVideoThumbnail` 从视频提取第一帧作为封面
3. **缓存目录**：使用 `Context.externalCacheDir` 存储封面图片，确保有写入权限
4. **Context 保存**：在 `init` 方法中保存 `Context` 引用，供后续生成封面时使用
5. **日志输出**：添加详细日志便于排查问题（路径、封面生成结果、消息创建结果）

**UTS 端调用注意事项**：

```typescript
// UTS 端 — duration 必须用 Math.round() 转换为整数
const duration = Math.round(result.duration as number) as number
IMService.sendVideoMessage(toUserId, path, 0, duration, '')
```

> ⚠️ `createVideoThumbnail` 和 `MediaStore.Video.Thumbnails.MINI_KIND` 已废弃（Android 10+），但在 UTS 插件中仍可使用。如需兼容更高版本，可考虑使用 `MediaMetadataRetriever` 替代。
```
