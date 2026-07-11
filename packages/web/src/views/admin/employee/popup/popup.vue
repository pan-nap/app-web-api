<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 p-5 overflow-hidden">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="!!props.row" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item v-if="!props.row" label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <footer class="flex items-center justify-end h-16 px-3">
      <hs-button @click="close('cancel')">取消</hs-button>
      <hs-button type="primary" @click="submit">确定</hs-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, useTemplateRef, watch } from "vue";
import { useEmployeeStore } from "@/stores/employee";

const props = defineProps<{
  close: (data?: "confirm" | "cancel") => void;
  row?: any;
}>();

const employeeStore = useEmployeeStore();
const formRef = useTemplateRef("formRef");

const form = reactive({
  username: props.row?.username || "",
  password: "123456",
  name: props.row?.name || "",
  phone: props.row?.phone || "",
  email: props.row?.email || "",
  role: props.row?.role || "user",
  status: props.row?.status !== undefined ? props.row.status : 1
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9_]{3,20}$/, message: "用户名格式不正确，只能包含字母、数字和下划线，长度3-20位", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" }
  ],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }
  ]
};

watch(
  () => props.row,
  (newVal) => {
    if (newVal) {
      form.username = newVal.username;
      form.password = "";
      form.name = newVal.name;
      form.phone = newVal.phone;
      form.email = newVal.email || "";
      form.role = newVal.role || "user";
      form.status = newVal.status;
    } else {
      resetForm();
    }
  }
);

const resetForm = () => {
  form.username = "";
  form.password = "123456";
  form.name = "";
  form.phone = "";
  form.email = "";
  form.role = "user";
  form.status = 1;
};

const close = (data?: "confirm" | "cancel") => {
  props.close(data);
};

const submit = async () => {
  await formRef.value.validate();
  if (props.row?.id) {
    await employeeStore.update(props.row.id, form);
  } else {
    await employeeStore.create(form);
  }
  props.close("confirm");
};
</script>
