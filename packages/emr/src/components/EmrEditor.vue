<template>
  <div class="emr-editor">
    <emr-toolbar :editor="editor" />
    <editor-content :editor="editor" class="emr-content bg-white shadow-sm my-2" />
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
import { VariableExtension } from "../extensions/VariableExtension";
import { PageBreakExtension } from "../extensions/PageBreakExtension";
import { useVariableEditing } from "../hooks/useVariableEditing";
import { useTableContextMenu } from "../hooks/useTableContextMenu";
import { useEmrApi } from "../hooks/useEmrApi";
import EmrToolbar from "./EmrToolbar.vue";

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
  content: ""
});

useVariableEditing(editor);
useTableContextMenu(editor);

defineExpose(useEmrApi(editor));
</script>

<style scoped>
.emr-editor {
  color: #000;
  font-size: 15px;
  line-height: 1.5;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  overflow: hidden;
}

.emr-content {
  padding: 15mm;
  overflow: auto;
  box-sizing: border-box;
}
.emr-content :deep(.ProseMirror) {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm;
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
.emr-content :deep(.page-break) {
  width: 100%;
  height: 1px;
  background: #ccc;
  position: relative;
  margin: 16px 0;
}

.emr-content :deep(.page-break-text) {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 12px;
  background: white;
  padding: 0 8px;
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
:deep(.ProseMirror .selectedCell) {
  background-color: rgba(0, 150, 255, 0.1); /* 浅蓝色背景 */
}
</style>
