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
  varKey: string;
  varLabel: string;
  varDataType: "text" | "number" | "date" | "radio";
  varValue?: string;
  options?: VariableOption[];
  required?: boolean;
}

export type EmrElement = any;
