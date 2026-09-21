# uvue CSS（ucss）

## 样式编写方式（项目规范）

- **统一使用 tailwind 原子类**书写样式，由 `a-hua-unocss`（`packages/app/js_sdk/a-hua-unocss`，vite 插件）在编译时扫描生成静态 CSS。
- **极个别情况**（原子类无法表达时）才在 `<style>` 标签中手写 CSS，且只写简单 class 选择器。
- 原子类与 scss 同为编译时方案：运行时无额外开销，产出的都是单 class / 分组选择器，天然满足蒸汽模式「仅支持简单 class 与分组选择器」的约束。

### 常用写法速查

| 类别     | 示例                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| 布局     | `flex` `flex-row` `flex-col` `items-center` `justify-between` `flex-1`                   |
| 间距     | `p-20` `px-24` `py-16` `mt-12`（数字默认为 rpx）                                         |
| 字号字重 | `text-28`（字号）`fw-700`（字重）`tracking-2`（字距）                                    |
| 颜色     | 主题色 `text-main-500` `bg-gray-50` `text-warn-650`；任意值 `text-[#333]` `bg-[#f5f5f5]` |
| 圆角尺寸 | `rd-12` `rd-full` `w-full` `h-88` `max-full`                                             |

主题色板定义在 `packages/app/vite.config.js` 的 `colors`（main / mainGray / gray / warn / success / error 全色阶）。

## 能力范围

- **App 端**：实现的是 Web CSS 的**子集**（常称 ucss）；编译到 Web/小程序时可使用完整 CSS。
- 布局：仅支持 **flex** 和**绝对定位**；选择器仅支持**简单 class 与分组选择器**，不支持 tag、#id、[attr] 等，运行时复杂关系选择器（`.a .b`）不可用，改用 BEM（`.a__b`）；**样式不继承**。

## flex 方向

- 与 W3C 不同，uni-app x **全平台默认 flex-direction 为 column（竖排）**。
- 横排需显式写 `flex-direction: row`；可在 App.uvue 中定义 `.uni-row` / `.uni-column` 全局 class 方便使用。

## flex 间距

- **`gap` 属性不被支持**，flex 子元素间距需改用 `margin` 实现：
  - flex-row（横排）：子项加 `margin-left`，首项不加
  - flex-col（竖排）：子项加 `margin-top`，首项不加

## 页面级滚动

- **App 端**：页面本身不滚动，需在需要滚动的区域使用 **scroll-view**（或 list-view）。
- 若根节点是 scroll-view，则 onPageScroll、onReachBottom 等在 App 端生效。

## 样式不继承

- 文字样式必须写在 **`<text>`** 上，写在父 `<view>` 上不会影响子节点。

## 优先级

- **内联 style > class**；`!important` 仅可在 class 里使用。
- App/小程序：页面样式可作用到当前页及子组件。
- Web：样式隔离，需影响子组件时用 **:deep()** / **::v-deep**。

## 层级

- App 仅对**同层兄弟节点**支持 **z-index** 调节层级。

## 不支持的 CSS 单位与值

- **`vh` / `vw` 单位不支持**：`height` 等属性不接受 `vh` / `vw` 值（仅支持 `number`、`pixel`、`percent`、`auto`）。用 `100%` 或具体 rpx 值替代。
- **`max-width` 不支持百分比**：`max-width` 仅接受 `number`、`pixel`，不接受 `%`。用具体 rpx 值替代，如 `max-width: 500rpx`。
- **`justify-content` 不支持 `start`/`end` 值**：仅支持 `center`、`flex-start`、`flex-end`、`space-between`、`space-around`、`space-evenly`。
