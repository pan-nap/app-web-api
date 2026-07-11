# MQTT 插件开发经验

## MQTT 3.1.1 报文结构

- 固定头：控制包类型（4bit）+ 标志位（4bit）+ 剩余长度
- 剩余长度编码：使用变长编码（每字节最高位表示是否还有后续字节）
- 可变头 + 有效载荷：按具体报文类型解析

## MQTT 报文编码要点

**UTF-8 编码**：UTS 不支持 `TextEncoder`，需手动实现：

```typescript
function stringToBytes(str: string): Uint8Array {
  // 遍历 charCodeAt，按 Unicode 编码范围输出 1~4 字节
  // 注意 surrogate pair 处理（0xD800-0xDFFF）
}
```

**报文构建**：将多个 Uint8Array 拼接成完整报文：

```typescript
function concatArrays(...arrays: Uint8Array[]): Uint8Array {
  let totalLen = 0
  for (let i = 0; i < arrays.length; i++) totalLen += (arrays[i] as Uint8Array).length
  const result = new Uint8Array(totalLen)
  let offset = 0
  for (let i = 0; i < arrays.length; i++) {
    const arr = arrays[i] as Uint8Array
    for (let j = 0; j < arr.length; j++) {
      result[offset + j] = arr[j] as number
    }
    offset += arr.length
  }
  return result
}
```

注意：`Uint8Array.set()` 在 UTS 中不支持，需用循环逐元素赋值。

## MQTT 控制包类型

| 类型值 | 报文 | 方向 |
|--------|------|------|
| 1 | CONNECT | 客户端→服务端 |
| 2 | CONNACK | 服务端→客户端 |
| 3 | PUBLISH | 双向 |
| 8 | SUBSCRIBE | 客户端→服务端 |
| 9 | SUBACK | 服务端→客户端 |
| 12 | PINGREQ | 客户端→服务端 |
| 13 | PINGRESP | 服务端→客户端 |
| 14 | DISCONNECT | 客户端→服务端 |
