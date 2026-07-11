import { VxeGridProps } from "hs-admin-ui";
import { reactive } from "vue";

export const gridOptions = reactive<VxeGridProps & { url: string }>({
  url: "/sf-web/student",
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
    { title: "学号", field: "id" },
    { title: "姓名", field: "name" },
    { title: "性别", field: "gender" },
    { title: "学校", field: "school" },
    { title: "年级", field: "grade" },
    { title: "班级", field: "className" },
    { title: "身份证号", field: "idCard" },
    { title: "联系电话", field: "phone" },
    {
      title: "状态",
      field: "status",
      width: 100,
      slots: { default: "status_default" }
    },
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
