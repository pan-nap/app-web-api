---
name: page-implementation
description: 页面层实现规范、文件结构、页面实现示例、注意事项
---

# 页面层实现规范

## 文件结构

```
src/views/admin/student/
├── index.vue           # 主页面
├── gridOptions.ts      # 表格配置
└── popup/
    ├── index.ts        # 弹窗调用方法
    └── popup.vue       # 弹窗内容组件
```

## 页面实现示例（index.vue）

```vue
<script setup lang="ts">
import { reactive, onBeforeMount } from "vue";
import { HsMessage, HsMessageBox } from "hs-admin-ui";
import { useGridTableMethods } from "@/hook/useGridTableMethods";
import { gridOptions } from "./gridOptions";
import { showPopup } from "./popup";
import type { Student } from "@/types";
import { useStudentStore } from "@/stores/student";

const studentStore = useStudentStore();
const { gridRef, checkboxData, gridEvents, ...tableMethods } = useGridTableMethods(gridOptions);

const searchForm = reactive({
  school: "", grade: null as number | null,
  className: "", name: "", status: null as number | null
});

onBeforeMount(() => {
  tableMethods.getList();
});

const handleSearch = () => {
  tableMethods.getList(
    Object.assign({}, searchForm, {
      currentPage: gridOptions.pagerConfig!.currentPage,
      pageSize: gridOptions.pagerConfig!.pageSize
    })
  );
};

const handleDelete = async (row: Student) => {
  HsMessageBox.confirm("确定要删除该学生吗？", "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      studentStore.deleteById(row.id)
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
</script>
```

## 页面层注意事项

1. **禁止直接调用API**：不允许在页面层使用 `Utils.useRequest` 调用接口
2. **统一使用Store方法**：所有数据操作都通过Store提供的方法完成
3. **表格数据加载**：通过 `useGridTableMethods` 的 `getList` 方法加载数据
4. **分页参数**：使用 `currentPage` 和 `pageSize` 作为分页参数
5. Store方法应该返回Promise，支持异步操作
6. 错误处理在Store层统一处理
7. 避免在页面层直接调用API
8. Store之间的依赖通过方法调用解决，避免循环依赖
9. 保持Store方法的单一职责原则
