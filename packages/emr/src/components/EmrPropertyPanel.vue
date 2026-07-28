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
          <input
            type="text"
            :value="selectedVariable.widgetName"
            @input="updateAttr('widgetName', ($event.target as HTMLInputElement).value)"
            class="form-input w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">引用键 (refKey)</label>
          <input
            type="text"
            :value="selectedVariable.refKey"
            @input="updateAttr('refKey', ($event.target as HTMLInputElement).value)"
            class="form-input w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="如：patient.patient_name"
          />
        </div>

        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">组件类型</label>
          <select
            :value="selectedVariable.widgetType"
            @change="updateAttr('widgetType', ($event.target as HTMLSelectElement).value)"
            class="form-input w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="text">文本输入</option>
            <option value="number">数字输入</option>
            <option value="date">日期选择</option>
            <option value="select">下拉选择</option>
          </select>
        </div>

        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">占位符文本</label>
          <input
            type="text"
            :value="selectedVariable.placeholder"
            @input="updateAttr('placeholder', ($event.target as HTMLInputElement).value)"
            class="form-input w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="未填写时显示的文字"
          />
        </div>

        <div class="form-item">
          <label class="form-label flex items-center text-xs text-gray-500 mb-1 cursor-pointer">
            <input
              type="checkbox"
              :checked="selectedVariable.required"
              @change="updateAttr('required', ($event.target as HTMLInputElement).checked)"
              class="mr-2"
            />
            <span>是否必填</span>
          </label>
        </div>

        <div v-if="selectedVariable.widgetType === 'select'" class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-2">下拉选项</label>
          <div class="options-list space-y-2">
            <div v-for="(option, index) in localOptions" :key="index" class="option-row flex items-center gap-2">
              <input
                type="text"
                v-model="option.label"
                @change="updateOptions()"
                class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="标签"
              />
              <input
                type="text"
                v-model="option.value"
                @change="updateOptions()"
                class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="值"
              />
              <button @click="removeOption(index)" class="p-1 text-red-500 hover:bg-red-50 rounded" title="删除">×</button>
            </div>
          </div>
          <button
            @click="addOption"
            class="mt-2 w-full py-1.5 text-xs text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 transition-colors"
          >
            + 添加选项
          </button>
        </div>

        <div class="form-item pt-2 border-t border-gray-200">
          <button
            @click="deleteVariable"
            class="w-full py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
          >
            删除变量
          </button>
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
