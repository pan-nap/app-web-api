---
name: page-development
description: 页面开发完整示例（登录、首页）
---

# 页面开发规范

## uvue 页面 SFC 结构

每个 uvue 页面包含三个根节点：

- **`<template>`**：模板，使用 uni 内置组件或自定义组件。
- **`<script>`**：逻辑，蒸汽模式下仅支持组合式（`<script setup>`）；逻辑层由 js 引擎驱动，直接写标准 js/ts 语法，无需强类型。
- **`<style>`**：样式，App 端为 ucss 子集。

### 组合式约束

→ 语法规则不在本文重复：蒸汽模式**只支持组合式** `<script setup>`，不支持选项式与 mixin；API 一览、“无需 import”、`defineOptions` 见 [组合式 API](vue-composition-api.md)，页面显示/隐藏命名（`onPageShow`/`onPageHide`）见 [生命周期](lifecycle.md)。

```vue
<script setup>
let title = ref("Hello world");
const buttonClick = () => {
  title.value = "按钮被点了";
};
onLoad(() => {});
</script>
```

### 关键点

- 仅能有一个 `<script>`，使用组合式（`<script setup>`）。
- **CSS 统一用 tailwind 原子类**（a-hua-unocss 编译时生成，见 [UVUE CSS](css-ucss.md)），极个别无法表达时才用 `<style>` 标签写简单 class。

## 登录页（pages/login/index.uvue）

```vue
<template>
  <hs-screen
    :verify-login="false"
    hide-bar
    title="登录页"
  >
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
      <hs-form
        ref="formRef"
        class="login-form"
        :model="formData"
        :rules="formRules"
      >
        <hs-form-item
          label="账号"
          prop="username"
        >
          <hs-input
            v-model="formData.username"
            placeholder="请输入账号"
          />
        </hs-form-item>
        <hs-form-item
          label="密码"
          prop="password"
        >
          <hs-input
            v-model="formData.password"
            type="text"
            :password="true"
            placeholder="请输入密码"
            @confirm="handleLogin"
          />
        </hs-form-item>
      </hs-form>

      <!-- 使用 hs-button 替代原生 button，内置 loading 状态管理 -->
      <hs-button
        type="primary"
        class="login-submit-btn mt-8"
        @tap="handleLogin"
      >
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

// 表单校验规则 - 标准对象字面量（蒸汽模式直接写 js/ts 语法，无需 UTSJSONObject）
const usernameRules: FormRule[] = [
  { required: true, message: '请输入登录账号' },
  { pattern: /^[A-Za-z0-9_@.-]{4,32}$/, message: '账号格式不正确' }
]
const passwordRules: FormRule[] = [
  { required: true, message: '请输入登录密码' },
  { pattern: /^[\s\S]{6,20}$/, message: '密码长度需在6-20位之间' }
]
const formRules : Record<string, any> = {
  username: usernameRules,
  password: passwordRules
}

// 登录方法 — 异步错误处理下沉到 store，页面只 await
// store 内部消化异常，页面无需 try/catch
const handleLogin = async () => {
  const formInstance = formRef.value
  if (formInstance == null) return
  await formInstance.validate()
  await userStore.login(formData)
}
</script>

<!-- 极个别场景示例：原子类无法表达时才用 style（实际 login 页仅此一处例外） -->
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

当前首页是**功能入口页**：`hs-card` 列表 + `uni.navigateTo` 跳各演示页（mqtt、stomp、刷新与加载 Demo），另附 openDialogPage 与 hs-dialog 两种弹窗示例：

```vue
<script setup>
import { openDialogPage } from '@/hook/openDialogPage'

const visible = ref(false)

const jumpTo = (url : string) => {
  uni.navigateTo({ url })
}

const openDialogPageDemo = () => {
  openDialogPage<{ action: string }>('/page_dialog/index/index', {
    params: { scene: 'dialog-page-demo' }
  }).then((result) => {
    const action = result.action ?? ''
    uni.showToast({ title: action == 'confirm' ? 'dialogPage 返回：确定' : 'dialogPage 返回：取消', icon: 'none' })
  }).catch((err) => {
    console.error('openDialogPage fail:', err)
  })
}
</script>
```

业务页仍按 [状态管理](state-management.md)「数据解耦规范」写：页面只做 UI 与交互、只 `await` store 方法，接口调用与异常处理全部下沉到 store（完整 store 写法见 state-management「Store 结构」，本文不重复）。
