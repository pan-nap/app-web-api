/**
 * 文书打印引擎（P2：真实切片分页）
 *
 * 流程：paginatePrintPages 切片 → buildPrintContainer 逐页输出固定纸张盒（含页眉/页脚/页码）
 *      → 注入 @page（margin:0，边距已内建到页盒）→ 预览 / window.print() / PDF 共用同一棵树
 */
import type { PageSettings } from "../types";
import { paginatePrintPages, getPaperDimensionsMm } from "./emrPagination";

export { getPaperDimensionsMm };

/** 打印选项 */
export interface EmrPrintOptions {
  /** 打印份数，默认 1（仅输出时复制整套页，预览固定单套） */
  copies?: number;
}

/** 根据页面设置生成 @page 规则：边距内建到页盒，故 @page margin 归零以保证所见即所得 */
export function buildPageStyleText(settings: PageSettings): string {
  const { width, height } = getPaperDimensionsMm(settings);
  return `@page { size: ${width}mm ${height}mm; margin: 0; }`;
}

/** 打印输出隔离：仅保留打印容器，每张纸断开 */
function buildPrintIsolationStyleText(): string {
  return `@media print {
  body > *:not(.emr-standard-print) { display: none !important; }
  .emr-standard-print.is-print { position: static !important; left: auto !important; top: auto !important; }
  .emr-print-page { break-after: page; }
  .emr-print-page:last-child { break-after: auto; }
}`;
}

/** 构建单张固定页盒：页眉 / 正文切片 / 页脚（含右侧自动页码） */
function buildPageElement(
  bodyHTML: string,
  settings: PageSettings,
  headerHTML: string,
  footerHTML: string,
  pageNo: number,
  total: number
): HTMLElement {
  const { width, height } = getPaperDimensionsMm(settings);
  const page = document.createElement("div");
  page.className = "emr-print-page";
  page.style.width = `${width}mm`;
  page.style.height = `${height}mm`;
  page.style.padding = `${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm`;

  const header = document.createElement("div");
  header.className = "emr-print-page__header";
  header.innerHTML = headerHTML;

  const body = document.createElement("div");
  body.className = "emr-print-page__body";
  const bodyPM = document.createElement("div");
  bodyPM.className = "ProseMirror emr-print-content";
  bodyPM.innerHTML = bodyHTML;
  body.appendChild(bodyPM);

  const footer = document.createElement("div");
  footer.className = "emr-print-page__footer";
  if (footerHTML) {
    const footerContent = document.createElement("div");
    footerContent.className = "emr-print-page__footer-content";
    footerContent.innerHTML = footerHTML;
    footer.appendChild(footerContent);
  }
  const pageNum = document.createElement("div");
  pageNum.className = "emr-print-page__pagenum";
  pageNum.textContent = `第 ${pageNo} / ${total}`;
  footer.appendChild(pageNum);

  page.append(header, body, footer);
  return page;
}

/**
 * 生成打印/预览 DOM（分页后的多张固定页，预览与打印共用）
 *
 * @param sourceEl 编辑器 .emr-content 元素
 * @param settings 生效的页面设置
 * @param options  printMode 为 true 时附加 is-print 类并按份数复制整套页
 */
export async function buildPrintContainer(
  sourceEl: HTMLElement,
  settings: PageSettings,
  options: { printMode?: boolean; copies?: number } = {}
): Promise<HTMLElement> {
  const { printMode = false, copies = 1 } = options;
  const { pages, headerHTML, footerHTML } = await paginatePrintPages(sourceEl, settings);

  const container = document.createElement("div");
  container.className = `emr-standard-print${printMode ? " is-print" : ""}`;
  const total = pages.length || 1;
  const safeCopies = printMode ? Math.max(1, Math.floor(copies)) : 1;
  for (let c = 0; c < safeCopies; c++) {
    pages.forEach((page, index) => {
      container.appendChild(buildPageElement(page.bodyHTML, settings, headerHTML, footerHTML, index + 1, total));
    });
  }
  return container;
}

/** 等待字体就绪 + 两轮渲染，保证测量/输出一致 */
async function waitForRenderReady() {
  try {
    await document.fonts.ready;
  } catch {
    /* 忽略字体加载异常 */
  }
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** 执行浏览器打印：分页 DOM 挂到屏外 → 注入 @page → window.print() → afterprint 清理 */
export async function printEmrDocument(sourceEl: HTMLElement, settings: PageSettings, options: EmrPrintOptions = {}): Promise<void> {
  const container = await buildPrintContainer(sourceEl, settings, { printMode: true, copies: options.copies });
  const styleEl = document.createElement("style");
  styleEl.textContent = `${buildPageStyleText(settings)}\n${buildPrintIsolationStyleText()}`;

  let finish: () => void = () => {};
  const printed = new Promise<void>((resolve) => {
    let settled = false;
    finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener("afterprint", finish);
      container.remove();
      styleEl.remove();
      resolve();
    };
    window.addEventListener("afterprint", finish);
  });

  document.head.appendChild(styleEl);
  document.body.appendChild(container);
  await waitForRenderReady();
  window.print();
  window.setTimeout(finish, 3000);
  await printed;
}

/**
 * 另存为 PDF：逐张固定页截图拼成 PDF（分页后天然按纸张逐页输出）。
 *
 * @param sourceEl 编辑器 .emr-content 元素
 * @param settings 生效的页面设置
 * @param options  copies 份数、fileName 文件名（不含扩展名）
 */
export async function saveEmrDocumentAsPdf(
  sourceEl: HTMLElement,
  settings: PageSettings,
  options: { copies?: number; fileName?: string } = {}
): Promise<void> {
  const { copies = 1, fileName = "文书" } = options;
  const container = await buildPrintContainer(sourceEl, settings, { printMode: true, copies });
  container.style.position = "fixed";
  container.style.left = "-100000px";
  container.style.top = "0";
  container.style.background = "#fff";
  document.body.appendChild(container);

  try {
    await waitForRenderReady();
    const [{ snapdom }, { jsPDF }] = await Promise.all([import("@zumer/snapdom"), import("jspdf")]);
    const pageEls = Array.from(container.querySelectorAll<HTMLElement>(".emr-print-page"));
    let pdf: InstanceType<typeof jsPDF> | undefined;
    for (const pageEl of pageEls) {
      const width = pageEl.offsetWidth;
      const height = pageEl.offsetHeight;
      const image = await snapdom.toJpg(pageEl, { backgroundColor: "#fff", scale: 1.5, dpr: 1, quality: 1 });
      const orientation = width > height ? "landscape" : "portrait";
      if (!pdf) {
        pdf = new jsPDF({ unit: "px", format: [width, height], orientation, hotfixes: ["px_scaling"] });
      } else {
        pdf.addPage([width, height], orientation);
      }
      pdf.addImage(image, "JPEG", 0, 0, width, height, undefined, "FAST");
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
    await pdf!.save(`${fileName}.pdf`, { returnPromise: true });
  } finally {
    container.remove();
  }
}
