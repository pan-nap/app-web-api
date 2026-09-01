<template>
  <div class="emr-designer h-full flex flex-col bg-gray-100">
    <div class="designer-header flex items-center justify-between px-4 bg-white border-b border-gray-200">
      <p class="text-base font-semibold text-gray-800">EMR 模板设计器</p>
      <div class="header-actions flex items-center gap-2">
        <el-button @click="handlePreview" type="primary">预览</el-button>
        <el-button @click="handleSave" type="primary">保存模板</el-button>
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
        <EmrEditor ref="editorRef" class="designer-editor" :class="{ 'editor-selected': isEditorFocused }" />
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
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import type { Editor } from "@tiptap/vue-3";
import EmrEditor from "./EmrEditor.vue";
import EmrComponentPanel from "./EmrComponentPanel.vue";
import EmrPropertyPanel from "./EmrPropertyPanel.vue";
import type { InsertVariableOptions, VariableOption } from "../types";

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

/** 预览模板（占位功能） */
function handlePreview() {
  alert("预览功能开发中...");
}

/** 保存模板 */
function handleSave() {
  const editor = getEditor();
  if (!editor) return;

  const template = editor.getJSON();
  console.log("保存模板：", template);
  alert("模板已保存（查看控制台）");
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

    document.addEventListener("click", handleEditorAreaClick);
  });
});

onBeforeUnmount(() => {
  const editor = getEditor();
  if (editor) {
    editor.off("selectionUpdate", handleSelectionUpdate);
  }

  document.removeEventListener("click", handleEditorAreaClick);
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
