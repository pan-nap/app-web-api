/**
 * Variable — 变量节点（内联、不可拆分、原子节点）
 *
 * 属性：
 *   varKey:     变量唯一标识
 *   varLabel:   变量显示标签
 *   varValue:   变量值（填充后）
 *   varDataType: 数据类型
 *   required:   是否必填
 *   options:    选项列表
 *
 * atom: true 保证变量作为一个整体被选中/删除
 */
import { Node, mergeAttributes } from "@tiptap/core";

export interface VariableOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (attrs: {
        varKey: string;
        varLabel: string;
        varValue?: string;
        varDataType?: string;
        required?: boolean;
        options?: { value: string; label: string }[];
      }) => ReturnType;
      updateVariable: (varKey: string, value: string) => ReturnType;
    };
  }
}

export const Variable = Node.create<VariableOptions>({
  name: "variable",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      varKey: { default: "" },
      varLabel: { default: "" },
      varValue: { default: "" },
      varDataType: { default: "text" },
      required: { default: false },
      options: { default: [] }
    };
  },

  parseHTML() {
    return [{ tag: "span[data-variable]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { varValue, varLabel, varKey, required } = HTMLAttributes;
    const showText = (varValue as string) || (varLabel as string);
    return [
      "span",
      mergeAttributes(
        {
          "data-variable": varKey as string,
          class: "emr-variable inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-sm border cursor-default select-none"
        },
        varValue
          ? { class: "emr-variable emr-variable--filled bg-green-50 text-green-700 border-green-200" }
          : { class: "emr-variable emr-variable--empty bg-blue-50 text-blue-700 border-blue-200" },
        required ? { class: "emr-variable--required" } : {}
      ),
      ...(required ? [["span", { class: "text-red-500 mr-0.5" }, "*"]] : []),
      showText as string
    ];
  },

  addCommands() {
    return {
      insertVariable:
        (attrs) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
      updateVariable:
        (varKey: string, value: string) =>
        ({ state, dispatch }) => {
          const tr = state.tr;
          let found = false;
          tr.doc.descendants((node, pos) => {
            if (!found && node.type.name === this.name && node.attrs.varKey === varKey) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, varValue: value });
              found = true;
              return false;
            }
            return !found;
          });
          if (found && dispatch) {
            dispatch(tr);
            return true;
          }
          return false;
        }
    };
  }
});
