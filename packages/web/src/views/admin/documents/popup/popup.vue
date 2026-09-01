<template>
  <div class="h-full overflow-hidden">
    <EmrDesigner
      ref="designerRef"
      :name="docName"
      :doc-type="'template'"
      :content="editorContent"
      hide-type-select
      @save="handleSave"
      @preview="handlePreview"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { EmrDesigner } from "@cashier/emr";
import type { EmrDesignerSavePayload, DocNode } from "@cashier/emr";
import { useDocumentStore } from "@/stores/documents";
import { HsMessage } from "hs-admin-ui";

const props = defineProps<{
  close: (data?: "confirm" | "cancel") => void;
  name?: string;
  row?: {
    id: string;
    name: string;
    content: DocNode;
  };
}>();

const documentStore = useDocumentStore();
const designerRef = ref<InstanceType<typeof EmrDesigner> | null>(null);

const docName = ref(props.row?.name ?? props.name ?? "");
const editorContent = ref<DocNode | null>(props.row?.content ?? null);

async function handleSave(payload: EmrDesignerSavePayload) {
  if (props.row?.id) {
    await documentStore.update(props.row.id, {
      name: payload.name,
      type: "template",
      content: payload.content
    });
  } else {
    await documentStore.create({
      name: payload.name,
      type: "template",
      content: payload.content
    });
  }
  props.close("confirm");
}

async function handlePreview(payload: EmrDesignerSavePayload) {
  // 预览前先校验名称
  if (!payload.name.trim()) {
    HsMessage.warning("请输入文书名称后再预览");
    return;
  }
  // 预览：先保存，再通过浏览器打印预览展示 A4 文书
  if (props.row?.id) {
    await documentStore.update(props.row.id, {
      name: payload.name,
      type: "template",
      content: payload.content
    });
  } else {
    await documentStore.create({
      name: payload.name,
      type: "template",
      content: payload.content
    });
  }
  window.print();
}

onMounted(() => {
  // 编辑已有文书但列表未带 content 时，从后端加载
  if (props.row?.id && !editorContent.value) {
    documentStore.getById(props.row.id).then((res: any) => {
      const doc = res?.data ?? res;
      if (doc?.content) {
        editorContent.value = doc.content;
      }
    });
  }
});
</script>
