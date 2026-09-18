/**
 * EMR 打印分页引擎（P2：真实切片分页）
 *
 * 思路（移植自华速 HIS 分页算法，改为直接消费编辑器克隆 DOM）：
 * 1. 克隆 .emr-content → 清理编辑态 → 抽出页眉/页脚 → 取正文块节点；
 * 2. 先按显式 pageBreak 节点切成「硬分段」；
 * 3. 在离屏探针页（与最终纸张同尺寸）里按浏览器真实排版高度逐块填充，
 *    超高分段按文本行、表格按行拆分，切出多张固定页；
 * 4. 输出每页正文 HTML，页眉/页脚/页码由打印构建器逐页拼装。
 */
import type { PageSettings } from "../types";
import { PAGE_SIZE_DIMENSIONS } from "../types";

/** 获取纸张毫米宽高（横向时自动交换，Custom 按 A4 兜底） */
export function getPaperDimensionsMm(settings: PageSettings): { width: number; height: number } {
  const dims = settings.pageSize === "Custom" ? PAGE_SIZE_DIMENSIONS.A4 : PAGE_SIZE_DIMENSIONS[settings.pageSize];
  if (settings.orientation === "landscape") {
    return { width: dims.height, height: dims.width };
  }
  return { width: dims.width, height: dims.height };
}

/** 分页结果：单页正文 HTML */
export interface PrintPage {
  bodyHTML: string;
}

/** 分页结果：页眉/页脚为全文共用，逐页重复 */
export interface PrintParts {
  pages: PrintPage[];
  headerHTML: string;
  footerHTML: string;
}

/** cloneNode 不复制 input/textarea/select 的实时值，先同步到标签属性 */
function syncFieldValues(root: HTMLElement) {
  root.querySelectorAll("input").forEach((el) => {
    el.setAttribute("value", (el as HTMLInputElement).value);
  });
  root.querySelectorAll("textarea").forEach((el) => {
    el.textContent = (el as HTMLTextAreaElement).value;
  });
  root.querySelectorAll("select").forEach((el) => {
    const select = el as HTMLSelectElement;
    select.options[select.selectedIndex]?.setAttribute("selected", "");
  });
}

/** 清理编辑态痕迹，避免离屏测量/输出与实际不一致 */
function sanitizePrintClone(clone: HTMLElement) {
  clone.querySelectorAll("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));
  clone.querySelectorAll("[tabindex]").forEach((el) => el.removeAttribute("tabindex"));
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  clone.querySelectorAll(".ProseMirror-selectednode, .selectedCell, .editor-selected, .ProseMirror-focused").forEach((el) => {
    el.classList.remove("ProseMirror-selectednode", "selectedCell", "editor-selected", "ProseMirror-focused");
  });
  clone.querySelectorAll(".measure-span").forEach((el) => el.remove());
  clone.querySelectorAll("button").forEach((el) => el.remove());
}

/** 等待字体就绪 + 两轮渲染，保证测量与实际排版一致 */
async function waitForLayout() {
  try {
    await document.fonts.ready;
  } catch {
    /* 忽略字体加载异常 */
  }
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** 克隆指定文本行，保留内层结构（变量下划线等），并固定内联宽度避免重排 */
function cloneLineHtml(node: HTMLElement, range: Range): string {
  let content = range.cloneContents();
  let ancestor =
    range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : (range.commonAncestorContainer as HTMLElement);
  while (ancestor && ancestor !== node) {
    const wrapper = ancestor.cloneNode(false) as HTMLElement;
    wrapper.append(content);
    content = document.createDocumentFragment();
    content.append(wrapper);
    ancestor = ancestor.parentElement;
  }
  const fragment = node.cloneNode(false) as HTMLElement;
  fragment.append(content);
  // Range 不含段落末尾的 trailingBreak，补回以保证换行一致
  const trailingBreak = node.querySelector(":scope > br.ProseMirror-trailingBreak");
  if (trailingBreak && !fragment.querySelector(":scope > br.ProseMirror-trailingBreak")) {
    fragment.append(trailingBreak.cloneNode(true));
  }
  return fragment.outerHTML;
}

/** 将超高文本节点按行、表格节点按行拆成独立 HTML 片段（node 必须已在 DOM 中布局） */
function splitNodeByLines(node: HTMLElement, availableHeight: number): Array<{ html: string; height: number }> {
  if (node.classList.contains("tableWrapper")) {
    const table = node.querySelector<HTMLTableElement>("table");
    if (!table) {
      return [{ html: node.outerHTML, height: node.getBoundingClientRect().height }];
    }
    const fragments: Array<{ html: string; height: number }> = [];
    let rows: HTMLTableRowElement[] = [];
    let rowsHeight = 0;
    const pushTable = () => {
      const tableFragment = table.cloneNode(true) as HTMLTableElement;
      tableFragment.querySelectorAll("thead, tbody, tfoot").forEach((section) => section.remove());
      const body = document.createElement("tbody");
      rows.forEach((row) => body.append(row.cloneNode(true)));
      tableFragment.append(body);
      const wrapper = node.cloneNode(false) as HTMLElement;
      wrapper.append(tableFragment);
      fragments.push({ html: wrapper.outerHTML, height: rowsHeight });
    };
    Array.from(table.rows).forEach((row) => {
      const rowHeight = row.getBoundingClientRect().height;
      if (rows.length > 0 && rowsHeight + rowHeight > availableHeight) {
        pushTable();
        rows = [];
        rowsHeight = 0;
      }
      rows.push(row);
      rowsHeight += rowHeight;
    });
    if (rows.length > 0) pushTable();
    return fragments;
  }

  if (!["P", "H1", "H2", "H3", "H4", "H5", "H6", "LI"].includes(node.tagName)) {
    return [{ html: node.outerHTML, height: node.getBoundingClientRect().height }];
  }

  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  const lines: Array<{ startNode: Text; startOffset: number; endNode: Text; endOffset: number; top: number; bottom: number }> = [];
  textNodes.forEach((textNode) => {
    for (let index = 0; index < textNode.length; index += 1) {
      const range = document.createRange();
      range.setStart(textNode, index);
      range.setEnd(textNode, index + 1);
      const rect = range.getBoundingClientRect();
      if (!rect.width && !rect.height) continue;
      const line = lines[lines.length - 1];
      if (line && Math.abs(line.top - rect.top) < 1) {
        line.endNode = textNode;
        line.endOffset = index + 1;
        line.bottom = Math.max(line.bottom, rect.bottom);
        continue;
      }
      lines.push({ startNode: textNode, startOffset: index, endNode: textNode, endOffset: index + 1, top: rect.top, bottom: rect.bottom });
    }
  });

  if (lines.length <= 1) {
    return [{ html: node.outerHTML, height: node.getBoundingClientRect().height }];
  }
  const lineHeight = node.getBoundingClientRect().height / lines.length;
  return lines.map((line) => {
    const range = document.createRange();
    range.setStart(line.startNode, line.startOffset);
    range.setEnd(line.endNode, line.endOffset);
    return { html: cloneLineHtml(node, range), height: Math.ceil(Math.max(line.bottom - line.top, lineHeight)) };
  });
}

/** 按显式分页符切分硬分段 */
function segmentByPageBreak(nodes: HTMLElement[]): HTMLElement[][] {
  const segments: HTMLElement[][] = [];
  let current: HTMLElement[] = [];
  for (const node of nodes) {
    if (node.classList.contains("page-break")) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
      continue;
    }
    current.push(node);
  }
  if (current.length > 0) segments.push(current);
  if (segments.length === 0) segments.push([]);
  return segments;
}

/**
 * 对编辑器 .emr-content 执行真实分页，返回逐页正文与全文共用的页眉/页脚。
 *
 * @param sourceEl 编辑器 .emr-content 元素
 * @param settings 生效的页面设置（可能包含弹窗临时覆盖的方向/纸张/边距）
 */
export async function paginatePrintPages(sourceEl: HTMLElement, settings: PageSettings): Promise<PrintParts> {
  const clone = sourceEl.cloneNode(true) as HTMLElement;
  syncFieldValues(clone);
  sanitizePrintClone(clone);

  const pm = (clone.querySelector(".ProseMirror") ?? clone) as HTMLElement;
  const header = pm.querySelector(":scope > .emr-header");
  const footer = pm.querySelector(":scope > .emr-footer");
  const headerHTML = header ? header.innerHTML : "";
  const footerHTML = footer ? footer.innerHTML : "";
  header?.remove();
  footer?.remove();
  const blockNodes = Array.from(pm.children) as HTMLElement[];

  const { width, height } = getPaperDimensionsMm(settings);

  // 离屏探针页：与最终纸张完全同尺寸，用于取正文可用高度并按真实排版切分
  const stage = document.createElement("div");
  stage.className = "emr-standard-print emr-paginate-stage";
  stage.style.cssText = "position:fixed;left:-100000px;top:0;width:0;height:0;overflow:visible;z-index:-1;";

  const probe = document.createElement("div");
  probe.className = "emr-print-page";
  probe.style.width = `${width}mm`;
  probe.style.height = `${height}mm`;
  probe.style.padding = `${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm`;

  const headerBox = document.createElement("div");
  headerBox.className = "emr-print-page__header";
  headerBox.innerHTML = headerHTML;

  const bodyBox = document.createElement("div");
  bodyBox.className = "emr-print-page__body";
  const bodyPM = document.createElement("div");
  bodyPM.className = "ProseMirror emr-print-content";
  bodyBox.appendChild(bodyPM);

  const footerBox = document.createElement("div");
  footerBox.className = "emr-print-page__footer";
  footerBox.innerHTML = footerHTML;

  probe.append(headerBox, bodyBox, footerBox);
  stage.appendChild(probe);
  document.body.appendChild(stage);

  try {
    await waitForLayout();
    // 原始块节点放入探针正文布局（用于 Range 行拆分取真实几何）
    bodyPM.append(...blockNodes);
    const available = Math.max(Math.floor(bodyBox.clientHeight), 1);

    // 累加器：与正文盒同宽的隐藏 ProseMirror，用于按真实高度探测溢出
    const acc = document.createElement("div");
    acc.className = "ProseMirror emr-print-content emr-paginate-acc";
    acc.style.cssText = `position:absolute;top:0;left:0;visibility:hidden;pointer-events:none;height:auto;overflow:visible;width:${bodyPM.getBoundingClientRect().width}px;`;
    bodyBox.appendChild(acc);

    const isOverflow = () => Math.ceil(acc.getBoundingClientRect().height) > available - 1;
    const segmentPages = (segNodes: HTMLElement[]): PrintPage[] => {
      const result: PrintPage[] = [];
      acc.replaceChildren();
      const pushPage = () => {
        result.push({ bodyHTML: acc.innerHTML });
        acc.replaceChildren();
      };
      const tryAppend = (html: string) => {
        acc.insertAdjacentHTML("beforeend", html);
        if (!isOverflow()) return true;
        acc.lastElementChild?.remove();
        return false;
      };
      const appendHtml = (html: string) => {
        if (tryAppend(html)) return;
        if (acc.childElementCount > 0) pushPage();
        acc.insertAdjacentHTML("beforeend", html); // 单块超页时独占一页
      };
      for (const node of segNodes) {
        if (tryAppend(node.outerHTML)) continue;
        const fragments = splitNodeByLines(node, available);
        if (fragments.length <= 1) {
          appendHtml(node.outerHTML);
          continue;
        }
        fragments.forEach((f) => appendHtml(f.html));
      }
      if (acc.childElementCount > 0 || segNodes.length === 0) pushPage();
      return result;
    };

    const pages: PrintPage[] = [];
    for (const seg of segmentByPageBreak(blockNodes)) {
      pages.push(...segmentPages(seg));
    }
    acc.remove();
    return { pages, headerHTML, footerHTML };
  } finally {
    stage.remove();
  }
}
