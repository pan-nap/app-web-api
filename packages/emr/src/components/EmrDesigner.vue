<template>
  <div class="emr-designer h-full flex flex-col bg-gray-100">
    <div class="designer-header flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 gap-3">
      <div class="flex items-center">
        <el-input v-model="docName" :disabled="props.disabled" placeholder="请输入文书名称" />
      </div>
      <EmrToolbar class="flex-1 justify-center min-w-0" :editor="toolbarEditor" />
      <div class="header-actions flex items-center gap-2 shrink-0">
        <el-button @click="openPrintDialog">打印</el-button>
        <el-button @click="handlePreview" type="primary" plain>预览</el-button>
        <el-button @click="handleSave" type="primary" :disabled="props.disabled">保存模板</el-button>
      </div>
    </div>

    <div class="designer-body flex flex-1 overflow-hidden">
      <EmrComponentPanel @drag-start="handleDragStart" />

      <div
        class="editor-container flex-1 overflow-auto flex items-start justify-center py-4"
        @dragover="handleDragOver"
        @drop="handleDrop"
        @click="handleEditorAreaClick"
      >
        <EmrEditor
          ref="editorRef"
          class="designer-editor"
          :class="{ 'editor-selected': isEditorFocused }"
          :content="props.content"
          :initial-data="props.initialData"
          :disabled="props.disabled"
          :page-settings="pageSettings"
        />
      </div>

      <EmrPropertyPanel
        :selected-variable="selectedVariable"
        :page-settings="pageSettings"
        :doc-name="docName"
        @update-attr="handleUpdateAttr"
        @update-options="handleUpdateOptions"
        @update-page-settings="handleUpdatePageSettings"
        @update-doc-name="(val: string) => (docName = val)"
        @delete="handleDeleteVariable"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import type { Editor } from "@tiptap/vue-3";
import EmrEditor from "./EmrEditor.vue";
import EmrComponentPanel from "./EmrComponentPanel.vue";
import EmrPropertyPanel from "./EmrPropertyPanel.vue";
import EmrToolbar from "./EmrToolbar.vue";
import EmrPrintDialog from "./EmrPrintDialog.vue";
import { getPluginItem } from "../index";
import type { InsertVariableOptions, VariableOption, DocNode, PageSettings } from "../types";
import { DEFAULT_PAGE_SETTINGS } from "../types";

/** 设计器保存载荷（文书均为纯模板，客户动态数据由变量值接口另行承载） */
export interface EmrDesignerSavePayload {
  name: string;
  content: DocNode | null;
  pageSettings?: PageSettings;
}

const props = withDefaults(
  defineProps<{
    /** 初始文书名称 */
    name?: string;
    /** 初始文档内容（ProseMirror JSON） */
    content?: DocNode | null;
    /** 初始变量数据 */
    initialData?: Record<string, any>;
    /** 是否禁用编辑 */
    disabled?: boolean;
  }>(),
  {
    name: "",
    content: null,
    initialData: undefined,
    disabled: false
  }
);

const emit = defineEmits<{
  (e: "save", payload: EmrDesignerSavePayload): void;
  (e: "preview", payload: EmrDesignerSavePayload): void;
}>();

const docName = ref(props.name || "");
const pageSettings = ref<PageSettings>({ ...DEFAULT_PAGE_SETTINGS });

watch(
  () => props.name,
  (val) => {
    if (val !== undefined) docName.value = val;
  }
);

const editorRef = ref<InstanceType<typeof EmrEditor> | null>(null);
/** 头部工具栏使用的编辑器实例（由 EmrEditor 内部创建，挂载后注入） */
const toolbarEditor = shallowRef<Editor | null>(null);
const selectedVariable = ref<InsertVariableOptions | null>(null);
const selectedPos = ref<number | null>(null);
const isEditorFocused = ref(false);

let editorInstance: Editor | null = null;
let dragPayload: any = null;

/** 获取编辑器实例（带缓存） */
function getEditor(): Editor | null {
  if (editorInstance) return editorInstance;
  editorInstance = editorRef.value?.getEditor() || null;
  return editorInstance;
}

/** 组装保存载荷 */
function buildPayload(): EmrDesignerSavePayload {
  const editor = getEditor();
  return {
    name: docName.value,
    content: editor ? (editor.getJSON() as DocNode) : null,
    pageSettings: pageSettings.value
  };
}

/** 拖拽开始事件处理，保存拖拽载荷 */
function handleDragStart(payload: any) {
  dragPayload = payload;
}

/** 拖拽悬停事件处理，设置拖放效果为复制 */
function handleDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "copy";
  }
}

/** 拖拽放下事件处理，在鼠标位置插入变量节点 */
function handleDrop(event: DragEvent) {
  event.preventDefault();

  const editor = getEditor();
  if (!editor || !dragPayload) {
    console.log("handleDrop: editor or dragPayload is null");
    return;
  }

  const coords = editor.view.posAtCoords({
    left: event.clientX,
    top: event.clientY
  });

  if (!coords || coords.pos === undefined) {
    console.log("handleDrop: coords is null, using default insert");
    return;
  }

  editor
    .chain()
    .focus()
    .insertContentAt(coords.pos, {
      type: "variable",
      attrs: {
        refKey: dragPayload.refKey || "",
        widgetName: dragPayload.widgetName || "变量",
        widgetType: dragPayload.widgetType || "text",
        extensionValue: "",
        options:
          dragPayload.widgetType === "select"
            ? [
                { label: "选项1", value: "1" },
                { label: "选项2", value: "2" }
              ]
            : [],
        required: false,
        requiredLevel: "none",
        placeholder: "",
        underline: false,
        readonly: false,
        selectOnly: false
      }
    })
    .run();

  nextTick(() => {
    selectVariableAtPos(coords.pos);
  });

  dragPayload = null;
}

/** 编辑器区域点击事件处理，选中变量节点并显示属性面板 */
function handleEditorAreaClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // 仅处理编辑器容器内的点击；
  // 点击属性面板 / 组件面板等编辑器外部区域时不改变选中状态（避免属性面板被清空）
  if (!target.closest(".editor-container")) return;

  if (target.closest(".emr-variable")) {
    const variableEl = target.closest(".emr-variable") as HTMLElement;
    const refKey = variableEl.getAttribute("data-ref-key") || "";
    const widgetName = variableEl.getAttribute("data-widget-name") || "";
    const widgetType = variableEl.getAttribute("data-widget-type") || "text";
    const placeholder = variableEl.getAttribute("data-placeholder") || "";
    const required = variableEl.getAttribute("data-required") === "true";
    const underline = variableEl.getAttribute("data-underline") === "true";
    const readonly = variableEl.getAttribute("data-readonly") === "true";
    const selectOnly = variableEl.getAttribute("data-select-only") === "true";
    const requiredLevel = (variableEl.getAttribute("data-required-level") as any) || (required ? "required" : "none");

    const editor = getEditor();
    if (!editor) return;

    const pos = editor.view.posAtDOM(variableEl as Node, 0);

    selectedPos.value = pos;
    selectedVariable.value = {
      refKey,
      widgetName,
      widgetType: widgetType as any,
      extensionValue: variableEl.textContent || "",
      options: [],
      required,
      requiredLevel,
      placeholder,
      underline,
      readonly,
      selectOnly
    };

    const nodePos = editorRef.value?.findVariableNodeAtPos(pos);
    if (nodePos && nodePos.node.attrs.options) {
      selectedVariable.value.options = nodePos.node.attrs.options;
    }
  } else {
    selectedVariable.value = null;
    selectedPos.value = null;
  }
}

/** 根据位置选中变量并更新属性面板 */
function selectVariableAtPos(pos: number) {
  const nodePos = editorRef.value?.findVariableNodeAtPos(pos);
  if (!nodePos) return;

  const node = nodePos.node;
  selectedPos.value = nodePos.pos;
  selectedVariable.value = {
    refKey: node.attrs.refKey || "",
    widgetName: node.attrs.widgetName || "",
    widgetType: node.attrs.widgetType || "text",
    extensionValue: node.attrs.extensionValue || "",
    options: node.attrs.options || [],
    required: node.attrs.required || false,
    requiredLevel: node.attrs.requiredLevel || "none",
    placeholder: node.attrs.placeholder || "",
    underline: node.attrs.underline || false,
    readonly: node.attrs.readonly || false,
    selectOnly: node.attrs.selectOnly || false
  };
}

/** 更新选中变量的指定属性值 */
function handleUpdateAttr(key: string, value: any) {
  if (!selectedVariable.value || selectedPos.value === null) return;

  const editor = getEditor();
  if (!editor) return;

  const pos = selectedPos.value;
  const nodePos = editorRef.value?.findVariableNodeAtPos(pos);
  if (!nodePos) return;

  const newAttrs = {
    ...nodePos.node.attrs,
    [key]: value
  };

  const transaction = editor.state.tr.setNodeMarkup(nodePos.pos, undefined, newAttrs);
  editor.view.dispatch(transaction);

  (selectedVariable.value as any)[key] = value;
}

/** 更新选中变量的下拉选项列表 */
function handleUpdateOptions(options: VariableOption[]) {
  if (!selectedVariable.value || selectedPos.value === null) return;

  const editor = getEditor();
  if (!editor) return;

  const pos = selectedPos.value;
  const nodePos = editorRef.value?.findVariableNodeAtPos(pos);
  if (!nodePos) return;

  const newAttrs = {
    ...nodePos.node.attrs,
    options
  };

  const transaction = editor.state.tr.setNodeMarkup(nodePos.pos, undefined, newAttrs);
  editor.view.dispatch(transaction);

  selectedVariable.value.options = options;
}

/** 删除选中的变量节点 */
function handleDeleteVariable() {
  if (selectedPos.value === null) return;

  const editor = getEditor();
  if (!editor) return;

  const nodePos = editorRef.value?.findVariableNodeAtPos(selectedPos.value);
  if (!nodePos) return;

  const transaction = editor.state.tr.delete(nodePos.pos, nodePos.pos + nodePos.node.nodeSize);
  editor.view.dispatch(transaction);

  selectedVariable.value = null;
  selectedPos.value = null;
}

/** 更新页面设置 */
function handleUpdatePageSettings(settings: PageSettings) {
  pageSettings.value = { ...settings };
}

/** 保存模板（交由父组件处理持久化） */
function handleSave() {
  if (props.disabled) return;
  if (!docName.value.trim()) {
    alert("请输入文书名称");
    return;
  }
  emit("save", buildPayload());
}

/** 预览（交由父组件处理，或默认打印） */
function handlePreview() {
  emit("preview", buildPayload());
}

/** 命令式打开标准打印预览弹窗（弹窗外壳由宿主注入的 showPopup 提供，预览与打印同源） */
function openPrintDialog() {
  const rootEl = editorRef.value?.$el as HTMLElement | undefined;
  const contentEl = rootEl?.querySelector(".emr-content") as HTMLElement | null;
  if (!contentEl) return;

  const showPopup = getPluginItem()?.showPopup;
  if (!showPopup) {
    alert("未配置弹窗能力，请在宿主注册 emrEditor 时注入 showPopup");
    return;
  }

  showPopup(
    EmrPrintDialog,
    { source: contentEl, settings: pageSettings.value },
    {
      title: docName.value ? `打印预览 - ${docName.value}` : "打印预览",
      width: "90%",
      height: "90%",
      padding: false,
      showFooter: false
    }
  );
}

/** 处理编辑器选区更新事件 */
function handleSelectionUpdate() {
  const editor = getEditor();
  if (!editor) return;

  const { from, to } = editor.state.selection;
  if (from === to) {
    const nodePos = editorRef.value?.findVariableNodeAtPos(from);
    if (nodePos) {
      selectVariableAtPos(nodePos.pos);
      return;
    }
  }
}

onMounted(() => {
  nextTick(() => {
    const editor = getEditor();
    if (editor) {
      toolbarEditor.value = editor;
      editor.on("selectionUpdate", handleSelectionUpdate);
    }
    // 点击选中已通过 .editor-container 的 @click 处理，无需全局监听
  });
});

onBeforeUnmount(() => {
  const editor = getEditor();
  if (editor) {
    editor.off("selectionUpdate", handleSelectionUpdate);
  }
});

defineExpose({
  buildPayload,
  getEditor,
  openPrintDialog
});
</script>

<style scoped>
.editor-container {
  background-color: #f3f4f6;
}

.designer-editor {
  width: 100%;
  max-width: 100%;
}

.editor-selected {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

:deep(.emr-variable) {
  cursor: pointer;
}

:deep(.emr-variable:hover) {
  background-color: rgba(59, 130, 246, 0.1) !important;
}
</style>
