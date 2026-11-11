# App.uvue 应用入口

## 作用

`App.uvue` 是应用入口主组件，所有页面在其下切换。**没有 `<template>`**，不能写视图，仅用于：

1. 监听**应用生命周期**
2. 配置 **globalData** 全局变量
3. 编写全局可用的 **method**
4. 配置**全局样式**

应用生命周期**仅能在 App.uvue 中监听**，在页面中监听无效。

## 写法

- **HBuilderX 5.0+ 支持组合式**；**蒸汽模式（本项目）只能用组合式 `<script setup>`**，选项式与 mixin 均不被支持。
- 生命周期写法与命名以本文为准（下表）；组合式 API 本身见 [组合式 API](vue-composition-api.md)。

```vue
<script setup>
// 本项目 App.uvue：只做应用级初始化，不写视图
onLaunch(() => {
  console.log("App Launch");
});
onAppShow(() => {});
onAppHide(() => {});
</script>
```

- 需在启动时初始化全局状态（登录态、监听回调等），在 `onLaunch` 里 import 并调用对应 store；store 写法见 [状态管理](state-management.md)。

## 应用生命周期

> 应用生命周期**与页面生命周期不同名**：用 `onAppShow`/`onAppHide`（避免与页面 `onPageShow` 混淆）。

| 生命周期                | 说明                                                 |
| ----------------------- | ---------------------------------------------------- |
| **onLaunch**            | 应用首次启动；可通过 scheme/applink 等获取启动参数。 |
| **onAppShow**           | 应用从后台切到前台；scheme/applink 激活时也会触发。  |
| **onAppHide**           | 应用切到后台。                                       |
| **onExit**              | 应用即将退出。                                       |
| **onError**             | 脚本报错时触发。                                     |
| **onLastPageBackPress** | 最后一页按返回键时触发（Android/鸿蒙）。             |

## globalData

在 `App.uvue` 的 `globalData` 中定义的数据，可在任意页面通过 `getApp().globalData` 读写。修改后界面不会自动更新。

- 没有 `this.globalData`，只能通过 `getApp().globalData` 读取，且部分生命周期回调时 App 实例可能尚未初始化，要注意时机。
- **蒸汽模式坑**：Android/iOS 的 **uts 插件环境不支持 `globalData`**（鸿蒙仅页面 script 为 ArkTS 驱动时可用）；需跨页面与插件共享的数据用 pinia store 或插件自有存储。

## 注意

- 最早在 **onLaunch** 里做初始化、拉取配置、打开 dialogPage 等。
- **不要在 main.uts 中**调用 openDialogPage 等依赖页面的 API。
