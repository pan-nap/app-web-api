---
name: index-ts
description: index.ts 规范、Utils.showPopup 调用方式
---

# index.ts 规范

```typescript
import { Utils } from "hs-admin-ui";
import popup from "./popup.vue";

export function showPopup(row?: any) {
  return new Promise((resolve) => {
    Utils.showPopup(
      popup,
      { row },
      {
        title: row ? "编辑" : "新增",
        success: ({ data }) => resolve(data),
        showFooter: false
      }
    );
  });
}
```

**关键点：**

- 必须从 `hs-admin-ui` 导入 `Utils`
- 必须导入当前目录下的 `popup.vue`（文件名固定）
- 必须导出 `showPopup` 函数（可自定义函数名，如 `showDetail`）
- `Utils.showPopup` 参数：
  - 第一个：组件文件（固定为 `./popup.vue`）
  - 第二个：传递给组件的 props（如 `{ row }` 表示传入行数据）
  - 第三个：配置对象（title、success 回调、showFooter 是否显示底部按钮）

## 在页面中调用

```typescript
import { showPopup } from "./popup";

// 打开新增弹窗
const handleAdd = () => {
  showPopup().then((res) => {
    if (res === "confirm") {
      // 刷新列表
    }
  });
};

// 打开编辑弹窗
const handleEdit = (row: any) => {
  showPopup(row).then((res) => {
    if (res === "confirm") {
      // 刷新列表
    }
  });
};
```
