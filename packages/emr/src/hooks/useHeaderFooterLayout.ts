import { onMounted, onBeforeUnmount, nextTick } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { EmrEditorProps } from "../types";

/**
 * 页眉/页脚布局同步：
 * - 页眉为文档首个块节点，正常流贴顶；
 * - 页脚绝对定位贴页面底部，通过撑开 ProseMirror 底部 padding 避免遮挡正文。
 */
export const useHeaderFooterLayout = (editor: { value: Editor | undefined }, props: EmrEditorProps) => {
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

  return {};
};
