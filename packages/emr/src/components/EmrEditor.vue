<template>
  <div class="emr-editor flex flex-col h-full bg-gray-100">
    <EmrToolbar :editor="editor" />
    <div class="flex-1 mt-2 overflow-hidden flex gap-2">
      <slot name="left"></slot>
      <div class="emr-scroll flex-1 overflow-auto">
        <div class="emr-paper mx-auto bg-white rounded-sm min-h-[500px] p-8 shadow-sm mb-2">
          <editor-content :editor="editor" class="emr-content outline-none" />
        </div>
      </div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import EmrToolbar from "./EmrToolbar.vue";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { VariableExtension } from "../extensions/VariableExtension";
import { temData, demoData } from "../data/data1.ts";

const applyDataToTemplate = (template: any, data: Record<string, string>) => {
  const applyToNode = (node: any): any => {
    if (!node) return node;
    if (node.type === "variable" && node.attrs?.varKey) {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          varValue: data[node.attrs.varKey] || ""
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
  return applyToNode(template);
};

const getTemplate = (): any => {
  if (!editor.value) return null;
  const json = editor.value.getJSON();
  const cleanNode = (node: any): any => {
    if (!node) return node;
    if (node.type === "variable" && node.attrs) {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          varValue: ""
        }
      };
    }
    if (node.content && Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.map(cleanNode)
      };
    }
    return node;
  };
  return cleanNode(json);
};

const updateVariables = (data: Record<string, string>) => {
  if (!editor.value) return;
  editor.value
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const { doc } = state;
      let modified = false;
      doc.descendants((node, pos) => {
        if (node.type.name === "variable") {
          const varKey = node.attrs.varKey;
          const newValue = data[varKey];
          if (newValue !== undefined && newValue !== node.attrs.varValue) {
            const attrs = { ...node.attrs, varValue: newValue };
            tr.setNodeMarkup(pos, undefined, attrs);
            modified = true;
          }
        }
        return true;
      });
      return modified;
    })
    .run();
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
    })
  ],
  content: applyDataToTemplate(temData, demoData)
});

defineExpose({
  getTemplate,
  updateVariables,
  editor
});
</script>

<style scoped>
.emr-editor {
  height: 100%;
  overflow: hidden;
  font-size: 15px;
  line-height: 1.5;
}

.emr-paper {
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
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
}

.emr-content :deep(th),
.emr-content :deep(td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.emr-content :deep(th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

.emr-content :deep(.emr-variable) {
  display: inline-block;
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #7dd3fc;
  cursor: pointer;
}

.emr-content :deep(.emr-variable[contenteditable="false"]) {
  pointer-events: none;
}
</style>
