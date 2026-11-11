---
name: vue-composition-api
description: 蒸汽模式组合式 API（ref/reactive/computed/watch）使用规范与遗留选项式改造要点
---

# 组合式 API

> 蒸汽模式（本项目）**只支持组合式** `<script setup>`，不支持选项式、mixin、`this`。

## 注意

- 暂不支持 `<script setup>` 与 `<script>` 同时存在；需配置 options（如 name）时用 **defineOptions**。
- 暂不支持顶层 **await**、**generic** 泛型参数。
- **App.uvue** 从 HBuilderX 5.0 起支持组合式。
- **不需要 import** Vue 与 uni-app x 的 API（`ref`、`reactive`、`computed`、`watch`、`onLoad`、`onMounted` 等），编译器会自动注入。

  ```typescript
  // ❌ 不需要
  import { ref, reactive, onMounted, computed, watch } from "vue";

  // ✅ 直接使用
  const loading = ref(false);
  const form = reactive({ ... });
  onMounted(() => {});
  ```

## 响应式核心

- **ref(initialValue)**：返回带 `.value` 的响应式引用；模板中自动解包，script 中需 `.value`。
- **reactive(obj)**：返回对象的深层响应式代理；**App-Android 上暂不支持对 class 做 reactive**，推荐用 **type** 定义数据对象。
- **computed(getter)**：只读计算属性；需**泛型指定返回类型**，如 `computed<number>(() => count.value * 2)`。
- **watch(source, callback, options)**：侦听一个或多个响应式源。
- **watchEffect / watchPostEffect / watchSyncEffect**：立即执行一次并收集依赖。
- **isRef**、**unref**、**toRef**、**toValue** 等工具与 Vue 3 用法一致。

## 关键点

- 组合式中 **computed** 必须写泛型返回类型。
- 组合式内**所有函数和变量必须先定义再调用**（uts 无提升），顺序不对要按依赖调整；详见 [函数与模块](uts-function-module.md)。
- 生命周期命名（`onPageShow`/`onPageHide` 等）以 [生命周期](lifecycle.md) 为准，本文不重复规则。
- `type` 直接写在文件内或单独模块即可（蒸汽模式没有 `export default {}` 的作用域问题）。

## 遗留选项式代码改造

搬入老页面时只做**语法层面**转换，不改变业务逻辑，不删减代码与注释：

- `data()` → 顶层 `reactive({...})` / `ref(...)`；`methods` → 顶层函数；`created` → `<script setup>` 顶层代码直接执行。
- 页面显示/隐藏 `onShow` / `onHide` → **`onPageShow` / `onPageHide`**（详见 [生命周期](lifecycle.md)）。
- `mounted` / `beforeUnmount` / `unmounted` → `onMounted` / `onBeforeUnmount` / `onUnmounted`。
- `onPullDownRefresh`、`onBackPress` 等页面钩子作为生命周期函数使用，不要写成普通方法；`onBackPress` **不能用 async**。
- 子组件方法**不会**自动暴露给父组件：子组件需 `defineExpose` 显式暴露，父组件才能通过 ref 调用（类型与调用方式见 [组件使用](component-usage.md)「ref 类型规范」）。
