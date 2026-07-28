<template>
  <div class="select-wrapper">
    <el-select v-model="selectValue" automatic-dropdown placeholder="请选择" @change="handleChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Option {
  label: string;
  value: string | number;
}

const props = defineProps<{
  modelValue?: string;
  options?: Option[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

const selectValue = ref(props.modelValue || "");

watch(
  () => props.modelValue,
  (val) => {
    selectValue.value = val || "";
  }
);

function handleChange(value: string) {
  emit("update:modelValue", value);
  emit("change", value);
}
</script>

<style scoped>
.select-wrapper {
  display: inline-block;
  min-width: 100%;
}
</style>
