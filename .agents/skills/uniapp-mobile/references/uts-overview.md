# UTS 概述

## 是什么

UTS（uni type script）是跨平台、强类型的现代编程语言，在不同平台编译为：
- Web/小程序 → JavaScript
- Android → Kotlin
- iOS → Swift
- 鸿蒙 → ArkTS

uni-app x 中逻辑层使用 UTS，不能写 JS（Android 无 JS 引擎）。

## 变量与常量

```ts
let str: string = "hello"   // 可重新赋值
str = "hello world"

const s: string = "hi"      // 只读，不能重新赋值
```

- 类型用冒号 `: 类型` 声明。
- 方法参数与返回值同样用冒号：`function test(score: number): boolean { ... }`。

## data 中的类型（选项式）

vue 的 `data()` 里不能用 `let x: number` 形式，可用：
- **字面量推导**：`n1: 0` 推导为 number。
- **as 声明**：`n2: null as number | null`、`year: date.getFullYear() as number`。

## 类型判断与安全调用

- **typeof**：判断 boolean、number、string、function；数组用 `typeof` 得 `"object"`。
- **instanceof**：判断类型，如 `x instanceof Date`、`x instanceof UTSJSONObject`。
- **可选链**：可为 null 的类型需用 `?.`。

## 与 TS 的差异

- 并非"TS 直接编译到各端"，而是抽象各端共性 + 条件编译支持平台特性。
- 联合类型仅支持 `| null`，不支持任意多类型联合。
