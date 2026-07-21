import type { Editor } from "@tiptap/vue-3";
import type { InsertVariableOptions, VariableChange } from "../types/emr";
import { getValueByPath } from "../utils/templateUtils";

export const useEmrApi = (editor: { value: Editor | undefined }) => {
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

  const compareVariables = (originalData: Record<string, any>): VariableChange[] => {
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
  };

  const getVariables = (): Record<string, any> => {
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
  };

  const updateVariables = (data: Record<string, any>) => {
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
  };

  return {
    getTemplate,
    insertVariable,
    compareVariables,
    getVariables,
    updateVariables
  };
};
