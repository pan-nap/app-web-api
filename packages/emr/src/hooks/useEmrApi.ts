import type { Editor } from "@tiptap/vue-3";
import type { InsertVariableOptions, VariableChange } from "../types/emr";
import { getValueByPath, decodeOptions, normalizeTemplate } from "../utils/templateUtils";
import { temData2, data2 } from "../data/data2.ts";
import { onMounted } from "vue";

export const useEmrApi = (editor: { value: Editor | undefined }) => {
  function getTemplate(): any {
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
  }

  function insertVariable(options: InsertVariableOptions) {
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
  }

  function compareVariables(originalData: Record<string, any>): VariableChange[] {
    if (!editor.value) return [];

    const changes: VariableChange[] = [];

    editor.value.state.doc.descendants((node) => {
      if (node.type.name === "variable") {
        const refKey = node.attrs.refKey;
        if (refKey) {
          const currentValue = node.attrs.extensionValue || "";
          const oldValue = getValueByPath(originalData, refKey) || "";

          if (currentValue !== oldValue) {
            changes.push({
              refKey,
              widgetName: node.attrs.widgetName || refKey,
              oldValue,
              newValue: currentValue
            });
          }
        }
      }

      return true;
    });

    return changes;
  }

  function getVariables(): Record<string, any> {
    if (!editor.value) return {};

    const variables: Record<string, any> = {};

    editor.value.state.doc.descendants((node) => {
      if (node.type.name === "variable") {
        const refKey = node.attrs.refKey;
        if (refKey) {
          const value = node.attrs.extensionValue || "";
          const parts = refKey.split(".");
          let current = variables;

          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
              current[part] = value;
            } else {
              if (!current[part]) {
                current[part] = {};
              }
              current = current[part];
            }
          }
        }
      }

      return true;
    });

    return variables;
  }

  function updateVariables(data: Record<string, any>) {
    if (!editor.value) return;

    const transaction = editor.value.state.tr;

    editor.value.state.doc.descendants((node, pos) => {
      if (node.type.name === "variable") {
        const refKey = node.attrs.refKey;
        if (refKey) {
          const newValue = getValueByPath(data, refKey);
          if (newValue !== undefined && newValue !== node.attrs.extensionValue) {
            transaction.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              extensionValue: String(newValue)
            });
          }
        }
      }
      return true;
    });

    editor.value.view.dispatch(transaction);
  }

  function applyDataToTemplate(template: any, data: Record<string, any>) {
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
  }

  function setContent(template?: any, data?: Record<string, any>) {
    if (!editor.value) return;
    editor.value.commands.setContent(applyDataToTemplate(template || temData2, data || data2));
  }

  onMounted(() => {
    setContent();
  });

  return {
    setContent,
    getTemplate,
    insertVariable,
    compareVariables,
    getVariables,
    updateVariables
  };
};
