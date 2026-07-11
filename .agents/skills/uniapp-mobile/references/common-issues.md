---
name: common-issues
description: 编译错误、类型告警等常见问题
---

# 常见问题

## UTS 与 JS 的差异

| 方面           | JS（老版 uni-app）                | UTS（uni-app x）                             |
| -------------- | --------------------------------- | -------------------------------------------- |
| **类型系统**   | 弱类型                            | 强类型，变量、参数、返回值均需类型           |
| **渲染**       | WebView 渲染                      | 原生渲染（ucss 子集）                        |
| **data 类型**  | 直接赋值                          | 用字面量推导或`as` 声明                      |
| **事件参数**   | 可省略类型                        | 必须写类型，如`(e: TouchEvent) => {}`        |
| **联网返回值** | `res.data.xxx` 直接访问           | 需`as UTSJSONObject` 或用 type + 泛型        |
| **CSS 继承**   | 支持                              | **样式不继承**，文字样式必须写在 `<text>` 上 |
| **选择器**     | 完整 CSS                          | 仅支持**class** 选择器                       |
| **flex 方向**  | `flex-direction: row`（W3C 标准） | 默认**column**（竖排）                       |
| **页面滚动**   | 页面本身可滚动                    | App 端页面不滚动，需 scroll-view / list-view |
| **拦截器**     | 完全复刻 JS 行为                  | 原生侧无 JS 动态性，拦截器无法完全复刻       |

## UTSJSONObject 类型转换错误

**错误**：`io.dcloud.uts.UTSJSONObject cannot be cast to uni.UNIB2D39C5.User`

**原因**：UTS 是名义类型系统，`as T` 只是编译时断言，不会进行运行时转换。

**解决**：编写 `toUser`、`toStudent` 等转换函数逐个提取属性。

## 表单组件类型告警

**错误**：`Property 'rules/model/registerItem' does not exist on type '{}'`

**解决**：通过辅助函数读取注入对象：

```typescript
const getFormContext = () => {
  const context = inject(FORM_KEY) as FormContext;
  return context || ({} as FormContext);
};
```

## UTS 类型比较警告

**警告**：`===` / `!==` 对 `Int` 类型已废弃

**解决**：使用 `==` / `!=` 替代。

## `vh` / `vw` 单位不支持

**错误**：`ERROR: property value 100vh is not supported for height (supported values are: number|pixel|percent|auto)`

**原因**：uni-app x 的 ucss 不支持 `vh` / `vw` 单位。

**解决**：用 `100%` 或具体 rpx 值替代：

```css
/* ❌ 错误 */
height: 100vh;

/* ✅ 正确 */
height: 100%;
```

## `max-width` 不支持百分比

**错误**：`ERROR: property value 65% is not supported for max-width (supported values are: number|pixel)`

**原因**：uni-app x 的 ucss 中 `max-width` 仅接受 `number`、`pixel`，不接受百分比。

**解决**：用具体 rpx 值替代：

```css
/* ❌ 错误 */
max-width: 65%;

/* ✅ 正确 */
max-width: 500rpx;
```

## CSS `gap` 属性不支持

**错误**：`WARNING: gap is not a standard property name (may not be supported)`

**原因**：uni-app-x 的 .uvue 文件中 CSS `gap` 属性不被标准支持。

**解决**：改用 `margin` + 相邻兄弟选择器 (`+`) 实现间距：

```css
/* ❌ 错误 */
.control-bar {
  display: flex;
  gap: 32px;
}

/* ✅ 正确 */
.control-bar {
  display: flex;
}

.control-btn + .control-btn {
  margin-left: 32px;
}

/* 对于 flex-column 的场景 */
.container {
  display: flex;
  flex-direction: column;
}

.item + .item {
  margin-top: 12px;
}
```

## Promise.then 不支持返回 Promise

**错误**：`Return type mismatch`

**原因**：在 UTS 中，`Promise.then()` 的回调函数签名只接受返回 `void`，不支持返回另一个 `Promise`。

**解决**：使用 `async/await` 替代 `.then()` 链式调用：

```typescript
// ❌ 错误 — 编译报错
return validate().then(() => {
  return login();
});

// ✅ 正确
const result = await validate();
await login();
```

## forEach 回调参数需显式类型标注

**错误**：`Type inference failed` 或隐式 `any` 类型警告

**原因**：在 UTS 中，`forEach` 回调函数的参数必须显式标注类型，不能依赖类型推断。

**解决**：

```typescript
// ❌ 错误 — 未标注类型
arr.forEach((item) => { ... })

// ✅ 正确
arr.forEach((item: string) => { ... })
arr.forEach((item: UTSJSONObject) => { ... })
```
