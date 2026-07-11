---
name: component-usage
description: hs-screen、hs-card、hs-form、hs-button 等组件使用规范
---

# 组件使用规范

## uni-app x 组件分类

| 分类 | 说明 | 使用方式 |
|------|------|----------|
| **内置组件** | view、text、button、scroll-view、input 等 | 直接写标签，无需引用和注册 |
| **ext 组件** | 文档在官方但未内置到引擎的组件 | 需下载到项目 |
| **前端 uvue 组件** | 按 Vue 规范写的 .uvue 文件 | 通过 easycom 或 import 使用 |
| **uts 原生组件** | App 端专用，由原生开发者按 uts 组件规范编写 | 安装后直接写标签 |

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
      <hs-form :model="formData" :rules="formRules">
        <hs-form-item label="账号" prop="username">
          <hs-input v-model="formData.username" />
        </hs-form-item>
      </hs-form>
    </hs-card>
  </hs-screen>
</template>
```

## 布局规范

### Flex布局

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

## 表单组件使用

表单校验规则通过 `UTSJSONObject` 动态组装：

```typescript
import type { FormRule } from '@/uni_modules/hs-design/types/form'

const fieldRules: FormRule[] = [
  { required: true, message: '必填提示' },
  { pattern: /^[\s\S]{6,20}$/, message: '格式错误' }
]
const formRules = new UTSJSONObject()
formRules['fieldName'] = fieldRules
```

## ref 类型规范

### 内置组件 ref 类型

| 组件 | ref 类型 |
|------|----------|
| view、text、普通 DOM | `ref<UniElement \| null>(null)` |
| scroll-view | `ref<UniScrollViewElement \| null>(null)` |
| slider | `ref<UniSliderElement \| null>(null)` |
| video | `ref<UniVideoElement \| null>(null)` |
| 自定义组件（easycom） | `ref<组件名驼峰 + ComponentPublicInstance \| null>(null)` |
| 自定义组件（非 easycom） | `ref<ComponentPublicInstance \| null>(null)` |

### 调用子组件方法

- **内置组件 / easycom 组件**：通过 `this.$refs.xxx` 拿到实例并 as 成对应类型，用 `.` 调用方法。
- **非 easycom 自定义组件**：通过 `this.$refs.xxx.$callMethod('方法名', 参数)` 调用。
- 子组件需通过 **defineExpose** 显式暴露方法或数据。

## Props定义规范

必须使用 `type` 字段定义，不支持内联类型：

```typescript
// ✅ 正确
type Props = {
  title?: string
}
defineProps<Props>()

// ✅ 带默认值
withDefaults(defineProps<Props>(), {
  title: '默认标题'
})

// ❌ 错误 - Android 不支持
defineProps<{ title?: string }>()
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
  <button class="hs-button" v-bind="attrs" :loading="loading" @tap="handleClick">
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

`useAttrs()` 在运行时返回 `Map<String, Any?>` 类型（非 `UTSJSONObject`），使用时必须注意：

**禁止操作**：
- ❌ `attrs as UTSJSONObject` — 触发 `ClassCastException`
- ❌ 解构 `const { onClick, ...rest } = attrs` — 编译错误

**安全访问方式**：
- 模板中通过 `v-bind="bindAttrs"` 绑定过滤后的非事件属性
- 脚本中通过 `attrs['onClick']` 下标语法获取父级事件

**entries 遍历分端处理**：

```typescript
const bindAttrs = {}

// #ifdef APP-ANDROID
// Kotlin 环境：attrs.entries 是 Map 的属性
for (const entry of attrs.entries) {
  if (entry.key != 'onClick') {
    bindAttrs[entry.key] = entry.value
  }
}
// #endif

// #ifndef APP-ANDROID
// JS 环境：使用 Object.entries
for (const [key, value] of Object.entries(attrs)) {
  if (key != 'onClick') {
    bindAttrs[key] = value
  }
}
// #endif
```

## 指令使用规范

| 指令 | 说明 |
|------|------|
| **v-if / v-else / v-else-if** | 条件渲染；为假时元素不渲染 |
| **v-show** | 切换 display 可见性，元素始终存在 |
| **v-for** | 列表渲染；需写 **key**（建议唯一 id） |
| **v-model** | 双向绑定，用于 input、textarea、组件等 |
| **:prop / v-bind** | 动态绑定属性 |
| **@event / v-on** | 绑定事件 |
| **v-text** | 设置元素文本，覆盖原有内容 |
| **v-html** | 设置 HTML；Android 上通过 rich-text 实现 |

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

| 属性 | 说明 | 示例 class |
|------|------|-----------|
| `font-size` | 字体大小 | `text-22`、`text-56` |
| `color` | 字体颜色 | `text-mainGray-500`、`text-mainGray-950` |
| `font-weight` | 字体粗细 | `fw-700`、`fw-bold` |
| `line-height` | 行高 | `leading-36` |
| `text-align` | 对齐方式 | `text-center`、`text-left`、`text-right` |
| `letter-spacing` | 字间距 | `tracking-2` |
| `text-decoration` | 文字装饰 | `underline`、`line-through` |

> 注意：`<view>` 只支持布局类属性（flex、padding、margin、width、height 等），字体类属性不生效。
