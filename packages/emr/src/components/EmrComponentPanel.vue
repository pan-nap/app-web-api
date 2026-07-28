<template>
  <div class="component-panel h-full bg-white border-r border-gray-200 flex flex-col">
    <div class="panel-header px-4 py-3 border-b border-gray-200">
      <h3 class="text-sm my-0 font-semibold text-gray-700">组件库</h3>
    </div>
    <div class="panel-content flex-1 overflow-y-auto p-3">
      <div class="component-group mb-4">
        <div class="group-title text-xs text-gray-500 mb-2 px-1">基础组件</div>
        <div class="component-list grid grid-cols-2 gap-2">
          <div
            v-for="item in componentList"
            :key="item.type"
            class="component-item flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg cursor-grab bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            draggable="true"
            @dragstart="handleDragStart($event, item)"
          >
            <div class="component-icon text-lg mb-1">{{ item.icon }}</div>
            <div class="component-label text-xs text-gray-600">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <div class="component-group">
        <div class="group-title text-xs text-gray-500 mb-2 px-1">数据源</div>
        <div class="data-source-list space-y-1">
          <div v-for="(fields, groupName) in dataSourceTree" :key="groupName" class="data-source-group">
            <div
              class="group-header flex items-center px-2 py-1.5 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded"
              @click="toggleGroup(groupName)"
            >
              <span class="mr-1">{{ expandedGroups[groupName] ? "▼" : "▶" }}</span>
              <span>{{ groupLabels[groupName] || groupName }}</span>
            </div>
            <div v-show="expandedGroups[groupName]" class="group-fields pl-4 mt-1 space-y-1">
              <div
                v-for="field in fields"
                :key="field.refKey"
                class="field-item flex items-center px-2 py-1.5 text-xs text-gray-600 cursor-grab hover:bg-blue-50 rounded"
                draggable="true"
                @dragstart="handleFieldDragStart($event, field)"
              >
                <span class="field-icon mr-2">{{ getTypeIcon(field.widgetType) }}</span>
                <span class="field-label truncate">{{ field.widgetName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { ComponentItem, DataField } from "../types";

const emit = defineEmits<{
  (e: "drag-start", payload: { type: string; widgetType: string; widgetName: string; refKey?: string }): void;
}>();

const componentList: ComponentItem[] = [
  { type: "text", label: "文本输入", icon: "📝", widgetType: "text" },
  { type: "number", label: "数字输入", icon: "🔢", widgetType: "number" },
  { type: "date", label: "日期选择", icon: "📅", widgetType: "date" },
  { type: "select", label: "下拉选择", icon: "📋", widgetType: "select" }
];

const groupLabels: Record<string, string> = {
  patient: "患者信息",
  patientOrder: "就诊信息"
};

const dataSourceTree: Record<string, DataField[]> = {
  patient: [
    { refKey: "patient.patient_name", widgetName: "患者姓名", widgetType: "text" },
    { refKey: "patient.patient_sex", widgetName: "患者性别", widgetType: "select" },
    { refKey: "patient.patient_age", widgetName: "患者年龄", widgetType: "text" },
    { refKey: "patient.familyAddr", widgetName: "家庭地址", widgetType: "text" },
    { refKey: "patient.ethnicity", widgetName: "民族", widgetType: "text" },
    { refKey: "patient.marital_status_name", widgetName: "婚姻状况", widgetType: "text" },
    { refKey: "patient.occupation", widgetName: "职业", widgetType: "text" }
  ],
  patientOrder: [
    { refKey: "patientOrder.no", widgetName: "就诊号", widgetType: "text" },
    { refKey: "patientOrder.admission_time", widgetName: "入院时间", widgetType: "date" },
    { refKey: "patientOrder.dischargeTime", widgetName: "出院时间", widgetType: "date" }
  ]
};

const expandedGroups = reactive<Record<string, boolean>>({
  patient: true,
  patientOrder: true
});

function toggleGroup(groupName: string) {
  expandedGroups[groupName] = !expandedGroups[groupName];
}

function getTypeIcon(widgetType: string): string {
  const iconMap: Record<string, string> = {
    text: "📝",
    number: "🔢",
    date: "📅",
    select: "📋"
  };
  return iconMap[widgetType] || "📝";
}

function handleDragStart(event: DragEvent, item: ComponentItem) {
  const payload = { type: "component", widgetType: item.widgetType, widgetName: item.label };
  if (event.dataTransfer) {
    event.dataTransfer.setData("application/json", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "copy";
  }
  emit("drag-start", payload);
}

function handleFieldDragStart(event: DragEvent, field: DataField) {
  const payload = {
    type: "datasource",
    widgetType: field.widgetType,
    widgetName: field.widgetName,
    refKey: field.refKey
  };
  if (event.dataTransfer) {
    event.dataTransfer.setData("application/json", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "copy";
  }
  emit("drag-start", payload);
}
</script>

<style scoped>
.component-panel {
  width: 240px;
  min-width: 240px;
}

.component-item:active {
  cursor: grabbing;
}

.field-item:active {
  cursor: grabbing;
}
</style>
