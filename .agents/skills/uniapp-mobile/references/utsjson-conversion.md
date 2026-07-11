---
name: utsjson-conversion
description: UTSJSONObject 与自定义类型转换
---

# UTSJSONObject类型转换

## 问题说明

在 UTS 中，`UTSJSONObject` 不能直接 `as` 转换为自定义类型（如 `User`）。必须编写转换函数，逐个提取属性。

**运行时错误**：
```
io.dcloud.uts.UTSJSONObject cannot be cast to uni.UNIB2D39C5.User
```

## as 类型断言的安全使用规范

`as` 在 UTS 中的使用需要区分场景：

| 场景 | 是否安全 | 说明 |
|------|---------|------|
| `any → UTSJSONObject` | ✅ 安全 | 运行时已知实际类型为 `UTSJSONObject` 时可安全使用 |
| `UTSJSONObject → 自定义type` | ❌ 不安全 | 编译时通过但运行时抛 `ClassCastException`，必须用映射函数 |
| `res.data as UTSJSONObject` | ✅ 安全 | `uni.request` 返回的 data 运行时就是 `UTSJSONObject` |

## 标准转换模式

```typescript
// 定义类型
export type User = {
  access_token: string
  username: string
  pageTitle: string
  id: string
}

// 编写转换函数
function toUser(data: UTSJSONObject): User {
  return {
    access_token: data.getString('access_token', ''),
    username: data.getString('username', ''),
    pageTitle: data.getString('pageTitle', ''),
    id: data.getString('id', '')
  }
}
```

## UTSJSONObject API

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getString(key, default)` | 获取字符串 | `string` |
| `getNumber(key, default)` | 获取数字 | `number` |
| `getBoolean(key, default)` | 获取布尔值 | `boolean` |
| `getAny(key)` | 获取任意类型值 | `any` |
| `put(key, value)` | 设置属性 | `void` |
| `UTSJSONObject.assign(target, source)` | 合并对象（返回新对象，同时修改target） | `UTSJSONObject` |
| `UTSJSONObject.keys(obj)` | 获取所有键名 | `string[]` |

## 复杂对象转换

```typescript
// 嵌套对象
export type Student = {
  id: string
  name: string
  idCard: string
  age: number
}

function toStudent(data: UTSJSONObject): Student {
  return {
    id: data.getString('id', ''),
    name: data.getString('name', ''),
    idCard: data.getString('idCard', ''),
    age: data.getNumber('age', 0) as number,
  }
}

// 数组转换
const rawArray = res as UTSJSONObject[]
const list = rawArray.map((item): Student => {
  return toStudent(item)
})
```
