/**
 * EMR 编辑器类型定义（Tiptap/ProseMirror JSON 格式）
 *
 * 数据结构以 ProseMirror JSON 为唯一真值
 */

/** 下拉选项配置 */
export interface VariableOption {
  /** 选项值 */
  value: string;
  /** 选项标签显示文本 */
  label: string;
}

/** 插入变量节点的选项参数 */
export interface InsertVariableOptions {
  /** 数据引用路径，如 patient.patient_name */
  refKey: string;
  /** 变量显示名称，如 姓名 */
  widgetName: string;
  /** 字段类型，支持 text/number/date/select */
  widgetType?: "text" | "number" | "date" | "select";
  /** 变量当前值 */
  extensionValue?: string;
  /** 下拉选项列表，widgetType为select时使用 */
  options?: VariableOption[];
  /** 是否必填字段 */
  required?: boolean;
  /** 占位符文本，未填写时显示 */
  placeholder?: string;
}

/** EMR 元素类型，对应 ProseMirror JSON 节点结构 */
export type EmrElement = any;

/** 文档记录实体 */
export interface DocumentRecord {
  /** 文档唯一标识 */
  id: string;
  /** 文档名称 */
  name: string;
  /** 文档类型：template-模板，instance-实例 */
  type: "template" | "instance";
  /** 文档内容，ProseMirror JSON 格式 */
  content: EmrElement;
  /** 关联患者ID（可选） */
  patientId?: string;
}

/** 变量变更记录 */
export interface VariableChange {
  /** 变量数据引用路径，如 patient.patient_name */
  refKey: string;
  /** 变量显示名称，如 姓名 */
  widgetName: string;
  /** 修改前的值 */
  oldValue: string;
  /** 修改后的值 */
  newValue: string;
}
