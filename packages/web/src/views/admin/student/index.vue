<template>
  <div class="p-5 h-full">
    <el-card class="h-full flex flex-col">
      <template #header>
        <span>学生管理</span>
      </template>
      <div class="flex items-start justify-between">
        <el-form inline :model="searchForm">
          <el-form-item label="学校">
            <el-select class="w-[150px]" v-model="searchForm.school" placeholder="请选择学校" clearable>
              <el-option v-for="item in dictionaryStore.getDictionary('school')" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="年级">
            <el-select class="w-[120px]" v-model="searchForm.grade" placeholder="请选择年级" clearable>
              <el-option v-for="item in dictionaryStore.getDictionary('grade')" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="班级">
            <el-select class="w-[100px]" v-model="searchForm.className" placeholder="请选择班级" clearable>
              <el-option v-for="item in dictionaryStore.getDictionary('class')" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
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
          <el-button type="primary" @click="handleEdit()">新增学生</el-button>
          <el-button type="warning" :disabled="!checkboxData.length" @click="handleBatchEdit">批量修改</el-button>
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
            <el-button type="danger" link :disabled="row.hasOrder" @click="handleDelete(row)">删除</el-button>
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
import { showBatchEditPopup } from "./batchEditPopup";
import type { Student } from "@/types";
import { useDictionaryStore } from "@/stores/dictionary";
import { useStudentStore } from "@/stores/student";

const dictionaryStore = useDictionaryStore();
const studentStore = useStudentStore();
const { gridRef, checkboxData, gridEvents, ...tableMethods } = useGridTableMethods(gridOptions);

const searchForm = reactive({
  school: "",
  grade: null as number | null,
  className: "",
  name: "",
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
  searchForm.school = "";
  searchForm.grade = null;
  searchForm.className = "";
  searchForm.name = "";
  searchForm.status = null;
  gridOptions.pagerConfig!.currentPage = 1;
  handleSearch();
};

const handleEdit = async (row?: Student) => {
  showPopup(row).then((res) => {
    if (res !== "confirm") return;
    tableMethods.getList();
    HsMessage.success(row ? "修改成功" : "新增成功");
  });
};

const handleStatusChange = (row: Student) => {
  const statusText = row.status === 1 ? "启用" : "禁用";
  HsMessage.success(`学生 ${row.name} 已${statusText}`);
};

const handleBatchEdit = async () => {
  showBatchEditPopup(checkboxData.value).then((res) => {
    if (res !== "confirm") return;
    HsMessage.success(`成功修改 ${checkboxData.value.length} 名学生`);
    tableMethods.getList();
  });
};

const handleDelete = async (row: Student) => {
  if (row.hasOrder) {
    HsMessage.error("该学生存在订单信息，无法删除");
    return;
  }
  HsMessageBox.confirm("确定要删除该学生吗？", "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      studentStore
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
  const hasOrderStudents = checkboxData.value.filter((s: Student) => s.hasOrder);
  if (hasOrderStudents.length > 0) {
    HsMessage.error(`选中的学生中有 ${hasOrderStudents.length} 名存在订单信息，无法删除`);
    return;
  }
  HsMessageBox.confirm(`确定要删除选中的 ${checkboxData.value.length} 名学生吗？`, "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      const ids = checkboxData.value.map((s: Student) => s.id);
      studentStore
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
