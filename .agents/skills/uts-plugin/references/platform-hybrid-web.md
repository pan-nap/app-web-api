# Web 平台混编 (uts for Web)

## 编译流程

UTS 源码保存时同步编译为 JavaScript 代码，H5 运行时直接执行编译后的 JS 代码。

## NPM 依赖配置

### 声明依赖

在 `utssdk/web/config.json` 中声明 NPM 依赖：

```json
{
  "minSdkVersion": "",
  "dependencies": {
    "tim-js-sdk": "^2.27.6"
  }
}
```

### 安装依赖

在项目根目录执行：

```bash
pnpm add tim-js-sdk
```

> ⚠️ **重要**：`config.json` 声明 + `pnpm add` 两者缺一不可，否则编译报错 `Cannot find module 'tim-js-sdk'`。

## TIM SDK 常量映射问题

### 问题描述

TIM Web SDK 的部分属性（如 `TIM.MSG_TYPE`、`TIM.NET_STATE`、`TIM.CONV_TYPE`）是运行时动态属性，UTS 编译期无法识别，导致编译警告：

- `Property 'NET_STATE' does not exist on type 'typeof TIM'`
- `Property 'CONV_TYPE' does not exist on type 'typeof TIM'`
- `Type 'any | null' is not assignable to type 'number'`

### 解决方案

定义本地常量替代 SDK 动态属性：

```typescript
// TIM SDK 消息类型常量（数字值）
const TIM_MSG_TYPE_TEXT = 1
const TIM_MSG_TYPE_IMAGE = 2
const TIM_MSG_TYPE_VIDEO = 3
const TIM_MSG_TYPE_AUDIO = 4
const TIM_MSG_TYPE_CUSTOM = 5

// 网络状态常量
const TIM_NET_STATE_CONNECTED = 'CONNECTED'
const TIM_NET_STATE_CONNECTING = 'CONNECTING'
const TIM_NET_STATE_DISCONNECTED = 'DISCONNECTED'

// 会话类型常量
const TIM_CONV_TYPE_C2C = 'C2C'
const TIM_CONV_TYPE_GROUP = 'GROUP'
```

### 替换示例

```typescript
// ❌ 编译警告 — TIM.NET_STATE 在 UTS 中不可访问
if (state == TIM.NET_STATE.CONNECTED) { ... }

// ✅ 正确 — 使用本地常量
if (state == TIM_NET_STATE_CONNECTED) { ... }

// ❌ 编译警告 — TIM.CONV_TYPE.C2C 在 UTS 中不可访问
conversationType: TIM.CONV_TYPE.C2C

// ✅ 正确 — 使用本地常量
conversationType: TIM_CONV_TYPE_C2C
```

## Promise 与异步处理

### Promise.then() 限制

UTS 中 `Promise.then()` 回调**不支持返回另一个 Promise**，会导致编译或运行时错误。

```typescript
// ❌ 错误 — then() 回调返回 Promise 不被支持
_tim.login({ userID, userSig })
  .then(function(res) {
    return _tim.getMessageList({ ... })  // 返回 Promise 会出错
  })
  .then(function(res) { ... })

// ✅ 正确 — 使用 async/await
async function loginAndLoad() {
  await _tim.login({ userID, userSig })
  const res = await _tim.getMessageList({ ... })
  // ...
}
```

### 事件监听机制

Web 端通过 `_tim.on(TIM.EVENT.xxx)` 监听事件，触发对应回调函数：

```typescript
_tim.on(TIM.EVENT.SDK_READY, function(): void {
  _isLogined = true
  triggerLoginStatus(2)
})

_tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event: any): void {
  const msgs = event.data != null ? event.data : []
  msgs.forEach(function(msg: any): void {
    const chatMsg = convertTIMMessage(msg)
    if (_onMessageReceived != null && chatMsg != null) {
      _onMessageReceived(chatMsg)
    }
  })
})
```

> ✅ **TIM.EVENT 常量可正常使用**，无需替换。

## 消息缓存策略

### 问题

撤回/删除消息需要原始消息实例，而 TIM SDK 的 `deleteMessage`、`revokeMessage` 方法需要传入完整的消息对象。

### 解决方案

使用 `Map<string, any>` 缓存消息实例：

```typescript
let _messageCache: Map<string, any> = new Map()

function convertTIMMessage(msg: any): ChatMessage | null {
  // ... 转换逻辑
  _messageCache.set(msgId, msg)  // 缓存原始消息
  return chatMsg
}

static deleteMessage(msgId: string): boolean {
  const msg = _messageCache.get(msgId)
  if (msg == null) return false
  _tim.deleteMessage([msg])
    .then(function(): void {
      _messageCache.delete(msgId)
    })
  return true
}
```

## 常见问题速查表

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `Cannot find module 'tim-js-sdk'` | 未安装 NPM 依赖 | `pnpm add tim-js-sdk` + `config.json` 声明 |
| `Property 'NET_STATE' does not exist...` | SDK 动态属性编译期不可访问 | 定义本地字符串常量替代 |
| `Property 'CONV_TYPE' does not exist...` | SDK 动态属性编译期不可访问 | 定义本地字符串常量替代 |
| `Type 'any \| null' is not assignable to type 'number'` | 消息类型值为 `any` | 定义本地数字常量 + 显式映射函数 |
| `Promise.then()` 回调返回 Promise 失败 | UTS Promise 链式调用限制 | 使用 `async/await` 替代 |
| `Params validate failed` (create*Message) | TIM SDK payload 参数用 `st()` (isPlainObject) 检测原型链，UTS 对象字面量编译为 UTSJSONObject 无法通过 | 改用纯 JS 辅助文件 (`platform-helper.js`) 构造消息对象，见 **UTSJSONObject payload 构造** |
| 撤回/删除消息失败 | 需要原始消息实例 | 使用 `Map` 缓存消息对象 |

## 架构设计建议

### 多平台分离架构（推荐）

采用 #16 方案 B（多平台独立文件）：`interface.uts` 定义 API 契约，各平台 `index.uts` 独立实现，原生桥接文件放在对应平台目录。

```
utssdk/interface.uts              ← API 契约（只签名不实现）
utssdk/web/index.uts              ← Web 端实现（tim-js-sdk）
utssdk/app-android/index.uts      ← Android 端 UTS 实现
utssdk/app-android/IMBridge.kt    ← Android 端 Kotlin 桥接（腾讯 IM SDK）
utssdk/app-ios/index.uts          ← iOS 端 UTS 实现
utssdk/app-ios/IMBridge.m         ← iOS 端 ObjC 桥接
utssdk/app-harmony/index.uts      ← HarmonyOS 端 UTS 实现
```

外部统一通过 `import { IMService } from '@/uni_modules/hs-im'` 引入，无需关心平台差异。

### 回调机制统一

Web 端通过事件监听触发回调，Android 端通过 Kotlin 桥接类回调，保持对外接口一致：

```typescript
// 统一的回调注册接口
static onLoginStatusChange(callback: (status: number) => void): void
static onMessageReceived(callback: (msg: ChatMessage) => void): void
static onMessageRevoked(callback: (msgId: string) => void): void
static onError(callback: (code: number, msg: string) => void): void
```

## UTSJSONObject payload 构造

### 问题描述

TIM SDK v2.27.6 的 `create*Message` 方法对 `payload` 参数有 isPlainObject 校验：

```javascript
// TIM SDK 内部 st() 函数 — isPlainObject 检测
st = function(e) {
  if ("object" !== typeof e || null === e) return false;
  var t = Object.getPrototypeOf(e);      // 直接原型
  if (null === t) return true;
  for (var o = t; null !== Object.getPrototypeOf(o); )
    o = Object.getPrototypeOf(o);
  return t === o;  // 直接原型 === Object.prototype 才为 true
}
```

UTS for Web 中对象字面量 `{ a: b }` 被编译为 `UTSJSONObject` 实例，原型链为 `UTSJSONObject.prototype → Object.prototype → null`，`st()` 返回 `false`，导致 `Params validate failed`。

### 解决方案演进

#### ❌ 方案一：`as XxxParams` 断言（已弃用）

```typescript
// 问题：UTS 的 as 是运行时类型转换，只能处理内联类型
// 内联形式（payload: { text: string }）→ 运行时有效，但触发 "Nested type literal" 警告
// 分离命名形式（payload: TextPayload）→ 无编译警告，但 as 无法解析引用的类型别名，运行时无效
```

#### ✅ 最终方案：纯 JS 辅助文件

在 `utssdk/web/` 目录下创建 `platform-helper.js`，用纯 JS 函数构造消息对象。JS 文件不经过 UTS 编译，返回的对象是真正的 `Object.prototype` 实例：

```javascript
// platform-helper.js
// 纯 JS 辅助函数，返回 plain JS 对象
// 不走 UTS 编译，无 UTSJSONObject 包装

export function createTextMsg(to, conversationType, text) {
  return {
    to: to,
    conversationType: conversationType,
    payload: { text: text }
  }
}

export function createImageMsg(to, conversationType, file) {
  return {
    to: to,
    conversationType: conversationType,
    payload: { file: file }
  }
}

export function createVideoMsg(to, conversationType, file, snapshotFile) {
  return {
    to: to,
    conversationType: conversationType,
    payload: { file: file, snapshotFile: snapshotFile }
  }
}

export function createAudioMsg(to, conversationType, file) {
  return {
    to: to,
    conversationType: conversationType,
    payload: { file: file }
  }
}

export function createCustomMsg(to, conversationType, data, description, extension) {
  return {
    to: to,
    conversationType: conversationType,
    payload: { data: data, description: description, extension: extension }
  }
}
```

在 `index.uts` 中导入使用：

```typescript
import { createTextMsg, createImageMsg, createVideoMsg, createAudioMsg, createCustomMsg } from './platform-helper.js'

// 直接传参，无需 as 断言
const msg = _tim.createTextMessage(createTextMsg(toUserId, TIM_CONV_TYPE_C2C, text))
```

### 原理

| 方式 | 对象来源 | 原型链 | st() 结果 | 副作用 |
|------|---------|--------|----------|--------|
| UTS 对象字面量 | `{ a: 1 }` | UTSJSONObject.prototype → Object.prototype | ❌ false | 无 |
| `as XxxParams`（内联类型） | UTS 运行时转换 | Object.prototype | ✅ true | "Nested type literal" 编译警告 |
| `as XxxParams`（引用命名类型） | UTS 运行时转换（不完整） | UTSJSONObject.prototype | ❌ false | 无编译警告但运行时无效 |
| **纯 JS 函数**（推荐） | JS 函数返回值 | Object.prototype | ✅ true | **无警告，无副作用** |

### 注意

- 其他 API（`login`、`getMessageList` 等）参数只校验基本类型，没有 `st()` 检查，无需特殊处理
- 类型定义（`IMLoginConfig`、`ChatMessage` 等）仍可在 `index.uts` 中保持 `export type`，供外部 `.uvue` 页面 `import type` 使用