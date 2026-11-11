---
name: "uniapp-x"
description: "UniApp X 移动端开发规范（HBuilderX 5.24+ 蒸汽模式），涵盖页面生命周期、组件使用、状态管理、请求拦截等。Invoke when developing uni-app x mobile applications with vapor mode."
---

# UniApp X 移动端开发规范（蒸汽模式）

> 项目级 uni-app x 开发规范，基于 **HBuilderX 5.24+** 蒸汽模式（Vapor），覆盖项目结构、生命周期、组件使用、状态管理、请求封装、编译运行等全流程。
> **范围约定**：本 skill 只写蒸汽模式（本项目 `manifest.json` 已开 `vapor: true`）；VDOM 模式与 `utssdk/` 插件的强类型写法一律不在这里维护，见 `.agents/skills/uts-plugin/SKILL.md`。各文件只保留「❌ 禁句」用于防止退回旧写法。

## 蒸汽模式核心要点（HBuilderX 5.24+）

> 官方依据：`https://doc.dcloud.net.cn/uni-app-x/app-vapor.html`；本地镜像 `C:\Program Files\HBuilderX\plugins\hbuilderx-ai-chat\uni-agent\knowledges\uni-app-x\docs\app-vapor.md`（随 HBuilderX 版本更新，优先级高于本文件描述）。
> 本项目开关：`manifest.json -> "uni-app-x": { "vapor": true, "styleIsolationVersion": "2", "vapor-render-target": "bytecode" }`。

| 要点                  | 说明                                                                                                                                                                                                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **文件后缀**          | 页面 `.uvue`，工具/脚本 `.uts`，入口 `main.uts`；**5.31+** 外链脚本 `.js`/`.ts`/`.uts` 各自独立编译（`.js` 无额外编译最快、`.ts` 走 ts2js 类型运行时擦除、`.uts` 走 uts2js 保留 UTSJSONObject），5.31 前导入链路不识别 `.ts` 需改名 `.uts`；官方仍建议非必要不新建 `.ts`/`.js`，维持 `.uts` 最稳                       |
| **Script 标签**       | **5.31+** 可显式 `lang="uts"/"ts"/"js"`（此前不要写 `lang`，强行设置反而触发 bug）；不写 lang 时按 `manifest.json -> uni-app-x.vapor-default-script-lang` 默认值（本项目已设为 `ts`，官方默认也是 ts）；用了 `UTSJSONObject` 专有方法（getString/getNumber 等）的页面才需要显式 `lang="uts"`，否则一律普通 object 写法 |
| **语法支持**          | 逻辑层由 js 引擎驱动，直接写标准 js/ts，**不要求强类型**；写成 uts 也可（经 `uts2js` 跑在同一 js 引擎上，会注入 `UTSJSONObject` 等 shim）                                                                                                                                                                              |
| **Vue API**           | 仅支持组合式（`<script setup>`），**不支持选项式、不支持 mixin、不支持 `this`**；历史选项式先转组合式                                                                                                                                                                                                                  |
| **页面生命周期名**    | 组合式下页面显示/隐藏是 **`onPageShow` / `onPageHide`**（`onShow`/`onHide` 只属于选项式，蒸汽模式写了取不到回调）；蒸汽模式新增 `onRecycle`/`onReuse`（组件回收/复用）                                                                                                                                                 |
| **CSS 选择器**        | 运行时**不支持任何关系选择器**：`.a .b`、`.a > .b`、`.a + .b`、`.a ~ .b` 全部失效，通配、ID、属性、伪类选择器同样不支持；只可用单类选择器与逗号分组选择器 + `page`；层级关系用 BEM 命名（`.a__b`）。scss 是编译时方案，仍可用                                                                                          |
| **样式隔离**          | 仅支持**样式隔离策略 2.0**（不是 scoped）：全局影响页面、页面/组件/父子组件互相隔离；**页面默认 `app`、组件默认 `isolated`**，可在 `<script setup>` 用 `defineOptions({ styleIsolation: 'isolated' \| 'app' \| 'app-and-page' })` 调整；组件子元素样式定制走 `external-class`（如 `placeholder-class`）                |
| **组件模式**          | 不再支持 uts 兼容模式组件，仅支持 uts 标准模式组件（`native-view` 写法）；部分布尔属性默认值由 true 改 false（scroll-view、swiper 等）                                                                                                                                                                                 |
| **swiper**            | 默认高度 150px（需随内容撑开用 `auto-height`）；`swiper-item` 的 position 固定为 `absolute`；指示器可用 `indicator-class`/`indicator-active-class` 或 `<template v-slot:indicator>` 自定义；支持 3D 轮播                                                                                                               |
| **list-view**         | 全新 C+uts 实现（不再基于 recycle-view），支持 vue 实例与 DOM 全面复用：`list-item` 的 `v-for` **必须有 `:key`**；仅**第一个** list-item 上的 v-for 参与复用；`list-view` 与 `list-item` 必须写在**同一个 uvue 文件**内（不可包成子组件）                                                                              |
| **拍平 flatten**      | 5.0/5.11/5.21 起 view、text、image 新增 `flatten`（仅蒸汽模式、初始化属性不可动态改）；拍平后不支持事件、`takeSnapshot`，text 的 `selectable`/`user-select` 失效                                                                                                                                                       |
| **原生 API**          | 页面（uvue）**不能直接调原生 API**：`UTSAndroid`、`getAndroidView` 等不可用，需挪进 `utssdk/` 插件；页面操作 DOM 用 `UniElement`；高频绘制直接用 `view`/`text`（可 `flatten`），Drawable 类的 Element API 官方仍缺失                                                                                                   |
| **globalData**        | 蒸汽模式 Android/iOS 的 **uts 插件环境不支持 `getApp().globalData`**；跨页面/插件共享状态用 pinia store（本项目用标准 pinia setup store，`main.uts` 里 `app.use(createPinia())`，编译器内置无需安装）                                                                                                                  |
| **条件编译**          | `APP-ANDROID`/`APP-IOS`/`APP-HARMONY`/`WEB`/`MP-WEIXIN` 等仍可用；渲染系统相关差异用新条件 **`VUE3-VAPOR`**（uts 插件需同时兼容两种渲染模式时使用）                                                                                                                                                                    |
| **平台与版本**        | 蒸汽模式支持：鸿蒙 HBuilderX 5.0+、iOS 5.11+、Android 5.21+；最低系统 Android 6.0（默认 target 36）、iOS 15、鸿蒙 API 20                                                                                                                                                                                               |
| **编译到 web/小程序** | 目前仍以 **VDOM 模式**运行（页面滚动等行为一致，无需为此写条件编译）；web 端 CSS 已拉齐 App 布局引擎（flex 重置）                                                                                                                                                                                                      |
| **视图层编译目标**    | template + style 编译为机器码或字节码；本项目用 **bytecode**（编译快，性能仅低约 3%，可 wgt 热更需 5.31+）                                                                                                                                                                                                             |
| **废弃组件替换**      | 早期 hello/uni-id-pages 组件：`uni-loading` → 内置 `loading`；`uni-popup` → 内置 `page-container`                                                                                                                                                                                                                      |
| **CSS 方案**          | **页面**统一用 tailwind 原子类（a-hua-unocss 编译时生成），极个别场景才用 `<style>` 写简单 class；**uni_modules 组件库（hs-design）内一律用 BEM 手写 `<style>` CSS，不用原子类**（组件 isolated 隔离引用不到页面全局 class），见 [css-ucss](references/css-ucss.md)                                                    |

## 蒸汽模式写代码范式（本项目取舍）

1. **按普通 js/ts 写**：`interface`/`type` + `as` 断言后直接 `.` 访问，允许 `??`、`?.`、`Object.keys`、`for...in`、`Object.assign`、`JSON.parse/stringify`。
   - 运行时（uts2js）里 `UTSJSONObject` 是「数据键直接挂在实例上 + 方法非枚举」的类，`Object.keys`/`.`/`[]` 都能用；其 `getString/getJSON/getArray/toMap` 等 API 也仍可用。
   - 只有写进 **`utssdk/` 插件**（编译为 Kotlin/Swift/ArkTS）的代码才必须改用强类型 + `UTSJSONObject` API，规范见 `.agents/skills/uts-plugin/SKILL.md`。
2. **联网/存储/事件回调的返回值**按普通对象处理（见 [request](references/request.md)），不要写 `as UTSJSONObject` 兜圈；跨端坑见 [common-issues](references/common-issues.md)。
3. **动态 key 遍历**（如 swagger `paths`、`content`）优先用 `utils/lodash.uts` 的 `keys`/`get`/`forInObject`，语义统一、可读性好。
4. **组件复用优先于堆节点**：长列表用 `list-view`（记得 `:key`），一次性渲染上限要控制；大量纯展示文本用整段 `text` + `\n`，不要拆节点。
5. **样式分工**：**页面**只用原子类（a-hua-unocss），**uni_modules 组件库**内用 BEM 手写 `<style>`（组件隔离引用不到全局原子 class，见 [css-ucss](references/css-ucss.md)）；尺寸只用 `rpx`/`px`/`%`；`vh`/`vw`、`gap`、`max-width: 50%`、`justify-content: start/end` 在 App 端会报错或无效。
6. **需要原生能力就写 UTS 插件**（`uni_modules/*/utssdk`），页面只调插件导出的 API；插件规范见 `.agents/skills/uts-plugin/SKILL.md`。

## 快速定位

| 主题               | 说明                                                                                                                           | 参考                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **项目结构**       | 项目目录组织、文件位置                                                                                                         | [project-structure](references/project-structure.md)                           |
| **生命周期**       | 页面/组件生命周期使用                                                                                                          | [lifecycle](references/lifecycle.md)                                           |
| **页面开发**       | 页面开发完整示例（登录、首页）                                                                                                 | [page-development](references/page-development.md)                             |
| **组件使用**       | hs-screen、hs-card、hs-form、hs-button 等                                                                                      | [component-usage](references/component-usage.md)                               |
| **text标签**       | 文字必须用text标签，字体属性只能在text上设置                                                                                   | [component-usage](references/component-usage.md)                               |
| **布局规范**       | Flex布局、卡片风格                                                                                                             | [component-usage](references/component-usage.md)                               |
| **状态管理**       | Store设计（标准 pinia setup store）、数据解耦                                                                                  | [state-management](references/state-management.md)                             |
| **请求封装**       | API调用、请求封装                                                                                                              | [request](references/request.md)                                               |
| **拦截器**         | 导航拦截、请求拦截                                                                                                             | [interceptors](references/interceptors.md)                                     |
| **工具函数**       | lodash、storage、tool等工具                                                                                                    | [utils](references/utils.md)                                                   |
| **测试**           | 集成测试编写                                                                                                                   | [testing](references/testing.md)                                               |
| **编译运行**       | CLI命令、构建配置                                                                                                              | [build-run](references/build-run.md)                                           |
| **常见问题**       | 编译错误、类型告警等                                                                                                           | [common-issues](references/common-issues.md)                                   |
| **文档资源**       | UniApp X官方文档位置                                                                                                           | [resources](references/resources.md)                                           |
| **App 入口**       | App.uvue 生命周期、globalData                                                                                                  | [core-app](references/core-app.md)                                             |
| **组合式 API**     | ref、reactive、computed、watch；遗留选项式代码改造                                                                             | [vue-composition-api](references/vue-composition-api.md)                       |
| **条件编译**       | #ifdef / #ifndef 平台差异化代码                                                                                                | [uts-conditional](references/uts-conditional.md)                               |
| **函数与模块**     | 函数定义、export/import、try-catch、先定义后调用                                                                               | [uts-function-module](references/uts-function-module.md)                       |
| **UVUE CSS**       | 页面 tailwind 原子类优先（a-hua-unocss）/ 组件库 BEM 手写 style、UCSS 子集、不支持 gap/vh/vw、justify-content 不支持 start/end | [css-ucss](references/css-ucss.md)                                             |
| **页面导航**       | navigateTo、redirectTo、reLaunch                                                                                               | [features-navigation](references/features-navigation.md)                       |
| **DOM 与页面栈**   | getElementById、ref、UniElement、getCurrentPages、draw API                                                                     | [features-dom](references/features-dom.md)                                     |
| **dialogPage**     | 弹窗页、openDialogPage、useDialogPage                                                                                          | [features-dialog-page](references/features-dialog-page.md)                     |
| **数据存储**       | setStorageSync、getStorageSync                                                                                                 | [features-storage](references/features-storage.md)                             |
| **事件与系统信息** | uni.$on/$emit、getSystemInfo                                                                                                   | [features-api-event-system-info](references/features-api-event-system-info.md) |
| **长列表与滚动**   | scroll-view、list-view、吸顶、嵌套滚动                                                                                         | [features-list-scroll](references/features-list-scroll.md)                     |
| **国际化**         | 多语言、lime-i18n、vue-i18n                                                                                                    | [features-i18n](references/features-i18n.md)                                   |
| **主题与暗黑**     | dark mode、theme.json、setAppTheme                                                                                             | [features-theme-dark](references/features-theme-dark.md)                       |
| **性能优化**       | DOM 数量、transform 动画、长列表                                                                                               | [best-practices-performance](references/best-practices-performance.md)         |
| **原生 SDK**       | 混合开发、嵌入原生工程                                                                                                         | [advanced-native-sdk](references/advanced-native-sdk.md)                       |

---

## 参考文件索引

### 基础

- [项目结构](references/project-structure.md) — 目录组织、文件位置
- [App 入口](references/core-app.md) — App.uvue 生命周期、globalData
- [生命周期](references/lifecycle.md) — 页面/组件生命周期、Vue API 导入
- [页面开发](references/page-development.md) — 登录页、首页完整示例
- [组件使用](references/component-usage.md) — 全局注册、布局、表单、Props、hs-button、useAttrs、text标签
- [UVUE CSS](references/css-ucss.md) — 样式编写分工（页面 tailwind 原子类优先、uni_modules 组件库 BEM 手写 style）、UCSS 子集、flex 布局差异、gap 不支持、不支持 vh/vw、样式不继承
- [DOM 与页面栈](references/features-dom.md) — UniElement、getElementById、ref、getCurrentPages/UniPage、draw API

### UTS 语言

- [UTS 语言基础](references/uts-overview.md) — 蒸汽模式下的语言边界、变量与类型、UTSJSONObject 怎么处理、uts2js 的 undefined→null 差异；原「UTS 概述 + UTS 数据类型」两份已合并为这一份
- [条件编译](references/uts-conditional.md) — #ifdef / #ifndef 平台差异化代码（**唯一权威**，其他文件只链接不重复）
- [函数与模块](references/uts-function-module.md) — 函数定义、export/import、try-catch
- [组合式 API](references/vue-composition-api.md) — ref、reactive、computed、watch、watchEffect；含遗留选项式代码改造要点（生命周期改名、defineExpose）

### 页面与路由

- [页面导航](references/features-navigation.md) — navigateTo、redirectTo、reLaunch、switchTab
- [dialogPage 弹窗页](references/features-dialog-page.md) — openDialogPage、与主 page 区别
- [长列表与滚动](references/features-list-scroll.md) — scroll-view、list-view、吸顶、嵌套滚动

### 数据与状态

- [状态管理](references/state-management.md) — 标准 pinia setup store、数据解耦、登录登出路由、全局状态
- [数据存储](references/features-storage.md) — setStorageSync、getStorageSync、对象读写
- [请求封装](references/request.md) — request封装、Store层调用方式、联网模式
- [拦截器](references/interceptors.md) — 导航拦截、请求拦截、注册

### 事件与主题

- [事件与系统信息](references/features-api-event-system-info.md) — uni.$on/$emit、getSystemInfo
- [国际化](references/features-i18n.md) — 多语言、lime-i18n、vue-i18n、uni.getLocale
- [主题与暗黑](references/features-theme-dark.md) — dark mode、theme.json、setAppTheme

### 工具与工程

- [工具函数](references/utils.md) — storage存储、lodash工具、通用工具
- [测试规范](references/testing.md) — 测试环境、文件位置、结构、命令
- [编译与运行](references/build-run.md) — CLI命令、package.json脚本
- [性能优化](references/best-practices-performance.md) — DOM 数量、transform 动画、长列表分批
- [原生 SDK](references/advanced-native-sdk.md) — 混合开发、嵌入原生工程、导出资源

### 参考

- [常见问题](references/common-issues.md) — 老写法禁令、CSS 报错速查、蒸汽模式新增坑、UniElement 桥接
- [文档资源](references/resources.md) — 本地/在线文档、分类速查
