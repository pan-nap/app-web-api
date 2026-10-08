/** 体温单数据模型（纯渲染用，与后端接口解耦，后续接口对接时按此结构适配） */

/** 体温测量方式：口温 ● / 腋温 × / 肛温 ○ */
export type TempMode = "oral" | "axillary" | "rectal";
/** 脉搏类测量方式：脉搏 ● / 心率 ○ */
export type PulseMode = "pulse" | "heart";

/** 体温单标准时间点（小时） */
export type VitalHour = 3 | 7 | 11 | 15 | 19 | 23;

/** 患者基本信息（页眉） */
export interface PatientInfo {
  name: string;
  age: string;
  gender: string;
  ward: string;
  bedNo: string;
  admitDate: string;
  admitNo: string;
}

/** 单个测量记录，dayIndex 为相对起始日的天序号（0~6） */
export interface VitalRecord {
  dayIndex: number;
  hour: VitalHour;
  value: number;
  mode: TempMode | PulseMode;
}

/** 41~42℃ 区间竖排红字事件（入院/手术/分娩等），hour 允许为任意时刻（如 14 点） */
export interface EventMark {
  dayIndex: number;
  hour: number;
  /** 逐字竖排文本，如 "入院——十四时——三分"，其中 "—" 绘制为横线 */
  text: string;
}

/** 下半部指标行（每行 7 个格，与日期列对齐；血压等复合值用字符串 "120/80"） */
export interface DailyRowData {
  /** 疼痛评分 0~10 */
  pain: (number | null)[];
  /** 呼吸（次/分），落在与主网格对齐的细格内 */
  respiration: (number | null)[];
  /** 血压（mmHg） */
  bp: (string | null)[];
  /** 血糖（mmol/L） */
  glucose: (number | null)[];
  /** 大便（次） */
  stool: (number | string | null)[];
  /** 尿量（ml/次） */
  urine: (number | null)[];
  /** 总入量（ml） */
  intake: (number | null)[];
  /** 总出量（ml） */
  output: (number | null)[];
  /** 体重（kg） */
  weight: (number | null)[];
  /** 身高（cm） */
  height: (number | null)[];
}

/** 一张体温单的完整数据 */
export interface TemperatureSheetData {
  patient: PatientInfo;
  /** 7 个日期表头，如 ["2026-09-26","27",...] */
  dates: string[];
  /** 住院天数（1~7 或连续编号） */
  hospitalDays: number[];
  /** 产/术后天数，无则 null */
  postOpDays: (number | null)[];
  temps: VitalRecord[];
  pulses: VitalRecord[];
  events: EventMark[];
  rows: DailyRowData;
}
