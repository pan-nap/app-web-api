<template>
  <div class="toolbar flex items-center gap-1 px-3 bg-white border-b border-gray-200">
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      :class="{ 'bg-blue-100 text-blue-600': editor?.isActive('bold') }"
      @click="editor?.chain().focus().toggleBold().run()"
    >
      B
    </button>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      :class="{ 'bg-blue-100 text-blue-600': editor?.isActive('italic') }"
      @click="editor?.chain().focus().toggleItalic().run()"
    >
      I
    </button>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      :class="{ 'bg-blue-100 text-blue-600': editor?.isActive('underline') }"
      @click="editor?.chain().focus().toggleUnderline().run()"
    >
      U
    </button>
    <div class="w-px h-6 bg-gray-200 mx-1"></div>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      :class="{ 'bg-blue-100 text-blue-600': editor?.isActive('heading', { level: 1 }) }"
      @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
    >
      H1
    </button>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      :class="{ 'bg-blue-100 text-blue-600': editor?.isActive('heading', { level: 2 }) }"
      @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      H2
    </button>
    <div class="w-px h-6 bg-gray-200 mx-1"></div>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      @click="editor?.chain().focus().toggleBulletList().run()"
    >
      • List
    </button>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      @click="editor?.chain().focus().toggleOrderedList().run()"
    >
      1. List
    </button>
    <div class="w-px h-6 bg-gray-200 mx-1"></div>
    <div class="table-dropdown relative" @mouseenter="showTableMenu = true">
      <button class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-1">
        <span>Table</span>
        <span class="text-xs">▼</span>
      </button>
      <div
        v-show="showTableMenu"
        @mouseleave="showTableMenu = false"
        class="table-menu absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 min-w-[200px]"
      >
        <div class="mb-3">
          <div class="text-xs text-gray-500 mb-2">选择行列数</div>
          <div class="grid-selector grid grid-cols-[repeat(8,1fr)] gap-1 bg-gray-200 p-1 rounded">
            <template v-for="row in maxRows" :key="row">
              <button
                v-for="col in maxCols"
                :key="`${row}-${col}`"
                class="grid-cell w-6 h-6 text-xs rounded-sm transition-colors"
                :class="{
                  'bg-blue-500 text-white': selectedRows >= row && selectedCols >= col,
                  'hover:bg-blue-100': selectedRows < row || selectedCols < col
                }"
                @mouseenter="selectGrid(row, col)"
                @click="insertTable(row, col)"
              ></button>
            </template>
          </div>
        </div>
        <div class="border-t border-gray-100 pt-3 space-y-2">
          <button class="dropdown-btn w-full px-3 py-2 text-sm rounded hover:bg-gray-50 text-left flex items-center gap-2" @click="handleMergeCells">
            <span>合并单元格</span>
          </button>
          <button class="dropdown-btn w-full px-3 py-2 text-sm rounded hover:bg-gray-50 text-left flex items-center gap-2" @click="handleSplitCell">
            <span>拆分单元格</span>
          </button>
          <button
            class="dropdown-btn w-full px-3 py-2 text-sm rounded hover:bg-gray-50 text-left flex items-center gap-2"
            @click="handleAddRowBefore"
          >
            <span>在上方添加行</span>
          </button>
          <button class="dropdown-btn w-full px-3 py-2 text-sm rounded hover:bg-gray-50 text-left flex items-center gap-2" @click="handleAddRowAfter">
            <span>在下方添加行</span>
          </button>
          <button
            class="dropdown-btn w-full px-3 py-2 text-sm rounded hover:bg-gray-50 text-left flex items-center gap-2"
            @click="handleAddColumnBefore"
          >
            <span>在左侧添加列</span>
          </button>
          <button
            class="dropdown-btn w-full px-3 py-2 text-sm rounded hover:bg-gray-50 text-left flex items-center gap-2"
            @click="handleAddColumnAfter"
          >
            <span>在右侧添加列</span>
          </button>
          <button class="dropdown-btn w-full px-3 py-2 text-sm rounded hover:bg-gray-50 text-left flex items-center gap-2" @click="handleDeleteRow">
            <span>删除当前行</span>
          </button>
          <button
            class="dropdown-btn w-full px-3 py-2 text-sm rounded hover:bg-gray-50 text-left flex items-center gap-2"
            @click="handleDeleteColumn"
          >
            <span>删除当前列</span>
          </button>
          <button
            class="dropdown-btn w-full px-3 py-2 text-sm rounded hover:bg-gray-50 text-left flex items-center gap-2 text-red-500"
            @click="handleDeleteTable"
          >
            <span>删除表格</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Editor } from "@tiptap/vue-3";

const props = defineProps<{
  editor: Editor | null | undefined;
}>();

const showTableMenu = ref(false);
const maxRows = 8;
const maxCols = 8;
const selectedRows = ref(3);
const selectedCols = ref(3);

const selectGrid = (row: number, col: number) => {
  selectedRows.value = row;
  selectedCols.value = col;
};

const insertTable = (rows: number, cols: number) => {
  props.editor?.chain().focus().insertTable({ rows, cols }).run();
  showTableMenu.value = false;
};

const handleMergeCells = () => {
  props.editor?.chain().focus().mergeCells().run();
  showTableMenu.value = false;
};

const handleSplitCell = () => {
  props.editor?.chain().focus().splitCell().run();
  showTableMenu.value = false;
};

const handleAddRowBefore = () => {
  props.editor?.chain().focus().addRowBefore().run();
  showTableMenu.value = false;
};

const handleAddRowAfter = () => {
  props.editor?.chain().focus().addRowAfter().run();
  showTableMenu.value = false;
};

const handleAddColumnBefore = () => {
  props.editor?.chain().focus().addColumnBefore().run();
  showTableMenu.value = false;
};

const handleAddColumnAfter = () => {
  props.editor?.chain().focus().addColumnAfter().run();
  showTableMenu.value = false;
};

const handleDeleteRow = () => {
  props.editor?.chain().focus().deleteRow().run();
  showTableMenu.value = false;
};

const handleDeleteColumn = () => {
  props.editor?.chain().focus().deleteColumn().run();
  showTableMenu.value = false;
};

const handleDeleteTable = () => {
  props.editor?.chain().focus().deleteTable().run();
  showTableMenu.value = false;
};
</script>

<style scoped>
.toolbar-btn {
  font-weight: 500;
}

.grid-cell {
  background-color: white;
}

.dropdown-btn:active {
  background-color: #e5e7eb;
}
</style>
