---
name: features-list-scroll
description: 长列表 scroll-view、list-view、吸顶、嵌套滚动、sticky-header、页面滚动
---

# 长列表与滚动

## 蒸汽模式页面滚动特性

**蒸汽模式下，App 平台的页面默认可滚动**，与 Web 和小程序保持一致（需 HBuilder 5.12+）。

| 模式         | 页面默认滚动      | 需要 scroll-view 包裹 |
| ------------ | ----------------- | --------------------- |
| VDOM 模式    | ❌ 不可滚动       | ✅ 必须显式包裹       |
| **蒸汽模式** | ✅ **默认可滚动** | ❌ **不需要**         |

### 禁用页面滚动

如果页面内部有自己的滚动容器（如 scroll-view、list-view），需要在 `pages.json` 中禁用页面滚动，避免嵌套滚动冲突：

```json
{
  "path": "chat/index",
  "style": {
    "navigationBarTitleText": "IM 聊天",
    "disableScroll": true
  }
}
```

**推荐禁用页面滚动的场景**：

- 页面根组件是 scroll-view、list-view、waterflow 等滚动容器
- 使用了自定义导航栏、自定义 tabbar

### hs-screen 组件

`hs-screen` 是“顶部固定导航栏 + 内容区”的全屏布局容器，根节点与内容区都用 `flex-1` 把高度锁定为一屏。注意：**这种锁定高度的布局下，内容超长时不会撑出页面，Web 端页面默认滚动不会触发（内容被定高容器裁住）**，因此内容区默认用 scroll-view 做内部滚动：

```vue
<!-- 默认：内容区 scroll-view 内部滚动（蒸汽模式纵向滚动默认开启，不要写 scroll-y） -->
<hs-screen title="页面标题">
  <view>内容区域</view>
</hs-screen>

<!-- 页面自带滚动容器（如消息列表）：传 :scroll="false" 回退为 view，避免双层 scroll-view 嵌套 -->
<hs-screen title2="IM 聊天" :scroll="false">
  <scroll-view class="flex-1">…</scroll-view>
</hs-screen>

<!-- 需要滚动监听/下拉刷新：直接在 hs-screen 上监听，事件由内容区 scroll-view 透传 -->
<hs-screen
  title="列表页"
  refresher-enabled
  :refresher-triggered="triggered"
  @scrolltolower="loadMore"
  @scroll="onScroll"
  @refresherrefresh="onRefresh"
>
  <view>内容区域</view>
</hs-screen>
```

**项目默认约定**：页面统一使用 hs-screen 内部滚动模式，`pages.json` 的 `globalStyle` 已配置 `disableScroll: true`（配合全局 `navigationStyle: "custom"`）；个别需要页面级滚动的页面在自身 style 中覆盖 `disableScroll: false`。hs-screen 转发能力：props `refresherEnabled`/`refresherTriggered`，事件 `scroll`/`scrolltolower`/`scrolltoupper`/`refresherrefresh`；开启 `refresher-enabled` 后自带自定义下拉提示“正在加载中”（slot="refresher" + refresher-default-style="none"，官方要求自定义元素必须设宽高且不能放首个子节点）；滚动定位（scroll-top/scroll-into-view）需页面自带内部 scroll-view 时用 `:scroll="false"` 方案自行实现。

> “页面默认可滚动、无需 scroll-view”只适用于内容自然流动、不设全屏定高锁定的页面；自定义导航栏 + flex 撑满一屏的布局应使用内部滚动容器，并配合 pages.json 的 `disableScroll: true`。

## scroll-view 与 list-view

- **scroll-view**：灵活，无内置复用机制，适合普通滚动、自定义下拉刷新；可做**嵌套滚动**。
- **list-view**：基于 recycle-view，**长列表推荐**，可复用节点保证性能；子节点为 **list-item**，支持 **sticky-header** / **sticky-section** 吸顶。
- 微信小程序下 list-view 目前编译为 scroll-view。

## 吸顶

1. **监听滚动 + transform**：在 scroll-view 的 @scroll 中根据滚动位置，对某个 view 设置 transform/position，使其固定在顶部；适合 scroll-view。
2. **sticky-header**：在 **list-view** 内使用 **sticky-header** 作为一级子组件，内容滚动到列表顶部时固定；配合 **sticky-section** 可做分段吸顶（如通讯录字母、多店铺购物车）。
3. **嵌套滚动**：父 scroll-view 设为嵌套模式，子滚动到一定条件后父不再滚动，视觉上类似吸顶。

## 嵌套滚动（scroll-view）

- 外层 **scroll-view** 设置 **type="nested"**，子节点仅能为 **nested-scroll-header** 和 **nested-scroll-body**（各一个子节点）；内层 **scroll-view** 或 **list-view** 设置 **associative-container="nested-scroll-view"**。
- 策略：向下滑先滚外层再内层；向上滑先滚内层再外层。适合"顶部区域 + 下方列表"的复杂布局。

## 下拉刷新

- scroll-view / list-view 均支持 **refresher-enabled**、**refresher-triggered** 及 refresherpulling/refresherrefresh 等事件；可设置 **refresher-default-style="none"** 后用 **slot="refresher"** 自定义下拉样式。

## 关键点

- 长列表优先用 **list-view**；吸顶在 list-view 中用 **sticky-header**；需要“顶部固定 + 下面可滚”的复杂联动用 **嵌套 scroll-view**。

## disableScroll / 内部滚动后的生命周期平替

页面不可滚动时（配置了 `disableScroll: true`，或内容被 flex 定高锁住从未撑出页面），`onPageScroll`、`onReachBottom`、`uni.pageScrollTo()` 均不会触发/不可用（官方 page.md 明确）。改用 scroll-view 自身能力：

| 页面级（失效）                                | scroll-view 替代                                                                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onPageScroll`                                | `@scroll` 事件                                                                                                                                    |
| `onReachBottom`                               | `@scrolltolower`（可配 `lower-threshold`）                                                                                                        |
| `uni.pageScrollTo()`                          | `scroll-top` 属性 / `scroll-into-view` 锚点                                                                                                       |
| `enablePullDownRefresh` + `onPullDownRefresh` | `refresher-enabled` + `@refresherrefresh`（蒸汽模式无页面下拉刷新，官方要求用 scroll-view api；注意 `disableScroll: true` 时 App 端不能下拉刷新） |

参考实现：`page_im/chat/index.uvue` 用 `@scrolltolower` 加载历史、`:scroll-into-view` 锚定底部。
