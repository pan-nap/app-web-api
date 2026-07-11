# iOS 平台混编 (uts for iOS)

## 编译流程

UTS 源码保存时同步编译为 Swift 代码，生成对应插件 Framework 工程，真机运行/云打包时 Framework 添加到打包工程生成 IPA。

## 类型差异

| 场景 | 默认 UTS 类型 | 需使用原生类型的场景 |
|------|--------------|-------------------|
| Int/Float/Double | `Number` | 实现三方 SDK 协议方法时需用原生 `Int`/`Float`/`Double` |

## iOS 原生资源配置

**Info.plist**：放在 `utssdk/app-ios/Info.plist`，云端打包时合并到原生工程的 Info.plist。

**entitlements**：放在 `utssdk/app-ios/UTS.entitlements`（HBuilderX 3.6.11+），配置 Capabilities。

**资源文件**：`utssdk/app-ios/Resources/` 目录，打包时添加到 main bundle。

**三方库依赖**：
- framework/xcframework：放 `utssdk/app-ios/Frameworks/` 目录
- .a 库：按目录结构存放，每个 .a 库创建独立文件夹（含 .a + .h + .swiftmodule）
- OC 的 .a 库无需 import 可直接使用
- Swift 的 .a 库需 `import { ... } from '库名'`
- 不含 Modules 的 framework：需创建 module.modulemap 或通过 XCode 生成 Modules 文件夹

## iOS 内置库（DCloudUTSFoundation）

```typescript
import { UTSiOS } from "DCloudUTSFoundation"

// 获取当前 UIViewController
UTSiOS.getCurrentViewController()

// 字符串色值转 UIColor
let bgColor = UTSiOS.colorWithString("#000000")

// 获取指定资源的运行期绝对路径
const imagePath = UTSiOS.getResourcePath("/static/logo.png")
```

## Swift → UTS 语法转换速查

| Swift 语法 | UTS 语法 |
|------------|----------|
| `let` 常量 / `var` 变量 | `const` 常量 / `let` 变量 |
| `String?` 可选类型 | `string \| null` |
| `UIAlertController(title: "提示")` | `new UIAlertController(title="提示")`（= 替代 :） |
| `.alert` 枚举简写 | `UIAlertController.Style.alert` 完整写出 |
| `class A: B` 继承 | `class A extends B` |
| `class A: Protocol` 遵循协议 | `class A implements Protocol` |
| `#available(iOS 10.0, *)` | `UTSiOS.available("iOS 10.0, *")` |
| `@available(iOS 15.0, *)` class | `@available(iOS 15.0, *)`（class 直接加） |
| `@available` 函数 | `@UTSiOS.available("iOS 16.1, *)` |
| 尾随闭包 `{ action in ... }` | `handler=(action: UIAlertAction):void => {...}` 完整写出 |
| `@escaping` | `@escaping` 在参数前 |
| `Selector("method:")` + `@objc func` | `Selector("方法名")` + `@objc static 方法名()` |
| `Dictionary<String,Any>` | `Map<string,any>` + `map.set(key, value)` |
| `func fn(_ a: Int, label b: Int)` | `fn(a: Int, @argumentLabel("label") b: Int)` |
| `try expr` / `try? expr` / `try! expr` | `UTSiOS.try(expr)` / `UTSiOS.try(expr, "?")` / `UTSiOS.try(expr, "!")` |
| `async func` | `async function` |
| `weak var` / `private class` | `@UTSiOS.keyword("weak")` / `@UTSiOS.keyword("private")` |
| `&pointer` 指针 | `UTSiOS.getPointer(pointer)` |

## 腾讯云 IM iOS SDK 集成 (hs-im)

### 集成方案

**方式一：CocoaPods 依赖（推荐）**

`utssdk/app-ios/config.json`：

```json
{
  "dependencies": {
    "TencentCloudIM": "~> 8.7"
  }
}
```

**方式二：手动集成 Framework**

1. 下载 [TencentCloudIM.framework](https://github.com/TencentCloud/TIMSDK)
2. 放置到 `utssdk/app-ios/Frameworks/` 目录
3. 在 `config.json` 中声明

### 已完成实现

```
utssdk/app-ios/
├── index.uts              ← UTS 入口（调用 IMBridgeHelper）
├── IMBridge.h            ← OC 头文件（TIM SDK 桥接）
├── IMBridge.m            ← OC 实现（V2TIMManager 封装）
├── IMBridgeHelper.h      ← OC 头文件（UTS 桥接）
├── IMBridgeHelper.m      ← OC 实现（桥接 IMBridge）
├── config.json           ← 依赖配置
├── Info.plist            ← 权限配置
└── TencentCloudIM.framework  ← 需手动下载添加
```

### 核心接口对应

| 功能 | Android (Kotlin) | iOS (OC) |
|------|------------------|----------|
| 初始化 | `initSDK(context, sdkAppId, config)` | `initWithSdkAppId:sdkAppId` |
| 登录 | `login(userId, userSig, callback)` | `login:userSig:succ:fail:` |
| 发文本 | `sendTextMessage(text, to, ...)` | `sendTextMessage:toUserId:text:` |
| 发图片 | `sendImageMessage(path, to, ...)` | `sendImageMessage:toUserId:imagePath:` |
| 发视频 | `sendVideoMessage(path, ..., duration, snapshot, ...)` | `sendVideoMessage:...:` |
| 发语音 | `createSoundMessage(path, duration)` | `sendVoiceMessage:...:` |
| 发自定义 | `createCustomMessage(data, desc, ext)` | `sendCustomMessage:...:` |
| 历史消息 | `getC2CMessageList(userId, count, lastMsg, callback)` | `getC2CMessageList:count:lastMsgId:onItem:onComplete:` |
| 删除消息 | `deleteMessage(msg)` | `deleteMessage:msgId` |
| 撤回消息 | `revokeMessage(msg)` | `revokeMessage:msgId` |
| 已读标记 | `markC2CMessageAsRead(userId, callback)` | `markC2CMessageAsRead:userId` |

### 权限配置

`utssdk/app-ios/Info.plist`：

```xml
<key>NSCameraUsageDescription</key>
<string>IM 发送图片和视频消息需要使用相机权限</string>
<key>NSMicrophoneUsageDescription</key>
<string>IM 发送语音和视频消息需要使用麦克风权限</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>IM 选择相册图片需要访问相册权限</string>
```

### 注意事项

- **SDK 版本**：建议使用 `8.7.x` 以上，与 Android 端保持一致
- **用户Sig**：必须使用腾讯云服务器生成，不能前端伪造
- **线程安全**：IM 回调在子线程，已通过 `dispatch_async(dispatch_get_main_queue())` 切换到主线程
- **UTS 调用**：UTS 编译成 Swift，通过 `@objc` 桥接调用 OC 类

## 常见问题

- **UI 线程操作**：`DispatchQueue.main.async(execute=():void => { ... })`
- **显式类型标注**：UTS 插件环境无法默认推断类型，必须显式标注（如 `uni.request<any>({...} as RequestOptions<any>)`）
- **销毁原生对象**：export class 实例需在 `unmounted()` 中调 `UTSiOS.destroyInstance(this)`
- **循环引用**：闭包内访问 `this` 时，在闭包体开头加 `"[weak self]"` 标记（标记后 `this` 变为可空）
- **返回自定义 class 类型**：需定义 interface + class implements interface，函数返回 interface 类型
- **单例创建**：export class 不支持，需在混编 Swift 中实现
- **Apple Shortcuts**：iOS 16.0+ 需 `AppShortcutsProvider` + 离线打包 + uts 插件 hook 生命周期
- **Swift 版本兼容性**：编译 Swift Framework/.a 时需使用与打包机相同或更低版本 XCode
- **HBuilderX 语法提示限制**：构造方法只提示一个、缺失可选类型标识、参数标签不明确、不支持子模块 import
