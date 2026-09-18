<template>
  <div class="toolbar flex flex-wrap items-center gap-y-2 px-3 py-1.5 bg-white border-b border-gray-200">
    <!-- 文本格式 -->
    <div class="flex items-center space-x-1">
      <button
        class="word-button"
        :class="{ active: editor?.isActive('bold') }"
        title="粗体 (Ctrl+B)"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <i class="emr-icon icon-doc-jiacu" />
      </button>
      <button
        class="word-button"
        :class="{ active: editor?.isActive('italic') }"
        title="斜体 (Ctrl+I)"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <i class="emr-icon icon-doc-xieti" />
      </button>
      <button
        class="word-button"
        :class="{ active: editor?.isActive('underline') }"
        title="下划线 (Ctrl+U)"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        <i class="emr-icon icon-doc-xiahuaxian" />
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- 标题 -->
    <div class="flex items-center space-x-1">
      <button
        class="word-button"
        :class="{ active: editor?.isActive('heading', { level: 1 }) }"
        title="标题1"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        class="word-button"
        :class="{ active: editor?.isActive('heading', { level: 2 }) }"
        title="标题2"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- 列表 -->
    <div class="flex items-center space-x-1">
      <button
        class="word-button"
        :class="{ active: editor?.isActive('bulletList') }"
        title="无序列表"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <i class="emr-icon icon-doc-liebiao" />
      </button>
      <button
        class="word-button"
        :class="{ active: editor?.isActive('orderedList') }"
        title="有序列表"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <i class="emr-icon icon-doc-shuziliebiao" />
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- 对齐方式 -->
    <div class="flex items-center space-x-1">
      <button
        class="word-button"
        :class="{ active: editor?.isActive({ textAlign: 'left' }) }"
        title="左对齐"
        @click="editor?.chain().focus().setTextAlign('left').run()"
      >
        <i class="emr-icon icon-doc-zuoduiqi" />
      </button>
      <button
        class="word-button"
        :class="{ active: editor?.isActive({ textAlign: 'center' }) }"
        title="居中对齐"
        @click="editor?.chain().focus().setTextAlign('center').run()"
      >
        <i class="emr-icon icon-doc-juzhongduiqi" />
      </button>
      <button
        class="word-button"
        :class="{ active: editor?.isActive({ textAlign: 'right' }) }"
        title="右对齐"
        @click="editor?.chain().focus().setTextAlign('right').run()"
      >
        <i class="emr-icon icon-doc-youduiqi" />
      </button>
      <button
        class="word-button"
        :class="{ active: editor?.isActive({ textAlign: 'justify' }) }"
        title="两端对齐"
        @click="editor?.chain().focus().setTextAlign('justify').run()"
      >
        <i class="emr-icon icon-doc-fenbuduiqi" />
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- 表格 -->
    <div class="table-dropdown relative" @mouseenter="showTableMenu = true">
      <button class="word-button" title="插入表格" @click="showTableMenu = !showTableMenu">
        <i class="emr-icon icon-doc-biaoge" />
      </button>
      <div
        v-show="showTableMenu"
        @mouseleave="showTableMenu = false"
        class="table-menu absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3"
      >
        <div class="mb-3">
          <div class="text-gray-500 mb-2">选择行列数 {{ selectedRows }}x{{ selectedCols }}</div>
          <div class="grid-selector grid grid-cols-[repeat(8,1fr)] gap-1 p-1 rounded">
            <template v-for="row in maxRows" :key="row">
              <div
                v-for="col in maxCols"
                :key="`${row}-${col}`"
                class="border-[1px] border-gray-400 border-solid w-6 h-6 rounded-sm transition-colors"
                :class="{
                  'bg-blue-500': selectedRows >= row && selectedCols >= col
                }"
                @mouseenter="selectGrid(row, col)"
                @click="insertTable(row, col)"
              ></div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="toolbar-separator"></div>

    <!-- 分页 -->
    <div class="flex items-center space-x-1">
      <button
        class="word-button"
        :class="{ active: editor?.isActive('pageBreak') }"
        title="插入分页符"
        @click="editor?.chain().focus().insertContent({ type: 'pageBreak' }).run()"
      >
        <i class="emr-icon icon-doc-wendang" />
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- 页眉页脚 -->
    <div class="flex items-center space-x-1">
      <button class="word-button" :class="{ active: hasHeader }" title="插入页眉（全文档仅一个）" @click="handleInsertHeader()">页眉</button>
      <button class="word-button" :class="{ active: hasFooter }" title="插入页脚（全文档仅一个）" @click="handleInsertFooter()">页脚</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Editor } from "@tiptap/vue-3";

const props = defineProps<{
  editor: Editor | null | undefined;
}>();

/** 文档变更刷新标位（插入页眉/页脚后自增，驱动按钮高亮重算） */
const docTick = ref(0);

/** 扫描当前文档是否存在指定类型的块节点 */
function hasNodeType(type: string): boolean {
  docTick.value; // 建立响应依赖
  const ed = props.editor;
  if (!ed) return false;
  let found = false;
  ed.state.doc.descendants((node) => {
    if (node.type.name === type) {
      found = true;
      return false;
    }
    return !found;
  });
  return found;
}

const hasHeader = computed(() => hasNodeType("header"));
const hasFooter = computed(() => hasNodeType("footer"));

function handleInsertHeader() {
  props.editor?.chain().focus().insertHeader().run();
  docTick.value++;
}

function handleInsertFooter() {
  props.editor?.chain().focus().insertFooter().run();
  docTick.value++;
}

const showTableMenu = ref(false);
const maxRows = 8;
const maxCols = 8;
const selectedRows = ref(3);
const selectedCols = ref(3);

function selectGrid(row: number, col: number) {
  selectedRows.value = row;
  selectedCols.value = col;
}

function insertTable(rows: number, cols: number) {
  props.editor?.chain().focus().insertTable({ rows, cols }).run();
  showTableMenu.value = false;
}
</script>

<style scoped>
/* 按钮样式（对齐参考工具栏 word-button 观感） */
.word-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 28px;
  padding: 0 6px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.word-button:hover {
  background: #f1f3f5;
  border-color: #d5d5d5;
}

.word-button.active {
  background: #dbe0e6;
  border-color: transparent;
}

/* 分隔线 */
.toolbar-separator {
  height: 20px;
  border-right: 1px solid #e0e0e0;
  margin: 0 6px;
}

.emr-icon {
  font-size: 16px;
}
</style>
