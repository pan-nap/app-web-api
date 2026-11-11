# UTS 语言基础（蒸汽模式）

> **本项目边界**：蒸汽模式页面/`.uts` 的逻辑层由 js 引擎驱动，**直接写标准 js/ts，不要求强类型**。
> 必须强类型的场景只剩一个：`uni_modules/*/utssdk/` 原生插件（编译为 Kotlin/Swift/ArkTS），规范见 `.agents/skills/uts-plugin/SKILL.md`，本文不重复。

## 是什么

UTS（uni type script）是跨平台现代语言。蒸汽模式下 Android/iOS 的页面逻辑层跑在自带 js 引擎上（写 uts 也是经 `uts2js` 转成 js 后运行），Web/小程序同样是 JS；只有 `utssdk/` 插件仍按平台编译为 Kotlin / Swift / ArkTS。

因此：**页面与业务 `.uts` 按普通 ts 写**，`interface` / `type` + `as` 断言后直接 `.` 访问，允许 `??`、`?.`、`Object.keys`、`for...in`、`Object.assign`、`JSON.parse/stringify`。

## 变量与类型

```ts
let str: string = "hello"; // 可重新赋值
const s: string = "hi"; // 只读

type User = {
  name: string;
  age: number;
};
const u: User = { name: "zhangsan", age: 12 };
```

- 类型注解可选（写 ts 就照常写）；`boolean` 不要写成 `bool`。
- 联合类型可空写 `string | null`；`any` 已包含 null/undefined，无需再写 `any | null`。
- 集合类型 `Date`、`Array`、`Map`、`Set` 首字母大写；判具体类型用 `instanceof`，判原始类型用 `typeof`（数组 `typeof` 得 `"object"`）。

## UTSJSONObject

- 蒸汽模式**不用特意处理它**：联网 / 存储 / 事件回调的返回值都是普通对象，`.` / `[]` / `Object.keys` 直接访问（uts2js 注入的 UTSJSONObject，其数据键就是实例属性、方法不可枚举）。
- ❌ 禁句：`res as UTSJSONObject` 后再 `getString/getNumber/getArray`；`UTSJSONObject.assign(...)`；`toUser(res as UTSJSONObject)` 之类的转换函数——这些是 VDOM/插件写法，本项目不要写。
- 需要 `UTSJSONObject` API 的场景（`utssdk/` 插件、跨端兼容层）见 uts-plugin skill。

## 与标准 js 的差异（蒸汽模式会命中）

uts2js 为拉齐多端行为，把部分内置 API 的返回值由 `undefined` 改成 `null`：

- `Array.prototype.pop / shift / find / findLast / at`
- `Map.prototype.get`、`WeakMap.prototype.get`
- `String.prototype.at / codePointAt`

**因此判空统一用 `== null` 或 `?.`，不要写 `=== undefined`**；可为 null 的变量使用前要判空。

## 关键点

- `<script setup>` 里没有 `data`（不支持选项式），状态用 `ref` / `reactive`（见 [组合式 API](vue-composition-api.md)）。
- 动态 key 遍历（如 swagger `paths`）优先用 `utils/lodash.uts` 的 `keys` / `get` / `forInObject`，语义统一。
- 函数与模块的导出/导入、先定义后调用规则见 [函数与模块](uts-function-module.md)；平台差异代码见 [条件编译](uts-conditional.md)。
