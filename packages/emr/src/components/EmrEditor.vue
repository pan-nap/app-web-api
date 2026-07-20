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

    <Teleport to="body">
      <div v-if="showDropdown" class="emr-dropdown-overlay" @click.self="showDropdown = false">
        <div class="emr-dropdown-menu" :style="dropdownStyle">
          <div
            v-for="option in dropdownOptions"
            :key="option.value"
            class="emr-dropdown-item"
            :class="{ 'emr-dropdown-item-selected': String(option.value) === String(dropdownCurrentValue) }"
            @click="handleDropdownSelect(option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </Teleport>
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
import { ref, reactive, computed } from "vue";
import { getValueByPath, decodeOptions, normalizeTemplate } from "../utils/templateUtils";
import type { InsertVariableOptions } from "../types/emr";
import { temData2, data2 } from "../data/data2.ts";

const showDropdown = ref(false);
const dropdownOptions = ref<{ value: string; label: string }[]>([]);
const dropdownCurrentValue = ref("");
const dropdownRefKey = ref("");
const dropdownPosition = reactive({ x: 0, y: 0 });

const dropdownStyle = computed(() => ({
  left: `${dropdownPosition.x}px`,
  top: `${dropdownPosition.y}px`
}));

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
        required: options.required || false,
        placeholder: options.placeholder || ""
      }
    })
    .run();
};

const handleVariableClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const variableSpan = target.closest(".emr-variable");

  if (!variableSpan || !editor.value) {
    showDropdown.value = false;
    return;
  }

  const refKey = variableSpan.getAttribute("data-ref-key");
  if (!refKey) return;

  editor.value.state.doc.descendants((node, pos) => {
    if (node.type.name === "variable" && node.attrs.refKey === refKey) {
      const widgetType = node.attrs.widgetType || "text";
      const options = node.attrs.options || [];
      const hasDropdown = widgetType === "select" && options.length > 0;

      if (hasDropdown) {
        event.preventDefault();
        event.stopPropagation();

        dropdownOptions.value = options;
        dropdownCurrentValue.value = node.attrs.extensionValue || "";
        dropdownRefKey.value = refKey;

        const rect = variableSpan.getBoundingClientRect();
        dropdownPosition.x = rect.left;
        dropdownPosition.y = rect.bottom;
        showDropdown.value = true;
      } else {
        startInlineEdit(variableSpan as HTMLElement, refKey, node.attrs.extensionValue || "");
      }

      return false;
    }
    return true;
  });
};

const startInlineEdit = (span: HTMLElement, refKey: string, currentValue: string) => {
  const rect = span.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(span);

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentValue;

  input.style.position = "fixed";
  input.style.left = `${rect.left}px`;
  input.style.top = `${rect.top}px`;
  input.style.width = `${Math.max(rect.width, 30)}px`;
  input.style.height = `${rect.height}px`;
  input.style.zIndex = "9999";
  input.style.border = "none";
  input.style.borderBottom = "1px solid #000";
  input.style.outline = "none";
  input.style.background = "#fef3c7";
  input.style.fontSize = computedStyle.fontSize;
  input.style.fontFamily = computedStyle.fontFamily;
  input.style.fontWeight = computedStyle.fontWeight;
  input.style.lineHeight = computedStyle.lineHeight;
  input.style.color = "#000";
  input.style.textAlign = "center";
  input.style.padding = "0 4px";
  input.style.margin = "0";
  input.style.boxSizing = "border-box";

  const finishEdit = (save: boolean) => {
    if (save) {
      updateVariableValue(refKey, input.value.trim());
    }
    input.remove();
  };

  input.addEventListener("blur", () => finishEdit(true));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEdit(true);
    } else if (e.key === "Escape") {
      e.preventDefault();
      finishEdit(false);
    }
  });

  document.body.appendChild(input);
  input.focus();
  input.select();
};

const updateVariableValue = (refKey: string, value: string) => {
  if (!editor.value) return;

  const transaction = editor.value.state.tr;

  editor.value.state.doc.descendants((node, pos) => {
    if (node.type.name === "variable" && node.attrs.refKey === refKey) {
      transaction.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        extensionValue: value
      });
      return false;
    }
    return true;
  });

  editor.value.view.dispatch(transaction);
};

const handleDropdownSelect = (option: { value: string; label: string }) => {
  if (!editor.value || !dropdownRefKey.value) return;

  const transaction = editor.value.state.tr;

  editor.value.state.doc.descendants((node, pos) => {
    if (node.type.name === "variable" && node.attrs.refKey === dropdownRefKey.value) {
      transaction.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        extensionValue: String(option.value)
      });
      return false;
    }
    return true;
  });

  editor.value.view.dispatch(transaction);
  showDropdown.value = false;
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
  content: applyDataToTemplate(temData2, data2),
  onUpdate: ({ editor }) => {
    const contentElement = editor.view.dom;
    contentElement.addEventListener("click", handleVariableClick);
  }
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
  border: none;
  border-top: 1px dashed #ddd;
  margin: 1em 0;
  page-break-after: always;
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

.emr-dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.emr-dropdown-menu {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  max-height: 300px;
  overflow-y: auto;
  padding: 4px 0;
}

.emr-dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.emr-dropdown-item:hover {
  background-color: #f5f5f5;
}

.emr-dropdown-item-selected {
  background-color: #e0f2fe;
  color: #0369a1;
}
</style>
