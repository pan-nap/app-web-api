/**
 * 拖拽设计器类型定义
 *
 * 用于组件面板、属性面板、拖拽配置等功能
 */

import type { DocNode, EmrElement } from "./emr";

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

/** 组件面板中的组件项 */
export interface ComponentItem {
  /** 项类型 */
  type: string;
  /** 标签显示文本 */
  label: string;
  /** 图标 */
  icon: string;
  /** 组件类型 */
  widgetType: "text" | "number" | "date" | "select";
}

/** 组件面板中的数据字段项 */
export interface DataField {
  /** 数据引用路径 */
  refKey: string;
  /** 字段显示名称 */
  widgetName: string;
  /** 组件类型 */
  widgetType: string;
}

/** 拖拽载荷 */
export interface DragPayload {
  /** 载荷类型：component-组件，datasource-数据源 */
  type: "component" | "datasource";
  /** 组件类型 */
  widgetType: string;
  /** 组件显示名称 */
  widgetName: string;
  /** 数据引用路径（仅数据源类型） */
  refKey?: string;
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

/** 模板内容结构 */
export interface TemplateContent {
  /** 模板名称 */
  name: string;
  /** 模板内容 */
  content: {
    /** 模板JSON内容 */
    templateContent: DocNode;
  };
}

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

/** 属性面板中的属性变更 */
export interface AttrChange {
  /** 属性名称 */
  key: string;
  /** 属性值 */
  value: any;
}
