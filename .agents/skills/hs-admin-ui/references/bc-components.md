---
name: bc-components
description: bc-button 自动 loading 按钮、bc-icon 图标组件
---

# bc-button 与 bc-icon

## bc-button 组件

当按钮需要 loading 状态时，使用 `<bc-button />` 组件，使用方式与 `<el-button>` 完全一致，但在调用异步函数时会自动显示 loading 状态，无需手动维护：

```vue
<template>
  <!-- 使用 bc-button -->
  <bc-button type="primary" @click="handleSubmit">
    提交
  </bc-button>

  <!-- 使用 el-button 需要手动维护 loading -->
  <el-button type="primary" :loading="loading" @click="handleSubmit2">
    提交
  </el-button>
</template>

<script setup>
import { ref } from 'vue';

// bc-button 自动处理 loading
const handleSubmit = async () => {
  await api.submitData();
  HsMessage.success('提交成功');
};

// el-button 需要手动维护 loading
const loading = ref(false);
const handleSubmit2 = async () => {
  loading.value = true;
  try {
    await api.submitData();
    HsMessage.success('提交成功');
  } finally {
    loading.value = false;
  }
};
</script>
```

**注意事项：**
- `<bc-button />` 的 `@click` 事件处理函数必须返回 `Promise`（即使用 `async` 函数）
- 如果事件处理函数不是异步函数，`bc-button` 行为与 `el-button` 完全一致
- 支持 `el-button` 的所有属性和事件

## bc-icon 组件

使用 `<bc-icon />` 组件可以快速使用 Element Plus 的图标，无需手动导入：

```vue
<template>
  <bc-icon name="el-Upload" size="14" color="#3964fe" />
</template>
```

**属性说明：**
- `name`: 图标名称，格式为 `el-图标名`（如 `el-Upload`, `el-Download`, `el-Delete`）
- `size`: 图标大小（默认 14）
- `color`: 图标颜色

**常用图标：**
```vue
<bc-icon name="el-Upload" />       <!-- 上传 -->
<bc-icon name="el-Download" />     <!-- 下载 -->
<bc-icon name="el-Delete" />       <!-- 删除 -->
<bc-icon name="el-Edit" />         <!-- 编辑 -->
<bc-icon name="el-Search" />       <!-- 搜索 -->
<bc-icon name="el-Refresh" />      <!-- 刷新 -->
<bc-icon name="el-Success" />      <!-- 成功 -->
<bc-icon name="el-Warning" />      <!-- 警告 -->
<bc-icon name="el-Info" />         <!-- 信息 -->
<bc-icon name="el-Close" />        <!-- 关闭 -->
```
