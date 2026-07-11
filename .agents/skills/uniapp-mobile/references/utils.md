---
name: utils
description: lodash、storage、tool 等工具函数
---

# 工具函数

## 本地存储（utils/storage.uts）

支持过期时间管理：

```typescript
import { storage } from '@/utils/storage.uts'

// 存储（带过期时间，单位：秒）
storage.set('TOKEN', 'abc123', 24 * 60 * 60) // 24小时过期

// 获取
const token = storage.get('TOKEN') as string | null

// 检查是否过期
const isExpired = storage.isExpired('TOKEN')

// 删除
storage.remove('TOKEN')

// 一次性读取（读取后自动删除）
const temp = storage.once('temp_key')

// 清空所有
storage.clear()
```

## lodash 工具（utils/lodash.uts）

常用工具函数：

```typescript
import { isArray, isObject, isString, isEmpty, assign, get, set, debounce, throttle, uuid } from '@/utils/lodash.uts'

// 类型判断
isArray([1, 2, 3])     // true
isObject({ a: 1 })     // true
isEmpty([])            // true

// 对象操作
assign(target, source) // 合并对象（底层调用 UTSJSONObject.assign）
get(obj, 'a.b', 'default') // 安全取值
set(obj, 'a.b', value) // 设置嵌套属性

// 防抖节流
const debouncedFn = debounce(() => {}, 300)
const throttledFn = throttle(() => {}, 300)
```

## 通用工具（utils/tool.uts）

```typescript
import { showToast } from '@/utils/tool.uts'

showToast('操作成功') // 统一提示
```
