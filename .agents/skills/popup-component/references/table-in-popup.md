---
name: table-in-popup
description: 弹窗内含表格的规范、gridOptions.ts、useGridTableMethods
---

# 弹窗内含表格的规范

若弹窗内需要展示表格（如详情弹窗），需遵循以下规范：

## 1. 独立 gridOptions.ts 文件

**注意**：文件名固定为 `gridOptions.ts`，与所在文件夹名称无关。

```typescript
import { VxeGridProps } from "hs-admin-ui";
import { reactive } from "vue";

export const gridOptions = reactive<VxeGridProps>({
  border: true,
  showOverflow: true,
  height: 300,
  columns: [
    { field: "field1", title: "字段1" },
    { field: "field2", title: "字段2", slots: { default: "field2" } }
  ],
  data: [],
  pagerConfig: { enabled: false }
});
```

## 2. popup.vue 中使用 useGridTableMethods

```vue
<template>
  <div class="p-5">
    <vxe-grid ref="gridRef" v-bind="gridOptions" v-on="gridEvents">
      <template #field2="{ row }">
        <!-- 插槽内容 -->
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useGridTableMethods } from "@/hook/useGridTableMethods";
import { gridOptions } from "./gridOptions";

const props = defineProps<{
  close: (data?: any) => void;
  row: any;
}>();

const { gridRef, gridEvents, ...tableMethods } = useGridTableMethods(gridOptions);
</script>
```

**关键点：**
- 表格配置必须独立为 `gridOptions.ts` 文件
- 必须使用 `useGridTableMethods` 处理表格
- `useGridTableMethods` 返回 `gridRef`、`gridEvents` 和 `tableMethods`
