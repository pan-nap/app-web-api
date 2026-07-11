import { VxeGridProps } from "hs-admin-ui";
import { reactive } from "vue";

export const gridOptions = reactive<VxeGridProps & { url: string }>({
  url: "/sf-web/dictionary",
  loading: false,
  size: "medium",
  height: "100%",
  border: true,
  showHeaderOverflow: true,
  showOverflow: "tooltip",
  rowConfig: {
    isCurrent: true,
    isHover: true
  },
  columnConfig: {
    resizable: true
  },
  cellConfig: {
    height: 40
  },
  pagerConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  columns: [
    { type: "checkbox", width: 60, align: "center" },
    { title: "ID", field: "id", width: 80 },
    { title: "类型", field: "type", width: 120 },
    { title: "标签", field: "label" },
    { title: "值", field: "value" },
    { title: "排序", field: "sort_order", width: 80 },
    {
      title: "操作",
      field: "setting",
      width: 120,
      fixed: "right",
      slots: { default: "setting" }
    }
  ],
  data: []
});
