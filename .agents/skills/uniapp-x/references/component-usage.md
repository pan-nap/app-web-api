---
name: component-usage
description: hs-screen、hs-card、hs-form、hs-button 等组件使用规范
---

# 组件使用规范

## uni-app x 组件分类

| 分类               | 说明                                        | 使用方式                    |
| ------------------ | ------------------------------------------- | --------------------------- |
| **内置组件**       | view、text、button、scroll-view、input 等   | 直接写标签，无需引用和注册  |
| **ext 组件**       | 文档在官方但未内置到引擎的组件              | 需下载到项目                |
| **前端 uvue 组件** | 按 Vue 规范写的 .uvue 文件                  | 通过 easycom 或 import 使用 |
| **uts 原生组件**   | App 端专用，由原生开发者按 uts 组件规范编写 | 安装后直接写标签            |

### 组件名与属性

- 组件名、属性名均**小写**，单词间用连字符 `-`。
- 组件有属性、事件、vue 指令（v-if、v-for、:prop 等）。

## 全局组件自动注册（easycom）

UniApp 自动扫描并注册全局组件，只需满足：

```
components/
├── hs-screen/
│   └── hs-screen.uvue    # 组件名: hs-screen
```

**目录名和文件名必须一致**，使用时**无需 import**：

```vue
<template>
  <hs-screen>
    <hs-card title="标题">
      <hs-form
        :model="formData"
        :rules="formRules"
      >
        <hs-form-item
          label="账号"
          prop="username"
        >
          <hs-input v-model="formData.username" />
        </hs-form-item>
      </hs-form>
    </hs-card>
  </hs-screen>
</template>
```

## 布局规范

### Flex布局

→ 默认方向、gap 不支持等规则只在 [UVUE CSS](css-ucss.md)「flex 方向」「flex 间距」维护；本文只给项目原子类写法：

```vue
<!-- 默认竖排 -->
<view class="flex flex-col">
  <view>元素1</view>
  <view>元素2</view>
</view>

<!-- 横排需显式添加 flex-row -->
<view class="flex flex-row">
  <view>元素1</view>
  <view>元素2</view>
</view>
```

### 卡片风格

界面以卡片风格为主，使用 `hs-card` 组件包裹内容：

```vue
<hs-card class="index-card">
  <text class="text-lg font-bold">学生信息查询</text>
  <!-- 卡片内容 -->
</hs-card>
```

### 图片：hs-img

```vue
<hs-img class="ml-16 h-88 w-160" :src="codeImg" mode="aspectFit" @error="codeImg = ''" />
```

- `mode` **没声明成 prop**，靠组件内 `defineOptions({ inheritAttrs: false })` + `v-bind="attrs"` 显式透传（`image` 的 `mode` 默认是 `scaleToFill`，丢了就会拉伸）。
- 组件内部故意拷了一份 `imgSrc = ref(props.src)`：官方 `component/image.md` Tips 要求「在 error 事件里重新设置 image 组件的 src，可实现自定义错误图」，而组件不能直改 `props.src`，所以**模板绑的是 `imgSrc`**。不要把这份镜像当冗余删掉，也不要改回 `:src="props.src"`（那样 `onError` 里的重置会静默失效）。
- `error` 已在 `defineEmits` 里声明，父页面的 `@error` 只会被 `emit` 触发一次（不会和透传双触发）；`@load` 未声明，原样透给内部 `image`。
- ⚠️ 占位/错误图文件必须放在 `static/`（项目根或 uni_modules 下）或 `import` 导入，否则不会 copy 进包（官方 Tips）。
- ℹ️ 置空不会死循环：`imgSrc.value = ''` 重复赋同值不触发渲染，最多重试一次就自锁，不需要另写防重入 flag。

## 表单组件使用

表单校验规则使用标准对象字面量（蒸汽模式直接写 js/ts 语法，无需 UTSJSONObject）：

```typescript
import type { FormRule, FormRules } from "@/uni_modules/hs-design/types/form.uts";

const fieldRules: FormRule[] = [
  { required: true, message: "必填提示" },
  { pattern: /^[\s\S]{6,20}$/, message: "格式错误" }
];
// FormRules = Record<string, FormRule[]>
const formRules: FormRules = {
  fieldName: fieldRules
};
```

## ref 类型规范

> 本节是 ref 类型的**唯一维护处**；[组合式 API](vue-composition-api.md) 与 [DOM、元素与页面栈](features-dom.md) 只链接不重复。

### 内置组件 ref 类型

| 组件                     | ref 类型                                                  |
| ------------------------ | --------------------------------------------------------- |
| view、text、普通 DOM     | `ref<UniElement \| null>(null)`                           |
| scroll-view              | `ref<UniScrollViewElement \| null>(null)`                 |
| slider                   | `ref<UniSliderElement \| null>(null)`                     |
| video                    | `ref<UniVideoElement \| null>(null)`                      |
| 自定义组件（easycom）    | `ref<组件名驼峰 + ComponentPublicInstance \| null>(null)` |
| 自定义组件（非 easycom） | `ref<ComponentPublicInstance \| null>(null)`              |

### 调用子组件方法

- 直接用 `xxx.value.方法名()`；子组件必须 **`defineExpose`** 显式暴露方法或数据，父组件才能通过 ref 调用。easycom 组件可把 ref 断成「组件名驼峰 + ComponentPublicInstance」后调用。
- ❌ 禁句：`this.$refs.xxx`、`$callMethod(...)` —— 蒸汽模式没有 `this`。

## Props定义规范

必须使用 `type` 字段定义，不支持内联类型：

```typescript
// ✅ 正确
type Props = {
  title?: string;
};
defineProps<Props>();

// ✅ 带默认值
withDefaults(defineProps<Props>(), {
  title: "默认标题"
});

// ❌ 错误 - Android 不支持
defineProps<{ title?: string }>();
```

## hs-button 组件规范

`hs-button` 内置 **loading 状态管理**，页面无需声明 loading 变量。

**使用方式**：

通过 `@tap` 传递异步回调（全平台兼容）：

```vue
<hs-button type="primary" @tap="handleLogin">立即登录</hs-button>
```

页面 `@tap` 回调需返回 `Promise`（`async` 函数），组件内部会自动：

1. 点击后设置 loading（按钮 disabled + 视觉反馈）
2. 等待异步操作完成
3. 完成后自动清除 loading

**组件核心逻辑**（`hs-button.uvue`）：

```vue
<template>
  <button
    class="hs-button"
    v-bind="attrs"
    :loading="loading"
    @tap="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  onClick?: () => Promise<void>
}>(), {})

const attrs = useAttrs()
const loading = ref(false)

async function handleClick() {
  if (loading.value) return
  loading.value = true
  try {
    if (props.onClick != null) {
      await props.onClick()
    }
  } finally {
    loading.value = false
  }
}
</script>
```

> 组件通过 `defineProps` 声明 `onClick` prop，父页面的 `@tap="handler"` 经 Vue 归一化为 `onClick` 后直接传入 prop，不经过 attrs/事件包装，因此 `async/await` 可正确工作。

## useAttrs 安全使用规范

`useAttrs()` 在蒸汽模式（js 驱动）下返回接近普通对象（`utssdk/` 插件里是 `Map<String, Any?>`，见 uts-plugin skill）。**不要写 `attrs as UTSJSONObject`，也不要解构**；接入前先 `console.log(attrs)` 确认当前端实际类型。

**禁止操作**：

- ❌ `attrs as UTSJSONObject` — 触发 `ClassCastException`
- ❌ 解构 `const { onClick, ...rest } = attrs` — 编译错误

**安全访问方式**：

- 模板中通过 `v-bind="bindAttrs"` 绑定过滤后的非事件属性
- 脚本中通过 `attrs['onClick']` 下标语法获取父级事件

**过滤非事件属性（本项目写法）**：蒸汽模式各平台逻辑层都是 js，统一用 `Object.entries`，不需要再为 Android 写条件编译：

```typescript
const bindAttrs = {};
for (const [key, value] of Object.entries(attrs)) {
  if (key != "onClick") {
    bindAttrs[key] = value;
  }
}
```

> 在 `utssdk/` 插件里 attrs 是 `Map<String, Any?>`，才需要 `attrs.entries` 遍历（插件写法见 uts-plugin skill）。

## 指令使用规范

| 指令                          | 说明                                     |
| ----------------------------- | ---------------------------------------- |
| **v-if / v-else / v-else-if** | 条件渲染；为假时元素不渲染               |
| **v-show**                    | 切换 display 可见性，元素始终存在        |
| **v-for**                     | 列表渲染；需写 **key**（建议唯一 id）    |
| **v-model**                   | 双向绑定，用于 input、textarea、组件等   |
| **v-model:visible**           | 组件显隐状态双向绑定（如 hs-dialog）     |
| **:prop / v-bind**            | 动态绑定属性                             |
| **@event / v-on**             | 绑定事件                                 |
| **v-text**                    | 设置元素文本，覆盖原有内容               |
| **v-html**                    | 设置 HTML；Android 上通过 rich-text 实现 |

### 注意

- **v-for** 与 **v-if** 同时用时，v-for 优先级更高。
- **v-html** 在 Android 上有限制，富文本复杂时建议用 **rich-text** 组件。
- 列表项务必提供稳定 **key**，避免用 index 导致复用错乱。

## text 标签规范

UniApp X 中文字必须使用 `<text>` 标签包裹，字体属性（大小、颜色、粗细等）**只能**在 `<text>` 标签上设置，其他标签（如 `<view>`）不支持这些属性。

**使用方式**：

```vue
<!-- ✅ 正确：文字用 <text> 标签，字体属性写在 <text> 上 -->
<text class="text-22 text-mainGray-950 fw-700">HS CASHIER</text>
<text class="text-56 fw-700 text-mainGray-500">欢迎回来</text>

<!-- ❌ 错误：在 <view> 上设置字体属性 -->
<view class="text-22 text-mainGray-950">内容</view>

<!-- ❌ 错误：文字裸露在 <view> 内 -->
<view class="flex flex-row">纯文字内容</view>
```

**可用属性**（仅 `<text>` 支持）：

| 属性              | 说明     | 示例 class                               |
| ----------------- | -------- | ---------------------------------------- |
| `font-size`       | 字体大小 | `text-22`、`text-56`                     |
| `color`           | 字体颜色 | `text-mainGray-500`、`text-mainGray-950` |
| `font-weight`     | 字体粗细 | `fw-700`、`fw-bold`                      |
| `line-height`     | 行高     | `leading-36`                             |
| `text-align`      | 对齐方式 | `text-center`、`text-left`、`text-right` |
| `letter-spacing`  | 字间距   | `tracking-2`                             |
| `text-decoration` | 文字装饰 | `underline`、`line-through`              |

> 注意：`<view>` 只支持布局类属性（flex、padding、margin、width、height 等），字体类属性不生效。

## hs-dialog 弹窗组件规范

`hs-dialog` 是基于 `page-container` 封装的弹窗组件，支持 el-popover 风格的使用方式。

> 插槽约定：传入 `#content` 插槽即启用**触发模式**，此时默认插槽作为触发元素；不传 `#content` 时保持经典用法，默认插槽即弹窗内容。

### 遮罩与点击关闭行为（page-container 的硬限制）

- `page-container` **没有** `close-on-click-overlay` 属性（官方属性表只有 show / duration / z-index / overlay / round / position / close-on-slide-down / overlay-style / custom-style），**“点遮罩就关”是它的内置行为**。
- 所以 `hs-dialog` 的 `closeOnClickOverlay=false` **不能**靠在 `@clickoverlay` 里判开关来实现：遮罩已经自己关了，紧接着 `@afterleave` 会把 v-model 置 false。官方唯一开关见 `component/page-container.md` Tips：**`overlay-style` 设 `pointer-events: none`**（hs-dialog 内部已按此实现，见 `mergedOverlayStyle`）。给封装组件加“开关型” prop 前，先确认底层组件有没有对应的原生能力。
- ⚠️ 代价：`pointer-events: none` 后遮罩不吃事件，点它会**穿透到下层页面**（官方 demo 就叫“蒙层穿透”）。弹窗下方被盖住的按钮仍可能被误触，“必须显式点按钮才能关”的场景要额外考虑下层危险操作（如退出登录）。
- `pointer-events` 兼容性 Android 3.9 / iOS 4.11 / 鸿蒙 4.61+；但**被 `flatten` 拍平的元素不支持**。

### 方式一：触发插槽（el-popover 风格，推荐）

点击默认插槽内的触发元素自动打开弹窗，无需外部状态变量：

```vue
<hs-dialog ref="dialogRef" position="center" :close-on-click-overlay="true">
  <!-- 默认插槽 = 触发元素 -->
  <hs-card><text>点击打开弹窗</text></hs-card>
  <!-- #content 插槽 = 弹窗内容 -->
  <template #content>
    <view class="flex flex-col bg-white w-[70%] rd-24 p-36">
      <text>弹窗内容</text>
      <button @tap="dialogRef?.hide()">关闭</button>
    </view>
  </template>
</hs-dialog>
```

### 方式二：v-model

组件导出的是 `modelValue`，所以写 `v-model`（不是 `v-model:visible`）：

```vue
<hs-dialog v-model="dialogVisible" position="center">
  <view class="flex flex-col bg-white w-[70%] rd-24 p-36">
    <text>弹窗内容</text>
    <button @tap="dialogVisible = false">关闭</button>
  </view>
</hs-dialog>

<button @tap="dialogVisible = true">打开弹窗</button>
```

### 方式三：ref.show()/hide()

```vue
<hs-dialog ref="dialogRef" position="center">
  <view>弹窗内容</view>
</hs-dialog>

<button @tap="dialogRef?.show()">打开</button>
<button @tap="dialogRef?.hide()">关闭</button>
```

### API

| 方法              | 说明                                                                   |
| ----------------- | ---------------------------------------------------------------------- |
| 默认插槽          | 触发模式（传 `#content` 时）下为触发元素，点击打开弹窗；否则为弹窗内容 |
| `#content` 插槽   | 触发模式下的弹窗内容                                                   |
| `v-model:visible` | 双向绑定显隐状态                                                       |
| `open(config?)`   | 命令式打开（可覆盖 position）                                          |
| `close()`         | 命令式关闭                                                             |
| `show(config?)`   | open() 别名                                                            |
| `hide()`          | close() 别名                                                           |

### Props

| 属性                  | 类型    | 默认值   | 说明                                   |
| --------------------- | ------- | -------- | -------------------------------------- |
| `visible`             | boolean | false    | v-model:visible 双向绑定               |
| `position`            | string  | 'bottom' | 弹出位置：top/bottom/left/right/center |
| `round`               | boolean | false    | 是否显示圆角                           |
| `overlay`             | boolean | true     | 是否显示遮罩                           |
| `closeOnClickOverlay` | boolean | false    | 点击遮罩是否关闭                       |
| `duration`            | number  | 300      | 动画时长（ms）                         |
