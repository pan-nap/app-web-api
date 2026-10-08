/**
 * 体温单版式 schema：A4 纸张（210×297mm）下的全部几何定义与坐标映射。
 * 所有绘制代码只引用本文件，不允许写魔法数字；微调版式只改这里。
 */
import type { VitalHour } from "./types";

/** 1mm 对应的逻辑像素（96dpi 基准，实际清晰度由渲染倍率保证） */
export const MM = 96 / 25.4;

/** 体温单标准时间点 */
export const TIME_HOURS: VitalHour[] = [3, 7, 11, 15, 19, 23];

/** 每日首个记录时间点（3 时） */
export const FIRST_HOUR: VitalHour = 3;

/** 体温轴范围与细分：每 1℃ 分 5 小格（0.2℃/格） */
export const TEMP_MAX = 42;
export const TEMP_MIN = 35;
export const TEMP_SUB_ROWS = 5;

/** 脉搏轴范围（与体温网格共线映射：每 0.5℃ 行 = 4 bpm） */
export const PULSE_MAX = 180;
export const PULSE_MIN = 40;

/** 每天 6 个时间点，每时间点横分 5 小格；天与天之间插入 1 个"23→3"缓冲窄列（两侧画红竖线） */
export const SUBS_PER_HOUR = 5;
export const GAP_SUBS = 1;
export const SUBS_PER_DAY = TIME_HOURS.length * SUBS_PER_HOUR + GAP_SUBS; // 31
export const DAYS = 7;

/** 红色参考横线温度值 */
export const RED_REF_TEMP = 37.5;

// ---------- 列宽（mm） ----------
const MARGIN = { top: 15, bottom: 15, left: 15, right: 15 };
const PULSE_AXIS_W = 26; // 第一列：图例列（口温/腋温/肛温/脉搏/心率格拉尔）
const TEMP_AXIS_W = 12; // 第二列：脉搏刻度列（40~180）
const LABEL_W = 10; // 第三列：体温刻度列（35~42），紧贴网格

// ---------- 行高（mm） ----------
const PATIENT_H = 8; // 页眉患者信息
const DATE_H = 7; // 日期
const HOSP_H = 7; // 住院天数
const POST_H = 7; // 产/术后天数
const TIME_H = 6; // 时间点（红字）
const PAIN_H = 18; // 疼痛评分（0~10 多行小格）
const RESP_H = 6; // 呼吸
const BOTTOM_ROW_H = 7; // 下半部单行表
const BOTTOM_ROWS = 8; // 血压~身高共 8 行

export interface SheetLayout {
  pageW: number;
  pageH: number;
  /** 三列标签区右边界（主网格左边界） */
  contentX: number;
  contentW: number;
  pulseAxisX: number;
  tempAxisX: number;
  labelX: number;
  subW: number; // 最小横格宽
  /** 各横向分区 */
  patientY: number;
  dateY: number;
  hospY: number;
  postY: number;
  timeY: number;
  mainTop: number;
  mainH: number;
  mainBottom: number;
  painTop: number;
  painH: number;
  respTop: number;
  respBottom: number;
  bottomTop: number;
  bottomRowH: number;
  /** 体温网格行高（0.2℃） */
  tempRowH: number;
}

/** 构建整张体温单的几何布局 */
export function buildLayout(): SheetLayout {
  const pageW = 210 * MM;
  const pageH = 297 * MM;
  const pulseAxisX = MARGIN.left * MM;
  const tempAxisX = pulseAxisX + PULSE_AXIS_W * MM;
  const labelX = tempAxisX + TEMP_AXIS_W * MM;
  const contentX = labelX + LABEL_W * MM;
  const contentW = pageW - MARGIN.right * MM - contentX;
  const subW = contentW / (DAYS * SUBS_PER_DAY - GAP_SUBS); // 末日后无缓冲列

  const patientY = MARGIN.top * MM;
  const dateY = patientY + PATIENT_H * MM;
  const hospY = dateY + DATE_H * MM;
  const postY = hospY + HOSP_H * MM;
  const timeY = postY + POST_H * MM;
  const mainTop = timeY + TIME_H * MM;
  const availH = pageH - MARGIN.bottom * MM - mainTop;
  // 方形小格：0.2℃ 行高 = 时间格宽（5 小格），主网格高度由正方形约束反推
  const squareMainH = (TEMP_MAX - TEMP_MIN) * TEMP_SUB_ROWS * SUBS_PER_HOUR * subW;
  const fixedBottomH = (PAIN_H + RESP_H + BOTTOM_ROWS * BOTTOM_ROW_H) * MM;
  const mainH = Math.min(availH - fixedBottomH, squareMainH);
  // 主网格让出的空间按比例分给下半部（疼痛评分/呼吸/8 行指标），保持整页铺满
  const bottomScale = 1 + (availH - mainH - fixedBottomH) / fixedBottomH;
  const painTop = mainTop + mainH;
  const painH = PAIN_H * MM * bottomScale;
  const respTop = painTop + painH;
  const respBottom = respTop + RESP_H * MM * bottomScale;

  return {
    pageW,
    pageH,
    contentX,
    contentW,
    pulseAxisX,
    tempAxisX,
    labelX,
    subW,
    patientY,
    dateY,
    hospY,
    postY,
    timeY,
    mainTop,
    mainH,
    mainBottom: mainTop + mainH,
    painTop,
    painH,
    respTop,
    respBottom,
    bottomTop: respBottom,
    bottomRowH: BOTTOM_ROW_H * MM * bottomScale,
    tempRowH: mainH / ((TEMP_MAX - TEMP_MIN) * TEMP_SUB_ROWS)
  };
}

/** 天序号 → 该天首列（3 时格）左边界 x */
export function dayX(L: SheetLayout, dayIndex: number): number {
  return L.contentX + dayIndex * SUBS_PER_DAY * L.subW;
}

/** 天序号 → 该天整体宽度（不含尾部缓冲列） */
export function dayW(L: SheetLayout): number {
  return (SUBS_PER_DAY - GAP_SUBS) * L.subW;
}

/** 时间点格左边界 x */
export function hourCellX(L: SheetLayout, dayIndex: number, hourIndex: number): number {
  return dayX(L, dayIndex) + hourIndex * SUBS_PER_HOUR * L.subW;
}

/** 时间点格中心 x（标点落位） */
export function hourCenterX(L: SheetLayout, dayIndex: number, hour: VitalHour): number {
  const idx = TIME_HOURS.indexOf(hour);
  return hourCellX(L, dayIndex, idx) + (SUBS_PER_HOUR / 2) * L.subW;
}

/** 任意时刻（含非标准点，如入院 14 点）中心 x，按 3~23 点线性插值 */
export function timePointX(L: SheetLayout, dayIndex: number, hour: number): number {
  const frac = (hour - FIRST_HOUR) / 4; // 0 ~ 5
  return dayX(L, dayIndex) + (frac * SUBS_PER_HOUR + SUBS_PER_HOUR / 2) * L.subW;
}

/**
 * 全部时间格边界 x 列表（含每天首列，不含全表右缘与红色缓冲列边缘）。
 * 注意：每天占 SUBS_PER_DAY(31) 个小格，不能用全局格号 % 5 判边界，否则从第 2 天起漂移。
 */
export function hourBoundaryXs(L: SheetLayout): number[] {
  const xs: number[] = [];
  for (let d = 0; d < DAYS; d++) {
    for (let k = 0; k < TIME_HOURS.length; k++) {
      // 第 2 天起的 3 时左界与红色天界线（drawRedLines）同位，跳过避免黑线叠红线加粗
      if (d > 0 && k === 0) continue;
      xs.push(L.contentX + (d * SUBS_PER_DAY + k * SUBS_PER_HOUR) * L.subW);
    }
  }
  return xs;
}

/** 温度值 → y */
export function tempToY(L: SheetLayout, t: number): number {
  return L.mainTop + ((TEMP_MAX - t) / (TEMP_MAX - TEMP_MIN)) * L.mainH;
}

/** 脉搏值 → y（与体温网格共线） */
export function pulseToY(L: SheetLayout, p: number): number {
  return L.mainTop + ((PULSE_MAX - p) / (PULSE_MAX - PULSE_MIN)) * L.mainH;
}
