---
name: common-errors
description: 常见错误与解决方案、检查清单、调试技巧
---

# 常见错误与解决方案

## 错误案例分析：员工管理弹窗问题

| 错误点 | 错误实现 | 正确实现 | 影响 |
| ------ | ------------------------------- | --------------------------- | ------------------- |
| 弹窗渲染方式 | 使用原生 `el-dialog` + `visible` 控制 | 通过 `Utils.showPopup()` 调用 | 无法集成到统一弹窗管理 |
| 关闭机制 | 使用 `emit('cancel')` 自定义事件 | 使用 `props.close()` 回调 | 弹窗无法正确关闭 |
| 底部按钮 | 使用 `el-dialog` 的 `footer` 插槽 | 使用 `<footer>` 自定义按钮 | 样式不统一 |
| 表单引用 | 使用 `ref()` 手动声明 | 使用 `useTemplateRef()` | 类型不安全 |
| 标题设置 | 在组件内部通过 ref 控制 | 通过 `Utils.showPopup()` 配置传入 | 职责分离不清 |
| 错误处理 | 在 submit 中使用 try-catch | 不使用 try-catch，由全局拦截器处理 | 重复处理 |

## 避免问题的检查清单

| 检查项 | 说明 | 验证方式 |
| ------------------------------- | ---------- | ------------------------------------------------------------- |
| index.ts 使用 `Utils.showPopup()` | 必须通过工具函数调用 | 检查 `import { Utils } from "hs-admin-ui"` |
| popup.vue 不包含 `el-dialog` | 仅包含内容区域 | 搜索 `<el-dialog` |
| props 包含 `close` 函数 | 用于关闭弹窗 | 检查 `defineProps` 定义 |
| 使用 `useTemplateRef()` | 表单引用方式 | 检查 `formRef = useTemplateRef()` |
| 使用 `<footer>` 自定义按钮 | 底部按钮区域 | 检查 footer 元素 |
| 取消按钮调用 `close('cancel')` | 取消操作 | 检查 `@click="close('cancel')"` |
| 确定按钮调用 `props.close('confirm')` | 确认操作 | 检查 `props.close("confirm")` |
| 数据操作通过 Store | 遵循解耦规范 | 检查是否导入并调用 Store 方法 |
| submit 方法不使用 try-catch | 错误由全局拦截器处理 | 搜索 `try {` 在 submit 方法中 |

## 调试技巧

1. **弹窗不显示**：检查 index.ts 是否正确调用 `Utils.showPopup()`，确保组件导入正确
2. **弹窗无法关闭**：检查是否调用了 `props.close()`，确认参数正确
3. **表单验证失败**：检查 `useTemplateRef` 是否正确使用
4. **样式错乱**：确保根元素使用 `flex flex-col h-full overflow-hidden` 结构

## 注意事项

1. **popup.vue 文件名不可改变**：index.ts 中引用的是 `./popup.vue`
2. **gridOptions.ts 文件名固定**：无论在哪个文件夹，文件名都是 `gridOptions.ts`
3. **弹窗内表格必须使用 useGridTableMethods**：配合独立的 gridOptions.ts
4. **close 回调必须调用**：否则弹窗无法关闭
5. **showFooter 设为 false 时**：需要在 popup.vue 中自定义底部按钮
6. **row 参数用于编辑/详情模式**：判断 `row` 是否存在来区分新增还是编辑
7. **遵循 store-data-decoupling 规范**：所有数据操作通过 Store 层完成

## `bc-button` 注意事项

### bc-button 自带异步 loading

```html
<!-- ✅ 正确：bc-button 会自动检测 async 函数并显示 loading -->
<bc-button type="primary" @click="submit">确定</bc-button>

<!-- ❌ 错误：不需要手动控制 :loading -->
<bc-button type="primary" :loading="submitting" @click="handleSubmit">确定</bc-button>
```

**原理**：`bc-button` 监听到 `@click` 事件返回 Promise 时，自动将按钮置为 loading 状态，Promise resolve 后自动恢复。因此：

- 不需要定义 `submitting` ref
- 不需要 `try/finally` 恢复 loading 状态
- click 处理函数必须是 async 函数
- 错误由全局拦截器处理，submit 内部不需要 try-catch
