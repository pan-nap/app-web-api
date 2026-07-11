import type { VxeGridInstance, VxeGridProps, VxeGridDefines, VxeTableDefines, VxeGridListeners } from "hs-admin-ui";
import { Utils } from "hs-admin-ui";
import { type Reactive, nextTick, computed, ref, onBeforeMount, onMounted, useTemplateRef } from "vue";
import { omit, cloneDeep, merge, get } from "lodash-es";

export function useGridTableMethods(gridConfig: Reactive<VxeGridProps & { url: string }>) {
  const gridRef = useTemplateRef<VxeGridInstance>("gridRef");
  const checkboxData = ref<any[]>([]);
  const keyPointer = {
    rowIndex: 0,
    columnIndex: 0
  };
  let count = 0;
  const tableData = computed({
    get: () => gridConfig.data,
    set: (val: any) => {
      gridConfig.data = val;
    }
  });
  onBeforeMount(() => {
    clearData();
  });
  onMounted(() => {
    gridRef.value?.focus();
    setTableCellFocus(0, 0);
  });

  /** 清除表格数据 */
  function clearData() {
    remove();
  }

  function getData() {
    return gridConfig.data!.map((i) => omit(i, "_X_ROW_KEY"));
  }

  function getCheckboxData() {
    return checkboxData.value.map((i) => omit(i, "_X_ROW_KEY"));
  }

  /** 删除表格数据 */
  function remove(row?: any | any[]) {
    if (!row) {
      gridConfig.data = [];
      checkboxData.value = [];
      return gridRef.value?.clearCheckboxRow();
    }
    const data = cloneDeep<any>(gridConfig.data);
    gridConfig.data = [];
    return nextTick().then(() => {
      const ids = (Array.isArray(row) ? row : [row]).map((i) => i._X_ROW_KEY);
      gridConfig.data = data.filter((i) => !ids.includes(i._X_ROW_KEY));
      return gridRef.value?.clearAll();
    });
  }

  /** 获取当前勾选的行数据 */
  function getCheckboxRecords() {
    return gridRef.value!.getCheckboxRecords();
  }

  /** 用于 type=checkbox，设置行为选中状态，第二个参数为选中与否 */
  function setCheckboxRow(rows: any | any[], checked: boolean) {
    return gridRef.value!.setCheckboxRow(rows, checked).then(checkboxAll);
  }

  /** 用于 type=checkbox，切换某一行的选中状态 */
  function toggleCheckboxRow(row: any) {
    return gridRef.value!.toggleCheckboxRow(row).then(checkboxAll);
  }

  /** 全选时获取复选框勾选 */
  function checkboxAll() {
    checkboxData.value = getCheckboxRecords();
  }

  /** 表格更新行数据 */
  function updateData(row: any | any[]) {
    const rows = cloneDeep(Array.isArray(row) ? row : [row]);
    rows.forEach((j: any) => {
      const index = gridConfig.data!.findIndex((i) => i._X_ROW_KEY === j._X_ROW_KEY);
      if (index > -1) {
        merge(gridConfig.data![index], j);
      }
    });
    return nextTick();
  }
  /** 表格重置数据 */
  function resetData(data: any[]) {
    gridConfig.data = data;
    return new Promise((resolve) => {
      setTimeout(() => {
        checkboxData.value = [];
        gridRef.value?.clearCheckboxRow();
        nextTick().then(resolve);
      });
    });
  }

  /** TAB右移聚焦 */
  function Tab(params: VxeGridDefines.KeydownEventParams) {
    params.$event.preventDefault();
    const { visibleColumn } = gridRef.value!.getTableColumn();
    keyPointer.columnIndex++;
    if (keyPointer.columnIndex > visibleColumn.length - 1) {
      keyPointer.columnIndex = 0;
    }
    // 跳过特殊类型列
    const rowIndex = keyPointer.rowIndex;
    count = 0;
    isFocus(visibleColumn);
    if (rowIndex !== keyPointer.rowIndex) {
      keyPointer.rowIndex--;
      return ArrowDown(params);
    }
    return setTableCellFocus(keyPointer.rowIndex, keyPointer.columnIndex);
  }

  // 循环查看当前列是否可聚焦
  function isFocus(columns: VxeTableDefines.ColumnInfo[], isDown = true) {
    const item = columns[keyPointer.columnIndex];
    if (count > 0) return;
    // 单元格可编辑退出循环
    if (!item?.editRender?.enabled) {
      keyPointer.columnIndex++;
      if (keyPointer.columnIndex > columns.length - 1) {
        count++;
        keyPointer.columnIndex = 0;
        if (isDown) {
          keyPointer.rowIndex++;
        }
      }
      isFocus(columns, isDown);
    }
  }

  function setTableCellFocus(rowIndex: number, field?: number | string) {
    if (!gridConfig.data?.length) return;
    if (rowIndex === -1) {
      gridRef.value?.clearCurrentRow();
      keyPointer.rowIndex = 0;
      keyPointer.columnIndex = 0;
      return Promise.reject();
    }
    return nextTick().then(() => {
      const activeElement = document.activeElement as HTMLInputElement;
      activeElement?.blur();
      const row = gridRef.value?.getData(rowIndex);
      gridRef.value?.setCurrentRow(row); // 设置当前行
      gridRef.value?.scrollToRow(row);
      // 获取可视列数据
      const { visibleColumn } = gridRef.value!.getTableColumn();
      let Field = "";
      if (typeof field === "string") {
        Field = field;
      }
      if (typeof field === "number") {
        keyPointer.columnIndex = field;
      }
      const columnField = Field || visibleColumn[keyPointer.columnIndex]?.field;
      if (!columnField) {
        return Promise.reject(`行${rowIndex}列${keyPointer.columnIndex}列字段${columnField}不存在`);
      }
      const colInfo = gridRef.value!.getColumnByField(columnField);
      return gridRef.value?.setEditRow(row, columnField).then(() => {
        const row = gridRef.value?.getCurrentRecord();
        const { rowIndex, columnIndex } = gridRef.value?.getEditRecord() || {};

        if (colInfo?.editRender?.enabled) {
          keyPointer.rowIndex = rowIndex ?? gridRef.value?.getRowIndex(row) ?? 0;
          keyPointer.columnIndex = columnIndex ?? 0;
        }

        const colEl = gridRef.value?.$el.querySelector(`[colid="${colInfo?.id}"][rowid="${row._X_ROW_KEY}"] input`) as HTMLElement;

        if (!colInfo?.editRender?.enabled && colEl) {
          colEl.focus();
        }

        return nextTick().then(() => {
          const vxeTable = gridRef.value?.$el?.querySelector(`.vxe-table`) as HTMLElement;
          const tableContent = document.activeElement?.closest(".vxe-table--body-wrapper") as HTMLElement;
          const cell = document.activeElement?.closest(".vxe-body--column") as HTMLElement;
          if (vxeTable && tableContent && cell) {
            const fixedLeft = (gridRef.value?.$el?.querySelector(`.fixed-left--wrapper .vxe-table--body`) as HTMLElement)?.offsetWidth || 0;
            tableContent.scrollLeft = cell.offsetLeft - fixedLeft - vxeTable.offsetWidth / 2 + 130;
          }
        });
      });
    });
  }

  function ArrowUp(params: VxeGridDefines.KeydownEventParams) {
    params.$event.preventDefault();
    keyPointer.rowIndex--;
    if (keyPointer.rowIndex < 0) {
      // 1. 表格循环上下切换
      keyPointer.rowIndex = gridRef.value!.getFullData().length - 1;
      // 2. 切换表单查询
      // keyPointer.rowIndex = 0;
    }
    return setTableCellFocus(keyPointer.rowIndex, keyPointer.columnIndex);
  }
  function ArrowDown(params: VxeGridDefines.KeydownEventParams) {
    params.$event.preventDefault();
    const tableData = gridRef.value!.getData();
    keyPointer.rowIndex++;
    if (keyPointer.rowIndex > tableData.length - 1) {
      keyPointer.rowIndex = 0;
    }
    return setTableCellFocus(keyPointer.rowIndex, keyPointer.columnIndex);
  }
  function Enter(params: VxeGridDefines.KeydownEventParams) {}

  function keydown(params: VxeGridDefines.KeydownEventParams) {
    const key = (params as any).key as string;
    get(
      {
        ArrowUp,
        ArrowDown,
        Enter,
        Tab
      },
      key
    )?.(params);
  }

  function cellClick(params: VxeGridDefines.CellClickEventParams) {
    const { rowIndex, columnIndex } = params;
    keyPointer.rowIndex = rowIndex;
    keyPointer.columnIndex = columnIndex;
  }

  /** 事件拦截 */
  const gridEvents: VxeGridListeners = {
    checkboxAll,
    checkboxChange(val) {
      toggleCheckboxRow(val);
    },
    keydown,
    cellClick,
    pageChange({ pageSize, currentPage }) {
      gridConfig.pagerConfig!.currentPage = currentPage;
      gridConfig.pagerConfig!.pageSize = pageSize;
      getList({ currentPage, pageSize });
    }
  };

  /** 获取表格数据 */
  function getList(params?: any, url?: string) {
    if (!params) {
      params = {
        currentPage: gridConfig.pagerConfig!.currentPage,
        pageSize: gridConfig.pagerConfig!.pageSize
      };
    }
    if (url) gridConfig.url = url;
    if (!gridConfig.url) return;
    gridConfig.loading = true;
    return Utils.useRequest(gridConfig.url, params)
      .then((res) => {
        checkboxData.value = [];
        gridRef.value?.clearCheckboxRow();
        gridConfig.data = res.data || [];
        gridConfig.pagerConfig!.total = res?.total || 0;
      })
      .finally(() => {
        gridConfig.loading = false;
      });
  }

  return {
    gridRef,
    tableData,
    checkboxData,
    gridEvents,
    getList,
    getData,
    getCheckboxData,
    clearData,
    remove,
    getCheckboxRecords,
    resetData,
    updateData,
    checkboxAll,
    toggleCheckboxRow,
    setCheckboxRow,
    keydown
  };
}
