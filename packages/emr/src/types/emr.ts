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

/** 文本样式标记属性 */
export interface TextStyleMarkAttrs {
  /** 字体名称 */
  fontFamily?: string;
  /** 字体大小，如 11pt */
  fontSize?: string;
  /** 字体颜色 */
  color?: string;
}

/** 标记类型 */
export type MarkType = "textStyle" | "bold" | "italic" | "underline" | "strike";

/** 标记节点 */
export interface MarkNode {
  /** 标记类型 */
  type: MarkType;
  /** 标记属性 */
  attrs?: TextStyleMarkAttrs;
}

/** 文本节点 */
export interface TextNode {
  /** 节点类型 */
  type: "text";
  /** 文本内容 */
  text: string;
  /** 标记列表 */
  marks?: MarkNode[];
}

/** 段落节点属性 */
export interface ParagraphAttrs {
  /** 文本对齐方式 */
  textAlign?: "left" | "center" | "right" | "justify";
}

/** 段落节点 */
export interface ParagraphNode {
  /** 节点类型 */
  type: "paragraph";
  /** 段落属性 */
  attrs?: ParagraphAttrs;
  /** 子节点列表 */
  content?: EmrNode[];
}

/** 变量字段节点属性 */
export interface VariableFieldAttrs {
  /** 字段唯一标识 */
  "data-id": string | number;
  /** 扩展类型，固定为 field */
  "data-extension-type": string;
  /** 组件显示名称 */
  "data-widget-name": string;
  /** 组件类型：text/number/date/select */
  "data-widget-type": string;
  /** 组件类型名称 */
  "data-widget-type-name": string;
  /** 占位符文本 */
  "data-placeholder": string | null;
  /** 最小字体数 */
  "data-min-font-num": number;
  /** 分组ID */
  "data-group-id": string;
  /** 选中状态 */
  "data-checked": string;
  /** 当前值 */
  "data-extension-value": string;
  /** 是否只读 */
  "data-readonly": string;
  /** 是否必填 */
  "data-required": string;
  /** 必填提示 */
  "data-required-warning": string;
  /** 是否仅选择 */
  "data-select-only": string;
  /** 更新时是否忽略 */
  "data-update-ignore": string;
  /** 是否显示下划线 */
  "data-underline": number;
  /** 版本ID */
  "data-version-id": string;
  /** 数据引用路径，如 patient.patient_name */
  "data-ref-key": string;
  /** 下拉选项，URL编码的JSON数组 */
  "data-options": string;
  /** 是否多选 */
  "data-multiple": string;
  /** 引用键索引 */
  "data-ref-key-index": number;
  /** 引用键属性 */
  "data-ref-key-attr": string;
  /** 时间格式 */
  "data-time-format": string;
  /** 必填表达式 */
  "data-required-exp": string;
}

/** 变量字段节点 */
export interface VariableFieldNode {
  /** 节点类型 */
  type: "field";
  /** 字段属性 */
  attrs: VariableFieldAttrs;
}

/** 表格单元格属性 */
export interface TableCellAttrs {
  /** 列合并数 */
  colspan?: number;
  /** 行合并数 */
  rowspan?: number;
  /** 列宽度数组 */
  colwidth?: number[];
  /** 对齐方式 */
  align?: "left" | "center" | "right" | null;
}

/** 表格单元格节点 */
export interface TableCellNode {
  /** 节点类型 */
  type: "tableCell";
  /** 单元格属性 */
  attrs?: TableCellAttrs;
  /** 子节点列表 */
  content?: EmrNode[];
}

/** 表格表头节点 */
export interface TableHeaderNode {
  /** 节点类型 */
  type: "tableHeader";
  /** 表头属性 */
  attrs?: TableCellAttrs;
  /** 子节点列表 */
  content?: EmrNode[];
}

/** 表格行节点 */
export interface TableRowNode {
  /** 节点类型 */
  type: "tableRow";
  /** 子节点列表 */
  content?: (TableCellNode | TableHeaderNode)[];
}

/** 表格节点 */
export interface TableNode {
  /** 节点类型 */
  type: "table";
  /** 子节点列表 */
  content?: TableRowNode[];
}

/** 分页符节点 */
export interface PageBreakNode {
  /** 节点类型 */
  type: "pageBreak";
}

/** 标题节点属性 */
export interface HeadingAttrs {
  /** 标题级别 */
  level: 1 | 2 | 3;
}

/** 标题节点 */
export interface HeadingNode {
  /** 节点类型 */
  type: "heading";
  /** 标题属性 */
  attrs: HeadingAttrs;
  /** 子节点列表 */
  content?: EmrNode[];
}

/** EMR 节点类型 */
export type EmrNode =
  | TextNode
  | ParagraphNode
  | VariableFieldNode
  | TableNode
  | TableRowNode
  | TableCellNode
  | TableHeaderNode
  | PageBreakNode
  | HeadingNode;

/** 文档根节点 */
export interface DocNode {
  /** 节点类型 */
  type: "doc";
  /** 子节点列表 */
  content?: EmrNode[];
}

/** EMR 元素类型，对应 ProseMirror JSON 节点结构 */
export type EmrElement = DocNode | EmrNode;

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
