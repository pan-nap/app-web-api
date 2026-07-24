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
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      :class="{ 'bg-blue-100 text-blue-600': editor?.isActive({ textAlign: 'left' }) }"
      @click="editor?.chain().focus().setTextAlign('left').run()"
      title="左对齐"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="15" y1="3" x2="6" y2="3"></line>
        <line x1="15" y1="9" x2="6" y2="9"></line>
        <line x1="19" y1="15" x2="6" y2="15"></line>
        <line x1="19" y1="21" x2="6" y2="21"></line>
      </svg>
    </button>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      :class="{ 'bg-blue-100 text-blue-600': editor?.isActive({ textAlign: 'center' }) }"
      @click="editor?.chain().focus().setTextAlign('center').run()"
      title="居中"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="21" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="6" x2="3" y2="6"></line>
        <line x1="21" y1="18" x2="3" y2="18"></line>
      </svg>
    </button>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      :class="{ 'bg-blue-100 text-blue-600': editor?.isActive({ textAlign: 'right' }) }"
      @click="editor?.chain().focus().setTextAlign('right').run()"
      title="右对齐"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="9" y1="3" x2="18" y2="3"></line>
        <line x1="9" y1="9" x2="18" y2="9"></line>
        <line x1="5" y1="15" x2="18" y2="15"></line>
        <line x1="5" y1="21" x2="18" y2="21"></line>
      </svg>
    </button>
    <div class="w-px h-6 bg-gray-200 mx-1"></div>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      @click="editor?.chain().focus().toggleTextStyle({ verticalAlign: 'top' }).run()"
      title="顶部对齐"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      @click="editor?.chain().focus().toggleTextStyle({ verticalAlign: 'middle' }).run()"
      title="居中对齐"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="12" y1="22" x2="12" y2="2"></line>
        <polyline points="4 12 12 2 20 12"></polyline>
        <polyline points="4 12 12 22 20 12"></polyline>
      </svg>
    </button>
    <button
      class="toolbar-btn px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
      @click="editor?.chain().focus().toggleTextStyle({ verticalAlign: 'bottom' }).run()"
      title="底部对齐"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
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
