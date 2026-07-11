<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 p-5 overflow-hidden">
      <el-form :model="form" label-width="80px">
        <el-form-item label="年级">
          <el-select v-model="form.grade" placeholder="请选择年级" clearable>
            <el-option v-for="item in dictionaryStore.getDictionary('grade')" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="form.className" placeholder="请选择班级" clearable>
            <el-option v-for="item in dictionaryStore.getDictionary('class')" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <footer class="flex items-center justify-end h-16 px-3">
      <hs-button @click="close('cancel')">取消</hs-button>
      <bc-button type="primary" @click="submit()">确定</bc-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import type { BatchForm, Student } from "@/types";
import { useDictionaryStore } from "@/stores/dictionary";
import { useStudentStore } from "@/stores/student";

const dictionaryStore = useDictionaryStore();
const studentStore = useStudentStore();

const props = defineProps<{
  close: (data?: "confirm" | "cancel") => void;
  rows: Student[];
}>();

const form = reactive<BatchForm>({
  grade: "",
  className: ""
});

const submit = async () => {
  const students = props.rows.map((i) => ({ ...i, grade: form.grade, className: form.className }));
  await studentStore.batchUpdate({ students });
  props.close("confirm");
};
</script>
