# STOMP 插件开发经验

## STOMP vs MQTT 协议选择

| 对比项 | STOMP | MQTT |
|--------|-------|------|
| **数据格式** | 文本帧（字符串） | 二进制帧（Uint8Array） |
| **连接方式** | WebSocket 直接发送文本 | WebSocket 发送 ArrayBuffer |
| **适用场景** | ActiveMQ、RabbitMQ 等传统消息队列 | IoT、物联网低带宽场景 |
| **UTS 实现难度** | 中等（字符串解析） | 高（二进制编解码） |

**两者不能共用同一个 UTS 插件**，需分别创建独立的插件（如 `hs-stomp` 和 `hs-mqtt`）。

## STOMP 帧结构

STOMP 是基于文本的帧协议，结构如下：
```
COMMAND
header1:value1
header2:value2

body^@
```
- 命令和 header 以换行符 `\n` 分隔
- headers 以空行结束
- body 后面以 NULL 字符 `\x00` 结束

## STOMP 帧构建与解析

**构建帧**：用字符串拼接，headers 改用 `string[]`（key:value 格式）代替 `Map`：

```typescript
function buildFrame(command: string, headers: string[], body: string = ""): string {
  let frame = command + "\n"
  for (let i = 0; i < headers.length; i++) {
    frame += headers[i] as string + "\n"
  }
  frame += "\n" + body + "\x00"
  return frame
}
```

**解析帧**：按 NULL 字符分割，再按换行解析 headers：

```typescript
function parseFrame(data: string): StompFrame | null {
  const nullIdx = data.indexOf("\x00")
  // ... 按行分割，第一行是 command，空行前是 headers，空行后是 body
}
```

## WebSocket 子协议（重要）

连接 STOMP 服务端（如 ActiveMQ）时，需在 `connectSocket` 中指定子协议：

```typescript
this.socketTask = uni.connectSocket({
  url,
  protocols: ["v12.stomp", "v11.stomp", "v10.stomp"],  // ← 必须
  // ...
})
```

不指定子协议可能导致服务器返回 400 (Bad Request) 错误。

## STOMP 连接流程

```
1. WebSocket 连接建立（onOpen）
2. 发送 STOMP CONNECT 帧（含 login/passcode/accept-version/heart-beat 等 header）
3. 服务端回复 CONNECTED 帧（表示连接成功）
4. 发送 SUBSCRIBE 帧订阅主题（含 id/destination/selector）
5. 服务端推送 MESSAGE 帧（含 destination/body/headers）
6. 发送 SEND 帧发布消息（含 destination/content-type）
```

## 心跳机制

STOMP 心跳通过发送**换行符** `\n`（或空格）实现，不是二进制帧。在 UTS 中使用 `setTimeout` 定期发送：

```typescript
private sendHeartbeat(): void {
  if (this.socketTask != null && this.connected) {
    this.socketTask.send({ data: "\n" })
  }
}

## 导出方法回调保活（"回调函数已释放，不能再次执行"）

**报错现场**（真机 Android 运行日志）：

```
uts插件[hs-stomp] uts.sdk.modules.hsStompStompClientByJs.subscribe 回调函数 已释放，不能再次执行，参考文档：https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin.html#keepalive
```

- 订阅后连续收到 N 条消息通常报 N-1 次（首次触发后回调即被回收）。
- 日志中的 `hsStompStompClientByJs` 是框架桥接命名，不代表仅 JS 调用才触发。

**原因**：HBuilderX 4.25+ 中 UTS 插件**导出方法**的回调参数默认"触发一次后立即自动回收"（防泄漏）。`subscribe()` 把调用方传入的 `onMessage` 存进订阅记录（如 `SubRecord.onMessage` 字段），之后每条 MESSAGE 帧再回调时，回调已被释放。

**解决**：`uni_modules/hs-stomp/utssdk/index.uts` 的 `subscribe()` 前加 `@UTSJS.keepAlive`：

```typescript
@UTSJS.keepAlive
export class StompClient {
  subscribe(destination: string, onMessage: (msg: StompMessage) => void, selector: string | null = null): string | null {
    const sub = new SubRecord()
    sub.onMessage = onMessage        // 长期保存 ✅ 可多次回调
    this.subscriptions.push(sub)
    return sub.id
  }
}
```

**保活规则**：
- 方式一：方法名以 `on` 开头且仅一个回调参数 → 自动识别为可持续触发，无需装饰器。
- 方式二：`@UTSJS.keepAlive` 装饰器 → 不限回调参数数量，导出函数与 class 方法均可标注。
- 回调常驻内存：属"一次性注册、长期回调"场景，避免高频重复调用注册方法堆积对象。
- 装饰器不支持 `export const fn = () => {}` 箭头导出，需写成 `export function`。
- `app-android` / `app-ios` 各平台目录下的实现都需加；Web 端无此回收机制，坑点只在 App 端暴露。
- 内置 API（`uni.connectSocket`、`SocketTask.onMessage` 等）回调由 SDK 管理，不受影响；仅 **uni_modules 插件导出方法**有此限制。

**同类对照**：`hs-mqtt` 的 `MqttClient.subscribe()` 不接收外部回调（消息走内部 `onMessageReceive` 属性 + `uni.$emit`），无此问题。hs-* 系列插件若再报同错，对相应导出方法加 `@UTSJS.keepAlive` 即可。
```