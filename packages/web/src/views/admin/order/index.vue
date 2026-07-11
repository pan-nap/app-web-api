<template>
  <div class="p-5 h-full">
    <el-card class="h-full flex flex-col">
      <template #header>
        <span>订单管理</span>
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
          <el-form-item label="套餐名称">
            <el-select class="w-[150px]" v-model="searchForm.packageName" placeholder="请选择套餐" clearable>
              <el-option v-for="item in dictionaryStore.getDictionary('package')" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="gap-[10px] flex">
          <el-button type="primary" @click="handleEdit()">创建订单</el-button>
          <el-button type="danger" :disabled="!checkboxData.length" @click="handleBatchDelete">批量删除</el-button>
        </div>
      </div>
      <div class="flex-1 overflow-hidden">
        <vxe-grid ref="gridRef" v-bind="gridOptions" v-on="gridEvents" :style="{ '--vxe-ui-table-header-font-weight': '400' }">
          <template #studentCount="{ row }">
            <el-tag type="info">{{ row.paidCount || 0 }}/{{ row.studentCount || 0 }}</el-tag>
          </template>
          <template #orderStatus="{ row }">
            <el-tag :type="row.orderStatus === '已完成' ? 'success' : row.orderStatus === '待处理' ? 'warning' : 'info'">{{
              row.orderStatus || "待处理"
            }}</el-tag>
          </template>
          <template #setting="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">详情</el-button>
            <el-button type="primary" link @click="handleGeneratePayCode(row)">生成支付码</el-button>
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
import { showDetail } from "./detailPopup";
import type { Order } from "@/types";
import { useDictionaryStore } from "@/stores/dictionary";
import { useOrderStore } from "@/stores/order";

const dictionaryStore = useDictionaryStore();
const orderStore = useOrderStore();
const { gridRef, checkboxData, gridEvents, ...tableMethods } = useGridTableMethods(gridOptions);

const searchForm = reactive({
  school: "",
  grade: null as string | null,
  className: "",
  packageName: ""
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
  searchForm.packageName = "";
  gridOptions.pagerConfig!.currentPage = 1;
  handleSearch();
};

const handleViewDetail = (row: Order) => {
  showDetail(row).then(() => {
    tableMethods.getList();
  });
};

const handleEdit = async (row?: Order) => {
  showPopup(row).then((res) => {
    if (res !== "confirm") return;
    tableMethods.getList();
    HsMessage.success(row ? "修改成功" : "创建成功");
  });
};

const handleGeneratePayCode = (row: Order) => {
  HsMessageBox.confirm(`确定要为订单 ${row.orderNo} 生成支付码吗？`, "生成支付码", {
    type: "info",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      orderStore
        .generatePayCode(row!.id!)
        .then((res) => {
          HsMessage.success(`支付码生成成功：${res.data.payCode}`);
        })
        .finally(() => {
          instance.confirmButtonLoading = false;
          done();
        });
    }
  });
};

const handleDelete = async (row: Order) => {
  HsMessageBox.confirm("确定要删除该订单吗？", "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      orderStore
        .deleteById(row!.id!)
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
  HsMessageBox.confirm(`确定要删除选中的 ${checkboxData.value.length} 条订单吗？`, "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    beforeClose: (action: string, instance: any, done: Function) => {
      if (action !== "confirm") return done();
      instance.confirmButtonLoading = true;
      const ids = checkboxData.value.map((o: Order) => o.id);
      orderStore
        .batchDelete(ids)
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
</script>

<style scoped>
:deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
