<template>
  <div class="h-full overflow-hidden flex flex-col">
    <div class="basis-[150rpx]"></div>
    <EmrDesigner ref="editorRef" />
    <div class="basis-[150rpx]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
