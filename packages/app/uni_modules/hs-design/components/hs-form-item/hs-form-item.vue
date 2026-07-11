<template>
  <view class="hs-form-item">
    <text v-if="label" class="hs-form-item__label">{{ label }}</text>
    <view class="hs-form-item__field">
      <view class="hs-form-item__slot">
        <slot></slot>
      </view>
      <text v-if="errMsg" class="hs-form-item__error">{{ errMsg }}</text>
    </view>
  </view>
</template>

<script setup lang="uts">
import type { FormContext, FormItemContext, FormRule, FormRules, ItemCtx } from '../../types/form'

type Props = {
  label?: string
  prop?: string
}

const props = defineProps<Props>()

const injectedForm = inject<FormContext | null>('hsForm', null)
const errMsg = ref('')

const getFormObject = (): FormContext | null => {
  return injectedForm
}

const getFormValue = (prop: string): string => {
  const formObject = getFormObject()
  if (formObject == null) {
    return ''
  }
  return formObject.getValue(prop)
}

const getFormRules = (): FormRules => {
  const formObject = getFormObject()
  if (formObject == null) {
    return new UTSJSONObject()
  }
  return formObject.rules
}

const getRegisterItem = (): ((ctx : ItemCtx) => void) | null => {
  const formObject = getFormObject()
  if (formObject == null) {
    return null
  }
  return formObject.registerItem
}

const getUnRegisterItem = (): ((prop : string) => void) | null => {
  const formObject = getFormObject()
  if (formObject == null) {
    return null
  }
  return formObject.unRegisterItem
}

const getPropKey = (): string => {
  return props.prop ?? ''
}

const getRuleList = (): FormRule[] => {
  const propKey = getPropKey()
  if (propKey.length == 0) {
    return []
  }
  const rules = getFormRules()[propKey]
  return rules != null ? rules as FormRule[] : []
}

const isEmptyValue = (value: any): boolean => {
  return value == '' || value == null
}

// 单项校验逻辑
const validate = () => {
  errMsg.value = ''
  const propKey = getPropKey()
  if (propKey.length == 0) {
    return true
  }

  const val = getFormValue(propKey)
  const ruleList = getRuleList()
  if (ruleList.length == 0) {
    return true
  }

  for (const rule of ruleList) {
    // 必填
    if (rule.required == true) {
      if (isEmptyValue(val)) {
        errMsg.value = rule.message
        return false
      }
    }
    // 正则
    if (rule.pattern != null) {
      if (!rule.pattern.test(val)) {
        errMsg.value = rule.message
        return false
      }
    }
    // 自定义校验函数
    if (rule.validator != null) {
      if (!rule.validator(val)) {
        errMsg.value = rule.message
        return false
      }
    }
  }
  return true
}

// 清除错误
const clearError = () => {
  errMsg.value = ''
}

// 注册进父表单
const propKey = getPropKey()
const registerItem = getRegisterItem()
if (registerItem != null && propKey.length > 0) {
  registerItem({
    prop: propKey,
    validate,
    clearError
  })
}

// 卸载注销
onUnmounted(() => {
  const unRegisterItem = getUnRegisterItem()
  if (unRegisterItem != null) {
    unRegisterItem(getPropKey())
  }
})

// 注入给子组件
const formItemContext: FormItemContext = {
  validate
}

provide('hsFormItem', formItemContext)
</script>

<style>
.hs-form-item {
  display: flex;
  flex-direction: row;
}
.hs-form-item__label {
  font-size: 30rpx;
  color: #222;
  margin-bottom: 12rpx;
  margin-right: 24rpx;
  margin-top: 10rpx;
}
.hs-form-item__slot {
  display: flex;
  flex: 1;
  flex-direction: row;
  position: relative;
}
.hs-form-item__field {
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  padding-bottom: 36rpx;
}
.hs-form-item__error {
  color: #f53f3f;
  font-size: 24rpx;
  line-height: 36rpx;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
