<template>
  <div class="emr-designer h-full flex flex-col bg-gray-100">
    <div class="designer-header flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 gap-3">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <input
          v-model="docName"
          :disabled="props.disabled"
          class="text-base font-semibold text-gray-800 border border-transparent rounded px-2 py-1 focus:outline-none focus:border-blue-400 focus:bg-white hover:border-gray-300 bg-transparent min-w-0 flex-1"
          placeholder="请输入文书名称"
        />
        <select
          v-if="!props.hideTypeSelect"
          v-model="docType"
          :disabled="props.disabled"
          class="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 focus:outline-none bg-white"
        >
          <option value="template">模板</option>
          <option value="instance">实例</option>
        </select>
      </div>
      <div class="header-actions flex items-center gap-2 shrink-0">
        <el-button @click="handlePrint">打印</el-button>
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
        />
      </div>

      <EmrPropertyPanel
        :selected-variable="selectedVariable"
        @update-attr="handleUpdateAttr"
        @update-options="handleUpdateOptions"
        @delete="handleDeleteVariable"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import type { Editor } from "@tiptap/vue-3";
import EmrEditor from "./EmrEditor.vue";
import EmrComponentPanel from "./EmrComponentPanel.vue";
import EmrPropertyPanel from "./EmrPropertyPanel.vue";
import type { InsertVariableOptions, VariableOption, DocNode } from "../types";

/** 设计器保存载荷 */
export interface EmrDesignerSavePayload {
  name: string;
  type: "template" | "instance";
  content: DocNode | null;
}

const props = withDefaults(
  defineProps<{
    /** 初始文书名称 */
    name?: string;
    /** 文书类型：template-模板 / instance-实例 */
    docType?: "template" | "instance";
    /** 初始文档内容（ProseMirror JSON） */
    content?: DocNode | null;
    /** 初始变量数据 */
    initialData?: Record<string, any>;
    /** 是否隐藏类型选择（仅模板场景时传 true，固定 docType 传入值） */
    hideTypeSelect?: boolean;
    /** 是否禁用编辑 */
    disabled?: boolean;
  }>(),
  {
    name: "",
    docType: "template",
    content: null,
    initialData: undefined,
    hideTypeSelect: false,
    disabled: false
  }
);

const emit = defineEmits<{
  (e: "save", payload: EmrDesignerSavePayload): void;
  (e: "preview", payload: EmrDesignerSavePayload): void;
}>();

const docName = ref(props.name || "");
const docType = ref(props.docType || "template");

watch(
  () => props.name,
  (val) => {
    if (val !== undefined) docName.value = val;
  }
);

watch(
  () => props.docType,
  (val) => {
    if (val !== undefined) docType.value = val;
  }
);

const editorRef = ref<InstanceType<typeof EmrEditor> | null>(null);
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
    type: docType.value,
    content: editor ? (editor.getJSON() as DocNode) : null
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
        placeholder: ""
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
      placeholder
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
    placeholder: node.attrs.placeholder || ""
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

/** 打印当前文书 */
function handlePrint() {
  window.print();
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
  getEditor
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

/* 打印时隐藏设计器面板，仅保留文书内容 */
@media print {
  .emr-designer {
    background: #fff !important;
  }
  .designer-header,
  :deep(.component-panel),
  :deep(.property-panel),
  :deep(.emr-toolbar) {
    display: none !important;
  }
  .editor-container {
    padding: 0 !important;
    background: #fff !important;
  }
  .designer-editor {
    max-width: 100% !important;
  }
  :deep(.emr-content) {
    box-shadow: none !important;
    margin: 0 !important;
  }
}
</style>
