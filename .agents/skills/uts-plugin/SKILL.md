---
name: "uts-plugin"
description: "UTS 插件开发规范与坑点总结。涵盖 uni_modules 插件结构、类型系统限制、编译/运行时错误修复、STOMP/MQTT 协议插件开发、TRTC 集成、三平台混编等。Invoke when developing or debugging UTS plugins for uni-app x."
---

# UTS 插件开发规范与坑点总结

## 快速定位表

| 问题类型            | 描述                                                                       | 参考文件                                                            |
| ------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **插件结构**        | 目录组织（以 hs-im 为模板）、package.json 配置、职责分层                      | [plugin-structure.md](references/plugin-structure.md)               |
| **hs-im 参考项目**  | hs-im 是四平台（Web/Android/iOS/HarmonyOS）UTS 插件的完整模板，涵盖类型系统、纯 JS 辅助、Kotlin/OC 桥接、CLI 原生 SDK 下载等模式，新插件开发应参照此结构 | 参考 `uni_modules/hs-im/` 目录及 [plugin-structure.md](references/plugin-structure.md) |
| **类型系统**        | 类型声明、模式速查、TS→UTS 转换                                            | [type-system.md](references/type-system.md)                         |
| **编译错误**        | 内联对象、解构、for...of、async 推断等 15 类错误 + 速查表                  | [compile-errors.md](references/compile-errors.md)                   |
| **运行时错误**      | ClassCastException、Smart cast、uni.$emit 丢失等 6 类错误 + 速查表         | [runtime-errors.md](references/runtime-errors.md)                   |
| **开发原则**        | 107 条开发原则（核心 + Android/iOS/HarmonyOS/Web 专属）                   | [development-principles.md](references/development-principles.md)   |
| **平台适配**        | 条件编译、平台 API 差异速查                                                | [platform-adaptation.md](references/platform-adaptation.md)         |
| **云打包/本地编译** | libs 目录冲突、config.json 依赖、切换工作流                                | [cloud-build.md](references/cloud-build.md)                         |
| **TRTC 集成**       | TRTC SDK 桥接架构、事件监听、坑点、自定义基座工作流                        | [trtc-integration.md](references/trtc-integration.md)               |
| **STOMP 插件**      | STOMP 帧结构、构建/解析、WebSocket 子协议、心跳机制                        | [stomp-plugin.md](references/stomp-plugin.md)                       |
| **MQTT 插件**       | MQTT 3.1.1 报文编码、UTF-8 手动实现、Uint8Array 拼接                       | [mqtt-plugin.md](references/mqtt-plugin.md)                         |
| **Android 混编**    | Kotlin 语法转换、UTSAndroid API、原生资源配置、线程管理、外部SDK API兼容性 | [platform-hybrid-android.md](references/platform-hybrid-android.md) |
| **iOS 混编**        | Swift 语法转换、DCloudUTSFoundation、原生资源配置                          | [platform-hybrid-ios.md](references/platform-hybrid-ios.md)         |
| **HarmonyOS 混编**  | ArkTS 类型差异、ohpm 依赖、module.json5、ets 混编                          | [platform-hybrid-harmony.md](references/platform-hybrid-harmony.md) |
| **Web 混编**        | TIM SDK 常量映射、NPM 依赖配置、Promise 限制、UTSJSONObject payload 构造 | [platform-hybrid-web.md](references/platform-hybrid-web.md)         |
| **hs-im 集成**      | Android/iOS/HarmonyOS/Web 四平台 TIM SDK 集成方案、文件上传插件           | [platform-hybrid-android.md](references/platform-hybrid-android.md) |

## 参考文件索引

```
uts-plugin/
├── SKILL.md                          ← 本文件（索引）
└── references/
    ├── plugin-structure.md           ← 插件目录结构、package.json、职责分层
    ├── type-system.md                ← 类型声明、interface.uts、模式速查表
    ├── compile-errors.md             ← 编译错误详解 + 高频错误速查表
    ├── runtime-errors.md             ← 运行时错误详解 + 高频错误速查表
    ├── development-principles.md     ← #1~#107 开发原则总结
    ├── platform-adaptation.md        ← 条件编译、平台 API 差异
    ├── cloud-build.md                ← 云打包与本地编译依赖处理
    ├── trtc-integration.md           ← TRTC SDK 集成完整经验
    ├── stomp-plugin.md               ← STOMP 协议插件开发
    ├── mqtt-plugin.md                ← MQTT 协议插件开发
    ├── platform-hybrid-android.md    ← Android 平台混编知识点
    ├── platform-hybrid-ios.md        ← iOS 平台混编知识点
    ├── platform-hybrid-harmony.md    ← HarmonyOS 平台混编知识点
    └── platform-hybrid-web.md        ← Web 平台混编知识点（TIM SDK 常量映射等）
```
