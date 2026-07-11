---
name: core-rules
description: VXE-Table 核心规则、目录结构
---

# 核心规则与目录结构

## 核心规则

**强制要求**：
1. 所有表格展示必须使用 `vxe-grid`（vxe-table），严禁使用 `el-table`
2. **表格请求接口不允许使用动态路由**（如 `/orders/:id`），必须使用静态路由（如 `/orders/list`）

## 目录结构

```
<功能模块>/
├── index.vue           # 主页面
├── gridOptions.ts      # 表格配置（必须单独文件）
└── popup/              # 弹窗文件夹
    ├── index.ts
    ├── popup.vue
    └── gridOptions.ts  # 若弹窗内含表格
```
