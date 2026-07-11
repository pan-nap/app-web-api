<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 p-5 overflow-hidden">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="标签" prop="label">
          <el-input v-model="form.label" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="form.value" placeholder="请输入值" />
        </el-form-item>
        <el-form-item label="排序" prop="sort_order">
          <el-input v-model.number="form.sort_order" type="number" placeholder="请输入排序号" />
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
import type { DictionaryItem } from "@/types";
import { useDictionaryStore } from "@/stores/dictionary";

const props = defineProps<{
  close: (data?: "confirm" | "cancel") => void;
  row?: DictionaryItem;
}>();

const dictionaryStore = useDictionaryStore();
const formRef = useTemplateRef("formRef");
const form = reactive<Omit<DictionaryItem, "id">>({
  type: props.row?.type || "",
  label: props.row?.label || "",
  value: props.row?.value || "",
  sort_order: props.row?.sort_order || 0
});

const rules = {
  type: [{ required: true, message: "请输入类型", trigger: "blur" }],
  label: [{ required: true, message: "请输入标签", trigger: "blur" }],
  value: [{ required: true, message: "请输入值", trigger: "blur" }]
};

const submit = async () => {
  await formRef.value.validate();
  if (props.row?.id) {
    await dictionaryStore.updateDictionary(props.row?.id, form);
  } else {
    await dictionaryStore.addDictionary(form);
  }
  props.close("confirm");
};
</script>
