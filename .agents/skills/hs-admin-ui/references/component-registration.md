---
name: component-registration
description: Element Plus 与 VXE-Table 组件注册、弹窗方法
---

# 组件注册与弹窗方法

## 自动注册的组件

通过 `useHsAdminUi` 自动注册：

- **Element Plus 组件**：使用 `el-` 前缀，如 `<el-button>`、`<el-input>`
- **VXE-Table 组件**：使用 `<vxe-table>`、`<vxe-column>` 等
- **VXEUI 组件**：所有 VXEUI 组件已自动注册

## 弹窗方法

```javascript
import { HsMessage, HsMessageBox, HsNotification } from 'hs-admin-ui';

// 消息提示
HsMessage.success('操作成功');
HsMessage.error('操作失败');
HsMessage.warning('警告信息');
HsMessage.info('提示信息');

// 弹窗确认
HsMessageBox.confirm('确定要删除吗？', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  type: 'warning'
}).then(() => {
  // 确定操作
}).catch(() => {
  // 取消操作
});

// 通知
HsNotification.success({
  title: '成功',
  message: '操作成功'
});
```
