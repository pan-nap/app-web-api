# UTS 类型声明与实现

## interface.uts 声明

```typescript
// interface.uts — 只导出类型，不包含实现
export type MqttConfig = {
  host: string
  port: number
  clientId?: string
  username?: string
  password?: string
  clean?: boolean
  keepalive?: number
}
```

## index.uts 实现

```typescript
// index.uts — 导入 interface 中的类型
import { MqttConfig } from './interface.uts'

// 导出类给外部使用
export class MqttClient {
  // ...
}

// 不导出业务单例（由外部业务层管理）
```

## UTS 插件类型系统模式速查

| 目标 | TypeScript 写法 | UTS 正确写法 |
|------|----------------|-------------|
| 枚举 | `enum X { A, B }` | `const X = { A:0, B:1 }; type X = number` |
| 内联对象 | `{ a: 1, b: 2 }` | `class X { a:number=1; b:number=2 }` |
| 可选参数 | `fn(x?: string)` | `fn(x: string \| null = null)` |
| 解构 | `const {a, b} = obj` | `const a = obj.a; const b = obj.b` |
| 空值合并 | `a \|\| b` | `a ?? b` |
| for...of | `for (const x of arr)` | `for (let i=0; i<arr.length; i++)` |
| 模板字符串 | `` `hello ${name}` `` | `'hello ' + name` |
| Class 引用 | `Context::class.java` | `java.lang.Class.forName('android.content.Context')` |
| 非空标记 | `Context!` | 不支持，用 `forName` |
| 属性访问 on any | `(data as any).body` | `(data as MyInterface).body` |
| Int 转换 | `num as int` | `num as Int` |
| 位运算 | `FLAG_A or FLAG_B` | `FLAG_A \| FLAG_B` |
| 非空断言 | `x!!` | 不可靠，用 `if (x == null) return` |
| uvue 组件引用 | `ref<view \| null>` | `ref<UniElement \| null>` |
| `const` 属性取值 | `const A = X.A`（Any?） | 直接写原始字面量 `2` |
| Java Int 字段赋值 | `f.x = a + (b as Int)` | `f.x = (a + (b as Int)) as Int` |
| Android 接口实现 | `new IF({method:fn})` | 单方法传函数，多方法绕开 |
| 函数定义顺序 | `fn()` 调用在定义前 | 所有函数先定义，再调用 |
| 类型 `any` | `let x: any = null` | UTS 无 `any`，只能用具体类型 `Xxx \| null` |
| 静态方法覆写 | `Cls.method = function(){}` | 方案 A：用 `#ifdef` 在方法体内直接实现；方案 B：各平台独立 `index.uts` 直接实现 |
| 回调调用 | `cb?.call(null, arg)` | 辅助函数 + `const cb = X.fn; if (cb != null) cb(arg)` |
| 可空对象调用 | `x != null && x.doSomething()` | `const v = x; if (v != null) v.doSomething()` |
| Java 泛型方法 | `getParcelableExtra(key)` | `getParcelableExtra<具体类>(key)` 显式传泛型 |
| Java 抽象类 | `new AbstractClass({method:fn})` | 具名 UTS 类 `extends` + `constructor() { super() }` + `override` |
| Java SAM 接口 | `new Runnable({run:fn})` | SAM 转换直接传函数 `function(): void { ... }` |
| Java byte[] | `Array<number>` 作 `byte[]` | 用 `BufferedReader`/`OutputStreamWriter` 包装类  |
| Android: Int 参数 | `num as number` | `num as Int`（重写 API 方法时参数必须 Int）|
| Android: MutableList | `Array<string>` | `MutableList<string>`（权限回调等特定场景）|
| Android: String[] | `string[]` | `import KotlinArray from 'kotlin.Array'` 别名引用 |
| Android: java.lang.* | 直接使用 | 需 `import X from 'java.lang.X'` |
| Android: 非空断言 | `x!!` | `x!`：UTS 用单 `!` 替代 Kotlin 双 `!!` |
| Android: 匿名内部类 | `object : X{}` | `const v = new (class implements X { ... })` |
| Android: Double 运算 | `a / b` 自动提升 | `a * 1.0 / b` 需一个操作数为 Double |
| Android: 静态方法调用 | `Obj.setX(v)` | `Obj.x = v` 属性访问替代方法调用 |
| Android: 泛型传递 | `fun <T> foo()` | `@UTSAndroid.keyword("inline") @UTSAndroid.keyword("reified")` |
| iOS: 构造参数 | `title: "提示"` | `title="提示"` 用 `=` 替代 `:` |
| iOS: 枚举简写 | `.alert` | `UIAlertController.Style.alert` 完整写出 |
| iOS: 闭包 | 尾随闭包简写 | 完整写出 `handler=(...):void => {...}` |
| iOS: 可选类型 | `String?` | `string \| null` |
| iOS: 常量和变量 | `let` 常量, `var` 变量 | `const` 常量, `let` 变量 |
| iOS: Dictionary | `Dictionary<String,Any>` | `Map<string,any>` + `map.set(key, value)` |
| iOS: try/catch | `try expr` / `try? expr` | `UTSiOS.try(expr)` / `UTSiOS.try(expr, "?")` |
| iOS: 版本判断 | `#available(iOS 10.0, *)` | `UTSiOS.available("iOS 10.0, *")` |
| iOS: 逃逸闭包 | 默认 | 需加 `@escaping` 标记 |
| iOS: 参数标签 | `fn(_ a: Int, label b: Int)` | `fn(a: Int, @argumentLabel("label") b: Int)` |
| iOS: 指针操作 | `&varName` | `UTSiOS.getPointer(varName)` |
| iOS: weak/private 修饰符 | `weak var` / `private class` | `@UTSiOS.keyword("weak")` / `@UTSiOS.keyword("private")` |
| HarmonyOS: 对象字面量 | `const obj = { a:1 }` | 需指定类型 `const obj: Obj = { a:1 }` 或 `as Obj` |
| HarmonyOS: 依赖 | npm 包 | ohpm 依赖 + config.json 配置 |
