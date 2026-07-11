<template>
  <view class="hs-form">
    <slot></slot>
  </view>
</template>

<script setup lang="uts">
import type { FormContext, FormRules, ItemCtx } from '../../types/form'

type Props = {
  model: any
  rules?: FormRules
}

// props
const props = defineProps<Props>()

// 子项收集
const itemCtxList = ref<ItemCtx[]>([])

// 注册/注销子项
const registerItem = (ctx: ItemCtx) => {
  itemCtxList.value = itemCtxList.value.filter((item: ItemCtx): boolean => item.prop !== ctx.prop)
  itemCtxList.value.push(ctx)
}
const unRegisterItem = (prop: string) => {
  if (prop.length == 0) {
    return
  }
  itemCtxList.value = itemCtxList.value.filter(it => it.prop !== prop)
}

// 全局校验
const validate = () => {
  let pass = true
  itemCtxList.value.forEach(item => {
    if (!item.validate()) pass = false
  })
  if(pass) {
    return Promise.resolve()
  }
  return Promise.reject()
}

const getValue = (prop: string): string => {
  if (prop.length == 0) {
    return ''
  }
  const model = JSON.parse(JSON.stringify(props.model)) as UTSJSONObject
  const value = model[prop]
  return value != null ? value as string : ''
}

// 清空全部错误
const clearValidate = () => {
  itemCtxList.value.forEach(item => item.clearError())
}

const getRules = (): FormRules => {
  const rules = props.rules
  if (rules == null) {
    return new UTSJSONObject()
  }
  return rules as FormRules
}

const normalizedRules = getRules()

// 注入给子组件
const formContext: FormContext = {
  rules: normalizedRules,
  getValue,
  registerItem,
  unRegisterItem
}

provide('hsForm', formContext)

// 暴露实例方法
defineExpose({ validate, clearValidate })
</script>
<style>
.hs-form {
  padding: 30rpx;
}
</style>
