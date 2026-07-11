/**
 * MedicalBlock — 医疗区块节点（块级）
 *
 * 属性：
 *   blockId:   唯一标识
 *   blockName: 显示名称
 *   required:  是否必填
 *   deletable: 是否可删除
 *   editable:  是否可编辑
 *   collapsed: 是否折叠
 *   sortOrder: 排序号
 *
 * 内容：blocks 类型，即可包含段落、表格、图片等
 */
import { Node, mergeAttributes } from "@tiptap/core";

export interface MedicalBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    medicalBlock: {
      insertMedicalBlock: (attrs: {
        blockId: string;
        blockName: string;
        required?: boolean;
        deletable?: boolean;
        editable?: boolean;
        collapsed?: boolean;
        sortOrder?: number;
      }) => ReturnType;
      toggleBlockCollapse: (blockId: string) => ReturnType;
      resetBlock: (blockId: string) => ReturnType;
    };
  }
}

export const MedicalBlock = Node.create<MedicalBlockOptions>({
  name: "medicalBlock",
  group: "block",
  content: "block*",
  defining: true,
  addAttributes() {
    return {
      blockId: { default: "" },
      blockName: { default: "" },
      required: { default: false },
      deletable: { default: true },
      editable: { default: true },
      collapsed: { default: false, parseHTML: (el) => el.hasAttribute("data-collapsed") },
      sortOrder: { default: 0 }
    };
  },

  parseHTML() {
    return [{ tag: "section[data-medical-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { blockName, required, collapsed } = HTMLAttributes;
    return [
      "section",
      mergeAttributes(
        { "data-medical-block": HTMLAttributes.blockId as string, "data-collapsed": collapsed ? "" : undefined },
        { class: "emr-block border border-gray-200 rounded-lg mb-3 overflow-hidden" },
        required ? { class: "emr-block--required bg-gray-50" } : {}
      ),
      [
        "div",
        { class: "emr-block__header flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200" },
        [
          "div",
          { class: "flex items-center gap-2" },
          ...(required ? [["span", { class: "text-red-500 mr-1" }, "*"]] : []),
          ["span", { class: "font-medium text-gray-800" }, blockName as string]
        ],
        ["div", { class: "flex items-center gap-2" }, ...(collapsed ? [["span", {}, "\u25BC"]] : [["span", {}, "\u25B2"]])]
      ],
      ["div", { class: `emr-block__content p-3 ${collapsed ? "hidden" : ""}` }, 0]
    ];
  },

  addCommands() {
    return {
      insertMedicalBlock:
        (attrs) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
      toggleBlockCollapse:
        (blockId: string) =>
        ({ state, dispatch }) => {
          const tr = state.tr;
          let found = false;
          tr.doc.descendants((node, pos) => {
            if (!found && node.type.name === this.name && node.attrs.blockId === blockId) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, collapsed: !node.attrs.collapsed });
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
        },
      resetBlock:
        (blockId: string) =>
        ({ state, dispatch }) => {
          const tr = state.tr;
          let found = false;
          tr.doc.descendants((node, pos, parent) => {
            if (!found && node.type.name === this.name && node.attrs.blockId === blockId) {
              // 清空子节点，插入一个空段落
              const paragraph = state.schema.nodes.paragraph?.create();
              if (paragraph) {
                tr.replaceWith(pos + 1, pos + node.nodeSize - 1, paragraph);
              }
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
