/** Canvas 绘制基础工具：像素对齐画线、合批网格线、文本与符号 */

export const FONT_FAMILY = '"SimSun","宋体","Microsoft YaHei",serif';

export const COLOR_BLACK = "#000";
export const COLOR_RED = "#e60000";
export const COLOR_BLUE = "#1d4ed8";

/** 0.5px 对齐，避免 1px 直线模糊 */
function snap(v: number): number {
  return Math.round(v) + 0.5;
}

/** 单条直线（自动对齐像素） */
export function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color = COLOR_BLACK, width = 1.2): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  if (x1 === x2) {
    const x = snap(x1);
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
  } else if (y1 === y2) {
    const y = snap(y1);
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
  } else {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
  ctx.restore();
}

/** 合批绘制一组水平线（整表网格一次 stroke 完成） */
export function hLines(ctx: CanvasRenderingContext2D, ys: number[], x1: number, x2: number, color = COLOR_BLACK, width = 1.2): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  for (const yRaw of ys) {
    const y = snap(yRaw);
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** 合批绘制一组竖线 */
export function vLines(ctx: CanvasRenderingContext2D, xs: number[], y1: number, y2: number, color = COLOR_BLACK, width = 1.2): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  for (const xRaw of xs) {
    const x = snap(xRaw);
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
  }
  ctx.stroke();
  ctx.restore();
}

/** 矩形边框（水平+竖线合批） */
export function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color = COLOR_BLACK, width = 1.5): void {
  hLines(ctx, [y, y + h], x, x + w, color, width);
  vLines(ctx, [x, x + w], y, y + h, color, width);
}

export interface TextOptions {
  size: number; // 逻辑像素
  color?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  bold?: boolean;
}

/** 文本绘制（统一字体栈） */
export function text(ctx: CanvasRenderingContext2D, str: string, x: number, y: number, opts: TextOptions): void {
  ctx.save();
  ctx.fillStyle = opts.color ?? COLOR_BLACK;
  ctx.font = `${opts.bold ? "bold " : ""}${opts.size}px ${FONT_FAMILY}`;
  ctx.textAlign = opts.align ?? "center";
  ctx.textBaseline = opts.baseline ?? "middle";
  ctx.fillText(str, x, y);
  ctx.restore();
}

/** 带下划线的"字段:值"文本（页眉信息栏），返回结束 x */
export function labeledValue(
  ctx: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
  size: number,
  gapAfter = size * 2
): number {
  ctx.save();
  ctx.font = `bold ${size}px ${FONT_FAMILY}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = COLOR_BLACK;
  ctx.fillText(label, x, y);
  const labelW = ctx.measureText(label).width;
  ctx.fillText(value, x + labelW, y);
  const valueW = ctx.measureText(value).width;
  ctx.restore();
  const endX = x + labelW + valueW;
  line(ctx, x + labelW, y + size * 0.7, endX, y + size * 0.7, COLOR_BLACK, 1);
  return endX + gapAfter;
}

/** 符号：实心圆 ● */
export function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** 符号：空心圆 ○ */
export function ring(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, r * 0.5);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** 符号：叉 × */
export function cross(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, r * 0.5);
  ctx.beginPath();
  ctx.moveTo(x - r, y - r);
  ctx.lineTo(x + r, y + r);
  ctx.moveTo(x + r, y - r);
  ctx.lineTo(x - r, y + r);
  ctx.stroke();
  ctx.restore();
}
