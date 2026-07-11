---
name: grid-options
description: gridOptions.ts 标准配置、参数说明、静态路由要求
---

# gridOptions.ts 标准配置

**参考学生管理 `gridOptions.ts` 作为默认参数模板**：

```typescript
import { VxeGridProps } from "hs-admin-ui";
import { reactive } from "vue";

export const gridOptions = reactive<VxeGridProps & { url: string }>({
  url: "/sf-web/xxx",       // API 地址（必填，使用静态路由）
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
    { type: "seq", width: 60, title: "序号" },
    { title: "字段名", field: "fieldName" },
    { title: "操作", field: "setting", width: 120, fixed: "right", slots: { default: "setting" } }
  ],
  data: []
});
```

**重要说明**：
- **`url` 参数必填**：必须使用静态路由，禁止使用动态路由
- **静态路由示例**：`/sf-web/orders/list`、`/sf-web/students`
- **禁止动态路由**：`/sf-web/orders/:id`（会导致路由冲突和匹配问题）

## 标准配置参数说明

| 参数 | 说明 |
|------|------|
| `url` | 表格数据请求接口地址（必填，必须是静态路由） |
| `loading` | 加载状态 |
| `size` | 表格尺寸 |
| `height` | 表格高度（主页面用 `"100%"`，弹窗内用固定值或 `"auto"`） |
| `border` | 是否显示边框 |
| `showHeaderOverflow` | 表头溢出时的显示方式 |
| `showOverflow` | 单元格溢出时的显示方式 |
| `rowConfig` | 行配置（isCurrent 当前行、isHover 悬停高亮） |
| `columnConfig` | 列配置（resizable 列宽可调整） |
| `cellConfig` | 单元格配置（height 高度） |
| `pagerConfig` | 分页配置（弹窗内表格通常不需分页） |
| `columns` | 列配置数组 |
