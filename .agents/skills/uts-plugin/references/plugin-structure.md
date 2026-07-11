# UTS 插件结构

## 多平台编译策略

UTS 插件支持两种多平台编译方案，应根据**是否需要平台桥接语言**（Kotlin/ObjC/Swift）选择：

### 方案 B（多平台独立文件，⭐推荐）

各平台有独立 `index.uts` 文件放在对应子目录，辅以原生桥接文件（`.kt`、`.h/.m`）。`interface.uts` 在根目录定义 API 契约。**适用于需要 Kotlin/ObjC/Swift 桥接的复杂插件**（如 hs-im）。

```
utssdk/
├── interface.uts          # API 契约（只签名不实现）
├── unierror.uts           # 错误码
├── web/index.uts          # Web 平台实现
├── app-android/
│   ├── index.uts          # Android 平台实现
│   ├── config.json        # Maven 依赖
│   ├── AndroidManifest.xml
│   ├── XxxBridge.kt       # [可选] Kotlin 桥接类
│   └── libs/              # [可选] AAR/JAR 本地依赖
├── app-ios/
│   ├── index.uts          # iOS 平台实现
│   ├── config.json
│   ├── XxxBridge.h        # ObjC 桥接头文件
│   └── XxxBridge.m        # ObjC 桥接实现
└── app-harmony/
    └── index.uts          # HarmonyOS 平台实现
```

**核心规则**：
- `interface.uts`：只写方法签名（无 body），不参与编译，仅提供 IDE 类型提示
- 各平台 `index.uts`：export 同名 class，完整实现所有方法
- 原生桥接文件（`.kt`/`.h/.m`）放在对应平台目录，UTS 通过 `import { ClassName } from 'package.name'` 引用
- 外部统一通过 `import { XxxService } from '@/uni_modules/xxx'` 引入，无需关心平台差异

### 方案 A（单文件条件编译）

所有平台实现在 `utssdk/index.uts` 一个文件中，用 `#ifdef APP-ANDROID / APP-IOS / APP-HARMONY` 区分平台。`app-android/` 目录只放原生配置文件（`config.json`、`AndroidManifest.xml`）。**适用于纯 UTS 实现、无 Kotlin/ObjC 桥接代码的简单插件**。

```
utssdk/
├── index.uts              # 含 #ifdef APP-ANDROID / APP-IOS / APP-HARMONY
├── app-android/
│   ├── config.json
│   └── AndroidManifest.xml
├── app-ios/
│   └── config.json
└── app-harmony/
    └── config.json
```

### 方案对比

| 维度 | 方案 A：单文件条件编译 | 方案 B：多平台独立文件（⭐推荐） |
|------|----------------------|-------------------------------|
| 目录结构 | `utssdk/index.uts`（含 #ifdef） | `utssdk/interface.uts`（契约）+ 各平台单独 index.uts |
| 代码组织 | 一个文件内 `#ifdef` 分平台 | 各平台独立文件，互不干扰 |
| 桥接语言支持 | ❌ 不支持 | ✅ Kotlin `.kt` / ObjC `.h/.m` 原生桥接 |
| 代码可读性 | 平台差异大时代码膨胀 | 各平台独立文件，清晰整洁 |
| 适用场景 | 纯 UTS、简单平台差异 | 需要原生 SDK 桥接、平台逻辑复杂 |

> ⭐ **推荐使用方案 B**，即使当前不需要桥接语言，也为后续扩展留有空间。

## 标准目录结构（以 hs-im 为模板）

hs-im 是经实战验证的标准 UTS 插件模板，覆盖 Web/Android/iOS/HarmonyOS 四平台，包含完整的类型系统、纯 JS 辅助、Kotlin/OC 桥接、CLI 原生 SDK 下载等模式：

```
uni_modules/hs-im/
├── package.json                     # 插件元信息（id/version/uni_modules.platforms）
├── changelog.md                     # 版本日志
├── readme.md                        # 使用文档
├── scripts/
│   ├── init-libs.bat                # CLI 模式下载原生 SDK（AAR/framework）
│   └── init-libs.sh
├── utssdk/
│   ├── interface.uts                # ===== 接口契约 =====
│   │                                 # export class XxxService { 只签名不实现 }
│   │                                 # export type / export const（IDE 语法提示用）
│   ├── unierror.uts                 # 错误码定义
│   │
│   ├── web/
│   │   ├── config.json              # NPM 依赖声明（pnpm add 需同步）
│   │   ├── index.uts                # Web 平台完整实现（export 同名 class/type）
│   │   └── platform-helper.js       # [可选] 纯 JS 辅助文件，绕过 UTSJSONObject
│   │
│   ├── app-android/
│   │   ├── config.json              # Maven 依赖声明（仓库地址 + dependency）
│   │   ├── AndroidManifest.xml      # Android 权限声明
│   │   ├── index.uts                # Android 平台完整实现
│   │   ├── XxxBridge.kt             # [可选] Kotlin 桥接类（UTS 无法直接调 Java 反射时用）
│   │   └── libs/                    # [可选] AAR/JAR 本地依赖
│   │
│   ├── app-ios/
│   │   ├── config.json              # pod / framework 依赖声明
│   │   ├── index.uts                # iOS 平台完整实现
│   │   ├── XxxBridge.h              # [可选] OC 桥接头文件
│   │   └── XxxBridge.m              # [可选] OC 桥接实现
│   │
│   └── app-harmony/
│       └── index.uts                # HarmonyOS 平台完整实现
```

### 关键文件职责

| 文件 | 职责 |
|------|------|
| `interface.uts` | **接口契约**：export class 方法只写签名不写 body（UTS 禁止空方法体，但 interface.uts 特殊对待）；export type 供外部 `import type` 使用；不参与编译，仅 IDE 提示 |
| `unierror.uts` | 插件专属错误码（建议 90 开头） |
| 各平台 `index.uts` | **完整实现**：export 同名 class/type，必须实现 interface.uts 中声明的所有方法；常量用 `export class { static field }` 而非 `export const`（避免 UTS 的 `const 属性值为 Any?` 问题） |
| `platform-helper.js` | **纯 JS 辅助**：不经过 UTS 编译，返回原生 JS 对象；用于绕过 UTSJSONObject 包装、TIM SDK isPlainObject 校验等问题 |
| `XxxBridge.kt` | **Kotlin 桥接类**：解决 UTS 无法直接调 Java 反射（`getMethod/newInstance`）的问题；UTS 端 `import { Bridge } from 'pkg.name'` 调用 |
| `scripts/*` | **CLI SDK 下载**：因 SDK 过大不提交 git，开发者运行脚本从 CDN/Maven 拉取到 libs/ |

### 平台入口导出规范

各平台 `index.uts` 必须导出完全一致的 API 表面（同名类、同名方法、同名类型），否则编译报错。

```typescript
// interface.uts（仅签名）
export class IMService {
  static login(config: IMLoginConfig): void
  static sendTextMessage(toUserId: string, text: string): string
}

// web/index.uts（完整实现）
export class IMService {
  static login(config: IMLoginConfig): void {
    // 完整实现...
  }
  static sendTextMessage(toUserId: string, text: string): string {
    // 完整实现...
  }
}
```

### 对外类型与常量导出

```typescript
// web/index.uts — 对外类型用 export type + export class 常量
export type ChatMessage = {
  msgId: string
  sender: string
  type: number
  text: string
}

// ⚠️ 不要用 export const 做常量（属性值会被推断为 Any?）
// ❌ export const MessageType = { Text: 0 }
// ✅ export class MessageType { static Text: number = 0 }

export class MessageType {
  static Text: number = 0
  static Image: number = 1
}
```

外部页面使用：
```typescript
import { IMService } from '@/uni_modules/hs-im'
import type { ChatMessage } from '@/uni_modules/hs-im'
```

### 插件职责边界

| 层次 | 位置 | 职责 |
|------|------|------|
| **插件 SDK** | `uni_modules/[id]/utssdk/` | 纯功能实现，不包含业务配置 |
| **业务层** | `store/*.uts` 或 `utils/*.uts` | 导入插件 + 配置凭证 + 管理状态/单例 |
| **页面层** | `pages/*/` | 调用业务层接口，展示 UI |

```
✅ 正确分层：
  store/im.uts → 导入 hs-im 插件 + 管理登录/消息状态
  pages/im/index.uvue → 调用 imStore 提供的接口

❌ 错误做法：在插件内硬编码 SDKAppID 等业务凭证
```

---

以下保留原文档的参考信息（方案A、package.json 配置等）

## 其他目录方案（参考）
