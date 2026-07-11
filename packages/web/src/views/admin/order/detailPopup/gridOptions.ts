import { VxeGridProps } from "hs-admin-ui";
import { reactive } from "vue";

export const gridOptions = reactive<VxeGridProps & { url: string }>({
  url: "/sf-web/order/{id}/items",
  loading: false,
  size: "medium",
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
  columns: [
    { field: "studentName", title: "学生姓名" },
    { field: "idCard", title: "身份证号" },
    { field: "parentPhone", title: "家长电话" },
    { field: "paymentStatus", title: "缴费状态", slots: { default: "paymentStatus" } },
    { field: "paymentTime", title: "缴费时间" },
    { field: "action", title: "操作", width: 120, slots: { default: "action" } }
  ],
  data: []
});
