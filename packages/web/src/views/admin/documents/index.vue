<template>
  <div class="p-5 h-full">
    <el-card class="h-full flex flex-col">
      <template #header>
        <span>文书管理</span>
      </template>
      <div class="flex items-start justify-between">
        <el-form inline :model="searchForm">
          <el-form-item label="名称">
            <el-input v-model="searchForm.name" placeholder="请输入文书名称" clearable />
          </el-form-item>
          <el-form-item label="类型">
            <el-select class="w-[120px]" v-model="searchForm.type" placeholder="全部" clearable>
              <el-option label="模板" value="template" />
              <el-option label="实例" value="instance" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="gap-[10px] flex">
          <el-button type="primary" @click="handleCreate">新建文书</el-button>
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
import { HsMessage, HsMessageBox } from "hs-admin-ui";
import { useGridTableMethods } from "@/hook/useGridTableMethods";
import { gridOptions } from "./gridOptions";
import { showPopup } from "./popup";
import { useDocumentStore } from "@/stores/documents";

const documentStore = useDocumentStore();
const { gridRef, checkboxData, gridEvents, ...tableMethods } = useGridTableMethods(gridOptions);

const searchForm = reactive({
  name: "",
  type: null as string | null
});

function handleSearch() {
  tableMethods.getList();
}

function handleReset() {
  searchForm.name = "";
  searchForm.type = null;
  tableMethods.getList();
}

async function handleCreate() {
  const result = await showPopup();
  if (result === "confirm") {
    tableMethods.getList();
  }
}

async function handleEdit(row: any) {
  const result = await showPopup({ row });
  if (result === "confirm") {
    tableMethods.getList();
  }
}

async function handleDelete(row: any) {
  HsMessageBox.confirm(`确定要删除文书"${row.name}"吗？`, "删除确认", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      documentStore
        .deleteById(row.id)
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
}

async function handleBatchDelete() {
  const ids = checkboxData.value.map((row: any) => row.id);
  if (!ids.length) return;

  HsMessageBox.confirm(`确定要删除选中的 ${ids.length} 条文书吗？`, "批量删除确认", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      documentStore
        .batchDelete(ids)
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
}

onBeforeMount(() => {
  // 初始化时刷新列表
  tableMethods.getList();
});
</script>
<style scoped>
:deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
