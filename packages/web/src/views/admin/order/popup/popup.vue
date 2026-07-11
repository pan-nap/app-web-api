<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 p-5 overflow-hidden">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="学校" prop="school">
          <el-select v-model="form.school" placeholder="请选择学校">
            <el-option v-for="item in dictionaryStore.getDictionary('school')" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择年级">
            <el-option v-for="item in dictionaryStore.getDictionary('grade')" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-select v-model="form.className" placeholder="请选择班级">
            <el-option v-for="item in dictionaryStore.getDictionary('class')" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐名称" prop="packageName">
          <el-input v-model="form.packageName" placeholder="请输入套餐名称"> </el-input>
        </el-form-item>
        <el-form-item label="套餐金额" prop="packageAmount">
          <el-input-number v-model="form.packageAmount" :min="0" :precision="2" placeholder="请输入金额" />
        </el-form-item>
      </el-form>
    </div>
    <footer class="flex items-center justify-end h-16">
      <hs-button @click="close('cancel')">取消</hs-button>
      <hs-button type="primary" @click="submit()" style="margin-right: 10px">确定</hs-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, useTemplateRef } from "vue";
import type { Order } from "@/types";
import { useDictionaryStore } from "@/stores/dictionary";
import { useOrderStore } from "@/stores/order";

const dictionaryStore = useDictionaryStore();
const orderStore = useOrderStore();

const props = defineProps<{
  close: (data?: any) => void;
  row?: Order;
}>();

const formRef = useTemplateRef("formRef");

const form = reactive({
  school: props.row?.school || "",
  grade: props.row?.grade || null,
  className: props.row?.className || "",
  packageName: props.row?.packageName || "",
  packageAmount: props.row?.packageAmount || 0
});

const rules = {
  school: [{ required: true, message: "请选择学校", trigger: "change" }],
  grade: [{ required: true, message: "请选择年级", trigger: "change" }],
  className: [{ required: true, message: "请选择班级", trigger: "change" }],
  packageName: [{ required: true, message: "请选择套餐", trigger: "change" }],
  packageAmount: [{ required: true, message: "请输入套餐金额", trigger: "blur" }]
};

const submit = async () => {
  await formRef.value.validate();
  if (props.row?.id) {
    await orderStore.update(props.row.id, form);
  } else {
    await orderStore.create(form);
  }
  props.close("confirm");
};
</script>
