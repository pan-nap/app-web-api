# UTS 编译错误处理

## 3.1 内联对象类型不支持

**错误**：`Direct declaration of Object Literal Type is not supported`

```typescript
// ❌ 错误
function foo(): { value: number; bytes: number } { ... }

// ✅ 正确 — 使用 export class
class ReadResult {
  value: number = 0
  bytes: number = 0
}
function foo(): ReadResult { ... }
```

## 3.2 内联对象字面量不支持

**错误**：同上（内联 `return { value, bytes }` 也会报错）

```typescript
// ❌ 错误
return { value, bytes }

// ✅ 正确 — 实例化 class 并赋值
const r = new ReadResult()
r.value = value
r.bytes = bytes
return r
```

## 3.3 解构赋值不支持

```typescript
// ❌ 错误
const { type, payload } = parsePacket(data)

// ✅ 正确
const parsed = parsePacket(data)
const type = parsed.type
const payload = parsed.payload
```

## 3.4 for...of / for...in 不支持

```typescript
// ❌ 错误 — for...of 在 Android UTS 中不可用
for (const arr of arrays) { ... }

// ✅ 正确 — 使用下标索引
for (let i = 0; i < arrays.length; i++) {
  const arr = arrays[i] as Uint8Array
  // ...
}
```

## 3.5 async 函数返回类型推断失败

**错误**：`Cannot infer type for this parameter` / `Not enough information to infer type argument for 'T'`

```typescript
// ❌ 错误 — 显式返回类型导致推断失败
export async function mqttClient(): MqttClient | null { ... }

// ✅ 正确 — 省略返回类型
export async function mqttClient() { ... }
```

## 3.6 Intersection Type 不支持

**错误**：`Intersection Type is not supported`

```typescript
// ❌ 错误 — (bytes[i] as number & 0x3F) 被解析为交叉类型
code |= (bytes[i + 1] as number & 0x3F)

// ✅ 正确 — 加括号包裹 as 表达式
code |= (bytes[i + 1] as number) & 0x3F
```

## 3.7 forEach 回调参数需显式标注类型

```typescript
// ❌ 错误 — Cannot infer type for this parameter
arr.forEach((item) => { ... })

// ✅ 正确
arr.forEach((item: string) => { ... })
```

## 3.8 || 不能用于非布尔类型

**错误**：`Conditional statements must use boolean types`

```typescript
// ❌ 错误 — clientId 为 string | undefined
const clientId = config.clientId || 'default'

// ✅ 正确 — 使用 ??
const clientId = config.clientId ?? 'default'
```

## 3.9 Optional chaining (?. ) 不支持

```typescript
// ❌ 错误
const interval = (this.config?.keepalive ?? 60) * 1000

// ✅ 正确
const keepaliveSec = this.config != null ? this.config.keepalive : null
const interval = (keepaliveSec ?? 60) * 1000
```

## 3.11 转义序列不支持

**错误**：`Unsupported escape sequence`

```typescript
// ❌ 错误 — UTS 不支持 \0 转义
const NULL_CHAR = "\0"

// ✅ 正确 — 使用十六进制转义
const NULL_CHAR = "\x00"
```

## 3.12 Map.keys() 返回类型不可遍历

**错误**：`Expression 'keys' of type 'MutableSet<String>' cannot be invoked as a function`

```typescript
// ❌ 错误 — keys() 返回 Set，没有 length 和下标访问
const keys = headers.keys()
for (let i = 0; i < keys.length; i++) { ... }

// ✅ 正确 — 改用数组存储 headers（string[] 每项为 "key:value"）
const hdrs: string[] = []
hdrs.push("accept-version:1.2")
// 遍历时直接操作数组
for (let i = 0; i < hdrs.length; i++) { ... }
```

## 3.13 MapEntry 类型在 UTS 中不可用

**错误**：`找不到名称 "MapEntry"`

```typescript
// ❌ 错误 — Map.entries 返回 Set，且 MapEntry 不是可用的类型
const entries = map.entries
for (let i = 0; i < entries.length; i++) {
  const entry = entries[i] as MapEntry  // 编译报错
}

// ✅ 正确 — 改用数组存储数据
const items: SubRecord[] = []
// 遍历用 for + 下标
for (let i = 0; i < items.length; i++) {
  const item = items[i] as SubRecord
}
```

## 3.14 可选参数 ?: 在 UTS 中可能引发编译错误

**错误**：`No value passed for parameter 'selector'`

```typescript
// ❌ 错误 — 方法重载或 ?: 可选参数在调用时可能不兼容
function subscribe(destination: string, onMessage: Function, selector?: string)

// ✅ 正确 — 使用默认值替代可选标记
function subscribe(destination: string, onMessage: Function, selector: string | null = null)
```

## 3.15 文本模板中的表达式解析限制

```typescript
// ❌ 错误 — config.host/port 无法在模板字符串中识别
const url = `wss://${config.host}:${config.port}/mqtt`

// ✅ 解决方式 — 确保 config 参数类型已正确导入
import { MqttConfig } from './interface.uts'
```

## 高频编译错误速查表

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `Direct declaration of Object Literal Type is not supported` | 内联对象类型 | 用 `class` 替代 `type { ... }` |
| `Intersection Type is not supported` | `as` 与 `&` 未加括号 | `(x as number) & mask` |
| `Conditional statements must use boolean types` | `||` 用于非布尔类型 | 改用 `??` |
| `Cannot infer type for this parameter` | 类型未显式标注 | 添加类型声明 |
| `Smart cast to 'X' is impossible...` | 变量被闭包捕获修改 | 拷贝到局部 let/const |
| `Unresolved reference` | 类型/变量未导入 | 检查 import 路径 |
| `Not enough information to infer type argument for 'T'` | async 返回类型显式标注 | 省略返回类型 |
| `No value passed for parameter 'options'` | `close()` 缺参 | 传 `close({})` |
| `找不到名称 "mqtt"` | `.uts` 文件 import npm 包 | 改用 uni 内置 API |
| `Infix call is prohibited on a nullable receiver` | 数组元素未 `as number` | `arr[i] as number` |
| `Unsupported escape sequence` | `\0` 等转义序列不支持 | 改用 `\x00` |
| `Expression 'keys' of type 'MutableSet<String>'...` | Map.keys() 返回 Set 不可遍历 | 改用 string[] 数组 |
| `找不到名称 "MapEntry"` | MapEntry 在 UTS 中不可用 | 改用数组 + class 存储 |
| `No value passed for parameter 'xxx'` | `?:` 可选参数不兼容 | 改用 `T \| null = null` 默认值 |
| `Assignment type mismatch: Function0<X> but X was expected` | 给静态方法属性赋函数表达式 | 方案 A：用 `#ifdef` 包裹方法体；方案 B：各平台独立 `index.uts` 直接实现 |
| `Cannot create an instance of an abstract class` | 直接 new 抽象类 | 定义具名 UTS 子类 extends |
| `This type has a constructor, so it must be initialized here` | extends 类未调 super() | `constructor() { super() }` |
| `Variable expected / Function invocation 'X()' expected` | 给类静态方法属性赋值 | 方案 A：用 `#ifdef` 在方法体内条件编译；方案 B：各平台独立 `index.uts` 直接实现 |
| `Smart cast to 'X' is impossible, because 'X' is a mutable...` | 可变 var 被并发修改 | 拷贝到局部 `const` 变量 |
| `找不到名称 "call"` | `?.call(null, ...)` 语法不支持 | 定义辅助函数局部变量检查+直接调用 |
| `Not enough information to infer type argument for 'T'`（getParcelableExtra） | Java 泛型方法缺类型参数 | `getParcelableExtra<Xxx>(key)` 显式传泛型 |
| `'onReceive' hides member of supertype 'X' and needs an 'override' modifier` | 重写父类方法缺 `override` | UTS 类中必须加 `override` 关键字 |
| `参数类型不匹配：实际类型为 'UTSJSONObject'，预期类型为 'Function0<Unit>'` | SAM 接口传了对象字面量 | 直接传函数（SAM 转换） |
| `Only safe (?.) or non-null asserted (!!.) calls on a nullable receiver` | `getUniActivity()` 未空安全调用 | `?.` 或用局部变量先判空 |
| `类型不匹配: 推断类型是 'X?'，但预期的是 'X'` | `as` 强转不改变空值性 | 用中间变量 + null 检查再赋值 |
| `ClassCastException: java.lang.Float cannot be cast to java.lang.Integer` | UTS number 转 Kotlin Int 时实际为 Float | 使用 `Math.round()` 显式转整数 |
| `找不到名称 "moveTaskToFront"` | UTS 中某些 Activity 方法不可见 | 改用 `startActivity` + `FLAG_ACTIVITY_REORDER_TO_FRONT` |
| `Classifier 'class X' does not have a companion object` | 类名不能直接作为表达式 | `UTSAndroid.getJavaClass(X)` 对 Kotlin 类不可用，改回旧 API |
| `参数类型不匹配：实际类型为 'Int'，预期类型为 'Float'` | 数值字面量默认 Int | `radius as Float` 显式转换 |
| `找不到名称 "getBondState"/"getName"/"getAddress"` | `getParcelableExtra` 返回类型推断失败 | 显式泛型 `getParcelableExtra<BluetoothDevice>(key)` |
