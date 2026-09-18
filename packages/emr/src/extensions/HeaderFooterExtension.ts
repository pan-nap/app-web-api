import { Node, mergeAttributes, Extension } from "@tiptap/core";
import type { Command } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    emrHeaderFooter: {
      /** 插入页眉（全文档仅允许一个） */
      insertHeader: () => ReturnType;
      /** 插入页脚（全文档仅允许一个） */
      insertFooter: () => ReturnType;
    };
  }
}

/** 文档中是否已存在指定类型的块节点 */
function hasNodeType(editor: any, typeName: string): boolean {
  let found = false;
  editor.state.doc.descendants((node: any) => {
    if (node.type.name === typeName) {
      found = true;
      return false;
    }
    return !found;
  });
  return found;
}

/**
 * 页眉节点
 *
 * 作为文档中的可编辑块节点存在（内部为 block* 段落），随模板 JSON 一起保存/回显。
 * - selectable: false —— 不启用 NodeSelection，避免鼠标选中态与 Vue 渲染冲突，点击直接进入内部编辑
 * - draggable: false  —— 不允许拖拽移动位置
 * - defining: false   —— 避免影响周围 undo 历史与跨边界合并行为
 * 全文档仅允许一个页眉/页脚，由插入命令 + 键盘守卫共同保证（见 HeaderFooterGuard）
 */
export const HeaderExtension = Node.create({
  name: "header",
  group: "block",
  content: "block*",
  selectable: false,
  draggable: false,
  defining: false,

  parseHTML() {
    return [{ tag: "div[data-emr-header]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-emr-header": "true", class: "emr-header" }), 0];
  },

  addCommands() {
    // 插入页眉：全文档仅允许一个，插入到文档开头，并把光标移入正文首段
    return {
      insertHeader:
        (): Command =>
        ({ editor, dispatch }) => {
          if (hasNodeType(editor, "header")) return false;
          if (dispatch) {
            const node = this.type.create(null, [editor.schema.nodes.paragraph!.create()]);
            editor.view.dispatch(editor.state.tr.insert(0, node));
            const bodyPos = Math.min(node.nodeSize + 1, editor.state.doc.content.size);
            editor.chain().focus().setTextSelection(bodyPos).run();
          }
          return true;
        }
    };
  }
});

/**
 * 页脚节点（结构同页眉）
 */
export const FooterExtension = Node.create({
  name: "footer",
  group: "block",
  content: "block*",
  selectable: false,
  draggable: false,
  defining: false,

  parseHTML() {
    return [{ tag: "div[data-emr-footer]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-emr-footer": "true", class: "emr-footer" }), 0];
  },

  addCommands() {
    // 插入页脚：全文档仅允许一个，插入到文档末尾
    return {
      insertFooter:
        (): Command =>
        ({ editor, dispatch }) => {
          if (hasNodeType(editor, "footer")) return false;
          if (dispatch) {
            const node = this.type.create(null, [editor.schema.nodes.paragraph!.create()]);
            const endPos = editor.state.doc.content.size;
            editor.view.dispatch(editor.state.tr.insert(endPos, node));
            editor.commands.focus();
          }
          return true;
        }
    };
  }
});

/** 判断光标所在的逻辑区域：header / footer / body */
function getZone($pos: any): "header" | "footer" | "body" {
  for (let depth = $pos.depth; depth > 0; depth--) {
    const name = $pos.node(depth).type.name;
    if (name === "header") return "header";
    if (name === "footer") return "footer";
  }
  return "body";
}

/**
 * 页眉/页脚键盘导航守卫
 *
 * 规则：
 * 1. 节点 selectable:false，鼠标点击可直接进入内部编辑；
 * 2. 键盘方向键/Home/End/PageUp/PageDown/Tab 不允许从 body 跨入 header/footer，也不允许 header↔footer 直跳；
 * 3. 允许在同一区域内自由导航，以及从 header/footer 内部离开到 body；
 * 4. Backspace/Delete 在 body 紧邻页眉/页脚的边界处阻止误删节点。
 */
export const HeaderFooterGuard = Extension.create({
  name: "headerFooterGuard",

  addProseMirrorPlugins() {
    let keyboardNav = false;

    return [
      new Plugin({
        key: new PluginKey("headerFooterGuard"),
        props: {
          handleKeyDown(view, event) {
            const { selection, doc } = view.state;
            const $cursor = doc.resolve(selection.from);
            const zone = getZone($cursor);

            // Backspace：body 首段开头退格，紧邻前一节点是 header/footer → 阻止，避免误删节点
            if (event.key === "Backspace" && zone === "body") {
              if ($cursor.depth === 1 && $cursor.parentOffset === 0) {
                const idx = $cursor.index(0) - 1;
                if (idx >= 0) {
                  const prev = $cursor.node(0).child(idx);
                  if (prev.type.name === "header" || prev.type.name === "footer") {
                    return true;
                  }
                }
              }
            }

            // Delete：body 末段末尾删除，紧邻后一节点是 header/footer → 阻止
            if (event.key === "Delete" && zone === "body") {
              if ($cursor.depth === 1) {
                const node = $cursor.parent;
                if ($cursor.parentOffset === node.content.size) {
                  const idx = $cursor.index(0) + 1;
                  if (idx < $cursor.node(0).childCount) {
                    const next = $cursor.node(0).child(idx);
                    if (next.type.name === "header" || next.type.name === "footer") {
                      return true;
                    }
                  }
                }
              }
            }

            const navKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", "Tab"];
            if (navKeys.includes(event.key)) {
              keyboardNav = true;
            }

            return false;
          }
        },
        appendTransaction(_transactions, oldState, newState) {
          if (!keyboardNav) return null;
          keyboardNav = false;

          const oldZone = getZone(oldState.selection.$head);
          const newZone = getZone(newState.selection.$head);

          // 同一区域内导航：放行
          if (oldZone === newZone) return null;
          // 从 header/footer 离开到 body：放行
          if (oldZone !== "body" && newZone === "body") return null;
          // body → header/footer，或 header ↔ footer：回退到原选区
          if (oldZone === "body" && newZone !== "body") {
            return newState.tr.setSelection(oldState.selection).scrollIntoView();
          }
          if (oldZone !== "body" && newZone !== "body" && oldZone !== newZone) {
            return newState.tr.setSelection(oldState.selection).scrollIntoView();
          }

          return null;
        }
      })
    ];
  }
});
