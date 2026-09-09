---
name: common-issues
description: 编译错误、类型告警等常见问题
---

# 常见问题

## UTS 与 JS 的差异

> **注意**：HBuilderX 5.24 蒸汽模式下，`.uvue` 页面可直接写 js/ts 语法，无需强类型。以下差异主要指 VDOM 模式或 `utssdk/` 插件中的 UTS 文件。

| 方面           | JS（老版 uni-app）                | UTS（uni-app x VDOM/插件）                   |
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

## 蒸汽模式常见问题（HBuilderX 5.24）

### `lang="ts"` 编译异常

**错误**：`.uvue` 文件中 `<script setup lang="ts">` 编译报错

**原因**：HBuilderX 5.25 之前版本不识别 `lang="ts"` 或 `lang="js"`

**解决**：去掉 `lang` 属性，直接写 `<script setup>`

### `UTSAndroid` 在 uvue 页面中报错

**错误**：`UTSAndroid` / `getAndroidView` 在 `.uvue` 页面中报错

**原因**：蒸汽模式下页面不允许直接使用原生 API

**解决**：迁移到 `utssdk/` 插件中，页面传 `UniElement` 引用

### import `.ts` 文件失败

**错误**：`import xxx from './utils.ts'` 失败

**原因**：不支持 `.ts` 后缀

**解决**：改名为 `.uts`，内容不变（蒸汽模式支持 js/ts 语法）

## 页面开发常见问题

### `uni.uploadFile` 的 `res.data` 是字符串

**错误**：直接访问 `res.data.code` 报 `Property 'code' does not exist on type 'string'`

**原因**：`uni.uploadFile` 回调的 `res.data` 是 `string` 类型（服务端返回的 JSON 字符串），不像 `uni.request` 的 `res.data` 自动解析为对象。

**解决**：手动 `JSON.parse` 后再使用：

```typescript
// ❌ 错误 — res.data 是 string
success(res) {
  const code = res.data.code  // 报错
}

// ✅ 正确
success(res) {
  const result = JSON.parse(res.data) as UTSJSONObject
  const code = result.getNumber('code')
}
```

### `UTSJSONObject.assign` 合并对象

**场景**：需要将多个对象合并到一个目标对象（类似 `Object.assign`）。

```typescript
// ✅ 合并到已有对象
const target = new UTSJSONObject();
UTSJSONObject.assign(target, { key1: "value1", key2: "value2" });

// ✅ 合并 header 等场景
const header = UTSJSONObject.assign(options.header != null ? options.header : {}, { Authorization: "Bearer xxx" });
```

**注意**：`UTSJSONObject.assign` 是 uni-app x 提供的 API，替代 JS 的 `Object.assign`。

### `config.json` 可直接 import

**说明**：在 `.uts` 文件中可以直接 `import` JSON 配置文件：

```typescript
import config from "../config.json";

// 使用方式
const baseUrl = config["baseUrl"] as string;
```

### `showActionSheet` 回调结果读取

**说明**：`uni.showActionSheet` 的 `success` 回调参数需要通过 `UTSJSONObject` 读取：

```typescript
uni.showActionSheet({
  itemList: ["选项A", "选项B"],
  success: function (res): void {
    const result = res as UTSJSONObject;
    const tapIndex = result.getNumber("tapIndex");
    if (tapIndex == 0) {
      /* 选项A */
    }
  }
});
```

### `RecorderManager.onStop` 回调结果类型

**说明**：录音停止回调的 `res` 需要用 `UTSJSONObject` 方式读取属性：

```typescript
recorderManager.onStop(function (res): void {
  const result = res as UTSJSONObject;
  const tempFilePath = result.getString("tempFilePath");
  const durationVal = result.getNumber("duration");
  const duration = durationVal != null ? durationVal : 0;
});
```

### `ChooseImageSuccess` / `ChooseVideoSuccess` 类型差异

**说明**：App 平台和 Web/MP 平台的回调类型不同，需要条件编译：

```typescript
uni.chooseImage({
  success: function (res): void {
    // #ifdef WEB|MP
    imStore.sendImageMessage(res); // Web 端 res 可直接使用
    // #endif
    // #ifdef APP-ANDROID|APP-HARMONY|APP-IOS
    const result = res as ChooseImageSuccess;
    const tempFilePaths = result.tempFilePaths as string[];
    const tempPath = tempFilePaths[0] as string;
    imStore.sendImageMessage(tempPath);
    // #endif
  }
});
```

### 蒸汽模式页面默认滚动

**说明**：HBuilderX 5.12+ 蒸汽模式中，App 平台页面默认可滚动（与 Web/小程序拉齐）。如需禁用滚动，在页面根元素设置 `overflow: hidden` 或使用 `hs-screen` 组件的 `:scroll="false"` 属性。

### UniElement 桥接原生视图

**模式**：蒸汽模式中，`.uvue` 页面不能直接使用 `getAndroidView`，需要通过 UTS 插件封装：

```typescript
// ===== .uvue 页面中 =====
const container = ref<UniElement | null>(null)
// 传 UniElement 给插件
TrtcService.setLocalVideoElement(container.value)

// ===== utssdk/app-android/index.uts 中 =====
static setLocalVideoElement(el: UniElement | null): void {
  if (el == null) return
  const vg = el.getAndroidView<android.view.ViewGroup>()
  // 使用原生 ViewGroup
}
```
