<template>
  <div class="emr-editor flex flex-col h-full overflow-hidden bg-gray-100">
    <emr-toolbar :editor="editor" />
    <div class="flex-1 overflow-auto mt-2 flex gap-2 items-start justify-between">
      <slot name="left"></slot>
      <div class="emr-scroll overflow-auto flex-1 flex items-center justify-center">
        <div class="emr-paper bg-white shadow-sm mb-2">
          <editor-content :editor="editor" class="emr-content" />
        </div>
      </div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import EmrToolbar from "./EmrToolbar.vue";
import { VariableExtension } from "../extensions/VariableExtension";
import { PageBreakExtension } from "../extensions/PageBreakExtension";
import { getValueByPath, decodeOptions, normalizeTemplate } from "../utils/templateUtils";
import { temData2, data2 } from "../data/data2.ts";
import { useVariableEditing } from "../hooks/useVariableEditing";
import { useEmrApi } from "../hooks/useEmrApi";

const applyDataToTemplate = (template: any, data: Record<string, any>) => {
  const normalized = normalizeTemplate(template);

  const applyToNode = (node: any): any => {
    if (!node) return node;

    if (node.type === "field" && node.attrs) {
      const attrs = node.attrs;
      const refKey = attrs["data-ref-key"] || "";
      const widgetName = attrs["data-widget-name"] || "";
      const widgetType = attrs["data-widget-type"] || "text";
      const extensionValue = getValueByPath(data, refKey) || attrs["data-extension-value"] || "";
      const optionsStr = attrs["data-options"] || "";
      const placeholder = attrs["data-placeholder"] || "";

      return {
        type: "variable",
        attrs: {
          refKey,
          widgetName,
          widgetType,
          extensionValue,
          options: decodeOptions(optionsStr),
          required: attrs["data-required"] !== "" || attrs["data-required-warning"] !== "",
          placeholder
        }
      };
    }

    if (node.content && Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.map(applyToNode)
      };
    }

    return node;
  };

  return applyToNode(normalized);
};

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }
    }),
    VariableExtension,
    Table.configure({
      resizable: true
    }),
    TableRow,
    TableCell,
    TableHeader,
    Placeholder.configure({
      placeholder: "开始输入内容..."
    }),
    TextStyle,
    TextAlign.configure({
      types: ["heading", "paragraph"]
    }),
    PageBreakExtension
  ],
  content: applyDataToTemplate(temData2, data2)
});

useVariableEditing(editor);
const { getTemplate, insertVariable, compareVariables, getVariables, updateVariables } = useEmrApi(editor);

defineExpose({
  getTemplate,
  getVariables,
  updateVariables,
  insertVariable,
  compareVariables
});
</script>

<style scoped>
.emr-editor {
  color: #000;
  font-size: 15px;
  line-height: 1.5;
}

.emr-paper {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm;
  box-sizing: border-box;
}
.emr-content {
  min-height: 100%;
}
.emr-content :deep(p) {
  margin: 0 0 1em 0;
}

.emr-content :deep(h1) {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 0.5em 0;
}

.emr-content :deep(h2) {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 0.5em 0;
}

.emr-content :deep(ul),
.emr-content :deep(ol) {
  padding-left: 1.5em;
  margin: 0 0 1em 0;
}

.emr-content :deep(li) {
  margin: 0.3em 0;
}

.emr-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  table-layout: fixed;
}

.emr-content :deep(th),
.emr-content :deep(td) {
  border: 1px solid #000;
  padding: 4px 6px;
  text-align: left;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  font-size: 11pt;
  line-height: 1.4;
  vertical-align: middle;
}

.emr-content :deep(th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

.emr-content :deep(.emr-variable) {
  display: inline-block;
  min-width: 30px;
  text-align: center;
  padding: 0 4px;
  border-bottom: 1px solid #000;
  cursor: pointer;
  line-height: inherit;
}
.emr-content :deep(.emr-variable-filled) {
  color: #000;
}
.emr-content :deep(.emr-variable-empty) {
  color: #7fbdff;
  background: rgba(184, 218, 255, 0.23);
}

.emr-content :deep(.ProseMirror-focused) {
  outline: none;
  border: none;
}

.emr-content :deep(.page-break) {
  position: relative;
}
.emr-content :deep(.page-break::after) {
  content: "分页符";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 0.8rem;
  background: white;
  padding: 0 0.5rem;
}

.emr-content :deep(.emr-variable-select) {
  padding-right: 18px;
  position: relative;
}

.emr-content :deep(.emr-variable-select::after) {
  content: "▼";
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  color: #999;
}
</style>
