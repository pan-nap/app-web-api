---
name: common-issues
description: 蒸汽模式编译错误、类型告警等常见问题
---

# 常见问题

> 本 skill 只覆盖**蒸汽模式**（本项目 `manifest.json -> "uni-app-x": { "vapor": true }`，HBuilderX 5.34）。
> VDOM 模式与 `utssdk/` 插件的强类型写法不在本文维护，见 `.agents/skills/uts-plugin/SKILL.md`。

## 蒸汽模式约束速查

| 方面                     | 蒸汽模式（本项目）                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **类型系统**             | 逻辑层由 js 引擎驱动，直接写 js/ts，**不要求强类型**；只支持组合式，无选项式 / mixin / `this` |
| **联网/存储/回调返回值** | `res.data.code`、`res.tapIndex` **按普通对象直接访问**                                        |
| **渲染**                 | 原生渲染，`template` + `style` 编译为字节码（本项目 `vapor-render-target: "bytecode"`）       |
| **页面滚动**             | 页面**默认可滚动**（5.12+），与 Web/小程序拉齐                                                |
| **选择器**               | **关系选择器全部不可用**（`.a .b`、`.a > .b`、`.a + .b`、`.a ~ .b`），只留单类与分组          |
| **样式隔离**             | **仅策略 2.0**：页面默认 `app`、组件默认 `isolated`                                           |
| **flex 方向**            | 全平台默认 **column**                                                                         |
| **拦截器**               | js 拦截器可直接用，不存在原生侧动态性缺失                                                     |

## 老写法禁令（蒸汽模式不要这样写）

| 报错 / 场景                                                                    | 处置                                                                        |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `io.dcloud.uts.UTSJSONObject cannot be cast to uni.XXX.User`                   | 只出现在 VDOM/插件；蒸汽模式 js 逻辑层不会命中，插件场景见 uts-plugin skill |
| `.then()` 回调返回 Promise 报 `Return type mismatch`                           | 强类型环境限制；蒸汽模式统一用 `async/await`，可读性也更好                  |
| `forEach` 回调报 `Type inference failed` / 隐式 `any`                          | 强类型环境要求参数标注；蒸汽模式按普通 js 写                                |
| `===` / `!==` 对 `Int` 类型已废弃的告警                                        | 蒸汽模式没有 `Int`/`Long` 类型，`===` / `!==` 照常使用                      |
| `attrs as UTSJSONObject`、`res as UTSJSONObject` 后 `getString/getNumber` 取数 | 多余的强转与 API 调用，直接 `res.tapIndex` / `attrs["xxx"]`                 |

> 接口字段与业务 type 不一致时，**业务数据仍建议过 store/mapper 的 `toXxx` 函数**，保证页面只依赖自己的 type，不被接口字段变动直接冲击。

## 表单组件类型告警

**错误**：`Property 'rules/model/registerItem' does not exist on type '{}'`

**解决**：通过辅助函数读取注入对象：

```typescript
const getFormContext = () => {
  const context = inject(FORM_KEY) as FormContext;
  return context || ({} as FormContext);
};
```

## CSS 报错原文速查（方案只在 css-ucss 维护）

下面只保留“报错文本→原因”的映射，便于搜错；**写法规范与替代方案统一见 [UVUE CSS](css-ucss.md)**：

| 报错 / 警告原文                                                                                                | 原因                                                      | 方案所在章节                      |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------- |
| `ERROR: property value 100vh is not supported for height (supported values are: number\|pixel\|percent\|auto)` | ucss 不支持 `vh` / `vw`（用 `100%` 或具体 rpx）           | css-ucss「不支持的 CSS 单位与值」 |
| `ERROR: property value 65% is not supported for max-width (supported values are: number\|pixel)`               | `max-width` 不接受百分比（用 `500rpx`）                   | 同上                              |
| `WARNING: gap is not a standard property name (may not be supported)`                                          | ucss 不支持 `gap`；⚠️ 也不能用兄弟选择器 `.a + .a` 补间距 | css-ucss「flex 间距」             |

## 蒸汽模式常见问题（症状速查，规则不在此重复）

| 报错 / 症状                                                      | 原因                                                                                                                                                                                 | 规则维护处                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `.uvue` 里写 `<script setup lang="ts">` 编译报错（仅低版本）     | HBuilderX **5.31+** 已支持显式 `lang="uts"/"ts"/"js"`；5.31 前不能手动指定 lang，强行写会触发 bug，去掉 `lang` 即可（不写时按 manifest 的 `vapor-default-script-lang`，本项目 `ts`） | SKILL.md「核心要点」Script 标签                                  |
| `import xxx from './utils.ts'` 失败（仅低版本）                  | 5.31 前导入链路不识别 `.ts` 后缀，改名为 `.uts` 即可；**5.31+** `.js`/`.ts`/`.uts` 各自独立编译，可直接导入；官方仍建议维持 `.uts`                                                   | SKILL.md「核心要点」文件后缀 + [项目结构](project-structure.md)  |
| `UTSAndroid` / `getAndroidView` 在页面中报错                     | 蒸汽模式页面不允许直接调原生 API，需挪进 `utssdk/` 插件、页面只传 `UniElement`                                                                                                       | [条件编译](uts-conditional.md) + 本文「UniElement 桥接原生视图」 |
| 编辑器里 `.uts`/`.uvue` 无任何类型提示/跳转（与后缀、lang 无关） | DCloud 语言服务插件以“工作区文件夹根 = 项目根”识别 uni-app x 项目；直接打开 monorepo 仓库根时 `packages/hs-his-app` 不会被扫描到                                                     | 本文「编辑器类型提示缺失」                                       |

## 编辑器类型提示缺失（Qoder/VSCode + DCloud 插件）

**症状**：`.uts`/`.uvue` 里 `uni.xxx` 无补全、业务 `interface` 类型（如 `RequestMethod`）无悬浮提示/跳转。

**根因链（按顺序排查）**：

1. **工作区打开方式**（最常见）：`dcloud-ide.hbuilderx-language-services` 把每个**工作区文件夹的根**当作项目，读该目录下的 `manifest.json` 是否含 `"uni-app-x"` 来启用 UTS 类型服务；它**不会向下扫描子目录**。monorepo 直接打开仓库根 ⇒ `packages/hs-his-app` 不会被识别。正确做法：「文件 → 打开工作区」选根目录的 `workspace.code-workspace`，或直接打开 `packages/hs-his-app`。
2. **平台目标**：同目录 `platformConfig.json` 的 `targets`（如 `["APP-ANDROID"]`）决定给哪个平台的类型定义，缺失或异常会导致提示不全。
3. **插件版本**：需匹配项目 HBuilderX 版本（如 5.31+ 的 ts/js 独立编译策略需要较新的语言服务），过旧插件对新语法/新策略不识别。
4. 业务符号（自己写的 `interface`/`type`）的提示走的是同一套 UTS 类型服务，**不需要**为此把文件改名 `.ts`；标准 `.ts` 文件则由编辑器内置 TS 服务接管（`typescript.tsdk` 已指向仓库 `node_modules/typescript`）。

> 验证方式：切换工作区后重启窗口，在 `.uts` 里输入 `uni.` 看补全、对业务类型悬浮看提示。

## 页面开发常见问题

### `uni.uploadFile` 的 `res.data` 是字符串

**错误**：直接访问 `res.data.code` 报 `Property 'code' does not exist on type 'string'`

**原因**：`uni.uploadFile` 回调的 `res.data` 是 `string` 类型（服务端返回的 JSON 字符串），不像 `uni.request` 的 `res.data` 自动解析为对象。

**解决**：先 `JSON.parse` 再使用：

```typescript
// ❌ 错误 — res.data 是 string
success: (res) => {
  const code = res.data.code; // 报错
};

// ✅ 蒸汽模式：解析后按普通对象用
success: (res) => {
  const result = JSON.parse(res.data as string) as ResponseData;
  const code = result.code;
};
```

### 合并对象

```typescript
// ✅ 就是普通 js，直接用 Object.assign / 展开
const header = Object.assign({}, options.header, { Authorization: "Bearer xxx" });
```

### `config.json` 可直接 import

**说明**：在 `.uts` 文件中可以直接 `import` JSON 配置文件：

```typescript
import config from "../config.json";

// 使用方式
const baseUrl = config["baseUrl"] as string;
```

### 回调结果读取（`showActionSheet` / `RecorderManager.onStop`）

**说明**：蒸汽模式下联网、存储、事件回调的返回值都是普通对象，直接取属性，不要再 `as UTSJSONObject` 后调 `getString/getNumber`。

```typescript
// ✅ showActionSheet
uni.showActionSheet({
  itemList: ["选项A", "选项B"],
  success: (res) => {
    const tapIndex = res.tapIndex;
  }
});

// ✅ RecorderManager.onStop
recorderManager.onStop((res) => {
  const tempFilePath = res.tempFilePath;
  const duration = res.duration ?? 0;
});
```

### `chooseImage` / `chooseVideo` 的端差异

**说明**：App 平台与 Web/MP 平台返回的回调结构不同，需条件编译区分（与渲染模式无关）：

```typescript
uni.chooseImage({
  success: (res) => {
    // #ifdef WEB || MP-WEIXIN
    uploadImage(res.tempFilePaths[0]); // Web 端可直接取
    // #endif
    // #ifdef APP-ANDROID || APP-IOS || APP-HARMONY
    const tempFilePath = res.tempFilePaths[0];
    uploadImage(tempFilePath);
    // #endif
  }
});
```

> `uploadImage` 只是占位（示意把选好的图交给业务层/store）；项目现有的上传封装是 `utils/request.uts` 的 `uploadFile(filePath)`。

### 蒸汽模式页面默认滚动

→ 规则与 `disableScroll` 场景统一见 [长列表与滚动](features-list-scroll.md)「蒸汽模式页面滚动特性」；本项目页面锁滚动靠 `pages.json` 的 `disableScroll` 或 `hs-screen` 的定高布局。

## 蒸汽模式新增坑（症状 → 权威文件索引）

> 规则本身只在各自主文件维护一遍，本表只留“踩到时的症状特征”，便于按现象检索。

| 症状                                                              | 根因与方案（详见）                                                                                                                                                                 |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 搬过来的 `export default { data() {} }`、mixin 编译报错或行为异常 | 蒸汽模式不支持选项式/mixin，全部改 `<script setup>`（SKILL.md「核心要点」）                                                                                                        |
| 页面写 `.hs-button { color: red }` 改不动组件内样式               | 样式隔离策略 2.0，组件默认 `isolated`；用 external-class 或 `defineOptions({ styleIsolation: 'app-and-page' })`（css-ucss「样式隔离」）                                            |
| 改造后间距/颜色莫名丢失、不报错                                   | 关系选择器 `.a .b` / `.a > .b` / `.a + .b` / `.a ~ .b` 蒸汽模式不支持 → 改写为单一 class（BEM）（css-ucss「能力范围」）                                                            |
| 长列表卡顿、list-item 不被复用                                    | 首个 v-for 缺 `:key` / list-item 被包到子组件 / list-view 与 list-item 不同文件（features-list-scroll「复用硬规则」）                                                              |
| swiper 指示器样式/高度不对                                        | 蒸汽模式组件变更：`indicator-class`、`<template v-slot:indicator>`、`swiper-item` 固定 `absolute`、默认高度 150px 需 `auto-height`（features-list-scroll「蒸汽模式组件属性变更」） |
| 文本无法长按选中复制、点不上事件                                  | `flatten` 拍平后不支持事件、`takeSnapshot`，text 的 `selectable`/`user-select` 失效 → 需要选中复制的文本不要加 flatten（css-ucss「拍平」）                                         |
| uts 插件里 `getApp().globalData` 拿不到                           | 蒸汽模式 Android/iOS 插件环境不支持 globalData → 走 store（core-app「globalData」）                                                                                                |
| web / 小程序行为跟 App 不一致                                     | 蒸汽模式编译到 web、小程序目前仍以 **VDOM** 运行，无需为它写渲染差异条件编译（build-run「版本与运行要求」）                                                                        |

## UniElement 桥接原生视图（页面与插件分工）

**模式**：`.uvue` 页面不能直接使用 `getAndroidView`，需要通过 UTS 插件封装（插件侧写法见 uts-plugin skill）：

```typescript
// ===== .uvue 页面中 =====
const container = ref<UniElement | null>(null);
// 传 UniElement 给插件
TrtcService.setLocalVideoElement(container.value);
```

> 页面侧只负责拿到并传 `UniElement`；`el.getAndroidView<ViewGroup>()` 之类的原生调用只能在 `utssdk/app-android/index.uts` 里写。
