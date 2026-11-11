---
name: best-practices-performance
description: App 端性能优化、DOM 数量、动画用 transform、长列表与分批加载
---

# 性能优化

## DOM 数量与层次

- Android 对 DOM 数量和层次更敏感；避免"每个格子一个 view"的写法，可参考日历示例用 **draw API** 整块绘制。
- 组件作者应控制单组件内节点数；HBuilderX 真机运行时会打印页面 dom 数量、排版次数、渲染耗时。
- 正式打包后性能优于调试基座；耗时数据以正式包为准。

## 动画与跟手

- **固定动画**：用 CSS transition 或 animation-view（Lottie）。
- **跟手动效**：优先用 **transform** 移动元素，不要频繁改 left/top/width/height（会触发排版）；建议通过 **ref/getElementById 拿到元素后调用 DOM API** 直接改样式，跳过 diff，保证 16ms 一帧（元素获取方式统一见 [DOM、元素与页面栈](features-dom.md)）。
- 吸顶等效果可直接监听 scroll 后用 transform 固定 top；list-view 内用 sticky-header 组件。
- 折叠面板等：高度变化建议"高度一次性变、子元素做动画"，避免下方大量元素连续排版导致卡顿。

## 主线程与 onLoad

- 开发者代码**默认在 UI 主线程**运行；onLoad 与进入动画同时发生，onLoad 内不宜大量同步耗时计算。
- **联网、图片加载**在子线程/协程，不会卡 UI；建议在 onLoad 里发起请求，数据回来后更新界面。
- 若 onLoad 仍卡动画，可把部分逻辑挪到 **onReady**。

## 长列表

→ 不重复维护：list-view 的复用硬规则、`scroll-view`/`list-view` 选型、分批渲染等统一见 [长列表与滚动](features-list-scroll.md)。

一句话结论：长列表优先用内置复用的 **list-view / waterflow**，避免数千条数据一次性赋给响应式变量；初始数据量大时做**分批加载**，并配合“闲时加载”（用户滚动/下拉刷新时暂停分批）。

## 关键点

- 静态资源放 **static**、编译源码不可放 static → 规则见 [项目结构](project-structure.md)「静态资源」。
- 安全软件可能扫描 unpackage 下 kt/class 等，可将 unpackage 设为信任以提升编译速度（编译器组成见 [编译与运行](build-run.md)）。
