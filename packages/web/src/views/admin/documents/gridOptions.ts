import { VxeGridProps } from "hs-admin-ui";
import { reactive } from "vue";

export const gridOptions = reactive<VxeGridProps & { url: string }>({
  url: "/sf-web/document",
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
    { title: "文书名称", field: "name", minWidth: 200 },
    {
      title: "类型",
      field: "type",
      width: 100,
      align: "center",
      formatter: ({ cellValue }: any) => {
        return cellValue === "template" ? "模板" : "实例"
      }
    },
    { title: "所属患者", field: "patientId", width: 150 },
    {
      title: "状态",
      field: "status",
      width: 100,
      align: "center",
      formatter: ({ cellValue }: any) => {
        const map: Record<string, string> = { draft: "草稿", completed: "已完成", archived: "已归档" }
        return map[cellValue] ?? cellValue
      }
    },
    { title: "创建时间", field: "createdAt", width: 180 },
    { title: "更新时间", field: "updatedAt", width: 180 },
    {
      title: "操作",
      field: "setting",
      width: 160,
      fixed: "right",
      slots: { default: "setting" }
    }
  ],
  data: []
});
