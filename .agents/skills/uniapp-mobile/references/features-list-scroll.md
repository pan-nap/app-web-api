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

`hs-screen` 是页面布局容器，蒸汽模式下**不再使用 scroll-view 包裹**，直接用 view 即可：

```vue
<!-- 蒸汽模式：页面默认可滚动，无需 scroll-view -->
<hs-screen title="页面标题">
  <view class="flex-1">
    <!-- 内容区域 -->
  </view>
</hs-screen>
```

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

- 长列表优先用 **list-view**；吸顶在 list-view 中用 **sticky-header**；需要"顶部固定 + 下面可滚"的复杂联动用 **嵌套 scroll-view**。
