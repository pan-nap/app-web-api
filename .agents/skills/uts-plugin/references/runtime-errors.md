# UTS 运行时错误处理

## 4.1 UTSJSONObject as 自定义类型 → ClassCastException

**错误**：`io.dcloud.uts.UTSJSONObject cannot be cast to xxx.RemainingLengthResult`

**原因**：`as` 在 UTS 中是编译时断言，运行时 UTSJSONObject 无法直接转换为自定义类型对象。

```typescript
// ❌ 错误 — 编译通过，运行时抛 ClassCastException
const result = new UTSJSONObject()
result['value'] = value
result['bytes'] = bytes
return result as RemainingLengthResult

// ✅ 正确 — 使用 class 实例
class ReadResult {
  value: number = 0
  bytes: number = 0
}
const result = new ReadResult()
result.value = value
result.bytes = bytes
return result
```

**原则**：内部数据结构用 `class` 而不是 `type { ... }` + `UTSJSONObject` 构造 + `as` 转换。

## 4.2 OnSocketMessageCallbackResult 类型转换

**错误**：`OnSocketMessageCallbackResult cannot be cast to UTSJSONObject`

```typescript
// ❌ 错误 — Android 运行时抛 ClassCastException
socket.onMessage((res: any) => {
  const raw = (res as UTSJSONObject).getAny('data')
})

// ✅ 正确 — res.data 直接访问（OnSocketMessageCallbackResult 是内置类型）
socket.onMessage((res) => {
  const raw = res.data as ArrayBuffer
})
```

## 4.3 Smart cast impossible（局部变量被闭包修改）

**错误**：`Smart cast to 'MqttClient' is impossible, because 'client' is a local variable that is mutated in a capturing closure`

```typescript
// ❌ 错误
async function sendMsg() {
  if (client != null) {
    await client.publish(...)  // client 可能被闭包修改
  }
}

// ✅ 正确 — 先拷贝到局部变量
async function sendMsg() {
  const c = client
  if (c != null) {
    await c.publish(...)
  }
}
```

## 4.4 SocketTask.close() 参数差异

```typescript
// Android: close() 必须传 options
this.socketTask.close({})

// ✅ 统一使用 close({})，兼容所有平台
this.socketTask.close({})
```

## 4.5 uni.$emit 传递 Map 类型导致类型丢失

**错误**：`TypeError: obj.getString is not a function`

**原因**：通过 `uni.$emit` 传递包含 `Map` 字段的类型时，接收方用 `as UTSJSONObject` 接收会丢失类型信息。

```typescript
// ❌ 错误 — 插件中使用 uni.$emit 传递 StompMessage（含 Map）
onMessageReceive(msg: StompMessage): void {
  uni.$emit("stompMsg", msg)  // Map 类型在事件中丢失
}

// 页面接收时报错
uni.$on("stompMsg", (data: any) => {
  const obj = data as UTSJSONObject
  obj.getString('destination', '')  // TypeError: obj.getString is not a function
})

// ✅ 正确 — 使用回调函数模式
// 插件：暴露回调注册接口
let onMessageCallback: ((msg: StompMessage) => void) | null = null
export function onStompMessage(callback: (msg: StompMessage) => void): void {
  onMessageCallback = callback
}

// 页面：直接注册回调，类型安全
onStompMessage((msg: StompMessage) => {
  receiveMsg.value = `[${msg.destination}] ${msg.body}`
})
```

**原则**：UTS 插件中不要用 `uni.$emit`/`uni.$on` 传递复杂对象（尤其是含 `Map` 字段的），改用回调函数模式。

## 4.6 WebSocket 连接报 400/500 错误

**400 Bad Request**：服务器拒绝握手，通常是因为缺少 WebSocket 子协议。
- 解决：在 `connectSocket` 中指定 `protocols: ["v12.stomp", "v11.stomp", "v10.stomp"]`

**500 Server Error**：服务器内部错误，通常是路径/协议不匹配。
- 解决：确认服务器支持的协议类型（STOMP vs MQTT）和路径（/stomp vs /mqtt）

## 4.7 Float 转 Integer 类型转换异常

**错误**：`java.lang.ClassCastException: java.lang.Float cannot be cast to java.lang.Integer`

**原因**：UTS 的 `number` 类型在编译为 Android 时可能是 `Float`，而 Kotlin 方法参数声明为 `Int`，运行时无法直接转换。

**典型场景**：`ChooseVideoSuccess.duration` 返回 `Float`，但 Kotlin 的 `sendVideoMessage(duration: Int)` 需要整数。

```typescript
// ❌ 错误 — duration 在 Android 端实际为 Float，传给 Int 参数报错
const duration = result.duration as number
IMService.sendVideoMessage(toUserId, path, 0, duration, snapshot)

// ✅ 正确 — 使用 Math.round() 显式转整数
const duration = Math.round(result.duration as number) as number
IMService.sendVideoMessage(toUserId, path, 0, duration, snapshot)
```

**原则**：当 UTS `number` 传给 Kotlin `Int` 参数时，使用 `Math.round()` 或 `Math.floor()` 显式转换。

## 4.8 内置类型强转为 UTSJSONObject

**错误**：`ClassCastException: ChooseVideoSuccess cannot be cast to UTSJSONObject`

**原因**：uni-app 内置 API 的回调结果（如 `ChooseVideoSuccess`、`ChooseImageSuccess`）是专用类型，不能强转为 `UTSJSONObject`。

```typescript
// ❌ 错误
const result = res as UTSJSONObject
const tempFilePath = result.getString('tempFilePath')

// ✅ 正确 — 直接访问属性
const result = res as ChooseVideoSuccess
const tempFilePath = result.tempFilePath as string
```

**原则**：使用 uni-app 内置类型（如 `ChooseVideoSuccess`、`ChooseImageSuccess`）直接访问属性，不要强转为 `UTSJSONObject`。

## 高频运行时错误速查表

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `ClassCastException: UTSJSONObject cannot be cast to xxx` | `UTSJSONObject as type` | 用 `class` 实例化 |
| `ClassCastException: xxx cannot be cast to UTSJSONObject` | 强转内置类型 | 直接访问属性 |
| `TypeError: obj.getString is not a function` | `uni.$emit` 传递含 Map 对象 | 改用回调函数模式 |
| `Expected HTTP 101 response but was '400'` | 缺少 WebSocket 子协议 | 添加 `protocols` 参数 |
| `Expected HTTP 101 response but was '500'` | 路径/协议不匹配 | 确认服务器支持的协议和路径 |
| `ClassCastException: java.lang.Float cannot be cast to java.lang.Integer` | UTS number 转 Kotlin Int 时实际为 Float | 使用 `Math.round()` 显式转整数 |
| `ClassCastException: ChooseVideoSuccess cannot be cast to UTSJSONObject` | 内置类型强转为 UTSJSONObject | 使用 `ChooseVideoSuccess` 直接访问属性 |
