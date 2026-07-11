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
```