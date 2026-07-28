import type { Editor } from "@tiptap/vue-3";
import type { InsertVariableOptions, VariableChange, EmrEditorProps } from "../types";
import { getValueByPath, decodeOptions, normalizeTemplate } from "../utils/templateUtils";
import { temData2, data2 } from "../data/data2.ts";
import { onMounted } from "vue";

export const useEmrApi = (editor: { value: Editor | undefined }, props: EmrEditorProps) => {
  /** 获取编辑器实例 */
  function getEditor(): Editor | null {
    return editor.value || null;
  }

  /** 获取模板内容（清除变量值，返回纯净模板） */
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

  /** 在光标位置插入变量节点 */
  function insertVariable(options: InsertVariableOptions) {
    if (!editor.value || props.disabled) return;

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

  /** 比对当前变量值与原始数据的差异，返回变更列表 */
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

  /** 获取当前所有变量值（返回嵌套结构对象） */
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

  /** 根据数据更新编辑器中变量的值 */
  function updateVariables(data: Record<string, any>) {
    if (!editor.value || props.disabled) return;

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

  /** 将数据应用到模板，将字段节点转换为变量节点 */
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

  /** 设置编辑器内容（模板+数据） */
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
    updateVariables,
    getEditor
  };
};
