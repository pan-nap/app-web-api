<template>
  <div class="flex flex-col h-full">
    <!-- 文书信息 -->
    <div class="flex items-center gap-4 px-4 py-3 border-b border-gray-200">
      <el-input v-model="docName" placeholder="请输入文书名称" class="flex-1" size="large" />
      <el-select v-model="docType" class="w-[120px]" size="large">
        <el-option label="模板" value="template" />
        <el-option label="实例" value="instance" />
      </el-select>
      <!-- 实例类型时选择关联模板 -->
      <el-select v-if="docType === 'instance'" v-model="templateId" placeholder="选择模板" class="w-[200px]" size="large">
        <el-option v-for="tpl in templateList" :key="tpl.id" :label="tpl.name" :value="tpl.id" />
      </el-select>
    </div>

    <!-- 编辑器 -->
    <div class="flex-1 overflow-hidden">
      <EmrEditor ref="editorRef" />
    </div>

    <!-- 底部按钮 -->
    <footer class="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
      <hs-button @click="close('cancel')">取消</hs-button>
      <bc-button type="primary">保存</bc-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { HsMessage } from "hs-admin-ui";
import { EmrEditor } from "@cashier/emr";
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
const editorRef = ref<InstanceType<typeof EmrEditor> | null>(null);

const docName = ref(props.row?.name ?? props.name ?? "");
const docType = ref(props.row?.type ?? props.docType ?? "template");
const templateId = ref<number | undefined>(props.row?.templateId);
const editorContent = ref<EmrElement[]>([]);
const templateList = ref<{ id: number; name: string }[]>([]);

onMounted(() => {
  setTimeout(() => {
    // 示例1：更新变量数据（使用嵌套对象格式）
    editorRef.value?.updateVariables({
      patient: {
        patient_name: "李四",
        patient_age: "28",
        patient_sex: "2",
        familyAddr: "上海市浦东新区"
      },
      patientOrder: {
        admission_time: "2026-07-15 08:30:00"
      }
    });

    // 示例2：插入变量节点（使用新的属性名）
    editorRef.value?.insertVariable({
      refKey: "custom.test_var",
      widgetName: "测试变量",
      widgetType: "text",
      extensionValue: "测试值"
    });

    // 示例3：获取模板数据（清除变量值）
    const template = editorRef.value?.getTemplate();
    console.log("模板数据:", template);

    // 示例4：获取变量数据
    const variables = editorRef.value?.getVariables();
    console.log("变量数据:", variables);
  }, 3000);
});
</script>
