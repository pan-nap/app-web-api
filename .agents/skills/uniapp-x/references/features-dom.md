---
name: features-dom
description: UVUE DOM、UniElement、getElementById、ref、页面栈（getCurrentPages / UniPage）与 draw API
---

# DOM、元素与页面栈

> 本文件是「元素获取 + 页面栈」的唯一维护处；ref 的具体类型表（内置组件 / 自定义组件）只在 [组件使用](component-usage.md)「ref 类型规范」写一份，此处不重复。

## DOM 概念

- 每个 uvue 页面在内存中有 **DOM**，与浏览器 DOM 类似；节点对应 **UniElement**。
- 为减少与 Vue 的冲突，**不支持**通过 DOM API **创建/删除**节点，仅支持**获取**元素并操作其属性/样式或调用方法。
- **蒸汽模式**：页面（.uvue）里只能操作 `UniElement`，**不能**直接用 `UTSAndroid` / `getAndroidView` 等原生 API，需挪进 `utssdk/` 插件（桥接写法见 [常见问题](common-issues.md)「UniElement 桥接原生视图」）。

## 使用场景

1. **跟手动效**：在 touch、scroll 中需 16ms 一帧时，用 **ref 或 getElementById** 拿到 UniElement，直接调 DOM API 改样式（如 transform），跳过 diff。性能角度的取舍见 [性能优化](best-practices-performance.md)。
2. **Draw API**：Android/iOS 的底层绘制能力需先拿到 UniElement，再调用其上的 draw 相关方法。

## 获取元素

- ❌ 禁句：`document.getElementById(...)`。`document` 只在编译到 web 时存在，App（Android/iOS/鸿蒙）页面里没有这个全局（蒸汽模式逻辑层虽是 js，但注入的是 uni-app x 自己的 DOM 实现，不是浏览器 DOM），取元素只用下面三种方式。
- **uni.getElementById(id)**：仅能获取**栈顶主页面**内带 id 的元素。
- 非栈顶页或 dialogPage 内的元素：必须在**该页面自己的 UniPage** 上调用 `getElementById`（取法见下节「当前页面对象」）；`uni.getElementById` 只认主页面栈顶。
- **ref**：模板写 `ref="xxx"`，script 中声明对应类型（`UniElement`、`UniXxxElement`、`ComponentPublicInstance`），通过 `xxx.value` 访问；类型对照表见 [组件使用](component-usage.md)「ref 类型规范」。
- 建议在 **onReady** 之后使用，确保节点已创建（`onLoad` 时 DOM 未就绪，见 [生命周期](lifecycle.md)「生命周期顺序」）。
- 读写样式、部分属性；调用元素/组件上的方法（如 video 的 play）；draw API 等，详见官方 [UniElement](https://doc.dcloud.net.cn/uni-app-x/api/dom/unielement.html) 与各组件文档。
- 量尺寸用的 `getBoundingClientRect()` 在**蒸汽模式**下要 **5.23+**（VDOM 是 Android 4.0 / iOS 4.11 / 鸿蒙 4.61）；低版本或需要异步量自定义组件内节点时用 `getBoundingClientRectAsync()`。

## 页面栈与当前页面

### getCurrentPages()

- 返回**主页面栈**的 **UniPage 数组**。
- **不包含** dialogPage；要获取某主页上的 dialogPage 列表，需先取到该主页面 UniPage，再调用 **getDialogPages()**。

### 当前页面对象

- **`getCurrentInstance()?.proxy?.$page`** 为当前页 UniPage（主页面或 dialogPage 均可）。
- 拿到 UniPage 后即可调用 `getElementById`、`getDialogPages`、`setPageStyle` 等。

### UniPage 能力

- 获取/设置 **pageStyle**（如导航栏、背景色）。
- **getElementById** / **getElement**：获取该页面内元素。
- **getDialogPages()**：获取该主页面上的 dialogPage 列表。
- 高宽、安全区等，见官方 [unipage](https://doc.dcloud.net.cn/uni-app-x/api/unipage.html) 文档。

## 绘制：不必再绕 Drawable

官方现状：蒸汽模式的 Element API 中 **Drawable 仍标为缺失（TODO）**，因为 dom2 的 `view`、`text` 创建已经足够快且支持 `flatten` 拍平，优先级不高。

- 写法人选：线条/文字等高频绘制**直接用 `view` + `text`（必要时加 `flatten`）跨平台写**，不再像早期那样为了性能绕开组件去用 Drawable 绘制（那种写法不跨端且复杂）。参考：hello uni-app x 的日历示例已从 Drawable 绘制改为拍平的 `text` 组件。
- `flatten` 的代价（不支持事件、`takeSnapshot`，text 的 `selectable`/`user-select` 失效）只在 [UVUE CSS](css-ucss.md)「拍平」维护一份。
- 确实需要原生绘制时，作为 `utssdk/` 插件实现，页面只传 `UniElement`（见 [常见问题](common-issues.md)「UniElement 桥接原生视图」）。

## 关键点

- 跟手、高频更新场景优先 **transform + DOM API**；普通数据驱动仍用 Vue 绑定。
- 需要"当前页"时优先用 **`getCurrentInstance()?.proxy?.$page`**，避免自己维护页面引用。
- 跨页面操作元素时注意"当前页"是主页面还是 dialogPage，选用 `uni.getElementById` 或 `$page.getElementById`。
- 不要通过 DOM 增删节点，以免与 Vue 管理的树不一致。
