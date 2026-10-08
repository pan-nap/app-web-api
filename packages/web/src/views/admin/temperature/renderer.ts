/**
 * 体温单渲染入口：无状态、幂等。数据变化时调用一次即整张重绘。
 * 内部以 A4 @96dpi 逻辑坐标绘制，实际位图按 RENDER_SCALE 倍率放大保证打印/高清屏清晰度。
 */
import { buildLayout } from "./layout";
import {
  drawBottomTable,
  drawEvents,
  drawFrame,
  drawHeaderTable,
  drawLegend,
  drawMainGrid,
  drawPatientInfo,
  drawRedLines,
  drawSeries
} from "./draw/sections";
import type { TemperatureSheetData } from "./types";

/** 位图放大倍率（≈288dpi 输出） */
const RENDER_SCALE = 3;

/**
 * 将体温单绘制到指定 canvas。
 * canvas 的 CSS 尺寸由外部布局控制（建议 aspect-ratio: 210/297），此处只负责位图内容与绘制。
 */
export function renderTemperatureSheet(canvas: HTMLCanvasElement, data: TemperatureSheetData): void {
  const L = buildLayout();
  canvas.width = Math.round(L.pageW * RENDER_SCALE);
  canvas.height = Math.round(L.pageH * RENDER_SCALE);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, L.pageW, L.pageH);

  // 绘制顺序：底图网格 → 表头/信息 → 红色要素（叠在网格之上）→ 数据 → 图例 → 外框
  drawMainGrid(ctx, L);
  drawBottomTable(ctx, L, data);
  drawHeaderTable(ctx, L, data);
  drawPatientInfo(ctx, L, data);
  drawRedLines(ctx, L);
  drawEvents(ctx, L, data);
  drawSeries(ctx, L, data);
  drawLegend(ctx, L);
  drawFrame(ctx, L);
}
