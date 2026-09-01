<template>
  <div class="property-panel h-full bg-white border-l border-gray-200 flex flex-col">
    <div class="panel-header px-4 py-3 border-b border-gray-200">
      <h3 class="text-sm font-semibold text-gray-700">属性配置</h3>
    </div>
    <div class="panel-content flex-1 overflow-y-auto p-3">
      <div v-if="!selectedVariable" class="empty-tip text-center text-gray-400 text-sm py-8">请选择一个变量组件</div>

      <div v-else class="property-form space-y-4">
        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">变量名称</label>
          <el-input
            :model-value="selectedVariable.widgetName"
            size="small"
            @update:model-value="(val: string) => updateAttr('widgetName', val)"
          />
        </div>

        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">引用键 (refKey)</label>
          <el-input
            :model-value="selectedVariable.refKey"
            size="small"
            placeholder="如：patient.patient_name"
            @update:model-value="(val: string) => updateAttr('refKey', val)"
          />
        </div>

        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">组件类型</label>
          <el-select
            :model-value="selectedVariable.widgetType"
            size="small"
            class="w-full"
            @update:model-value="(val: string) => updateAttr('widgetType', val)"
          >
            <el-option label="文本输入" value="text" />
            <el-option label="数字输入" value="number" />
            <el-option label="日期选择" value="date" />
            <el-option label="下拉选择" value="select" />
          </el-select>
        </div>

        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">占位符文本</label>
          <el-input
            :model-value="selectedVariable.placeholder"
            size="small"
            placeholder="未填写时显示的文字"
            @update:model-value="(val: string) => updateAttr('placeholder', val)"
          />
        </div>

        <div class="form-item">
          <el-checkbox
            :model-value="selectedVariable.required"
            @update:model-value="(val: boolean | string | number) => updateAttr('required', val)"
          >
            <span class="text-xs text-gray-500">是否必填</span>
          </el-checkbox>
        </div>

        <div v-if="selectedVariable.widgetType === 'select'" class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-2">下拉选项</label>
          <div class="options-list space-y-2">
            <div v-for="(option, index) in localOptions" :key="index" class="option-row flex items-center gap-2">
              <el-input v-model="option.label" size="small" placeholder="标签" @change="updateOptions()" />
              <el-input v-model="option.value" size="small" placeholder="值" @change="updateOptions()" />
              <el-button size="small" type="danger" text @click="removeOption(index)" title="删除">×</el-button>
            </div>
          </div>
          <el-button
            class="mt-2 w-full"
            size="small"
            type="primary"
            plain
            @click="addOption"
          >
            + 添加选项
          </el-button>
        </div>

        <div class="form-item pt-2 border-t border-gray-200">
          <el-button class="w-full" size="small" type="danger" plain @click="deleteVariable">
            删除变量
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { InsertVariableOptions, VariableOption } from "../types";

const props = defineProps<{
  selectedVariable: InsertVariableOptions | null;
}>();

const emit = defineEmits<{
  (e: "update-attr", key: string, value: any): void;
  (e: "update-options", options: VariableOption[]): void;
  (e: "delete"): void;
}>();

const localOptions = ref<VariableOption[]>([]);

watch(
  () => props.selectedVariable?.options,
  (newOptions) => {
    localOptions.value = newOptions ? JSON.parse(JSON.stringify(newOptions)) : [];
  },
  { immediate: true }
);

watch(
  () => props.selectedVariable?.widgetType,
  () => {
    if (props.selectedVariable?.widgetType === "select" && localOptions.value.length === 0) {
      localOptions.value = [
        { label: "选项1", value: "1" },
        { label: "选项2", value: "2" }
      ];
      updateOptions();
    }
  }
);

function updateAttr(key: string, value: any) {
  emit("update-attr", key, value);
}

function updateOptions() {
  emit("update-options", localOptions.value);
}

function addOption() {
  localOptions.value.push({
    label: `选项${localOptions.value.length + 1}`,
    value: String(localOptions.value.length + 1)
  });
  updateOptions();
}

function removeOption(index: number) {
  localOptions.value.splice(index, 1);
  updateOptions();
}

function deleteVariable() {
  emit("delete");
}
</script>

<style scoped>
.property-panel {
  width: 280px;
  min-width: 280px;
}
</style>
