# UTS 函数与模块

## 函数定义

- **函数声明**：`function name(x: string, y: number): string { return ... }`；除返回 void 外需标明返回类型。
- **函数表达式**：`const fn = function(x: string): number { ... }`。
- **箭头函数**：`(s) => s.length`；组合式里推荐箭头函数以保持作用域一致。

## 异常处理

- **throw**：`throw new Error("msg")`。
- **try-catch-finally**：`try { ... } catch (e: Error) { ... } finally { ... }`。

## 模块 export / import

- **export**：`export const name = "x"`、`export function fn(){}`、`export default class C{}`；export 需在模块顶层。
- **import**：`import { name, fn } from './a.uts'`、`import * as M from './a.uts'`、`import C from './a.uts'`；可用 **as** 别名。
- 一个文件可有多个 export，但仅一个 **export default**。

## 关键点

- 跨平台时避免在模块顶层写仅单平台可用的代码，可放到条件编译或运行时判断中。
- **先定义后调用**：UTS 中函数声明和变量不提升（no hoisting），必须在引用前完成定义。
	```typescript
	// ❌ 错误 — UTS 中函数声明不提升
	onShow(function () {
		doSomething() // 编译报错：找不到名称
	})
	function doSomething(): void { ... }

	// ✅ 正确 — 定义在前
	function doSomething(): void { ... }
	onShow(function () {
		doSomething()
	})
	```
