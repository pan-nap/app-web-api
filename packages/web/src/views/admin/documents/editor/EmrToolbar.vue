<!--
  EmrToolbar — EMR 编辑器顶部工具栏

  功能：文本格式 + 表格/图片插入 + 校验 + 撤销/重做
-->
<template>
  <div class="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200">
    <!-- 加粗 -->
    <button class="emr-tb-btn" :class="{ 'is-active': editor.isActive('bold') }" title="加粗 (Ctrl+B)" @click="editor.chain().toggleBold().run()">
      <strong>B</strong>
    </button>
    <!-- 斜体 -->
    <button class="emr-tb-btn" :class="{ 'is-active': editor.isActive('italic') }" title="斜体 (Ctrl+I)" @click="editor.chain().toggleItalic().run()">
      <em>I</em>
    </button>
    <!-- 下划线 -->
    <button
      class="emr-tb-btn"
      :class="{ 'is-active': editor.isActive('underline') }"
      title="下划线 (Ctrl+U)"
      @click="editor.chain().toggleUnderline().run()"
    >
      <u>U</u>
    </button>

    <span class="w-px h-5 bg-gray-300 mx-2" />

    <!-- 表格 -->
    <button class="emr-tb-btn" title="插入表格" @click="$emit('insertTable')">表格</button>
    <!-- 图片 -->
    <button class="emr-tb-btn" title="插入图片" @click="$emit('insertImage')">图片</button>

    <span class="w-px h-5 bg-gray-300 mx-2" />

    <!-- 校验 -->
    <button class="emr-tb-btn text-green-600" title="保存前校验" @click="$emit('validate')">校验</button>

    <span class="w-px h-5 bg-gray-300 mx-2" />

    <!-- 撤销 -->
    <button class="emr-tb-btn" :disabled="!editor.can().chain().undo().run()" title="撤销 (Ctrl+Z)" @click="editor.chain().undo().run()">↩</button>
    <!-- 重做 -->
    <button class="emr-tb-btn" :disabled="!editor.can().chain().redo().run()" title="重做 (Ctrl+Y)" @click="editor.chain().redo().run()">↪</button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/core";

defineProps<{
  editor: Editor;
}>();

defineEmits<{
  insertTable: [];
  insertImage: [];
  validate: [];
}>();
</script>

<style scoped>
.emr-tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #555;
  transition: all 0.15s;
}
.emr-tb-btn:hover {
  background-color: #e5e7eb;
}
.emr-tb-btn.is-active {
  background-color: #dbeafe;
  color: #1976d2;
}
.emr-tb-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.emr-tb-btn:not(:disabled) {
  padding: 0 8px;
}
</style>
