---
name: "vxe-table-usage"
description: "Standardizes vxe-table usage with useGridTableMethods. Invoke when creating or modifying any table/list page to ensure consistent patterns across the project."
---

# Vxe-Table 表格使用规范

> 所有表格使用 `vxe-grid`，配置独立 `gridOptions.ts` 文件，使用 `useGridTableMethods` 管理。

## 快速定位

| 主题 | 说明 | 参考 |
|------|------|------|
| **核心规则** | 使用 vxe-grid、禁止动态路由、目录结构 | [core-rules](references/core-rules.md) |
| **gridOptions** | 标准配置模板、参数说明 | [grid-options](references/grid-options.md) |
| **index.vue** | 页面模板、列表数据获取 | [index-vue](references/index-vue.md) |
| **API 与确认** | useRequest 规范、二次确认弹窗 | [api-confirm](references/api-confirm.md) |

---

## 参考文件索引

### 基础规则
- [核心规则与目录结构](references/core-rules.md) — vxe-grid 强制要求、静态路由、目录组织
- [gridOptions.ts 标准配置](references/grid-options.md) — 配置模板、参数说明、静态路由要求

### 页面开发
- [index.vue 规范](references/index-vue.md) — 页面模板、getList 数据获取、动态覆盖 URL
- [API 请求与二次确认](references/api-confirm.md) — useRequest 规范、删除/批量删除确认弹窗