---
name: "popup-component"
description: "Creates popup/dialog components following the standard folder structure. Invoke when user asks to create a popup, dialog, or modal component, or needs to add edit/create/detail popup functionality."
---

# Popup Component Skill

弹窗组件开发规范。遵循 store-data-decoupling 设计模式，所有数据操作通过 Store 层完成。

## 快速定位

| 主题 | 说明 | 参考 |
|------|------|------|
| **目录结构** | 弹窗文件夹组织、多弹窗场景 | [directory-structure](references/directory-structure.md) |
| **index.ts** | showPopup 导出、Utils.showPopup 调用 | [index-ts](references/index-ts.md) |
| **popup.vue** | 弹窗内容组件、表单、底部按钮 | [popup-vue](references/popup-vue.md) |
| **内含表格** | 弹窗内表格配置、useGridTableMethods | [table-in-popup](references/table-in-popup.md) |
| **常见错误** | 错误案例、检查清单、调试技巧 | [common-errors](references/common-errors.md) |

---

## 参考文件索引

### 目录与结构
- [目录结构规范](references/directory-structure.md) — 弹窗文件夹组织、多弹窗场景
- [index.ts 规范](references/index-ts.md) — showPopup 导出、Utils.showPopup 参数

### 组件开发
- [popup.vue 规范](references/popup-vue.md) — 组件结构、表单、底部按钮、Store 调用
- [弹窗内含表格规范](references/table-in-popup.md) — gridOptions.ts、useGridTableMethods

### 排错
- [常见错误与检查清单](references/common-errors.md) — 错误案例、检查清单、调试技巧

