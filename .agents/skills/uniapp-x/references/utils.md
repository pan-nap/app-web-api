---
name: utils
description: lodash、storage、tool 等工具函数
---

# 工具函数

## 本地存储（utils/storage.uts）

> `uni.setStorageSync` / `getStorageSync` 等**官方 API**（含对象读写与 key 命名保留前缀）见 [数据存储](features-storage.md)；本节只写项目封装层。

支持过期时间管理：

```typescript
import { storage } from "@/utils/storage.uts";

// 存储（带过期时间，单位：秒）
storage.set("TOKEN", "abc123", 24 * 60 * 60); // 24小时过期

// 获取
const token = storage.get("TOKEN") as string | null;

// 检查是否过期
const isExpired = storage.isExpired("TOKEN");

// 删除
storage.remove("TOKEN");

// 一次性读取（读取后自动删除）
const temp = storage.once("temp_key");

// 清空所有
storage.clear();
```

## lodash 工具（utils/lodash.uts）

常用工具函数：

```typescript
import { isArray, isObject, isString, isEmpty, isNull, assign, keys, get, set, forInObject, toArray, forEach, debounce, throttle, uuid } from "@/utils/lodash.uts";

// 类型判断
isArray([1, 2, 3]); // true
isObject({ a: 1 }); // true
isEmpty([]); // true
isNull(null); // true（App 端统一 == null，其他端额外兼容 undefined）

// 对象操作（蒸汽模式下遍历动态 key 的首选）
keys({ a: 1, b: 2 }); // ['a','b']（底层 Object.keys）
get(obj, "a", "default"); // 取一层键值（注意：实现是 obj[key]，**不支持 'a.b' 点路径**，嵌套自己逐层取或用可选链）
set(obj, "a.b", value); // 设置嵌套属性（set 才支持点路径/数组下标）
assign(target, source); // 合并对象（底层 Object.assign）
forInObject(paths, (value, key) => {
  /* 逐个 key 处理 */
});
toArray(data, (value, key) => ({ key, value })); // 对象转数组

// 防抖节流
const debouncedFn = debounce(() => {}, 300);
const throttledFn = throttle(() => {}, 300);
```

> 逻辑层是 js，`Object.keys` / `for...in` / `Object.assign` 都可用（语言层写法边界只在 [UTS 语言基础](uts-overview.md)「UTSJSONObject」一节维护）。本文下面只讲项目工具函数本身。

## 通用工具（utils/tool.uts）

```typescript
import { showToast } from "@/utils/tool.uts";

showToast("操作成功"); // 统一提示
```
