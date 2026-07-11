<!--
  EmrEditor — EMR 编辑器主组件（Tiptap 实现）

  功能：
  - 基础富文本编辑（加粗/斜体/下划线）
  - 撤销/重做
  - 变量插入（自定义 Variable 内联节点）
  - 表格插入 + 右键菜单（增删行列/合并拆分）
  - 图片插入
  - 常用术语插入
  - 保存前校验
  - A4 纸张布局
  - v-model 双向绑定 ProseMirror JSON
-->
<template>
  <div class="emr-editor flex flex-col h-full bg-gray-100">
    <EmrToolbar v-if="editor" :editor="editor" @insert-table="handleInsertTable" @insert-image="handleInsertImage" @validate="handleValidate" />

    <div class="flex flex-1 min-h-0">
      <!-- 编辑区（A4 纸张布局） -->
      <div class="emr-scroll flex-1 overflow-auto px-8 py-6">
        <div class="emr-paper mx-auto bg-white rounded-sm" :style="paperStyles" @contextmenu="showTableMenu" @click="closeTableMenu">
          <editor-content v-if="editor" :editor="editor" class="emr-content outline-none" />
        </div>
      </div>

      <!-- 右侧插入面板（tab 切换） -->
      <aside class="emr-sidebar w-60 border-l border-gray-200 bg-white flex flex-col flex-shrink-0">
        <div class="flex border-b border-gray-200">
          <button
            class="flex-1 text-sm py-2 text-center font-medium transition-colors"
            :class="sideTab === 'variable' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            @click="sideTab = 'variable'"
          >
            变量
          </button>
          <button
            class="flex-1 text-sm py-2 text-center font-medium transition-colors"
            :class="sideTab === 'term' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            @click="sideTab = 'term'"
          >
            术语
          </button>
        </div>

        <div v-show="sideTab === 'variable'" class="flex-1 overflow-auto p-2">
          <div v-for="group in VARIABLE_GROUPS" :key="group.groupKey" class="mb-3">
            <div class="text-xs font-medium text-gray-400 mb-1 px-1">{{ group.groupName }}</div>
            <div class="flex flex-wrap gap-1">
              <button v-for="v in group.variables" :key="v.varKey" class="emr-sb-item" @click="insertVar(v)">{{ v.varLabel }}</button>
            </div>
          </div>
        </div>

        <div v-show="sideTab === 'term'" class="flex-1 overflow-auto p-2">
          <div v-for="group in MEDICAL_TERMS" :key="group.groupName" class="mb-3">
            <div class="text-xs font-medium text-gray-400 mb-1 px-1">{{ group.groupName }}</div>
            <div class="flex flex-wrap gap-1">
              <button v-for="term in group.terms" :key="term" class="emr-sb-item" @click="insertTerm(term)">{{ term }}</button>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- 表格右键菜单 -->
    <teleport to="body">
      <div
        v-show="tableMenu.visible"
        class="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm"
        :style="{ left: tableMenu.x + 'px', top: tableMenu.y + 'px' }"
      >
        <button class="emr-menu-item" @click="tableAction('addRow')">插入行</button>
        <button class="emr-menu-item" @click="tableAction('deleteRow')">删除行</button>
        <button class="emr-menu-item" @click="tableAction('addColumn')">插入列</button>
        <button class="emr-menu-item" @click="tableAction('deleteColumn')">删除列</button>
        <span class="block h-px bg-gray-200 my-1" />
        <button class="emr-menu-item" @click="tableAction('mergeCells')">合并单元格</button>
        <button class="emr-menu-item" @click="tableAction('splitCells')">拆分单元格</button>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onBeforeUnmount, nextTick } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Gapcursor from "@tiptap/extension-gapcursor";
import { HsMessage } from "hs-admin-ui";
import type { EmrElement, VariableDef } from "@/types/emr";
import { VARIABLE_GROUPS, MEDICAL_TERMS } from "@/types/emr";
import { Variable } from "./extensions/Variable";
import { MedicalBlock } from "./extensions/MedicalBlock";
import { useEmrValidation } from "../composables/useEmrValidation";
import { showTableInsertPopup } from "../popup/table-insert";
import EmrToolbar from "./EmrToolbar.vue";

const props = defineProps<{
  modelValue?: EmrElement[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: any[]];
}>();

const { validate } = useEmrValidation();

const sideTab = ref<"variable" | "term">("variable");

// ========== 扩展列表 ==========
const extensions = [
  StarterKit.configure({
    bold: { HTMLAttributes: { class: "font-bold" } },
    italic: { HTMLAttributes: { class: "italic" } },
    underline: false
  }),
  Underline,
  Gapcursor,
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  ImageExt.configure({ inline: false, allowBase64: true }),
  Placeholder.configure({ placeholder: "开始输入病历内容..." }),
  Variable,
  MedicalBlock
];

// ========== 编辑器实例 ==========
const editor = new Editor({
  extensions,
  content: "",
  editable: true
});

// ========== 内容加载 ==========
async function loadContent(json: EmrElement[] | undefined): Promise<void> {
  if (!json || json.length === 0) {
    editor.commands.setContent("");
    return;
  }
  try {
    const html = generateHTML(json, extensions);
    editor.commands.setContent(html);
  } catch (e) {
    console.warn("generateHTML 失败，尝试直接 setContent:", e);
    try {
      editor.commands.setContent(json);
    } catch (e2) {
      console.error("setContent 也失败:", e2);
      editor.commands.setContent("");
    }
  }
}

// 初始加载
if (props.modelValue?.length) {
  nextTick(() => loadContent(props.modelValue));
}

// 外部 v-model 同步
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      const current = editor.getJSON();
      if (JSON.stringify(current.content) !== JSON.stringify(newVal)) {
        loadContent(newVal);
      }
    }
  },
  { deep: true }
);

// 编辑器内容变化 → 对外 emit
editor.on("update", () => {
  emit("update:modelValue", editor.getJSON().content as any[]);
});

onBeforeUnmount(() => {
  editor.destroy();
});

// ========== A4 纸张样式 ==========
const paperStyles = reactive({
  width: "210mm",
  minHeight: "297mm",
  padding: "15mm",
  boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
});

// ========== 变量/术语插入 ==========
function insertVar(v: VariableDef): void {
  editor
    .chain()
    .insertVariable({
      varKey: v.varKey,
      varLabel: v.varLabel,
      varDataType: v.varDataType,
      required: v.required,
      options: v.options
    })
    .run();
}

function insertTerm(term: string): void {
  editor.chain().insertContent(term).run();
}

// ========== 表格 + 图片插入 ==========
async function handleInsertTable(): Promise<void> {
  const size = await showTableInsertPopup();
  if (!size) return;
  editor.chain().insertTable({ rows: size.rows, cols: size.cols, withHeaderRow: true }).run();
}

function handleInsertImage(): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      editor
        .chain()
        .setImage({ src: e.target?.result as string })
        .run();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ========== 校验 ==========
function handleValidate(): void {
  const json = editor.getJSON();
  const errors = validate((json.content || []) as EmrElement[]);
  if (errors.length === 0) {
    HsMessage.success("校验通过，所有必填项已填写");
    return;
  }
  HsMessage.warning(`发现 ${errors.length} 个问题：`);
  errors.forEach((err) => HsMessage.error(err.message));
}

// ========== 表格右键菜单 ==========
const tableMenu = reactive({ visible: false, x: 0, y: 0 });

function showTableMenu(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (!target.closest("table")) return;
  event.preventDefault();
  tableMenu.visible = true;
  tableMenu.x = event.clientX;
  tableMenu.y = event.clientY;
}

function closeTableMenu(): void {
  tableMenu.visible = false;
}

function tableAction(action: string): void {
  const actions: Record<string, () => void> = {
    addRow: () => editor.chain().addRowAfter().run(),
    deleteRow: () => editor.chain().deleteRow().run(),
    addColumn: () => editor.chain().addColumnAfter().run(),
    deleteColumn: () => editor.chain().deleteColumn().run(),
    mergeCells: () => editor.chain().mergeCells().run(),
    splitCells: () => editor.chain().splitCell().run()
  };
  actions[action]?.();
  closeTableMenu();
}

defineExpose({
  editor,
  validate,
  loadContent
});
</script>

<style scoped>
.emr-editor {
  font-size: 15px;
  line-height: 1.8;
}
.emr-scroll {
  background: #e8ecf0;
}
.emr-paper {
  font-family: SimSun, STSong, serif;
  font-size: 11pt;
  line-height: 1.6;
  background: #fff;
}
.emr-content {
  min-height: inherit;
  cursor: text;
}
.emr-content :deep(p) {
  min-height: 1.5em;
  margin: 0.3em 0;
}
.emr-content :deep(.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #bbb;
  pointer-events: none;
  float: left;
  height: 0;
}
.emr-content :deep(.ProseMirror) :where(.emr-variable) {
  user-select: none;
}
.emr-content :deep(.ProseMirror) :where(.emr-variable.selected) {
  outline: 2px solid #1976d2;
  outline-offset: 1px;
}
/* 表格样式 */
.emr-content :deep(table) {
  border-collapse: collapse;
  margin: 0.5em 0;
  overflow: hidden;
  table-layout: fixed;
  width: 100%;
}
.emr-content :deep(td),
.emr-content :deep(th) {
  border: 1px solid #000;
  padding: 4px 8px;
  vertical-align: top;
  min-width: 1em;
}
.emr-content :deep(.selectedCell:after) {
  background: rgba(200, 200, 255, 0.4);
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2;
}
/* 右侧面板 */
.emr-sb-item {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  line-height: 1.4;
}
.emr-sb-item:hover {
  border-color: #93c5fd;
  background: #eff6ff;
  color: #1d4ed8;
}
/* 表格右键菜单 */
.emr-menu-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  white-space: nowrap;
}
.emr-menu-item:hover {
  background: #f3f4f6;
}
</style>
