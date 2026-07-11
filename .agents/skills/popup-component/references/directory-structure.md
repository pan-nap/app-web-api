---
name: directory-structure
description: 弹窗组件目录结构规范、多弹窗场景目录组织
---

# 目录结构规范

每个弹窗对应一个独立文件夹，结构如下：

```
<功能模块>/
└── popup/
    ├── index.ts       # 必须：导出弹窗调用方法
    ├── popup.vue      # 必须：弹窗内容组件（文件名固定为 popup.vue）
    └── gridOptions.ts # 可选：若弹窗内含表格，需独立表格配置
```

## 多弹窗场景

每个弹窗单独建文件夹，不可合并：

```
<功能模块>/
├── popup/
│   ├── index.ts
│   ├── popup.vue          # 新增/编辑弹窗
│   └── gridOptions.ts     # 可选：弹窗内表格配置
└── detailPopup/
    ├── index.ts
    ├── popup.vue          # 详情弹窗（文件名固定为 popup.vue）
    └── gridOptions.ts     # 详情内表格配置（文件名固定为 gridOptions.ts）
```

## 使用示例：字典管理模块

```
dictionary/
├── index.vue
├── gridOptions.ts
└── popup/
    ├── index.ts
    └── popup.vue          # 新增/编辑字典
```
