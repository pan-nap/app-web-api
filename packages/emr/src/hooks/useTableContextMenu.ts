import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Editor } from "@tiptap/vue-3";

export const useTableContextMenu = (editor: { value: Editor | undefined }) => {
  const showMenu = ref(false);
  let menuElement: HTMLElement | null = null;

  const createMenu = () => {
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

    const createItem = (text: string, onClick: () => void, isDanger = false) => {
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
    };

    const createDivider = () => {
      const divider = document.createElement("div");
      divider.className = "emr-context-menu-divider";
      divider.style.cssText = `
        height: 1px;
        background-color: #e5e7eb;
        margin: 4px 0;
      `;
      return divider;
    };

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
  };

  const handleContextMenu = (event: MouseEvent) => {
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

    createMenu();
    showMenu.value = true;

    if (menuElement) {
      menuElement.style.display = "block";
      menuElement.style.left = `${event.clientX}px`;
      menuElement.style.top = `${event.clientY}px`;
    }
  };

  const closeMenu = () => {
    showMenu.value = false;
    if (menuElement) {
      menuElement.style.display = "none";
    }
  };

  const insertRowBefore = () => {
    if (!editor.value) return;
    editor.value.chain().focus().addRowBefore().run();
    closeMenu();
  };

  const insertRowAfter = () => {
    if (!editor.value) return;
    editor.value.chain().focus().addRowAfter().run();
    closeMenu();
  };

  const insertColumnBefore = () => {
    if (!editor.value) return;
    editor.value.chain().focus().addColumnBefore().run();
    closeMenu();
  };

  const insertColumnAfter = () => {
    if (!editor.value) return;
    editor.value.chain().focus().addColumnAfter().run();
    closeMenu();
  };

  const mergeCells = () => {
    if (!editor.value) return;
    editor.value.chain().focus().mergeCells().run();
    closeMenu();
  };

  const splitCell = () => {
    if (!editor.value) return;
    editor.value.chain().focus().splitCell().run();
    closeMenu();
  };

  const deleteRow = () => {
    if (!editor.value) return;
    editor.value.chain().focus().deleteRow().run();
    closeMenu();
  };

  const deleteColumn = () => {
    if (!editor.value) return;
    editor.value.chain().focus().deleteColumn().run();
    closeMenu();
  };

  onMounted(() => {
    document.addEventListener("contextmenu", handleContextMenu);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("contextmenu", handleContextMenu);
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
