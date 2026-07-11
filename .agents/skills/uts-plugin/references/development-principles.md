# UTS 开发原则总结

## 核心架构原则

1. **插件不包含业务配置** — 插件只提供纯功能，配置/单例写在 `utils/` 层
2. **内部数据结构用 class** — 不要用 `UTSJSONObject` + `as`；用 `class` + 成员赋值
3. **显式标注类型** — `arr[i] as number`、`str.charCodeAt(i) as number`
4. **避免解构** — 用逐行赋值替代 `const { a, b } = ...`
5. **用 `??` 替代 `||`** — 处理 `undefined`/`null` 默认值
6. **省略 async 返回类型** — 让编译器自动推断
7. **局部变量拷贝** — 闭包中修改的变量先拷贝再使用
8. **`as` 加括号** — `(x as number) & mask` 避免 Intersection Type 错误
9. **STOMP headers 用 string[] 而非 Map** — headers 以 `"key:value"` 字符串数组传递，避免 Map 遍历问题
10. **避免 uni.\$emit 传递复杂对象** — UTS 中 `uni.$emit`/`uni.$on` 不适合传递含 Map 字段的对象，改用回调函数模式
11. **STOMP 连接必须指定子协议** — 连接 ActiveMQ 等 STOMP 服务端时，带上 `protocols: ["v12.stomp", "v11.stomp", "v10.stomp"]`
12. **Uint8Array.set() 不支持** — 用循环逐元素赋值替代
13. **字符串转义用 \xNN** — UTS 不支持 `\0`、`\a` 等简写转义，用 `\x00` 替代
14. **Map 替代方案** — 需遍历 Map 时，改用 `string[]` 数组 + 手动拼接 key:value，或直接用 `class` 存储
15. **uni_modules 只可靠导出 class** — 独立函数和 type/interface 重导出可能不被外部解析。插件入口 **必须导出 class**，type/enum 定义在 class 所在文件内直接 `export`，不要用 `export { X } from './file'` 重导出
16. **多平台编译策略：按需选择单文件条件编译或多平台独立文件** — UTS 插件支持两种多平台编译方案，应根据**是否需要平台桥接语言**（Kotlin/ObjC/Swift）选择：
    - **方案 A（单文件条件编译）**：所有平台实现在 `utssdk/index.uts` 一个文件中，用 `#ifdef APP-ANDROID / APP-IOS / APP-HARMONY` 区分平台。`app-android/` 目录只放原生配置文件（`config.json`、`AndroidManifest.xml`）。适用于：**纯 UTS 实现、无 Kotlin/ObjC 桥接代码**的简单插件。
    - **方案 B（多平台独立文件，⭐推荐）**：各平台有独立 `index.uts` 文件放在对应子目录，辅以原生桥接文件。`interface.uts` 在根目录定义 API 契约。适用于：**需要 Kotlin/ObjC/Swift 桥接**的复杂插件（如 hs-im）。
    - 两种方案对比如下：

| 维度 | 方案 A：单文件条件编译 | 方案 B：多平台独立文件（⭐推荐） |
|------|----------------------|-------------------------------|
| 目录结构 | `utssdk/index.uts`（含 #ifdef）<br>`utssdk/app-android/config.json` | `utssdk/interface.uts`（契约）<br>`utssdk/app-android/index.uts` + `XxxBridge.kt`<br>`utssdk/app-ios/index.uts` + `XxxBridge.m` |
| 代码组织 | 一个文件内 `#ifdef` 分平台 | 各平台独立文件，互不干扰 |
| 桥接语言支持 | ❌ 不支持（无法跨文件引用） | ✅ Kotlin `.kt` / ObjC `.h/.m` 原生桥接 |
| 代码可读性 | 平台差异大时代码膨胀 | 各平台独立文件，清晰整洁 |
| 适用场景 | 纯 UTS、简单平台差异 | 需要原生 SDK 桥接、平台逻辑复杂 |
| 模板项目 | hs-mqtt 插件 | hs-im 插件 |
    - hs-im 采用方案 B 的目录结构：
    ```
    utssdk/
    ├── interface.uts       # API 契约（只签名不实现）
    ├── unierror.uts        # 错误码
    ├── web/index.uts       # Web 平台实现
    ├── app-android/
    │   ├── index.uts       # Android 平台实现
    │   └── IMBridge.kt     # Kotlin 桥接类
    ├── app-ios/
    │   ├── index.uts       # iOS 平台实现
    │   ├── IMBridge.h      # ObjC 桥接头文件
    │   └── IMBridge.m      # ObjC 桥接实现
    └── app-harmony/
        └── index.uts       # HarmonyOS 平台实现
    ```
    - **原则**：涉及原生桥接语言时必须使用方案 B；纯 UTS 实现可任选。
17. **`::` class 引用语法不支持** — 不能用 `android.content.Context::class.java`，用 `java.lang.Class.forName('android.content.Context')`
18. **uni.getActivity() 在插件中不可用** — 插件内获取 Activity 需用 `UTSAndroid.getUniActivity()`（全局可用，无需 import）
19. **`X!` 非空标记语法不支持** — UTS 不支持 Kotlin 的 `!` 非空标记，直接用 `::class.java`（但 `::` 也不支持，见上条）
20. **enum 不能用于模块级初始化表达式** — UTS `enum` 是 Kotlin 的 enum class，没有 companion object，不能在模块级变量初始化（`let x: MyEnum = MyEnum.A`）中用作表达式。替代方案：用 `const` 对象 + `type` 别名
21. **any 类型不支持属性访问** — `(data as any).body` 在 UTS 中报 "找不到名称"，必须先转为具体 interface/class
22. **Java 原生 int 参数需 `as Int`** — 调用 Java `setInt()` 等需 int 参数的方法时，必须 `value as Int`（UTS number 默认是 kotlin Long/Double）
23. **CSS `gap` 属性不支持** — uni-app-x 的 .uvue 文件中 CSS `gap` 属性不被标准支持，改用 `margin` + `+` 选择器模拟
24. **`const` 对象属性值类型为 `Any?`** — `const Foo = { A: 1 }` 的 `Foo.A` 在用作变量初始化或函数参数时类型推断为 `Any?`，不能赋值给 `number`。**必须用原始字面量替代**（如 `let x: number = 1` 而非 `let x: number = Foo.A`）
25. **回调参数必须显式标注类型** — UTS 不能自动推断回调参数类型。`useStompMessage("evt", (msg) => {...})` 报 `Cannot infer type`，必须写 `(msg: StompMessage) => {...}`
26. **函数参数数量必须完全匹配** — `useStompMessage` 声明为 `(eventName: string, callback: ...)`，调用时不能省略 `eventName` 参数。UTS 不支持可选参数省略
27. **反射调用 SDK 需配置 Maven 依赖** — 使用 `Class.forName` 反射调用第三方 SDK 时，仍需在 `app-android/config.json` 中配置真实的 Maven 依赖和仓库地址，否则运行时报 `ClassNotFoundException`
28. **TRTC `roomId`（int）和 `strRoomId`（String）是两个不同的房间** — 新版 TRTC SDK 同时支持 `params.roomId = 888`（int 数值房间）和 `params.strRoomId = "888"`（String 字符串房间），但这两者是不同的房间，Web SDK 仅支持数值 roomId。两端必须统一使用同一种，否则互相不可见。纯数字房间统一用 `params.roomId`
29. **自定义基座的依赖只能通过 Maven 坐标引入** — 放在 `app-android/libs/` 目录的 AAR 文件在自定义基座中**不会自动生效**，必须通过 `config.json` 的 `dependencies` 字段配置 Maven 坐标。自定义基座打包时 Gradle 从 Maven Central 下载依赖，不会扫描本地 `libs/`
30. **HBuilderX CLI 启动 app 后进程不会退出** — 使用 `spawnSync`（同步等待）启动 `launch app-android` 会导致终端卡死，因为 HBuilderX CLI 运行 App 后会保持连接监听日志和热重载。必须用 `spawn`（异步）方式启动
31. **TRTC SDK Maven 版本号必须与仓库一致** — `com.tencent.liteav:LiteAVSDK_TRTC:11.9.0.14028` 在所有 Maven 仓库中都不存在。正确版本请查询 [Maven Central](https://central.sonatype.com/artifact/com.tencent.liteav/LiteAVSDK_TRTC)。当前可用版本如 `13.3.0.20247`
32. **TRTC SDK 下载链接含 `/v1/` 路径** — 官方最新版下载地址是 `https://liteav.sdk.qcloud.com/download/latest/v1/TXLiteAVSDK_TRTC_Android_latest.zip`，缺少 `/v1/` 会报 `NoSuchKey`
33. **`or` 位运算关键字不支持** — UTS 不支持 Kotlin 的 `or` 关键字做位运算（如 `FLAG_A or FLAG_B`），必须使用 `|` 操作符替代
34. **`!!` 非空断言不可靠** — UTS 中 `UTSAndroid.getUniActivity()!!` 不一定会触发非空断言，后续调用仍报 `Activity?` 类型错误。必须使用 `if (x == null) return` 显式检查 + Kotlin smart cast 收窄类型
35. **`implements` 嵌套 Android 接口类型不支持** — `class X extends Object implements android.view.TextureView.SurfaceTextureListener` 编译失败，UTS 无法解析嵌套接口类型。替代方案：
    - **单方法接口**（`OnClickListener`、`OnTouchListener`）：直接传匿名函数 `setOnClickListener(function(v: View): void {})`
    - **多方法接口**（`SurfaceTextureListener`有4个方法）：无法用任何方式实现，只能用其他方案绕开（如直接绑定视频，跳过 Surface 就绪回调）
36. **Java Int 字段赋值需整体 `as Int`** — 对 Android 原生 `Int` 类型字段（如 `LayoutParams.x/y`）赋值时，`curLp.x = (curLp.x as number) + (dx as Int)` 报类型不匹配，必须 `((curLp.x as number) + (dx as Int)) as Int` 整体转换
37. **`.uvue` 中 `ref<view | null>` 不合法** — uni-app x 中没有 `view` 类型，必须使用 `ref<UniElement | null>` 引用 uvue 组件容器
38. **`const` 对象属性值 `Any?` 不能用于 `switch case`** — `CallStatusConst.Connected`（值为 `2`）在 switch case 中报类型错误，因为 `const` 对象的属性值类型是 `Any?`。必须用原始字面量 `case 2:`
39. **Android 接口不能通过对象字面量实现** — UTS 不支持 `new InterfaceName({ method: function(){}}) ` 语法。单方法接口直接传函数引用，多方法接口完全无法实现
40. **UTS 函数必须"先定义后使用"** — 在 `.uvue` 的 `<script setup>` 中，所有函数定义必须放在调用位置之前，不支持 JavaScript 的变量提升（hoisting）。生命周期钩子（`onMounted`/`onShow` 等）中调用的函数必须先定义，再调用生命周期
41. **`TRTCCloud.sharedInstance()` 必须传 Context** — 调用 `TRTCCloud.getMethod('sharedInstance')` 不带参数会抛 `NoSuchMethodException`，因为 TRTC SDK 只有 `sharedInstance(Context)` 有参静态方法，不存在无参版本
42. **`UniElement` 可通过 `getAndroidView<ViewGroup>()` 获取原生视图** — 官方支持此方式（HBuilderX 4.25+），无需用 `act.findViewById()`。示例：`const vg = element.getAndroidView<android.view.ViewGroup>()`，然后可 `vg.addView()`
43. **单文件条件编译（方案 A）时应将 `#ifdef` 放在函数内部而非包裹函数块** — 采用 #16 方案 A（一个 `index.uts` 内含所有平台代码）时，推荐以下写法：所有平台共享函数签名统一暴露，在函数**内部**用 `#ifdef APP-ANDROID / APP-IOS / APP-HARMONY` 三区块分别实现平台逻辑。这样保证：
    - 函数名始终可被 class/service 层调用，无需在调用处加 `#ifdef`
    - 新加平台只需在函数内新增一个 `#ifdef` 块，不破坏已有代码
    - Android 辅助函数/变量（如 `getTrtcCloud()`、`_wm`）用 `#ifdef APP-ANDROID` 包裹，只在该平台编译
    - 示例结构：
    ```
    // 正确：函数内部条件编译
    function nativeEnterRoom(config: TrtcConfig): void {
      // #ifdef APP-ANDROID
      ...Android实现...
      // #endif
      // #ifdef APP-IOS
      ...iOS实现...
      // #endif
    }

    // 错误：包裹整个函数块
    // #ifdef APP-ANDROID
    function nativeEnterRoom(config: TrtcConfig): void { ... }
    // #endif
    ```
    - 对应地，`TrtcService` 等业务 class 中**不要**出现 `#ifdef`，所有平台差异下沉到 `native*` 函数内部
44. **`any` 类型没有 `getClass()` 方法** — UTS 中 `any` 类型映射到 Kotlin 的 `Any`，Kotlin 的 `Any` 没有 `getClass()` 方法（Java 的 `Object.getClass()` 需要强制类型转换为 `Any?` 才能调用）。正确做法：缓存 `Class.forName()` 结果而不是从实例获取 Class
45. **`SYSTEM_ALERT_WINDOW` 悬浮窗权限需运行时检查** — Android 6.0（API 23）以上，`SYSTEM_ALERT_WINDOW` 是特殊权限，仅靠 `AndroidManifest.xml` 声明不够。必须在运行时通过 `Settings.canDrawOverlays(context)` 反射判断，未授权时跳转 `Settings.ACTION_MANAGE_OVERLAY_PERMISSION` 设置页引导用户手动开启。不能用常规的 `UTSAndroid.requestSystemPermission()` 请求此权限
46. **TRTC Maven 版本号必须与 Maven Central 一致** — `com.tencent.liteav:LiteAVSDK_TRTC:13.3.0.20247` 在 Maven Central **不存在**（该版本仅存在于 `LiteAVSDK_Professional`）。`LiteAVSDK_TRTC` 最新版本为 `13.0.0.19676`。使用 `config.json` 配置 Maven 依赖时，必须先在 [Maven Central](https://central.sonatype.com/artifact/com.tencent.liteav/LiteAVSDK_TRTC) 确认版本是否存在
47. **`startLocalPreview` 反射参数需用 `Boolean.TYPE` 而非 `Boolean.class`** — `TRTCCloud.startLocalPreview(boolean, TextureView)` 的 `boolean` 参数是**基本类型**，Java 反射中 `boolean.class ≠ Boolean.class`。必须用 `java.lang.Boolean.TYPE`（编译为 `boolean.class`）才能匹配到正确方法签名。用 `Class.forName('java.lang.Boolean')` 会得到 `Boolean.class`（包装类型），反射找不到方法抛 `NoSuchMethodException`
48. **多平台 UTS 插件三层架构模式（方案 A 适用）** — 采用 #16 方案 A（单文件条件编译）时，推荐按以下三层组织代码，保证跨平台结构清晰且主体代码零 `#ifdef`：
    ```
    第一层: 缓存函数 — get*Class(), get*Context() 等
            函数内部用 #ifdef 区分三平台（android/ios/harmony），每个平台都有 return
            例：getCloudClass()、getContextClass()、getTRTCParamsClass()

    第二层: 各平台实现函数 — platform*Impl()
            整体包裹在 // #ifdef APP-XXXX ... // #endif 块中
            纯平台特有代码（Java 反射、iOS API 调用等）
            例：androidEnterRoomImpl()、iosLeaveRoomImpl()

    第三层: 分发函数 — native*() 或 *Impl()
            无 #ifdef，仅有对平台实现函数的一行委托调用
            例：enterRoomImpl() → androidEnterRoomImpl()
     ```
49. **TRTC Android `startLocalPreview` 只有 `(boolean, TXCloudVideoView)` 签名** — TRTC Android SDK 只有 `startLocalPreview(boolean frontCamera, TXCloudVideoView view)` 这一个签名，**没有** `startLocalPreview(boolean)` 重载（iOS/桌面端才有）。如需纯反射方式调用，需通过 `Class.forName('com.tencent.rtmp.ui.TXCloudVideoView')` 反射创建 `TXCloudVideoView` 实例再传入。`startRemoteView(String, TextureView)` 不受影响（远端渲染），本地预览视图（`TXCloudVideoView`）未被添加到窗口时，用户看不到本地画面，但摄像头仍会采集并推送给远端用户。
50. **UTS 不支持 Java 反射 (getMethod/getField/newInstance)** — UTS 的 `java.lang.Class` 类型定义中**没有** `getMethod()`、`getField()`、`newInstance()`、`getConstructor()` 等方法。`(x as any).method()` 也不可用（UTS 的 `any` 不支持任意属性访问，见 #21）。标准解决方案：创建 **Kotlin 桥接类**（`.kt` 文件放在 `utssdk/app-android/` 下），UTS 端直接调用桥接类静态方法。
    - 位置：`utssdk/app-android/<ClassName>.kt`（直接放在 `app-android/` 根目录）
    - 包名无需与 UTS 插件默认包名一致，UTS 通过 `import { ClassName } from 'package.name'` 引用
    - **使用自定义基座**（`config.json` 配置了 Maven 依赖）时，Kotlin 可直接 `import com.tencent.trtc.TRTCCloud`，编译时 Maven 类在 classpath 上
    - **如果走标准基座**（Maven 依赖不在 classpath），Kotlin 中只能用反射：`Class.forName()`、`getMethod()`、`getField()`、`newInstance()`（Kotlin 运行在 JVM 上，这些方法完整可用）
    - UTS 端调用方式：`import { Bridge } from 'pkg.name'` → `Bridge.method()`
51. **UTS 没有 `any` 类型** — `let x: any = null` 编译报错。必须使用具体类型（如 `Xxx | null`）替代。`as any` 也不可用，需要用 `as 具体类型`。
52. **UTS 类静态方法不能通过赋值函数表达式覆写** — `BluetoothService.isSupported = function(): boolean { ... }` 编译报错，不给类静态属性赋值为函数。采用 #16 方案 A（单文件条件编译）时，所有平台代码直接写在 `index.uts` 中该方法体的 `#ifdef APP-ANDROID / APP-IOS / APP-HARMONY` 条件编译块内。采用方案 B（多平台独立文件）时，各平台 `index.uts` 中直接完整实现方法即可。参见 #43。
53. **`?.call(null, ...)` 语法不支持** — `BluetoothService.onError?.call(null, msg)` 报"找不到名称 call"。UTS 不支持 JS 的 `.call()` 调用。解决方案：定义辅助函数，通过局部变量 `const cb = X.onError; if (cb != null) cb(msg)` 模式安全调用回调。
54. **UTS number 传给 Kotlin Int 参数需显式转换** — UTS 的 `number` 类型编译为 Android 时可能是 `Float`，而 Kotlin 方法参数声明为 `Int` 时，运行时会报 `ClassCastException: java.lang.Float cannot be cast to java.lang.Integer`。必须使用 `Math.round()` 或 `Math.floor()` 显式转换：`Math.round(duration as number) as number`
55. **uni-app 内置类型不要强转为 UTSJSONObject** — `ChooseVideoSuccess`、`ChooseImageSuccess` 等内置类型是专用类型，强转为 `UTSJSONObject` 会报 `ClassCastException`。直接使用内置类型访问属性：`const result = res as ChooseVideoSuccess; const path = result.tempFilePath as string`
56. **TIM SDK 文件路径需去除 file:// 前缀** — `uni.chooseVideo`、`uni.chooseImage` 返回的路径包含 `file://` 前缀，TIM SDK 的 `createVideoMessage`、`createImageMessage` 需要纯文件系统路径。必须手动去除前缀：`val realPath = if (path.startsWith("file://")) path.substring(7) else path`
57. **TIM SDK 视频消息必须提供封面图片** — `createVideoMessage` 的封面路径参数不能为空，否则消息创建失败或无法显示。当封面路径为空时，需使用 `ThumbnailUtils.createVideoThumbnail` 从视频提取第一帧作为封面
58. **Smart cast 对模块级 `var` 不可靠** — 模块级 `var _x: Xxx | null` 在 `if (_x != null) _x.doSomething()` 时编译器报 "Smart cast is impossible"。Kotlin 无法对可能被并发修改的模块级 mutable 属性做空安全推断。修复：先赋值给局部 `const val = _x` 再 `if (val != null) val.doSomething()`。
59. **`getParcelableExtra()` 必须显式传泛型参数** — `intent.getParcelableExtra(key)` 报 "Cannot infer type for this parameter"。因为 Java 方法是 `<T> T getParcelableExtra(String)`，UTS 无法推断 `T`。必须写 `intent.getParcelableExtra<具体的类>(key)`。返回类型为可空，需安全判空。
60. **`new Android抽象类({...})` 不支持** — UTS 不能通过 `new BroadcastReceiver({ onReceive: fn })` 创建匿名子类。正确做法：创建具名 UTS 类 `extends android.content.BroadcastReceiver`，并添加 `constructor() { super() }` 调用父类构造函数。在方法上需使用 `override` 关键字。
61. **Java SAM 接口需函数直接传参而非对象字面量** — `new java.lang.Runnable({ run: fn })` 报 `UTSJSONObject` 类型不匹配。Runnable 等 SAM（单抽象方法）接口在 UTS 中通过 Kotlin SAM 转换支持，应直接传函数：`new Thread(function(): void { ... })`。
62. **Java `InputStream.read(byte[])` 不接受 `Array<number>`** — UTS 中 `Array<number>` 不等同于 Java `byte[]`，不能作为参数传入。涉及字节流读取时，改用 `BufferedReader` + `InputStreamReader`（文本）或 `DataInputStream`（二进制）包装类。写入时同理用 `OutputStreamWriter` 替代 `OutputStream.write(byte[])`。
63. **`UTSAndroid.getUniActivity()` 全程可空** — 返回 `Activity?`，每次使用都必须用 `?.` 空安全调用或先判空后使用。推荐先赋值给局部常量一次，后续统一用该局部变量调用。
64. **平台子目录是否放 `.uts` 取决于编译方案** — 根据 #16 的两种多平台编译策略：
    - **方案 A（单文件条件编译）**：`app-android/`、`app-ios/`、`app-harmony/` 目录只存放**原生资源文件**（`AndroidManifest.xml`、`config.json`、ObjC `.h/.m` 等），不放置 `.uts` 文件。所有 `.uts` 代码（包括各平台实现）统一放在 `utssdk/index.uts` 中，通过 `#ifdef` 条件编译分平台。
    - **方案 B（多平台独立文件）**：`app-android/index.uts`、`app-ios/index.uts`、`web/index.uts` 各自独立实现，原生桥接文件（`.kt`、`.h/.m`）放在同目录下。根目录 `interface.uts` 只放 API 契约（方法签名不含 body）。
    - **hs-im 采用方案 B**：各平台有独立 `index.uts`，配合 `IMBridge.kt`/`.h/.m` 实现 TIM SDK 桥接。外部通过 `import { IMService } from '@/uni_modules/hs-im'` 统一引入，无需关心平台差异。

## Android 专属原则

65. **Android: 重写系统方法参数用 Int 而非 Number** — UTS 默认用 Number 兼容 Int，但重写 Android API 方法时，参数和返回值必须用原生的 `Int` 类型。
66. **Android: `java.lang.*` 包需手动 import** — `java.lang.System`、`java.lang.Class` 等不会自动导入，需显式 `import System from 'java.lang.System'`。
67. **Android: 匿名内部类用 `new (class implements X){...}`** — 不能用 `object : X{}` 语法，需用 `const myListener = new (class implements Listener { ... })`。
68. **Android: 非空断言用 `!` 而非 `!!`** — Kotlin 用 `x!!`，UTS 用 `x!`。但 `!` 在某些场景不可靠，推荐显式 `if (x == null) return`。
69. **Android: Double 运算需 `a * 1.0 / b`** — Int 除法不会自动提升为 Double，需 `let c: Double = a * 1.0 / b`。
70. **Android: 静态方法调用用属性访问** — Kotlin 编译的 AAR 将方法改为私有，不能 `setShowLine(false)`，应 `showLine = false`。
71. **Android: 过时 API 用 `@Suppress("DEPRECATION")` 忽略警告**。
72. **Android: 泛型传递丢失用 `@UTSAndroid.keyword`** — `@UTSAndroid.keyword("inline") @UTSAndroid.keyword("reified")` 使编译产出 `inline fun <reified T>`。注意 inline 方法内不能含局部 function。
73. **Android: R 资源引入需检查包名** — `import R from 'io.dcloud.uni_modules.xxx.R'` 包名需与插件默认包名一致。
74. **Android: 包名含 Kotlin 关键字用反引号转义** — `import X from "com.example.\`object\`.Cls"`。
75. **Android: 界面跳转用 `.javaClass`** — `new Intent(getUniActivity(), DemoActivity().javaClass)`。
76. **Android: Kotlin 2.0 升级注意** — HBuilderX 4.81 升级 Kotlin 2.2.0：open 属性必须初始化；`toLowerCase()`→`lowercase()`；`when`中 if 需 else 分支；Java String! 空检测更严格。
77. **Android: 一个类只能有一个构造函数** — 不允许构造器重载。
78. **Android: 生成 byte[] 用 `new ByteArray(n)`** — 无需额外 import。

## iOS 专属原则

79. **iOS: 构造参数用 `=` 而非 `:`** — `new UIAlertController(title="提示", ...)` 替代 swift `title: "提示"`。
80. **iOS: 枚举值不支持简写** — 必须完整写 `UIAlertController.Style.alert`，不能 `.alert`。
81. **iOS: 枚举关联类型不支持** — 带关联值的 Swift 枚举不可用，需改无关联值。
82. **iOS: 闭包必须完整写出** — 不支持尾随闭包，`handler=(action: UIAlertAction):void => {...}`。
83. **iOS: 逃逸闭包需 `@escaping`** — `function fn(@escaping completion: (res: boolean)=>void)`。
84. **iOS: target-action 需 `Selector` + `@objc`** — `Selector("方法名")`，回调加 `@objc static`。
85. **iOS: 参数标签用 `@argumentLabel("xxx")`** — 实现协议方法时标注参数标签，无标签用 `@argumentLabel("")`。
86. **iOS: try/catch 用 `UTSiOS.try()`** — `UTSiOS.try(expr)` 对应 `try`；加 `"?"` 参数对应 `try?`；加 `"!"` 对应 `try!`。
87. **iOS: 系统版本判断用 `UTSiOS.available()`** — `UTSiOS.available("iOS 10.0, *")`。版本标记：class 用 `@available(iOS 15.0, *)`，函数用 `@UTSiOS.available("iOS 16.1, *")`。存储属性不支持。
88. **iOS: Swift 修饰符用 `@UTSiOS.keyword()`** — 如 `@UTSiOS.keyword("weak")`、`@UTSiOS.keyword("private")` 等。
89. **iOS: 指针操作用 `UTSiOS.getPointer()`** — 替代 Swift 的 `&` 操作符。
90. **iOS: 销毁 export class 用 `UTSiOS.destroyInstance()`** — export 给 js 的 class 实例需在 `unmounted()` 时销毁。
91. **iOS: 闭包循环引用用 `"[weak self]"` 标记** — 闭包体开头加此字符串，标记后 `this` 变为可空。
92. **iOS: 返回自定义 class 需定义 interface** — export function 返回自定义 class 时，需定义 interface + class implements 该 interface。
93. **iOS: export class 创建单例不支持** — 需在混编 Swift 中实现。

## HarmonyOS 专属原则

94. **iOS: 显式标注回调参数类型** — UTS 插件中无法默认推断类型，所有回调参数必须显式标注。
95. **iOS: Dictionary 用 Map 替代** — `Map<string,any>` + `map.set(key, value)`。
96. **iOS: `@available` 存储属性不支持** — 对 class 存储属性添加版本约束会报错。计算属性 `@available` 不生效（已知问题）。
97. **HarmonyOS: 对象字面量需指定类型** — 否则编译为 `as UTSJSONObject`。
98. **HarmonyOS: config.json 不能含注释** — 否则编译失败。
99. **HarmonyOS: 获取 Context 用 `getContext()` 或 `getHostContext()`** — `UTSHarmony.onAppAbilityWindowStageCreate` 获取 WindowStage 后 `getUIContext().getHostContext()`。
100. **HarmonyOS: overrides 需在 harmony-configs/oh-package 配置** — 插件内 config.json 依赖在非根目录，overrides 不生效。
101. **HarmonyOS: 混编 ets 文件** — `app-harmony/*.ets` 原样拷贝到产物，uts 可引用。
102. **Web: TIM SDK create*Message 参数校验 — 用纯 JS 辅助文件绕过 UTSJSONObject** — TIM JS SDK v2.27.6 的 `createTextMessage/createImageMessage/createVideoMessage/createAudioMessage/createCustomMessage` 方法内部用 `st()`（isPlainObject）检测 `payload` 参数原型链。UTS for Web 中对象字面量 `{ a: b }` 被编译为 `UTSJSONObject` 实例（原型链 `UTSJSONObject.prototype→Object.prototype`），无法通过 `st()` 校验，导致 `Params validate failed`。
   - ❌ `as XxxParams` 方案已弃用：内联嵌套类型（`payload: { text: string }`）触发 "Nested type literal" 编译警告；引用命名类型（`payload: TextPayload`）UTS 运行时 `as` 无法解析引用别名，无效
   - ✅ `platform-helper.js` 方案：在 `utssdk/web/` 下创建纯 JS 文件，用 JS 函数返回对象字面量。JS 文件不经过 UTS 编译，返回值是真正的 `Object.prototype` 实例。`index.uts` 中 `import { createTextMsg, createImageMsg } from './platform-helper.js'` 后直接调用
   - 其他 API（`login`、`getMessageList`、`sendMessage`）没有 `isPlainObject` 校验，无需处理
103. **Web: `import type` + `as` 运行时 ReferenceError** — UTS for Web 编译时，`import type` 导入的类型若在运行时被间接引用（如 `const config: IMLoginConfig = {...}` 的类型注解，或 `{...} as IMLoginConfig` 的断言），编译后仍生成对类型标识符的运行时引用，引发 `ReferenceError: XXX is not defined`。
    - 外部 store 中不要用 `import type { IMLoginConfig }` 做变量注解或 `as` 断言
    - 仅保持 `import { IMService }` 和 `import type { ChatMessage }`（只用于类型标注，不做 as）
    - 插件内部 `web/index.uts` 中类型本地 `export type` 后，`as` 断言仅在插件内部使用
104. **Web: UTS 的 `as` 不能递归解析引用的 type 别名** — `type TextMessageParams = { payload: TextPayload }` 中的 `TextPayload` 如果在另一个 `type` 中定义，UTS 运行时 `as TextMessageParams` 无法完整解析类型结构，断言变为空操作。必须使用完整内联类型或纯 JS 辅助函数。
105. **interface.uts 中 class 方法不能有 body** — `interface.uts` 里的 `export class IMService { static fn(): void }` 方法只能写签名（无 `{}`），UTS 禁止空方法体类。各平台 `index.uts` 必须用 `export class IMService { static fn(): void { /* 完整实现 */ } }` 重新实现。
106. **常量用 `export class { static field }` 而非 `export const`** — `export const MessageType = { Text: 0 }` 中 `MessageType.Text` 的类型是 `Any?`，不能用于变量初始化或 switch case。应用 `export class MessageType { static Text: number = 0 }`，属性值类型为 `number`。
107. **平台入口必须导出同名 type 供外部使用** — 各平台 `index.uts` 中需 `export type` 所有对外类型。外部 `.uvue` 页面通过 `import type { ChatMessage } from '@/uni_modules/hs-im'` 使用。类型定义放在 `interface.uts`（契约）+ 各平台 `index.uts`（export 导出的实际来源）。
