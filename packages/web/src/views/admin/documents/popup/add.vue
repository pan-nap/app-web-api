<template>
  <div class="flex flex-col h-full">
    <!-- 编辑器 -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <div class="basis-[150rpx]"></div>
      <EmrDesigner ref="editorRef" />
      <div class="basis-[150rpx]"></div>
    </div>

    <!-- 底部按钮 -->
    <footer class="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
      <hs-button @click="close('cancel')">取消</hs-button>
      <bc-button type="primary">保存</bc-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { EmrDesigner } from "@cashier/emr";
import type { EmrElement } from "@cashier/emr";
import { useDocumentStore } from "@/stores/documents";

const props = defineProps<{
  close: (data?: "confirm" | "cancel") => void;
  name?: string;
  docType?: "template" | "instance";
  row?: {
    id: string;
    name: string;
    type: "template" | "instance";
    templateId?: number;
    content: EmrElement[];
    patientId?: string;
  };
}>();

const documentStore = useDocumentStore();
const editorRef = ref<InstanceType<typeof EmrDesigner> | null>(null);

const docName = ref(props.row?.name ?? props.name ?? "");
const docType = ref(props.row?.type ?? props.docType ?? "template");
const templateId = ref<number | undefined>(props.row?.templateId);
const templateList = ref<{ id: number; name: string }[]>([]);
</script>
