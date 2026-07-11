---
name: popup-vue
description: popup.vue 规范、底部按钮、Store 方法命名
---

# popup.vue 规范

```vue
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 p-5 overflow-hidden">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入类型" />
        </el-form-item>
        <!-- 更多表单项 -->
      </el-form>
    </div>
    <footer class="flex items-center justify-end h-16 px-3">
      <hs-button @click="close('cancel')">取消</hs-button>
      <bc-button type="primary" @click="submit">确定</bc-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, useTemplateRef } from "vue";
import { useDictionaryStore } from "@/stores/dictionary";
import type { DictionaryItem } from "@/types";

const props = defineProps<{
  close: (data?: "confirm" | "cancel") => void;
  row?: DictionaryItem;
}>();

const dictionaryStore = useDictionaryStore();
const formRef = useTemplateRef("formRef");
const form = reactive<Omit<DictionaryItem, "id">>({
  type: props.row?.type || "",
  label: props.row?.label || "",
  value: props.row?.value || "",
  sort_order: props.row?.sort_order || 0
});

const rules = {
  type: [{ required: true, message: "请输入类型", trigger: "blur" }],
  label: [{ required: true, message: "请输入标签", trigger: "blur" }],
  value: [{ required: true, message: "请输入值", trigger: "blur" }]
};

const submit = async () => {
  await formRef.value.validate();
  if (props.row?.id) {
    await dictionaryStore.updateDictionary(props.row.id, form);
  } else {
    await dictionaryStore.addDictionary(form);
  }
  props.close("confirm");
};
</script>
```

**关键点：**
- 必须定义 `props` 包含 `close` 函数和可选的 `row` 数据
- 使用 Store 进行数据操作（遵循 store-data-decoupling 规范）
- `close("confirm")` 表示确认操作，`close("cancel")` 或不传表示取消
- 表单验证通过后调用 Store 方法，然后调用 `props.close("confirm")`
- **submit 方法不要使用 try-catch**：错误处理由全局错误拦截器统一处理
- **bc-button 自带异步 loading**：`@click` 绑定 async 函数后自动显示 loading，无需手动控制 `:loading` 属性
- 使用 `useTemplateRef()` 而不是 `ref()` 获取表单引用

## 底部按钮规范

当 `showFooter: false` 时，需在 popup.vue 中自定义底部按钮：

```html
<footer class="flex items-center justify-end h-16 px-3">
  <hs-button @click="close('cancel')">取消</hs-button>
  <bc-button type="primary" @click="submit">确定</bc-button>
</footer>
```

- 取消按钮：`<hs-button @click="close('cancel')">取消</hs-button>`
- 确定按钮：`<bc-button type="primary" @click="submit">确定</bc-button>` 或 `<hs-button type="primary" @click="submit">确定</hs-button>`

## Store 方法命名规范

| 操作 | Store 方法 | 说明 |
| ---- | ---------------------------------- | ------ |
| 新增 | `store.addDictionary(data)` | 创建新记录 |
| 编辑 | `store.updateDictionary(id, data)` | 更新记录 |
| 删除 | `store.deleteDictionary(id)` | 删除单条记录 |
| 批量删除 | `store.batchDelete(ids)` | 批量删除 |
