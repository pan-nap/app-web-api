<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 p-5 overflow-hidden">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="id">
          <el-input v-model="form.id" :disabled="!!props.row?.id" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
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
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
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
import type { Student } from "@/types";
import { useDictionaryStore } from "@/stores/dictionary";
import { useStudentStore } from "@/stores/student";

const dictionaryStore = useDictionaryStore();
const studentStore = useStudentStore();

const props = defineProps<{
  close: (data?: "confirm" | "cancel") => void;
  row?: Student;
}>();

const formRef = useTemplateRef("formRef");
const form = reactive<Student>({
  id: props.row?.id || "",
  name: props.row?.name || "",
  gender: props.row?.gender || "男",
  school: props.row?.school || "",
  grade: props.row?.grade || "一年级",
  className: props.row?.className || "",
  idCard: props.row?.idCard || "",
  phone: props.row?.phone || "",
  status: props.row?.status ?? 1,
  hasOrder: props.row?.hasOrder || false
});

const validateIdCard = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入身份证号"));
  } else if (value.length !== 18) {
    callback(new Error("身份证号必须为18位"));
  } else {
    callback();
  }
};

const rules = {
  id: [{ required: true, message: "请输入学号", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  school: [{ required: true, message: "请选择学校", trigger: "change" }],
  grade: [{ required: true, message: "请选择年级", trigger: "change" }],
  className: [{ required: true, message: "请选择班级", trigger: "change" }],
  idCard: [{ required: true, validator: validateIdCard, trigger: "blur" }],
  phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }]
};

const submit = async () => {
  await formRef.value.validate();
  if (props.row?.id) {
    await studentStore.update(props.row.id, form);
  } else {
    await studentStore.create(form);
  }
  props.close("confirm");
};
</script>
