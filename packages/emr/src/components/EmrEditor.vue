<template>
  <div class="emr-editor">
    <editor-content :editor="editor" class="emr-content bg-white shadow-sm my-2" :style="contentStyle" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import { VariableExtension } from "../extensions/VariableExtension";
import { PageBreakExtension } from "../extensions/PageBreakExtension";
import { HeaderExtension, FooterExtension, HeaderFooterGuard } from "../extensions/HeaderFooterExtension";
import { useVariableEditing } from "../hooks/useVariableEditing";
import { useTableContextMenu } from "../hooks/useTableContextMenu";
import { useEmrApi } from "../hooks/useEmrApi";
import type { EmrEditorProps } from "../types";
import { DEFAULT_PAGE_SETTINGS, PAGE_SIZE_DIMENSIONS } from "../types";
import { computed, onMounted, onBeforeUnmount, nextTick } from "vue";

const props = withDefaults(defineProps<EmrEditorProps>(), {
  disabled: false,
  content: null,
  initialData: undefined,
  pageSettings: undefined
});

/** 根据页面设置计算容器样式 */
const contentStyle = computed(() => {
  const ps = props.pageSettings || DEFAULT_PAGE_SETTINGS;
  const isLandscape = ps.orientation === "landscape";

  let width: number;
  let height: number;

  if (ps.pageSize === "Custom") {
    width = 210;
    height = 297;
  } else {
    const dims = PAGE_SIZE_DIMENSIONS[ps.pageSize];
    width = isLandscape ? dims.height : dims.width;
    height = isLandscape ? dims.width : dims.height;
  }

  return {
    padding: `${ps.marginTop}mm ${ps.marginRight}mm ${ps.marginBottom}mm ${ps.marginLeft}mm`,
    "--page-width": `${width}mm`,
    "--page-height": `${height}mm`,
    "--margin-top": `${ps.marginTop}mm`,
    "--margin-right": `${ps.marginRight}mm`,
    "--margin-bottom": `${ps.marginBottom}mm`,
    "--margin-left": `${ps.marginLeft}mm`
  } as Record<string, string>;
});

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }
    }),
    VariableExtension,
    Table.configure({
      resizable: true
    }),
    TableRow,
    TableCell,
    TableHeader,
    Placeholder.configure({
      placeholder: "开始输入内容..."
    }),
    TextStyle,
    TextAlign.configure({
      types: ["heading", "paragraph"]
    }),
    PageBreakExtension,
    HeaderExtension,
    FooterExtension,
    HeaderFooterGuard
  ],
  editable: !props.disabled,
  content: ""
});

useVariableEditing(editor, props);
useTableContextMenu(editor, props);

/**
 * 页眉/页脚布局同步：
 * - 页眉为文档首个块节点，正常流贴顶；
 * - 页脚绝对定位贴页面底部，通过撑开 ProseMirror 底部 padding 避免遮挡正文。
 */
let hfResizeObserver: ResizeObserver | null = null;
let hfMutationObserver: MutationObserver | null = null;

function isHeaderFooter(node: Node): boolean {
  const el = node as Element;
  return !!el.classList && (el.classList.contains("emr-header") || el.classList.contains("emr-footer"));
}

function syncHeaderFooterSpacing() {
  const pm = editor.value?.view.dom as HTMLElement | undefined;
  if (!pm) return;
  const cs = getComputedStyle(pm);
  if (!pm.dataset.basePadBottom) {
    pm.dataset.basePadBottom = cs.paddingBottom;
    pm.dataset.basePadLeft = cs.paddingLeft;
    pm.dataset.basePadRight = cs.paddingRight;
  }
  const baseBottom = parseFloat(pm.dataset.basePadBottom ?? "") || 0;
  const baseLeft = parseFloat(pm.dataset.basePadLeft ?? "") || 0;
  const baseRight = parseFloat(pm.dataset.basePadRight ?? "") || 0;

  const footer = pm.querySelector(".emr-footer") as HTMLElement | null;
  if (footer) {
    footer.style.left = `${baseLeft}px`;
    footer.style.right = `${baseRight}px`;
  }
  const footerGap = footer ? footer.offsetHeight + 12 : 0;
  pm.style.paddingBottom = `${baseBottom + footerGap}px`;
}

function setupHeaderFooterObservers() {
  const pm = editor.value?.view.dom as HTMLElement | undefined;
  if (!pm || typeof ResizeObserver === "undefined") return;
  hfResizeObserver = new ResizeObserver(() => syncHeaderFooterSpacing());
  pm.querySelectorAll(".emr-header, .emr-footer").forEach((el) => hfResizeObserver?.observe(el));
  hfMutationObserver = new MutationObserver((mutations) => {
    let changed = false;
    mutations.forEach((m) => {
      m.addedNodes.forEach((n) => {
        if (isHeaderFooter(n)) {
          hfResizeObserver?.observe(n as Element);
          changed = true;
        }
      });
      m.removedNodes.forEach((n) => {
        if (isHeaderFooter(n)) {
          hfResizeObserver?.unobserve(n as Element);
          changed = true;
        }
      });
    });
    if (changed) syncHeaderFooterSpacing();
  });
  hfMutationObserver.observe(pm, { childList: true, subtree: true });
  syncHeaderFooterSpacing();
}

onMounted(() => {
  nextTick(setupHeaderFooterObservers);
});

onBeforeUnmount(() => {
  hfResizeObserver?.disconnect();
  hfMutationObserver?.disconnect();
  hfResizeObserver = null;
  hfMutationObserver = null;
});

defineExpose(useEmrApi(editor, props));
</script>

<style scoped>
.emr-editor {
  color: #000;
  font-size: 15px;
  line-height: 1.5;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  overflow: hidden;
}

.emr-content {
  padding: 15mm;
  overflow: auto;
  box-sizing: border-box;
}
.emr-content :deep(.ProseMirror) {
  width: var(--page-width, 210mm);
  min-height: var(--page-height, 297mm);
  padding: var(--margin-top, 15mm) var(--margin-right, 15mm) var(--margin-bottom, 15mm) var(--margin-left, 15mm);
  position: relative;
}

/* 页眉：文档首个块节点，正常流贴顶，底部虚线分隔 */
.emr-content :deep(.emr-header) {
  border-bottom: 1px dashed #c9ccd1;
  padding-bottom: 6px;
  margin-bottom: 12px;
}
/* 页脚：绝对定位贴页面底部（left/right/bottom 由 JS 按边距同步） */
.emr-content :deep(.emr-footer) {
  position: absolute;
  bottom: 0;
  border-top: 1px dashed #c9ccd1;
  padding-top: 6px;
  background: #fff;
}
.emr-content :deep(.emr-header > p:first-child:empty::before) {
  content: "页眉（点击编辑）";
  color: #c0c4cc;
}
.emr-content :deep(.emr-footer > p:first-child:empty::before) {
  content: "页脚（点击编辑）";
  color: #c0c4cc;
}
.emr-content :deep(.emr-header) {
  color: #606266;
  font-size: 10pt;
}
.emr-content :deep(.emr-footer) {
  color: #606266;
  font-size: 10pt;
}
.emr-content :deep(p) {
  margin: 0 0 1em 0;
}

.emr-content :deep(h1) {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 0.5em 0;
}

.emr-content :deep(h2) {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 0.5em 0;
}

.emr-content :deep(ul),
.emr-content :deep(ol) {
  padding-left: 1.5em;
  margin: 0 0 1em 0;
}

.emr-content :deep(li) {
  margin: 0.3em 0;
}

.emr-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  table-layout: fixed;
}

.emr-content :deep(th),
.emr-content :deep(td) {
  border: 1px solid #000;
  padding: 4px 6px;
  text-align: left;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  font-size: 11pt;
  line-height: 1.4;
  vertical-align: middle;
}

.emr-content :deep(th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

.emr-content :deep(.emr-variable) {
  display: inline-block;
  min-width: 30px;
  text-align: center;
  padding: 0 4px;
  border-bottom: 1px solid #000;
  cursor: pointer;
  line-height: inherit;
}
.emr-content :deep(.emr-variable-filled) {
  color: #000;
}
.emr-content :deep(.emr-variable-empty) {
  color: #7fbdff;
  background: rgba(184, 218, 255, 0.23);
}

.emr-content :deep(.emr-variable-underline) {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.emr-content :deep(.emr-variable[data-readonly="true"]) {
  cursor: not-allowed;
  opacity: 0.7;
}

.emr-content :deep(.ProseMirror-focused) {
  outline: none;
  border: none;
}

.emr-content :deep(.page-break) {
  position: relative;
}
.emr-content :deep(.page-break) {
  width: 100%;
  height: 1px;
  background: #ccc;
  position: relative;
  margin: 16px 0;
}

.emr-content :deep(.page-break-text) {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 12px;
  background: white;
  padding: 0 8px;
}

.emr-content :deep(.emr-variable-select) {
  padding-right: 18px;
  position: relative;
}

.emr-content :deep(.emr-variable-select::after) {
  content: "▼";
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  color: #999;
}
:deep(.ProseMirror .selectedCell) {
  background-color: rgba(0, 150, 255, 0.1); /* 浅蓝色背景 */
}

/* 打印：仅保留文书内容 */
@media print {
  .emr-editor {
    background: #fff !important;
    overflow: visible !important;
  }
  .emr-content {
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }
  :deep(.ProseMirror) {
    width: auto !important;
    min-height: auto !important;
    padding: 0 !important;
  }
  /* 打印时变量显示为普通文本 */
  :deep(.emr-variable) {
    cursor: default !important;
    background: none !important;
  }
  :deep(.emr-variable-empty) {
    color: #999 !important;
    background: none !important;
  }
}
</style>
