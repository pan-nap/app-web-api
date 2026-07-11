<template>
  <div class="flex flex-col h-full">
    <!-- 文书信息 -->
    <div class="flex items-center gap-4 px-4 py-3 border-b border-gray-200">
      <el-input v-model="docName" placeholder="请输入文书名称" class="flex-1" size="large" />
      <el-select v-model="docType" class="w-[120px]" size="large">
        <el-option label="模板" value="template" />
        <el-option label="实例" value="instance" />
      </el-select>
    </div>

    <!-- 编辑器 -->
    <div class="flex-1 overflow-auto">
      <EmrEditor ref="editorRef" v-model="editorContent" />
    </div>

    <!-- 底部按钮 -->
    <footer class="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
      <hs-button @click="close('cancel')">取消</hs-button>
      <bc-button type="primary" @click="handleSubmit">保存</bc-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { HsMessage } from "hs-admin-ui";
import { useDocumentStore } from "@/stores/documents";
import EmrEditor from "@/views/admin/documents/editor/EmrEditor.vue";
import type { EmrElement } from "@/types/emr";

const props = defineProps<{
  close: (data?: "confirm" | "cancel") => void;
  name?: string;
  docType?: "template" | "instance";
  row?: {
    id: string;
    name: string;
    type: "template" | "instance";
    content: EmrElement[];
    patientId?: string;
  };
}>();

const documentStore = useDocumentStore();
const editorRef = ref<InstanceType<typeof EmrEditor> | null>(null);

const docName = ref(props.row?.name ?? props.name ?? "");
const docType = ref(props.row?.type ?? props.docType ?? "template");
const editorContent = ref<EmrElement[]>(props.row?.content ?? []);
async function handleSubmit() {
  if (!docName.value.trim()) {
    HsMessage.warning("请输入文书名称");
    return;
  }

  if (props.row?.id) {
    await documentStore.update(props.row.id, {
      name: docName.value,
      type: docType.value,
      content: editorContent.value
    });
    HsMessage.success("保存成功");
  } else {
    await documentStore.create({
      name: docName.value,
      type: docType.value,
      content: editorContent.value
    });
    HsMessage.success("创建成功");
  }
  props.close("confirm");
}
</script>
