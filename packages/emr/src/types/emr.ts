/**
 * EMR 编辑器类型定义（Tiptap/ProseMirror JSON 格式）
 *
 * 数据结构以 ProseMirror JSON 为唯一真值
 */

export interface VariableOption {
  value: string;
  label: string;
}

export interface InsertVariableOptions {
  refKey: string;
  widgetName: string;
  widgetType?: "text" | "number" | "date" | "select";
  extensionValue?: string;
  options?: VariableOption[];
  required?: boolean;
  placeholder?: string;
}

export type EmrElement = any;

export interface DocumentRecord {
  id: string;
  name: string;
  type: "template" | "instance";
  content: EmrElement;
  patientId?: string;
}
