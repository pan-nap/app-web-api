---
name: index-vue
description: index.vue 规范、列表数据获取、API 请求规范、二次确认弹窗
---

# index.vue 规范

```vue
<template>
  <div class="p-5 h-full">
    <el-card class="h-full flex flex-col">
      <template #header>
        <span>页面标题</span>
      </template>
      <div class="flex items-start justify-between">
        <el-form inline :model="searchForm">
          <!-- 搜索表单项 -->
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="gap-[10px] flex">
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="danger" :disabled="!checkboxData.length" @click="handleBatchDelete">批量删除</el-button>
        </div>
      </div>
      <div class="flex-1 overflow-hidden">
        <vxe-grid ref="gridRef" v-bind="gridOptions" v-on="gridEvents">
          <template #setting="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </vxe-grid>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount } from "vue";
import { HsMessage, HsMessageBox, Utils } from "hs-admin-ui";
import { useGridTableMethods } from "@/hook/useGridTableMethods";
import { gridOptions } from "./gridOptions";
import type { YourType } from "@/types";

const { gridRef, checkboxData, gridEvents, ...tableMethods } = useGridTableMethods(gridOptions);

const searchForm = reactive({ field1: "", field2: "" });

onBeforeMount(() => { tableMethods.getList(); });

const handleSearch = () => {
  tableMethods.getList(Object.assign({}, searchForm, {
    currentPage: gridOptions.pagerConfig!.currentPage,
    pageSize: gridOptions.pagerConfig!.pageSize
  }));
};
const handleReset = () => {
  gridOptions.pagerConfig!.currentPage = 1;
  handleSearch();
};
</script>
```

## 列表数据获取规范

```typescript
// 页面初始化获取列表
onBeforeMount(() => { tableMethods.getList(); });

// 带参数获取列表
onBeforeMount(() => { tableMethods.getList({ orderId: 1, status: "active" }); });

// 搜索时带参数
const handleSearch = () => {
  tableMethods.getList(Object.assign({}, searchForm, {
    currentPage: gridOptions.pagerConfig!.currentPage,
    pageSize: gridOptions.pagerConfig!.pageSize
  }));
};
```

### getList 的第二个参数：动态覆盖 URL

`getList` 支持第二个参数，用于临时覆盖 `gridOptions.url`：

```typescript
tableMethods.getList({ orderId: 1 });
tableMethods.getList({ orderId: 1 }, "/sf-web/order/items"); // 临时覆盖 URL
```
