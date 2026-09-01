import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Editor } from "@tiptap/vue-3";
import { CellSelection } from "@tiptap/pm/tables";
import type { EmrEditorProps } from "../types";

export const useTableContextMenu = (editor: { value: Editor | undefined }, props: EmrEditorProps) => {
  const showMenu = ref(false);
  let menuElement: HTMLElement | null = null;
  /** 右键时保存的单元格选区（anchor/head 位置），菜单动作前恢复 */
  let savedCellSelection: { anchor: number; head: number } | null = null;

  /**
   * 阻止右键 mousedown 破坏表格单元格选区（CellSelection）。
   * 不阻止的话，ProseMirror 会把光标移动到右键点击的单元格，
   * 导致框选高亮（.selectedCell）在 contextmenu 弹出前就消失。
   */
  function handleCellMouseDown(event: MouseEvent) {
    // 仅处理右键
    if (event.button !== 2) return;
    const target = event.target as HTMLElement;
    const tableElement = target.closest("table");
    if (!tableElement) return;
    // 保存当前单元格选区（如有），供菜单动作前恢复
    saveCellSelection();
    // 阻止编辑器消费该 mousedown，保留单元格选区
    event.preventDefault();
    event.stopPropagation();
  }

  /** 保存当前表格单元格选区 */
  function saveCellSelection() {
    const editorInstance = editor.value;
    if (!editorInstance) return;
    const sel = editorInstance.state.selection;
    if (sel instanceof CellSelection) {
      savedCellSelection = { anchor: sel.anchor, head: sel.head };
    } else {
      savedCellSelection = null;
    }
  }

  /**
   * 恢复右键前保存的单元格选区。
   * 若事件链（mousedown/handleClickOn 等）已将 CellSelection 破坏，
   * 在弹出菜单前恢复，确保"合并单元格"等操作基于完整选区执行。
   */
  function restoreCellSelection() {
    if (!savedCellSelection || !editor.value) return;
    const view = editor.value.view;
    const sel = view.state.selection;
    // 当前已是单元格选区则无需恢复
    if (sel instanceof CellSelection) {
      savedCellSelection = null;
      return;
    }
    try {
      const doc = view.state.doc;
      const restored = CellSelection.create(doc, savedCellSelection.anchor, savedCellSelection.head);
      view.dispatch(view.state.tr.setSelection(restored));
    } catch (e) {
      console.error("[emr] 恢复单元格选区失败:", e);
    }
    savedCellSelection = null;
  }

  /** 创建右键菜单 DOM 元素及其子菜单项 */
  function createMenu() {
    if (menuElement) return;

    menuElement = document.createElement("div");
    menuElement.className = "emr-context-menu";
    menuElement.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: 160px;
      padding: 4px 0;
      font-size: 14px;
      z-index: 10000;
      display: none;
    `;

    /** 创建菜单项 */
    function createItem(text: string, onClick: () => void, isDanger = false) {
      const item = document.createElement("div");
      item.className = `emr-context-menu-item${isDanger ? " emr-context-menu-item-danger" : ""}`;
      item.textContent = text;
      item.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        color: ${isDanger ? "#dc2626" : "#374151"};
        white-space: nowrap;
      `;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });
      item.addEventListener("click", onClick);
      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = isDanger ? "#fef2f2" : "#f3f4f6";
      });
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "";
      });
      return item;
    }

    /** 创建菜单项分割线 */
    function createDivider() {
      const divider = document.createElement("div");
      divider.className = "emr-context-menu-divider";
      divider.style.cssText = `
        height: 1px;
        background-color: #e5e7eb;
        margin: 4px 0;
      `;
      return divider;
    }

    menuElement.appendChild(createItem("在上方插入行", insertRowBefore));
    menuElement.appendChild(createItem("在下方插入行", insertRowAfter));
    menuElement.appendChild(createDivider());
    menuElement.appendChild(createItem("在左侧插入列", insertColumnBefore));
    menuElement.appendChild(createItem("在右侧插入列", insertColumnAfter));
    menuElement.appendChild(createDivider());
    menuElement.appendChild(createItem("合并单元格", mergeCells));
    menuElement.appendChild(createItem("取消单元格合并", splitCell));
    menuElement.appendChild(createDivider());
    menuElement.appendChild(createItem("删除行", deleteRow, true));
    menuElement.appendChild(createItem("删除列", deleteColumn, true));

    menuElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    document.body.appendChild(menuElement);
  }

  /** 处理右键菜单事件，显示或更新菜单位置 */
  function handleContextMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const tableElement = target.closest("table");
    const menuElementTarget = target.closest(".emr-context-menu");

    if (!tableElement) {
      if (menuElementTarget) {
        event.preventDefault();
        return;
      }
      closeMenu();
      return;
    }

    event.preventDefault();

    if (showMenu.value && menuElement?.style?.display === "block") {
      menuElement.style.left = `${event.clientX}px`;
      menuElement.style.top = `${event.clientY}px`;
      return;
    }

    const cell = target.closest("td, th") as HTMLTableCellElement;
    if (!cell || !editor.value) return;

    // 恢复右键前保存的单元格选区（若被事件链破坏），再弹出菜单
    restoreCellSelection();

    createMenu();
    showMenu.value = true;

    if (menuElement) {
      menuElement.style.display = "block";
      menuElement.style.left = `${event.clientX}px`;
      menuElement.style.top = `${event.clientY}px`;
    }
  }

  /** 关闭右键菜单 */
  function closeMenu() {
    showMenu.value = false;
    if (menuElement) {
      menuElement.style.display = "none";
    }
  }

  /** 在当前单元格上方插入一行 */
  function insertRowBefore() {
    if (!editor.value) return;
    editor.value.chain().focus().addRowBefore().run();
    closeMenu();
  }

  /** 在当前单元格下方插入一行 */
  function insertRowAfter() {
    if (!editor.value) return;
    editor.value.chain().focus().addRowAfter().run();
    closeMenu();
  }

  /** 在当前单元格左侧插入一列 */
  function insertColumnBefore() {
    if (!editor.value) return;
    editor.value.chain().focus().addColumnBefore().run();
    closeMenu();
  }

  /** 在当前单元格右侧插入一列 */
  function insertColumnAfter() {
    if (!editor.value) return;
    editor.value.chain().focus().addColumnAfter().run();
    closeMenu();
  }

  /** 合并选中的单元格 */
  function mergeCells() {
    if (!editor.value) return;
    editor.value.chain().focus().mergeCells().run();
    closeMenu();
  }

  /** 拆分合并的单元格 */
  function splitCell() {
    if (!editor.value) return;
    editor.value.chain().focus().splitCell().run();
    closeMenu();
  }

  /** 删除当前行 */
  function deleteRow() {
    if (!editor.value) return;
    editor.value.chain().focus().deleteRow().run();
    closeMenu();
  }

  /** 删除当前列 */
  function deleteColumn() {
    if (!editor.value) return;
    editor.value.chain().focus().deleteColumn().run();
    closeMenu();
  }

  onMounted(() => {
    if (props.disabled) return;
    document.addEventListener("contextmenu", handleContextMenu);
    // 捕获阶段拦截右键 mousedown，避免编辑器清空表格单元格选区
    document.addEventListener("mousedown", handleCellMouseDown, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("mousedown", handleCellMouseDown, true);
    if (menuElement) {
      document.body.removeChild(menuElement);
      menuElement = null;
    }
  });

  return {
    showMenu,
    insertRowBefore,
    insertRowAfter,
    insertColumnBefore,
    insertColumnAfter,
    mergeCells,
    splitCell,
    deleteRow,
    deleteColumn
  };
};
