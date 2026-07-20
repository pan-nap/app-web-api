<template>
  <div class="emr-editor flex flex-col h-full bg-gray-100">
    <EmrToolbar :editor="editor" />
    <div class="flex-1 overflow-hidden mt-2 flex gap-2 items-start justify-between">
      <slot name="left"></slot>
      <div class="emr-scroll flex-1 overflow-auto">
        <div class="emr-paper mx-auto bg-white rounded-sm p-8 shadow-sm mb-2">
          <editor-content :editor="editor" class="emr-content outline-none" />
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
import EmrToolbar from "./EmrToolbar.vue";
import { VariableExtension } from "../extensions/VariableExtension";
import { PageBreakExtension } from "../extensions/PageBreakExtension";
import { getValueByPath, decodeOptions, normalizeTemplate } from "../utils/templateUtils";
import type { InsertVariableOptions } from "../types/emr";
import { temData2, data2 } from "../data/data2.ts";

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

      return {
        type: "variable",
        attrs: {
          refKey,
          widgetName,
          widgetType,
          extensionValue,
          options: decodeOptions(optionsStr),
          required: attrs["data-required"] !== "" || attrs["data-required-warning"] !== ""
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
          extensionValue: ""
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

const updateVariables = (data: Record<string, any>) => {
  if (!editor.value) return;

  editor.value
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const { doc } = state;
      let modified = false;

      doc.descendants((node, pos) => {
        if (node.type.name === "variable") {
          const refKey = node.attrs.refKey;
          const newValue = getValueByPath(data, refKey);

          if (newValue !== undefined && String(newValue) !== node.attrs.extensionValue) {
            const attrs = { ...node.attrs, extensionValue: String(newValue) };
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

const getVariables = (): Record<string, string> => {
  if (!editor.value) return {};

  const variables: Record<string, string> = {};

  editor.value.state.doc.descendants((node) => {
    if (node.type.name === "variable") {
      const refKey = node.attrs.refKey;
      if (refKey) {
        variables[refKey] = node.attrs.extensionValue || "";
      }
    }

    return true;
  });

  return variables;
};

const insertVariable = (options: InsertVariableOptions) => {
  if (!editor.value) return;

  editor.value
    .chain()
    .focus()
    .insertContent({
      type: "variable",
      attrs: {
        refKey: options.refKey,
        widgetName: options.widgetName,
        widgetType: options.widgetType || "text",
        extensionValue: options.extensionValue || "",
        options: options.options || [],
        required: options.required || false
      }
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
    }),
    TextStyle,
    PageBreakExtension
  ],
  content: applyDataToTemplate(temData2, data2)
});

defineExpose({
  getTemplate,
  getVariables,
  updateVariables,
  insertVariable
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

.emr-content :deep(.ProseMirror-focused) {
  outline: none;
  border: none;
}

.emr-content :deep(.page-break) {
  border: none;
  border-top: 1px dashed #ddd;
  margin: 1em 0;
  page-break-after: always;
}
</style>
