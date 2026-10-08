/** 体温单分区绘制：页眉信息、日期/时间表头、体温主网格、事件红字、曲线标点、下半部指标表、图例 */
import {
  buildLayout,
  dayW,
  dayX,
  hourBoundaryXs,
  hourCellX,
  hourCenterX,
  pulseToY,
  RED_REF_TEMP,
  SUBS_PER_DAY,
  SUBS_PER_HOUR,
  tempToY,
  TEMP_MAX,
  TEMP_MIN,
  TEMP_SUB_ROWS,
  TIME_HOURS,
  type SheetLayout
} from "../layout";
import type { PulseMode, TempMode, TemperatureSheetData, VitalRecord } from "../types";
import { COLOR_BLUE, COLOR_BLACK, COLOR_RED, cross, dot, hLines, labeledValue, line, rect, ring, text, vLines } from "./utils";

/** 字号（mm → 逻辑像素） */
const F_BASE = 3.4 * 3.7795; // 正文 ~12.8px
const F_SMALL = 3 * 3.7795; // 刻度数字
const F_TINY = 2.2 * 3.7795; // 时间点红字

const RIGHT_EDGE = (L: SheetLayout) => L.contentX + L.contentW;

/** 页眉：患者基本信息（值带下划线） */
export function drawPatientInfo(ctx: CanvasRenderingContext2D, L: SheetLayout, data: TemperatureSheetData): void {
  const p = data.patient;
  const y = L.patientY + (8 * 3.7795) / 2;
  const size = F_SMALL; // 页眉字段多，用较小字号保证不超出纸张
  const gap = size * 1.4; // 字段间距
  let x = L.pulseAxisX;
  x = labeledValue(ctx, "姓名:", p.name, x, y, size, gap);
  x = labeledValue(ctx, "年龄:", p.age, x, y, size, gap);
  x = labeledValue(ctx, "性别:", p.gender, x, y, size, gap);
  x = labeledValue(ctx, "病区:", p.ward, x, y, size, gap);
  x = labeledValue(ctx, "床号:", p.bedNo, x, y, size, gap);
  x = labeledValue(ctx, "入院日期:", p.admitDate, x, y, size, gap);
  labeledValue(ctx, "住院号:", p.admitNo, x, y, size, gap);
}

/** 表头四行：日期 / 住院天数 / 产术后天数 / 时间点 */
export function drawHeaderTable(ctx: CanvasRenderingContext2D, L: SheetLayout, data: TemperatureSheetData): void {
  const right = RIGHT_EDGE(L);
  const rowTops = [L.dateY, L.hospY, L.postY, L.timeY, L.mainTop];
  hLines(ctx, rowTops, L.pulseAxisX, right); // 行分隔线横贯到最左，左上角不留白（与标签格合并）

  // 前三行的日分格竖线
  const dayBorders: number[] = [];
  for (let d = 0; d <= 7; d++) dayBorders.push(d < 7 ? dayX(L, d) : right);
  vLines(ctx, dayBorders, L.dateY, L.timeY);

  // 时间行：每个时间点单独分格（与主网格边界对齐）
  vLines(ctx, hourBoundaryXs(L), L.timeY, L.mainTop);

  // 标签：在合并后的整行左区（最左缘→内容区）居中
  const label = (str: string, top: number, h: number) => text(ctx, str, (L.pulseAxisX + L.contentX) / 2, top + h / 2, { size: F_BASE });
  label("日期", L.dateY, L.hospY - L.dateY);
  label("住院天数", L.hospY, L.postY - L.hospY);
  label("产/术后天数", L.postY, L.timeY - L.postY);
  label("时间", L.timeY, L.mainTop - L.timeY);

  // 单元格内容
  const cw = dayW(L);
  data.dates.forEach((d, i) => text(ctx, d, dayX(L, i) + cw / 2, L.dateY + (L.hospY - L.dateY) / 2, { size: F_BASE }));
  data.hospitalDays.forEach((d, i) => text(ctx, String(d), dayX(L, i) + cw / 2, L.hospY + (L.postY - L.hospY) / 2, { size: F_BASE }));
  data.postOpDays.forEach((d, i) => {
    if (d !== null) text(ctx, String(d), dayX(L, i) + cw / 2, L.postY + (L.timeY - L.postY) / 2, { size: F_BASE });
  });
  // 时间点：3/7/23 时红色，其余黑色
  for (let d = 0; d < 7; d++) {
    TIME_HOURS.forEach((h, i) => {
      const x = hourCellX(L, d, i) + (SUBS_PER_HOUR / 2) * L.subW;
      const color = h === 3 || h === 7 || h === 23 ? COLOR_RED : COLOR_BLACK;
      text(ctx, String(h), x, L.timeY + (L.mainTop - L.timeY) / 2, { size: F_TINY, color });
    });
  }
}

/** 体温/脉搏主网格：细格 + 加粗整度线/时间点线 + 双轴刻度 + 红色参考线 */
export function drawMainGrid(ctx: CanvasRenderingContext2D, L: SheetLayout): void {
  const right = RIGHT_EDGE(L);
  const totalRows = (TEMP_MAX - TEMP_MIN) * TEMP_SUB_ROWS;

  // 水平网格：0.2℃ 细线 + 1℃ 加粗线（只画内容区，左侧三列文字区不画横线）
  // 顶线由加粗线承担、底线单独补画，故 boldYs 去掉首尾，避免同位双线加粗
  const thinYs: number[] = [];
  const boldYs: number[] = [];
  for (let r = 1; r < totalRows; r++) {
    (r % TEMP_SUB_ROWS === 0 ? boldYs : thinYs).push(L.mainTop + r * L.tempRowH);
  }
  hLines(ctx, thinYs, L.contentX, right);
  hLines(ctx, boldYs, L.contentX, right, COLOR_BLACK, 2);
  hLines(ctx, [L.mainTop, L.mainBottom], L.contentX, right, COLOR_BLACK, 2);

  // 竖直网格：与横线同法，只在时间点边界画线（每 4 小时一根，天界由红色缓冲列线承担），不逐小格画细线避免过密
  // 右缘补画一根（hourBoundaryXs 已不含右缘，避免与外框 rect 同位叠粗）
  vLines(ctx, [...hourBoundaryXs(L), right], L.mainTop, L.mainBottom);

  // 列分隔竖线（图例列│脉搏列│体温列），pulseAxisX 底线由外框承担，不重复画
  vLines(ctx, [L.pulseAxisX, L.tempAxisX, L.labelX], L.mainTop, L.mainBottom);

  // 刻度：第二列脉搏 40~180、第三列体温 35~42，各自对齐整度线（顶线 42/180、底线 35/40）
  for (let p = 60; p <= 160; p += 20) {
    text(ctx, String(p), L.tempAxisX + 6 * 3.7795, pulseToY(L, p), { size: F_SMALL });
  }
  for (let t = TEMP_MIN + 1; t <= TEMP_MAX - 1; t++) {
    text(ctx, String(t), L.labelX + 5 * 3.7795, tempToY(L, t), { size: F_SMALL });
  }

  // 脉搏列：标题与顶部数值反转位置且都不压线——标题居顶线下方、180 再往下移，40 提到底线之上
  text(ctx, "脉搏", L.tempAxisX + 6 * 3.7795, L.mainTop + L.tempRowH, { size: F_SMALL });
  text(ctx, "180", L.tempAxisX + 6 * 3.7795, L.mainTop + L.tempRowH * 2.5, { size: F_SMALL });
  text(ctx, "40", L.tempAxisX + 6 * 3.7795, L.mainBottom - L.tempRowH, { size: F_SMALL });
  // 体温列同法：标题居顶线下方、42 下移、35 提到底线之上
  text(ctx, "体温℃", L.labelX + 5 * 3.7795, L.mainTop + L.tempRowH, { size: F_SMALL });
  text(ctx, "42", L.labelX + 5 * 3.7795, L.mainTop + L.tempRowH * 2.5, { size: F_SMALL });
  text(ctx, "35", L.labelX + 5 * 3.7795, L.mainBottom - L.tempRowH, { size: F_SMALL });
}

/** 红色要素：37.5℃ 参考横线 + 天界"23→3"缓冲列末条竖线（贯穿时间行至呼吸行）。最后绘制保证不被网格压住 */
export function drawRedLines(ctx: CanvasRenderingContext2D, L: SheetLayout): void {
  const right = RIGHT_EDGE(L);
  line(ctx, L.contentX, tempToY(L, RED_REF_TEMP), right, tempToY(L, RED_REF_TEMP), COLOR_RED, 1.2);
  for (let d = 0; d < 6; d++) {
    const gapEnd = L.contentX + (d * SUBS_PER_DAY + TIME_HOURS.length * SUBS_PER_HOUR + 1) * L.subW;
    vLines(ctx, [gapEnd], L.timeY, L.respBottom, COLOR_RED, 2);
  }
}

/**
 * 事件红字列水平落位：吸附到网格格位，不插值压线。
 * 整点命中时间点时居中于该格；否则取夹住它的两个时间点格的交界线（如 14 点 → 11 格与 15 格之间）。
 */
function eventX(L: SheetLayout, dayIndex: number, hour: number): number {
  const exact = TIME_HOURS.findIndex((h) => h === hour);
  if (exact >= 0) return hourCenterX(L, dayIndex, TIME_HOURS[exact]!);
  const hi = TIME_HOURS.findIndex((h) => h > hour);
  if (hi <= 0) return dayX(L, dayIndex); // 早于 3 点：贴当天左缘
  if (hi >= TIME_HOURS.length) return dayX(L, dayIndex) + dayW(L); // 晚于 23 点：贴当天右缘
  return dayX(L, dayIndex) + hi * SUBS_PER_HOUR * L.subW; // 前后两时间点格交界
}

/** 41~42℃ 起逐格竖排红字事件（"—" 渲染为横线），大字加粗，白底遮盖网格线 */
export function drawEvents(ctx: CanvasRenderingContext2D, L: SheetLayout, data: TemperatureSheetData): void {
  const size = F_BASE;
  for (const ev of data.events) {
    const x = eventX(L, ev.dayIndex, ev.hour);
    const chars = [...ev.text];
    chars.forEach((ch, i) => {
      const y = L.mainTop + i * L.tempRowH + L.tempRowH / 2;
      if (y > L.mainBottom - L.tempRowH) return;
      // 白色背景盖住穿过字格的横/纵网格线，宽度不超一个方格，保证正好落在格内
      const bgW = Math.min(size + 2, SUBS_PER_HOUR * L.subW);
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.fillRect(x - bgW / 2, y - L.tempRowH / 2, bgW, L.tempRowH);
      ctx.restore();
      if (ch === "—") {
        line(ctx, x - bgW / 2 + 1, y, x + bgW / 2 - 1, y, COLOR_RED, 1.2);
      } else {
        text(ctx, ch, x, y, { size, color: COLOR_RED, bold: true });
      }
    });
  }
}

/** 排序 + 过滤出指定类别的记录 */
function sortVitals(records: VitalRecord[]): VitalRecord[] {
  return [...records].sort((a, b) => a.dayIndex - b.dayIndex || a.hour - b.hour);
}

/** 折线 + 标点（体温蓝色系 / 脉搏红色系） */
function drawVitalSeries(
  ctx: CanvasRenderingContext2D,
  L: SheetLayout,
  records: VitalRecord[],
  toY: (v: number) => number,
  lineColor: string,
  symbolColor: (mode: TempMode | PulseMode) => string
): void {
  const pts = sortVitals(records).map((r) => ({
    x: hourCenterX(L, r.dayIndex, r.hour),
    y: toY(r.value),
    mode: r.mode
  }));
  if (pts.length > 1) {
    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2; // 折线粗细
    ctx.beginPath();
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
    ctx.restore();
  }
  const r = Math.max(4, L.subW * 1.4); // 标点半径
  for (const p of pts) {
    const color = symbolColor(p.mode);
    if (p.mode === "axillary") cross(ctx, p.x, p.y, r, color);
    else if (p.mode === "rectal" || p.mode === "heart") ring(ctx, p.x, p.y, r, color);
    else dot(ctx, p.x, p.y, r, color);
  }
}

/** 体温与脉搏曲线 */
export function drawSeries(ctx: CanvasRenderingContext2D, L: SheetLayout, data: TemperatureSheetData): void {
  drawVitalSeries(
    ctx,
    L,
    data.temps,
    (v) => tempToY(L, v),
    COLOR_BLUE,
    () => COLOR_BLUE
  );
  drawVitalSeries(
    ctx,
    L,
    data.pulses,
    (v) => pulseToY(L, v),
    COLOR_RED,
    () => COLOR_RED
  );
}

/** 下半部：疼痛评分、呼吸及 8 行指标表 */
export function drawBottomTable(ctx: CanvasRenderingContext2D, L: SheetLayout, data: TemperatureSheetData): void {
  const right = RIGHT_EDGE(L);
  const rows = data.rows;
  const cw = dayW(L);
  const labelOf = (str: string, top: number, h: number) => text(ctx, str, (L.pulseAxisX + L.contentX) / 2, top + h / 2, { size: F_BASE });
  const valueOf = (v: number | string | null, dayIndex: number, cy: number) => {
    if (v === null || v === "") return;
    text(ctx, String(v), dayX(L, dayIndex) + cw / 2, cy, { size: F_SMALL });
  };

  // ---- 疼痛评分：两列展示——左侧合并区文字描述，右侧体温列内放评分等级数值 ----
  // 6 档（0/2/4/6/8/10）对应 6 行格，数值画在格中心；数值列内不画横线，横线只在内容区起画
  const painSteps = 6;
  const painRowH = L.painH / painSteps;
  const painYs: number[] = [];
  for (let i = 0; i <= painSteps; i++) painYs.push(L.painTop + i * painRowH);
  // 内部分格线只在内容区画；顶部/底部边界线全宽必画（含描述列与数值列）
  hLines(ctx, painYs.slice(1, -1), L.contentX, right);
  line(ctx, L.pulseAxisX, L.painTop, right, L.painTop);
  line(ctx, L.pulseAxisX, L.respTop, right, L.respTop);
  for (let i = 0; i < painSteps; i++) {
    text(ctx, String(10 - i * 2), (L.labelX + L.contentX) / 2, L.painTop + (i + 0.5) * painRowH, { size: F_TINY });
  }
  vLines(ctx, hourBoundaryXs(L), L.painTop, L.painTop + L.painH);
  text(ctx, "疼痛评分", (L.pulseAxisX + L.labelX) / 2, L.painTop + L.painH / 2, { size: F_BASE });
  // 疼痛评分数据：红色实心三角用折线串联，值为 0 或 null 不绘制
  const painPts: { x: number; y: number }[] = [];
  rows.pain.forEach((v, i) => {
    if (!v) return;
    painPts.push({ x: dayX(L, i) + cw / 2, y: L.painTop + ((10 - v) / 2) * painRowH + painRowH / 2 });
  });
  for (let i = 1; i < painPts.length; i++) {
    const a = painPts[i - 1]!;
    const b = painPts[i]!;
    line(ctx, a.x, a.y, b.x, b.y, COLOR_RED, 2);
  }
  for (const p of painPts) {
    ctx.save();
    ctx.fillStyle = COLOR_RED;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - 6.4);
    ctx.lineTo(p.x + 5.6, p.y + 4.8);
    ctx.lineTo(p.x - 5.6, p.y + 4.8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ---- 呼吸：竖线与主网格同法，只在时间点边界画；底线即下方 8 行表首横线，不重复画 ----
  vLines(ctx, hourBoundaryXs(L), L.respTop, L.respBottom);
  labelOf("呼吸（次/分）", L.respTop, L.respBottom - L.respTop);
  rows.respiration.forEach((v, i) => valueOf(v, i, (L.respTop + L.respBottom) / 2));

  // ---- 血压 ~ 身高 8 行 ----
  const labels = ["血压（mmHg）", "血糖（mmol/L）", "大便（次）", "尿量（ml/次）", "总入量（ml）", "总出量（ml）", "体重（kg）", "身高（cm）"];
  const values: (number | string | null)[][] = [rows.bp, rows.glucose, rows.stool, rows.urine, rows.intake, rows.output, rows.weight, rows.height];
  const top = L.bottomTop;
  const bottom = top + L.bottomRowH * 8;
  hLines(
    ctx,
    Array.from({ length: 9 }, (_, i) => top + i * L.bottomRowH),
    L.pulseAxisX,
    right
  );
  labels.forEach((lb, ri) => {
    const rowTop = top + ri * L.bottomRowH;
    labelOf(lb, rowTop, L.bottomRowH);
    // 血压行每日分两格（收缩压/舒张压），其余行日分格；只画 7 天，末日右界由外框承担，避免框外多出竖线
    if (ri === 0) {
      for (let d = 0; d < 7; d++) {
        const dx = dayX(L, d);
        vLines(ctx, [dx, dx + cw / 2], rowTop, rowTop + L.bottomRowH);
      }
      values[ri]!.forEach((v, d) => {
        if (v === null || v === "") return;
        const [sys, dia] = String(v).split("/");
        const cy = rowTop + L.bottomRowH / 2;
        text(ctx, sys ?? "", dayX(L, d) + cw / 4, cy, { size: F_SMALL });
        if (dia) text(ctx, dia, dayX(L, d) + (cw / 4) * 3, cy, { size: F_SMALL });
      });
    } else {
      vLines(
        ctx,
        Array.from({ length: 8 }, (_, d) => (d < 7 ? dayX(L, d) : right)),
        rowTop,
        rowTop + L.bottomRowH
      );
      values[ri]!.forEach((v, d) => valueOf(v, d, rowTop + L.bottomRowH / 2));
    }
  });
  line(ctx, L.pulseAxisX, bottom, right, bottom);
  line(ctx, L.labelX, L.mainTop, L.labelX, L.respTop); // 体温列左界：主网格至疼痛行，呼吸行起左侧合并为一列不再分格
}

/** 左侧图例：口温●/腋温×/肛温○/脉搏●/心率○ 集中在第一列（图例列），底部靠左竖排 */
export function drawLegend(ctx: CanvasRenderingContext2D, L: SheetLayout): void {
  const rowH = L.tempRowH * 2.5;
  const items: { label: string; draw: (x: number, y: number) => void }[] = [
    { label: "口温", draw: (x, y) => dot(ctx, x, y, 2.6, COLOR_BLUE) },
    { label: "腋温", draw: (x, y) => cross(ctx, x, y, 2.6, COLOR_BLUE) },
    { label: "肛温", draw: (x, y) => ring(ctx, x, y, 2.6, COLOR_BLUE) },
    { label: "脉搏", draw: (x, y) => dot(ctx, x, y, 2.6, COLOR_RED) },
    { label: "心率", draw: (x, y) => ring(ctx, x, y, 2.6, COLOR_RED) }
  ];
  items.forEach((it, i) => {
    const y = L.mainBottom - (items.length - i) * rowH - L.tempRowH + rowH / 2;
    text(ctx, it.label, L.pulseAxisX + 4 * 3.7795, y, { size: F_SMALL, align: "left" });
    it.draw(L.pulseAxisX + 14 * 3.7795, y);
  });
}

/** 外框：只包表格主体（从日期行起），页眉患者信息在框外，与纸质样单一致 */
export function drawFrame(ctx: CanvasRenderingContext2D, L: SheetLayout): void {
  const bottom = L.bottomTop + L.bottomRowH * 8;
  rect(ctx, L.pulseAxisX, L.dateY, RIGHT_EDGE(L) - L.pulseAxisX, bottom - L.dateY, COLOR_BLACK, 1);
}

export { buildLayout };
export type { SheetLayout };
