# uvue CSS（ucss）

## 样式编写方式（项目规范）

### 页面（pages/ 等业务页面）

- **统一使用 tailwind 原子类**书写样式，由 `a-hua-unocss`（`packages/app/js_sdk/a-hua-unocss`，vite 插件）在编译时扫描生成静态 CSS。
- **极个别情况**（原子类无法表达时）才在 `<style>` 标签中手写 CSS，且只写简单 class 选择器。
- 原子类与 scss 同为编译时方案：运行时无额外开销，产出的都是单 class / 分组选择器，天然满足蒸汽模式「仅支持简单 class 与分组选择器」的约束。

### uni_modules 组件库（hs-design 等可复用组件）

- **组件内一律用 BEM 命名手写 `<style>` CSS，不使用 unocss 原子类**。原因见「优先级与样式隔离」：组件默认 `isolated`，**组件样式隔离、引用不到页面编译出的全局原子 class**，写在组件模板上的 `flex / text-28 / bg-[#xxx]` 这类原子类在组件里不生效，必须落到组件自身 `<style>` 声明的 class 上。
- BEM 三段式：`块__元素--修饰符`，块名带项目前缀（`hs-button`、`hs-picker`）。示例：
  - Block：`.hs-button`
  - Element：`.hs-button__label`、`.hs-picker__item`
  - Modifier：`.hs-button--primary`（块级变体，对应 props）、`.hs-picker__itemText--active`（元素状态）
- **只用单 class / 分组选择器**（ucss 约束），不写后代/子代/兄弟等关系选择器；层级关系靠 BEM 命名表达。
- **样式不继承 → 字体类属性必须写在 `<text>` 对应的 class 上**（如 `.hs-picker__itemText`），不能只挂在父 `<view>`。
- 基础类承载公共布局/过渡，修饰符类只做状态切换（如波纹 `.hs-button__ripple--init` ↔ `--on` 配合 transition），不用上下文嵌套选择器切状态。
- 组件仍遵守「不写死尺寸/间距、margin 等布局交给调用方原子类」的约定（见下节）。

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
- 布局：仅支持 **flex** 和**绝对定位**；**样式不继承**。
- 选择器（以官方 `css/common/selector.md` 为准）：
  - 支持：**类选择器 `.a`**、**分组选择器 `.a, .b`**、**`page` 选择器**（App 蒸汽模式也支持）。
  - **不支持：所有关系选择器**——`.a .b`（后代）、`.a > .b`（直接子代）、`.a ~ .b`、`.a + .b`（运行时全部不可用）；层级关系用 BEM 命名（`.a__b`）。
  - **不支持：通配 `*`、ID `#a`、属性 `[attr]`、伪类（`:active`/`:first-child`/`:nth-child()`等）、伪元素（`::before`/`::after`/`::placeholder`等）**；点击态用 `hover-class`，首/末项差异用动态 class，占位符样式用 `placeholder-class`，组件内子元素样式用 external-class。
  - 动态改 class 时，**只有声明中最后一个选择器规则的变更会触发 DOM 更新**（后设生效），多选择器组合的样式动态切换建议改单一 class。

## flex 方向

- 与 W3C 不同，uni-app x **全平台默认 flex-direction 为 column（竖排）**。
- 横排需显式写 `flex-direction: row`；可在 App.uvue 中定义 `.uni-row` / `.uni-column` 全局 class 方便使用。

## flex 间距

- **`gap` 属性不被支持**，flex 子元素间距需改用 `margin` 实现：
  - flex-row（横排）：子项加 `margin-left`，首项不加
  - flex-col（竖排）：子项加 `margin-top`，首项不加
- **不支持兄弟选择器**，不能写 `.a + .a { margin-left }` 实现"除首项外"的间距（写了不报错也不生效）；可用的做法：
  - **统一给子项加 margin，用容器负 margin 抵消首部间距**（如子项 `margin-top: 12px`，容器 `margin-top: -12px`）；
  - **v-for 按下标给动态 class**：`:class="idx == 0 ? 'mt-0' : 'mt-12'"`；
  - 或直接给每个子项写相同的 margin 原子类（首项是否去掉间距视设计而定）。

## 页面级滚动

→ 归滚动主题统一维护，见 [长列表与滚动](features-list-scroll.md)「蒸汽模式页面滚动特性」与「disableScroll / 生命周期平替」（一句话结论：蒸汽模式 App 端页面默认可滚动，VDOM 模式需 scroll-view）。

## 样式不继承

- 文字样式必须写在 **`<text>`** 上，写在父 `<view>` 上不会影响子节点；`<text>` 支持的字体类属性清单与正反例见 [组件使用](component-usage.md)「text 标签规范」。

## 优先级与样式隔离（蒸汽模式：仅策略 2.0）

- **内联 style > class**；`!important` 仅可在 class 里使用。
- **样式隔离策略 2.0**（HBuilderX 5.0+ 全平台统一，蒸汽模式只支持它；不是 vue 的 `scoped`）：
  - 全局样式（App.uvue 引入的 class）影响页面：页面可引用全局 class，同名则合并且**页面 > 全局**；**组件不可引用全局 class**。
  - 页面、组件、父子组件之间**互相隔离**：过去的"App 端页面样式能影响子组件"、"web 需 `:deep()` 穿透"在 2.0 下不再适用。
  - 默认值：**页面 `app`（可被全局影响）、组件 `isolated`（不受外部影响）**；同一 uvue 当组件用时按组件默认 isolated。
  - 需调整时在 `<script setup>` 写：`defineOptions({ styleIsolation: 'isolated' | 'app' | 'app-and-page' })`（`app-and-page` 仅对组件生效：允许全局+页面同名 class 合入，优先级 页面 > 组件 > 全局）。
  - 组件根节点仍支持外部传 class/style（单根组件自动作用到根节点）；组件内部子元素要对外开样式，用 **external-class** 机制（如 `placeholder-class`、自定义的 `thumb-class`），而不是 `:deep()`。
  - 本项目 `manifest.json` 已显式配置 `"styleIsolationVersion": "2"`。

### 写封装组件（hs-design 这类组件库）时的三条约定

- **单根组件的根节点不需要 externalClasses**：官方 `css/common/style-isolation.md`「组件根样式传递依然生效，不受样式隔离策略影响」——页面的原子类直接写在组件标签上就能作用到组件根节点（本项目 `hs-img class="ml-16 h-88 w-160"` 实测生效）。只有组件**内部子元素**要对外开样式才需要 `externalClasses`。
- **组件内不写死尺寸/间距**：`.hs-input { width: 100% }`、`.hs-form { padding: 30rpx }` 这类规则会和使用方传入的 `flex-1` / `px-0 pt-24` 同名打架；更糟的是 `width: 100%` 在 `flex-direction: row` 容器里会占满整行、把兄弟节点（如验证码图片）顶出屏幕。组件只留不可覆盖的品牌样式（颜色、字号、圆角），尺寸交给外部；要组件自己在 flex 行里撑满就写 `flex: 1; min-width: 0;`。
- **不依赖隐式 attribute 继承**：`inheritAttrs` 默认 true 确实会把 `type`/`placeholder`/`:maxlength`/`password`/`mode`/`@confirm`/`@tap` 透到单根节点，但组件库统一走 `defineOptions({ inheritAttrs: false })` + `v-bind="attrs"`（`hs-button`/`hs-input`/`hs-img`/`hs-card` 已全部拉齐），这样以后中间多包一层 view 时不会静默失效。`useAttrs()` 的用法限制见 [组件使用](component-usage.md)「useAttrs 安全使用规范」。
  - 已实测（web/VDOM 与 App/蒸汽两条链路）：透传的 class/style 落在组件**根节点**上，蒸汽模式下就是真 `input`/`image`，web 下落在外层自定义元素 `<uni-input>` / `<uni-image>` 上（真 `input`、内部 `<img>` 是其子节点）——写测试选择器时要按这层结构兜，见 [测试规范](testing.md)。

## 拍平（flatten）- 蒸汽模式新增

- 仅 **view、text、image** 支持（Android 5.21+/iOS 5.11+/鸿蒙 5.0+），为初始化属性，**不可动态修改**；自定义组件单根节点是此三者时会自动支持并透传。
- 拍平即不创建独立元素而绘制在父上（审查元素看不到红框），性能更高，但代价：
  - 不支持事件（click/touch）、不支持 `takeSnapshot`；
  - 不支持 `z-index`、`background-image`/`background-clip`、`pointer-events`；`box-shadow` 不支持 inset/spreadRadius；`display: fixed`、`transition` 背景色等存在缺陷；
  - **text 拍平后 `selectable`/`user-select` 失效**（需 selectable 选中的代码展示、可复制文本不要拍平）；
  - view 有子元素时 `transform`/`overflow`/`display`/`opacity` 对非拍平子元素无效；`hover-*` 属性无效；image 拍平后 gif/webp 仅显示首帧。
- 鸿蒙平台拍平需满足额外条件才真正生效，拍平前后建议真机对比。

## 层级

- App 仅对**同层兄弟节点**支持 **z-index** 调节层级。

## 不支持的 CSS 单位与值

- **`vh` / `vw` 单位不支持**：`height` 等属性不接受 `vh` / `vw` 值（仅支持 `number`、`pixel`、`percent`、`auto`）。用 `100%` 或具体 rpx 值替代。
- **`max-width` 不支持百分比**：`max-width` 仅接受 `number`、`pixel`，不接受 `%`。用具体 rpx 值替代，如 `max-width: 500rpx`。
- **`justify-content` 不支持 `start`/`end` 值**：仅支持 `center`、`flex-start`、`flex-end`、`space-between`、`space-around`、`space-evenly`。
