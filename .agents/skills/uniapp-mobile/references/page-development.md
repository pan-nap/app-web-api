---
name: page-development
description: 页面开发完整示例（登录、首页）
---

# 页面开发规范

## uvue 页面 SFC 结构

每个 uvue 页面包含三个根节点：

- **`<template>`**：模板，使用 uni 内置组件或自定义组件。
- **`<script>`**：逻辑，仅能写 UTS；支持 `<script setup>`（组合式）或 `export default {}`（选项式）。
- **`<style>`**：样式，App 端为 ucss 子集。

### 组合式 API（推荐）

```vue
<script setup>
  let title = ref("Hello world")
  const buttonClick = () => {
    title.value = "按钮被点了"
  }
  onLoad(() => {})
</script>
```

- 更灵活、代码更短；可监听页面生命周期（onLoad、onShow 等）。
- 新页面/组件建议直接用组合式。

### 选项式 API

```vue
<script>
  export default {
    data() { return { title: "Hello world" } },
    onLoad() {},
    methods: { buttonClick() { this.title = "按钮被点了" } }
  }
</script>
```

- App.uvue、uts 组件插件的入口目前仅支持选项式。
- `export default {}` **外部**的代码在应用启动时执行，且不随页面回收，不宜写复杂逻辑。

### 关键点

- 仅能有一个 `<script>`；组合式与选项式不能分两个 script 块。
- 选项式里页面「显示/隐藏」用 onShow/onHide；组合式里用 **onPageShow/onPageHide**。
- **不需要 import** Vue/uni 的 API（ref、onLoad 等），框架会自动注入。
- **使用类似unocss方式书写css** 项目使用a-hua-unocss自动编译unocss书写方式css。

## 登录页（pages/login/index.uvue）

```vue
<template>
  <hs-screen :verify-login="false" hide-bar title="登录页">
    <!-- 顶部品牌区域 -->
    <view class="mb-28 flex flex-col p-8 pt-18">
      <view class="flex flex-row items-center justify-center rd-full bg-mainGray-950 px-18 py-10">
        <text class="text-22 tracking-2">HS CASHIER</text>
      </view>
      <text class="mt-26 text-56 fw-700 text-mainGray-500">欢迎回来</text>
      <text class="mt-16 text-28 text-mainGray-450">使用新表单组件完成账号登录。</text>
    </view>

    <!-- 登录卡片 -->
    <hs-card>
      <hs-form ref="formRef" class="login-form" :model="formData" :rules="formRules">
        <hs-form-item label="账号" prop="username">
          <hs-input v-model="formData.username" placeholder="请输入账号" />
        </hs-form-item>
        <hs-form-item label="密码" prop="password">
          <hs-input v-model="formData.password" type="text" :password="true" placeholder="请输入密码" @confirm="handleLogin" />
        </hs-form-item>
      </hs-form>

      <!-- 使用 hs-button 替代原生 button，内置 loading 状态管理 -->
      <hs-button type="primary" class="login-submit-btn mt-8" @tap="handleLogin">
        立即登录
      </hs-button>
    </hs-card>
  </hs-screen>
</template>

<script setup>
import type { FormRule } from '@/uni_modules/hs-design/types/form'
import { type User, type LoginFormData, useUserStore } from '@/store/user.uts'
import { showToast } from '@/utils/tool.uts'

const formRef = ref<HsFormComponentPublicInstance | null>(null)
const userStore = useUserStore()

// 表单数据 - 使用 reactive
const formData = reactive<LoginFormData>({
  username: 'admin',
  password: '123456'
})

// 表单校验规则 - 使用 UTSJSONObject 组装
const usernameRules: FormRule[] = [
  { required: true, message: '请输入登录账号' },
  { pattern: /^[A-Za-z0-9_@.-]{4,32}$/, message: '账号格式不正确' }
]
const passwordRules: FormRule[] = [
  { required: true, message: '请输入登录密码' },
  { pattern: /^[\s\S]{6,20}$/, message: '密码长度需在6-20位之间' }
]
const formRules = new UTSJSONObject()
formRules['username'] = usernameRules
formRules['password'] = passwordRules

// 登录方法 — 异步错误处理下沉到 store，页面只 await
// store 内部消化异常，页面无需 try/catch
const handleLogin = async () => {
  const formInstance = formRef.value
  if (formInstance == null) return
  await formInstance.validate()
  await userStore.login(formData)
}
</script>

<style>
.login-form {
  padding-left: 0rpx;
  padding-right: 0rpx;
  padding-bottom: 12rpx;
  padding-top: 24rpx;
}
</style>
```

## 首页（pages/index/index.uvue）

遵循 **store-data-decoupling** 规范：页面层只负责UI展示和用户交互，Store层负责接口调用和数据处理：

```vue
<script setup>
import { useStudentStore } from '@/store/student.uts'
import { useUserStore } from '@/store/user.uts'

const userStore = useUserStore()
const studentStore = useStudentStore()

// 页面只负责计算属性和调用Store
const isSearchDisabled = computed(() : boolean => {
  return studentStore.state.idCard.length != 18
})

const handleSearch = async () => {
  if (studentStore.state.idCard == '') {
    showToast('请输入身份证号')
    return
  }
  // Store 内部处理异常，页面直接 await
  await studentStore.queryByIdCard(studentStore.state.idCard)
}
</script>
```
