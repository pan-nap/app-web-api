<template>
  <div class="date-picker-wrapper">
    <el-date-picker v-model="dateValue" type="date" :value-format="valueFormat" placeholder="选择日期" @change="handleChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue?: string;
  valueFormat?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
  (e: "blur"): void;
}>();

const dateValue = ref(props.modelValue || "");
const valueFormat = ref(props.valueFormat || "YYYY-MM-DD");

watch(
  () => props.modelValue,
  (val) => {
    dateValue.value = val || "";
  }
);

function handleChange(value: string) {
  emit("update:modelValue", value);
  emit("change", value);
}
</script>

<style scoped>
.date-picker-wrapper {
  display: inline-block;
}

.date-picker-wrapper :deep(.el-date-editor) {
  width: 100%;
}
</style>
