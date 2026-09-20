<template>
  <div class="property-panel h-full bg-white border-l border-gray-200 flex flex-col">
    <!-- Tab 切换 -->
    <div class="panel-tabs flex border-b border-gray-200">
      <button
        class="tab-btn flex-1 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'page' ? 'tab-active text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
        @click="activeTab = 'page'"
      >
        页面设置
      </button>
      <button
        class="tab-btn flex-1 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'control' ? 'tab-active text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
        @click="activeTab = 'control'"
      >
        控件设置
      </button>
    </div>

    <div class="panel-content flex-1 overflow-y-auto p-3">
      <!-- ==================== 页面设置 Tab ==================== -->
      <div v-if="activeTab === 'page'" class="page-settings space-y-4">
        <!-- 文书名称 -->
        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">文书名称</label>
          <el-input
            :model-value="docName"
            size="small"
            placeholder="请输入文书名称"
            @update:model-value="(val: string) => emit('update-doc-name', val)"
          />
        </div>

        <!-- 页面尺寸 -->
        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">页面尺寸</label>
          <el-select
            :model-value="localPageSettings.pageSize"
            size="small"
            class="w-full"
            @update:model-value="(val: PageSize) => updatePageSetting('pageSize', val)"
          >
            <el-option label="A4" value="A4" />
            <el-option label="A5" value="A5" />
            <el-option label="B5" value="B5" />
            <el-option label="Letter" value="Letter" />
            <el-option label="自定义" value="Custom" />
          </el-select>
        </div>

        <!-- 页面方向 -->
        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-1">页面方向</label>
          <el-select
            :model-value="localPageSettings.orientation"
            size="small"
            class="w-full"
            @update:model-value="(val: PageOrientation) => updatePageSetting('orientation', val)"
          >
            <el-option label="纵向" value="portrait" />
            <el-option label="横向" value="landscape" />
          </el-select>
        </div>

        <!-- 边距设置 -->
        <div class="form-item">
          <label class="form-label block text-xs text-gray-500 mb-2">边距设置</label>
          <div class="margin-grid grid grid-cols-2 gap-2">
            <div class="margin-field flex items-center gap-1">
              <span class="text-xs text-gray-400 w-8">上</span>
              <el-input-number
                :model-value="localPageSettings.marginTop"
                size="small"
                :min="0"
                :max="50"
                :step="1"
                controls-position="right"
                class="!w-full"
                @update:model-value="(val: number | undefined) => updatePageSetting('marginTop', val ?? 0)"
              />
              <span class="text-xs text-gray-400">mm</span>
            </div>
            <div class="margin-field flex items-center gap-1">
              <span class="text-xs text-gray-400 w-8">下</span>
              <el-input-number
                :model-value="localPageSettings.marginBottom"
                size="small"
                :min="0"
                :max="50"
                :step="1"
                controls-position="right"
                class="!w-full"
                @update:model-value="(val: number | undefined) => updatePageSetting('marginBottom', val ?? 0)"
              />
              <span class="text-xs text-gray-400">mm</span>
            </div>
            <div class="margin-field flex items-center gap-1">
              <span class="text-xs text-gray-400 w-8">左</span>
              <el-input-number
                :model-value="localPageSettings.marginLeft"
                size="small"
                :min="0"
                :max="50"
                :step="1"
                controls-position="right"
                class="!w-full"
                @update:model-value="(val: number | undefined) => updatePageSetting('marginLeft', val ?? 0)"
              />
              <span class="text-xs text-gray-400">mm</span>
            </div>
            <div class="margin-field flex items-center gap-1">
              <span class="text-xs text-gray-400 w-8">右</span>
              <el-input-number
                :model-value="localPageSettings.marginRight"
                size="small"
                :min="0"
                :max="50"
                :step="1"
                controls-position="right"
                class="!w-full"
                @update:model-value="(val: number | undefined) => updatePageSetting('marginRight', val ?? 0)"
              />
              <span class="text-xs text-gray-400">mm</span>
            </div>
          </div>
        </div>

        <!-- 连续显示 -->
        <div class="form-item">
          <el-checkbox
            :model-value="localPageSettings.continuousDisplay"
            @update:model-value="(val: boolean | string | number) => updatePageSetting('continuousDisplay', val === true)"
          >
            <span class="text-xs text-gray-500">连续显示</span>
          </el-checkbox>
        </div>
      </div>

      <!-- ==================== 控件设置 Tab ==================== -->
      <div v-if="activeTab === 'control'">
        <div v-if="!selectedVariable" class="empty-tip text-center text-gray-400 text-sm py-8">请选择一个变量组件</div>

        <div v-else class="control-settings space-y-4">
          <!-- 控件属性按钮组 -->
          <div class="control-buttons flex flex-wrap gap-2">
            <button
              class="control-toggle-btn px-3 py-1.5 text-xs rounded border transition-colors"
              :class="
                selectedVariable.underline ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              "
              @click="toggleControlAttr('underline')"
            >
              下划线
            </button>
            <button
              class="control-toggle-btn px-3 py-1.5 text-xs rounded border transition-colors"
              :class="
                selectedVariable.requiredLevel === 'required'
                  ? 'bg-red-50 border-red-400 text-red-600'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              "
              @click="setRequiredLevel('required')"
            >
              强制必填
            </button>
            <button
              class="control-toggle-btn px-3 py-1.5 text-xs rounded border transition-colors"
              :class="
                selectedVariable.requiredLevel === 'optional'
                  ? 'bg-orange-50 border-orange-400 text-orange-600'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              "
              @click="setRequiredLevel('optional')"
            >
              非强制必填
            </button>
            <button
              class="control-toggle-btn px-3 py-1.5 text-xs rounded border transition-colors"
              :class="
                selectedVariable.readonly ? 'bg-gray-100 border-gray-400 text-gray-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              "
              @click="toggleControlAttr('readonly')"
            >
              只读
            </button>
            <button
              class="control-toggle-btn px-3 py-1.5 text-xs rounded border transition-colors"
              :class="
                selectedVariable.selectOnly
                  ? 'bg-purple-50 border-purple-400 text-purple-600'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              "
              @click="toggleControlAttr('selectOnly')"
            >
              仅选择
            </button>
          </div>

          <!-- 控件信息展示 -->
          <div class="control-info space-y-3 pt-2 border-t border-gray-100">
            <div class="info-item">
              <label class="block text-xs text-gray-400 mb-1">控件ID</label>
              <div class="text-sm text-gray-700 font-mono break-all">{{ selectedVariable.refKey || "未设置" }}</div>
            </div>
            <div class="info-item">
              <label class="block text-xs text-gray-400 mb-1">控件名称</label>
              <div class="text-sm text-gray-700">{{ selectedVariable.widgetName || "未设置" }}</div>
            </div>
            <div class="info-item">
              <label class="block text-xs text-gray-400 mb-1">控件类型</label>
              <div class="text-sm text-gray-700">{{ typeLabelMap[selectedVariable.widgetType || "text"] || "文本输入" }}</div>
            </div>
          </div>

          <!-- 可编辑属性 -->
          <div class="editable-attrs space-y-4 pt-2 border-t border-gray-100">
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
                <el-option label="单选框" value="radio" />
                <el-option label="多选框" value="checkbox" />
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

            <!-- 选项配置（下拉 / 单选 / 复选 各自的选项列表） -->
            <div v-if="hasOptionConfig" class="form-item">
              <label class="form-label block text-xs text-gray-500 mb-2">
                {{ isSelectType ? "下拉选项" : "选项" }}
              </label>
              <div v-if="isChoiceType" class="text-xs text-gray-400 mb-2">画布上可直接点击选项文字修改，此处增删选项</div>
              <div class="options-list space-y-2">
                <div v-for="(option, index) in localOptions" :key="index" class="option-row flex items-center gap-2">
                  <el-input v-model="option.label" size="small" placeholder="标签" @change="updateOptions()" />
                  <el-input v-model="option.value" size="small" placeholder="值" @change="updateOptions()" />
                  <el-button size="small" type="danger" text @click="removeOption(index)" title="删除">×</el-button>
                </div>
              </div>
              <el-button class="mt-2 w-full" size="small" type="primary" plain @click="addOption"> + 添加选项 </el-button>
            </div>

            <!-- 删除按钮 -->
            <div class="form-item pt-2 border-t border-gray-200">
              <el-button class="w-full" size="small" type="danger" plain @click="deleteVariable"> 删除变量 </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { InsertVariableOptions, VariableOption, PageSettings, PageOrientation, PageSize, RequiredLevel } from "../types";

const props = defineProps<{
  selectedVariable: InsertVariableOptions | null;
  pageSettings: PageSettings;
  docName?: string;
}>();

const emit = defineEmits<{
  (e: "update-attr", key: string, value: any): void;
  (e: "update-options", options: VariableOption[]): void;
  (e: "update-page-settings", settings: PageSettings): void;
  (e: "update-doc-name", name: string): void;
  (e: "delete"): void;
}>();

const activeTab = ref<"page" | "control">("page");

const localPageSettings = ref<PageSettings>({ ...props.pageSettings });
const localOptions = ref<VariableOption[]>([]);

const typeLabelMap: Record<string, string> = {
  text: "文本输入",
  number: "数字输入",
  date: "日期选择",
  select: "下拉选择",
  radio: "单选框",
  checkbox: "多选框"
};

/** 下拉选择：选项以浮层下拉呈现（与单选/复选不同类） */
const isSelectType = computed(() => props.selectedVariable?.widgetType === "select");
/** 单选/复选：选项以「标记 + 文字」平铺呈现 */
const isChoiceType = computed(() => ["radio", "checkbox"].includes(props.selectedVariable?.widgetType || ""));
/** 是否需要在线配置选项列表（下拉/单选/复选各自维护选项数据） */
const hasOptionConfig = computed(() => isSelectType.value || isChoiceType.value);

// 同步外部 pageSettings 变化
watch(
  () => props.pageSettings,
  (newSettings) => {
    localPageSettings.value = { ...newSettings };
  },
  { deep: true }
);

// 切换 Tab 时，如果选中了变量则自动切换到控件设置
watch(
  () => props.selectedVariable,
  (val) => {
    if (val) {
      activeTab.value = "control";
    }
  }
);

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
    if (props.selectedVariable && hasOptionConfig.value && localOptions.value.length === 0) {
      localOptions.value = [
        { label: "选项1", value: "1" },
        { label: "选项2", value: "2" }
      ];
      updateOptions();
    }
  }
);

/** 更新页面设置单项 */
function updatePageSetting(key: keyof PageSettings, value: any) {
  localPageSettings.value = { ...localPageSettings.value, [key]: value };
  emit("update-page-settings", localPageSettings.value);
}

/** 切换控件布尔属性 */
function toggleControlAttr(key: "underline" | "readonly" | "selectOnly") {
  const currentVal = props.selectedVariable?.[key] || false;
  updateAttr(key, !currentVal);
}

/** 设置必填等级 */
function setRequiredLevel(level: RequiredLevel) {
  // 如果点击的是已选中的等级，则取消（设为 none）
  const currentLevel = props.selectedVariable?.requiredLevel || "none";
  const newLevel = currentLevel === level ? "none" : level;
  updateAttr("requiredLevel", newLevel);
  // 同步更新 required 字段以保持兼容
  updateAttr("required", newLevel === "required");
}

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
  width: 300px;
  min-width: 300px;
}

.tab-btn {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
}

.control-toggle-btn {
  cursor: pointer;
  outline: none;
  user-select: none;
}

.control-toggle-btn:active {
  transform: scale(0.97);
}

.info-item {
  padding: 6px 0;
}
</style>
