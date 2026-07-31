<template>
  <div class="input-wrapper" :style="{ minWidth: minWidth + 'px' }">
    <el-input
      ref="inputRef"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :style="{ width: inputWidth + 'px' }"
      @input="handleInput"
      @change="handleChange"
      @keydown.enter="handleEnter"
      @keydown.esc="handleEsc"
      @blur="handleBlur"
    />
    <span ref="measureRef" class="measure-span">{{ inputValue || " " }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";

const props = defineProps<{
  modelValue?: string;
  type?: string;
  placeholder?: string;
  minWidth?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
  (e: "enter", value: string): void;
  (e: "esc"): void;
  (e: "blur", value: string): void;
}>();

const inputValue = ref(props.modelValue || "");
const inputRef = ref<any>(null);
const measureRef = ref<HTMLElement | null>(null);
const inputWidth = ref(props.minWidth || 30);
const minWidth = props.minWidth || 30;

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val || "";
    nextTick(updateWidth);
  }
);

/** 根据内容动态计算输入框宽度 */
function updateWidth() {
  if (!measureRef.value) return;
  const textWidth = measureRef.value.getBoundingClientRect().width;
  inputWidth.value = Math.max(textWidth + 20, minWidth);
}

function handleInput() {
  emit("update:modelValue", inputValue.value);
  nextTick(updateWidth);
}

function handleChange(value: string) {
  emit("update:modelValue", value);
  emit("change", value);
}

function handleEnter() {
  emit("enter", inputValue.value);
}

function handleEsc() {
  emit("esc");
}

function handleBlur() {
  emit("blur", inputValue.value);
}

onMounted(() => {
  nextTick(() => {
    updateWidth();
    const input = inputRef.value?.$el?.querySelector("input") as HTMLInputElement;
    if (input) {
      input.focus();
    }
  });
});
</script>

<style scoped>
.input-wrapper {
  display: inline-block;
  position: relative;
}

.input-wrapper :deep(.el-input) {
  width: auto;
}

.input-wrapper :deep(.el-input__inner) {
  text-align: center;
}
.input-wrapper :deep(.el-input__wrapper) {
  padding: 0;
}

.measure-span {
  position: absolute;
  visibility: hidden;
  white-space: pre;
  left: 0;
  top: 0;
  padding: 0 20px;
  pointer-events: none;
}
</style>
