import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import type { Editor } from "@tiptap/vue-3";

export const useTableContextMenu = (editor: { value: Editor | undefined }) => {
  const showMenu = ref(false);
  const menuPosition = reactive({ x: 0, y: 0 });
  let menuContainer: HTMLElement | null = null;
  let isSelecting = false;
  let startCell: HTMLTableCellElement | null = null;
  let selectedCells: HTMLTableCellElement[] = [];

  const HIGHLIGHT_CLASS = "emr-table-cell-highlight";

  const createMenu = () => {
    if (menuContainer) return;

    menuContainer = document.createElement("div");
    menuContainer.className = "emr-context-menu-container";
    menuContainer.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: none;
    `;

    const menu = document.createElement("div");
    menu.className = "emr-context-menu";
    menu.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: 160px;
      padding: 4px 0;
      font-size: 14px;
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

    menu.appendChild(createItem("在上方插入行", insertRowBefore));
    menu.appendChild(createItem("在下方插入行", insertRowAfter));
    menu.appendChild(createDivider());
    menu.appendChild(createItem("在左侧插入列", insertColumnBefore));
    menu.appendChild(createItem("在右侧插入列", insertColumnAfter));
    menu.appendChild(createDivider());
    menu.appendChild(createItem("合并单元格", mergeCells));
    menu.appendChild(createItem("取消单元格合并", splitCell));
    menu.appendChild(createDivider());
    menu.appendChild(createItem("删除行", deleteRow, true));
    menu.appendChild(createItem("删除列", deleteColumn, true));

    menuContainer.appendChild(menu);
    document.body.appendChild(menuContainer);

    menuContainer.addEventListener("click", (e) => {
      if (e.target === menuContainer) {
        closeMenu();
      }
    });

    menuContainer.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  };

  const getCellIndex = (cell: HTMLTableCellElement): { row: number; col: number } => {
    const row = cell.parentElement;
    if (!row) return { row: 0, col: 0 };

    const cells = Array.from(row.children) as HTMLTableCellElement[];
    let colIndex = 0;
    let currentCol = 0;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === cell) {
        colIndex = currentCol;
        break;
      }
      currentCol += cells[i]?.colSpan || 1;
    }

    const rows = Array.from(row.parentElement?.children || []);
    let rowIndex = 0;
    let currentRow = 0;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i] === row) {
        rowIndex = currentRow;
        break;
      }
      const rowCells = Array.from((rows[i] as HTMLElement).children) as HTMLTableCellElement[];
      const maxRowSpan = Math.max(...rowCells.map((c) => c.rowSpan || 1));
      currentRow += maxRowSpan;
    }

    return { row: rowIndex, col: colIndex };
  };

  const highlightCells = (endCell: HTMLTableCellElement) => {
    if (!startCell) return;

    const table = startCell.closest("table");
    if (!table) return;

    clearHighlights();

    const startIndex = getCellIndex(startCell);
    const endIndex = getCellIndex(endCell);

    const minRow = Math.min(startIndex.row, endIndex.row);
    const maxRow = Math.max(startIndex.row, endIndex.row);
    const minCol = Math.min(startIndex.col, endIndex.col);
    const maxCol = Math.max(startIndex.col, endIndex.col);

    const rows = Array.from(table.querySelectorAll("tr"));
    let currentRow = 0;

    for (const row of rows) {
      const cells = Array.from(row.children) as HTMLTableCellElement[];
      let currentCol = 0;

      for (const cell of cells) {
        const cellRowSpan = cell.rowSpan || 1;
        const cellColSpan = cell.colSpan || 1;

        const cellStartRow = currentRow;
        const cellEndRow = currentRow + cellRowSpan - 1;
        const cellStartCol = currentCol;
        const cellEndCol = currentCol + cellColSpan - 1;

        const cellMidRow = Math.floor((cellStartRow + cellEndRow) / 2);
        const cellMidCol = Math.floor((cellStartCol + cellEndCol) / 2);

        const isInRange = cellMidRow >= minRow && cellMidRow <= maxRow && cellMidCol >= minCol && cellMidCol <= maxCol;

        if (isInRange) {
          cell.classList.add(HIGHLIGHT_CLASS);
          selectedCells.push(cell);
        }

        currentCol += cellColSpan;
      }

      const maxRowSpanInRow = Math.max(...cells.map((c) => c.rowSpan || 1));
      currentRow += maxRowSpanInRow;
    }
  };

  const clearHighlights = () => {
    selectedCells.forEach((cell) => {
      cell.classList.remove(HIGHLIGHT_CLASS);
    });
    selectedCells = [];
  };

  const handleContextMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const tableElement = target.closest("table");
    const containerElement = target.closest(".emr-context-menu-container") as HTMLElement;

    if (!tableElement && containerElement?.style?.display === "none") return;

    event.preventDefault();

    if (showMenu.value && menuContainer) {
      menuPosition.x = event.clientX;
      menuPosition.y = event.clientY;
      const menu = menuContainer.querySelector(".emr-context-menu") as HTMLElement;
      if (menu) {
        menu.style.left = `${menuPosition.x}px`;
        menu.style.top = `${menuPosition.y}px`;
      }
      return;
    }

    const cell = target.closest("td, th") as HTMLTableCellElement;
    if (!cell || !editor.value) return;

    if (!isSelecting) {
      startCell = cell;
      highlightCells(cell);
    }

    createMenu();
    menuPosition.x = event.clientX;
    menuPosition.y = event.clientY;
    showMenu.value = true;

    if (menuContainer) {
      menuContainer.style.display = "block";
      const menu = menuContainer.querySelector(".emr-context-menu") as HTMLElement;
      if (menu) {
        menu.style.left = `${menuPosition.x}px`;
        menu.style.top = `${menuPosition.y}px`;
      }
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const cell = target.closest("td, th") as HTMLTableCellElement;
    const variableElement = target.closest(".emr-variable");

    if (!cell || variableElement) {
      isSelecting = false;
      startCell = null;
      clearHighlights();
      return;
    }

    isSelecting = true;
    startCell = cell;
    highlightCells(cell);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isSelecting || !startCell) return;

    const target = event.target as HTMLElement;
    const cell = target.closest("td, th") as HTMLTableCellElement;

    if (cell && cell.closest("table") === startCell.closest("table")) {
      highlightCells(cell);
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!isSelecting) return;

    isSelecting = false;

    if (event.button !== 2) {
      clearHighlights();
    }
  };

  const closeMenu = () => {
    showMenu.value = false;
    if (menuContainer) {
      menuContainer.style.display = "none";
    }
    clearHighlights();
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
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    const style = document.createElement("style");
    style.textContent = `
      .${HIGHLIGHT_CLASS} {
        background-color: rgba(59, 130, 246, 0.2) !important;
        box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.6) !important;
      }
    `;
    document.head.appendChild(style);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    clearHighlights();
    if (menuContainer) {
      document.body.removeChild(menuContainer);
      menuContainer = null;
    }
  });

  return {
    showMenu,
    menuPosition,
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
