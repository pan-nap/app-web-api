import { VxeGridProps } from "hs-admin-ui";
import { reactive } from "vue";

export const gridOptions = reactive<VxeGridProps & { url: string }>({
  url: "/sf-web/order",
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
    { title: "订单号", field: "orderNo" },
    { title: "学校", field: "school" },
    { title: "年级", field: "grade" },
    { title: "班级", field: "className" },
    { title: "套餐名称", field: "packageName" },
    { title: "套餐金额", field: "packageAmount" },
    {
      title: "学生数",
      field: "studentCount",
      width: 100,
      slots: { default: "studentCount" }
    },
    {
      title: "订单状态",
      field: "orderStatus",
      width: 100,
      slots: { default: "orderStatus" }
    },
    { title: "创建人", field: "creator" },
    {
      title: "操作",
      field: "setting",
      width: 250,
      fixed: "right",
      slots: {
        default: "setting"
      }
    }
  ],
  data: []
});
