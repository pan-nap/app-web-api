<template>
  <div class="p-5 h-full">
    <el-card class="h-full flex flex-col">
      <template #header>
        <span>员工管理</span>
      </template>
      <div class="flex items-start justify-between">
        <el-form inline :model="searchForm">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="searchForm.phone" placeholder="请输入联系电话" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select class="w-[100px]" v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="gap-[10px] flex">
          <el-button type="primary" @click="handleEdit()">新增员工</el-button>
          <el-button type="danger" :disabled="!checkboxData.length" @click="handleBatchDelete">批量删除</el-button>
        </div>
      </div>
      <div class="flex-1 overflow-hidden">
        <vxe-grid ref="gridRef" v-bind="gridOptions" v-on="gridEvents" :style="{ '--vxe-ui-table-header-font-weight': '400' }">
          <template #status_default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
          </template>
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
import { useEmployeeStore } from "@/stores/employee";

const employeeStore = useEmployeeStore();
const { gridRef, checkboxData, gridEvents, ...tableMethods } = useGridTableMethods(gridOptions);

const searchForm = reactive({
  name: "",
  phone: "",
  status: null as number | null
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

const handleReset = () => {
  searchForm.name = "";
  searchForm.phone = "";
  searchForm.status = null;
  gridOptions.pagerConfig!.currentPage = 1;
  handleSearch();
};

const handleEdit = async (row?: any) => {
  showPopup(row).then((res) => {
    if (res !== "confirm") return;
    tableMethods.getList();
    HsMessage.success(row ? "修改成功" : "新增成功");
  });
};

const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? "启用" : "禁用";
  employeeStore.update(row.id, { status: row.status }).then(() => {
    HsMessage.success(`员工 ${row.name} 已${statusText}`);
  }).catch(() => {
    HsMessage.error("状态更新失败");
  });
};

const handleDelete = async (row: any) => {
  HsMessageBox.confirm("确定要删除该员工吗？", "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      employeeStore
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
};

const handleBatchDelete = () => {
  HsMessageBox.confirm(`确定要删除选中的 ${checkboxData.value.length} 名员工吗？`, "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      const ids = checkboxData.value.map((e: any) => e.id);
      employeeStore
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
};
</script>

<style scoped>
:deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>