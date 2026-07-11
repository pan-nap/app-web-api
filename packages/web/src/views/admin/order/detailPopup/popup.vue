<template>
  <div class="p-5">
    <el-descriptions :column="2" border v-if="orderData">
      <el-descriptions-item label="订单号">{{ orderData.order_no }}</el-descriptions-item>
      <el-descriptions-item label="学校">{{ orderData.school }}</el-descriptions-item>
      <el-descriptions-item label="年级">{{ orderData.grade }}</el-descriptions-item>
      <el-descriptions-item label="班级">{{ orderData.class_name }}</el-descriptions-item>
      <el-descriptions-item label="套餐名称">{{ orderData.package_name }}</el-descriptions-item>
      <el-descriptions-item label="套餐金额">¥{{ orderData.package_amount }}</el-descriptions-item>
      <el-descriptions-item label="创建人">{{ orderData.creator }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ orderData.created_at }}</el-descriptions-item>
    </el-descriptions>
    <el-divider>学生缴费明细</el-divider>
    <vxe-grid ref="gridRef" v-bind="gridOptions" v-on="gridEvents">
      <template #paymentStatus="{ row }">
        <el-tag :type="row.paymentStatus === '已缴费' ? 'success' : 'warning'">{{ row.paymentStatus }}</el-tag>
      </template>
      <template #action="{ row }">
        <el-button v-if="row.paymentStatus === '未缴费'" type="primary" link size="small" @click="handleUpdatePaymentStatus(row)">
          标记已缴费
        </el-button>
        <span v-else class="text-gray-400">-</span>
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { HsMessage } from "hs-admin-ui";
import { useGridTableMethods } from "@/hook/useGridTableMethods";
import { gridOptions } from "./gridOptions";
import { useOrderStore } from "@/stores/order";

const props = defineProps<{
  close: (data?: any) => void;
  row: any;
}>();

const orderStore = useOrderStore();

const { gridRef, gridEvents, ...tableMethods } = useGridTableMethods(gridOptions);
const orderData = ref<any>(null);

const fetchOrderDetail = async () => {
  const res = await orderStore.getById(props.row.id);
  orderData.value = res.data;
};

const handleUpdatePaymentStatus = async (row: any) => {
  await orderStore.updateItem(row.id, { paymentStatus: "已缴费", paymentTime: new Date().toLocaleString() });
  HsMessage.success("标记成功");
  tableMethods.getList({ orderId: props.row.id });
};

onMounted(() => {
  fetchOrderDetail();
  tableMethods.getList({ orderId: props.row.id }, `/sf-web/order/${props.row.id}/items`);
});
</script>
