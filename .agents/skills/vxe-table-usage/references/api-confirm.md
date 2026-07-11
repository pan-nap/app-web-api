---
name: api-confirm
description: API 请求规范（Utils.useRequest）、二次确认弹窗规范
---

# API 请求与二次确认

## API 请求规范

**使用 `Utils.useRequest`**：
- 不需要 `try-catch` 包裹
- 接口失败时错误弹窗提示已在内部封装
- 成功逻辑通过 `.then()` 处理

```typescript
Utils.useRequest("/api/path", {}, "get")
Utils.useRequest("/api/path", data, "post")
Utils.useRequest(`/api/path/${id}`, data, "put")
Utils.useRequest(`/api/path/${id}`, {}, "delete")
```

## 二次确认弹窗规范

```typescript
HsMessageBox.confirm("提示文案", "标题", {
  type: "warning",
  confirmButtonText: "确定",
  cancelButtonText: "取消",
  closeOnClickModal: false,
  beforeClose: (action: string, instance: any, done: Function) => {
    if (action !== "confirm") return done();
    instance.confirmButtonLoading = true;
    Utils.useRequest("/api", data, "post")
      .then(() => {
        tableMethods.getList();
        HsMessage.success("操作成功");
      })
      .finally(() => {
        instance.confirmButtonLoading = false;
        done();
      });
  }
});
```

## 删除操作示例

```typescript
const handleDelete = (row: YourType) => {
  HsMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      Utils.useRequest(`/api/${row.id}`, {}, "delete")
        .then(() => {
          tableMethods.getList();
          HsMessage.success("删除成功");
        })
        .finally(() => {
          instance.confirmButtonLoading = false;
          done();
        });
    }
  });
};
```

## 批量删除示例

```typescript
const handleBatchDelete = () => {
  HsMessageBox.confirm(`确定要删除选中的 ${checkboxData.value.length} 条数据吗？`, "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      const ids = checkboxData.value.map((item: YourType) => item.id);
      Utils.useRequest("/api/batch", { ids }, "delete")
        .then(() => {
          tableMethods.getList();
          HsMessage.success("批量删除成功");
        })
        .finally(() => {
          instance.confirmButtonLoading = false;
          done();
        });
    }
  });
};
```
