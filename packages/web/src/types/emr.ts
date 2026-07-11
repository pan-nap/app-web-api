/**
 * EMR 编辑器类型定义（Tiptap/ProseMirror JSON 格式）
 *
 * 数据结构以 ProseMirror JSON 为唯一真值
 */

// ========== Tiptap 节点类型定义 ==========

/** 段落元素 */
export interface ParagraphNode {
  type: "paragraph";
  content?: InlineNode[];
}

/** 文本节点 */
export interface TextNode {
  type: "text";
  text: string;
  marks?: MarkNode[];
}

/** Mark 节点 */
export interface MarkNode {
  type: string;
  attrs?: Record<string, unknown>;
}

/** 变量节点（自定义内联原子节点） */
export interface VariableNode {
  type: "variable";
  attrs: {
    varKey: string;
    varLabel: string;
    varValue?: string;
    varDataType?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
  };
}

/** 图片节点 */
export interface ImageNode {
  type: "image";
  attrs: {
    src: string;
    alt?: string;
    title?: string;
    width?: string;
    height?: string;
  };
}

/** 医疗区块节点（自定义块级节点） */
export interface MedicalBlockNode {
  type: "medicalBlock";
  attrs: {
    blockId: string;
    blockName: string;
    required: boolean;
    deletable: boolean;
    editable: boolean;
    collapsed: boolean;
    sortOrder: number;
  };
  content?: EmrElement[];
}

/** 表格节点 */
export interface TableNode {
  type: "table";
  content: TableRowNode[];
}

export interface TableRowNode {
  type: "tableRow";
  content: TableCellNode[];
}

export interface TableCellNode {
  type: "tableCell" | "tableHeader";
  content?: EmrElement[];
  attrs?: {
    colspan?: number;
    rowspan?: number;
    colwidth?: number[];
  };
}

/** 内联节点联合类型 */
export type InlineNode = TextNode | VariableNode | ImageNode;

/** 编辑器元素联合类型 */
export type EmrElement = ParagraphNode | MedicalBlockNode | TableNode | TableRowNode | TableCellNode | ImageNode | VariableNode;

// ========== 常量 ==========

/** 编辑器默认初始值 */
export const DEFAULT_EDITOR_VALUE: EmrElement[] = [{ type: "paragraph", content: [{ type: "text", text: "" }] }];

// ========== 医疗区块配置 ==========

/** 医疗区块定义 */
export interface MedicalBlockDef {
  blockId: string;
  blockName: string;
  required: boolean;
  deletable: boolean;
  editable: boolean;
  sortOrder: number;
}

/** 标准医疗区块列表（三甲EMR标准） */
export const MEDICAL_BLOCKS: MedicalBlockDef[] = [
  { blockId: "basic-info", blockName: "基本信息", required: true, deletable: false, editable: true, sortOrder: 1 },
  { blockId: "contact-info", blockName: "联系人信息", required: false, deletable: false, editable: true, sortOrder: 2 },
  { blockId: "admission-info", blockName: "入院信息", required: true, deletable: false, editable: true, sortOrder: 3 },
  { blockId: "diagnosis-admission", blockName: "入院诊断", required: true, deletable: false, editable: true, sortOrder: 4 },
  { blockId: "diagnosis-discharge", blockName: "出院诊断", required: true, deletable: false, editable: true, sortOrder: 5 },
  { blockId: "surgery-info", blockName: "手术及操作", required: false, deletable: true, editable: true, sortOrder: 6 },
  { blockId: "medical-history", blockName: "既往史", required: false, deletable: false, editable: true, sortOrder: 7 },
  { blockId: "personal-history", blockName: "个人史", required: false, deletable: false, editable: true, sortOrder: 8 },
  { blockId: "family-history", blockName: "家族史", required: false, deletable: false, editable: true, sortOrder: 9 },
  { blockId: "physical-exam", blockName: "体格检查", required: true, deletable: false, editable: true, sortOrder: 10 },
  { blockId: "laboratory-exam", blockName: "辅助检查", required: false, deletable: true, editable: true, sortOrder: 11 },
  { blockId: "treatment-plan", blockName: "处理意见", required: false, deletable: true, editable: true, sortOrder: 12 },
  { blockId: "hospital-expense", blockName: "住院费用", required: false, deletable: true, editable: true, sortOrder: 13 },
  { blockId: "hospital-infection", blockName: "医院感染", required: false, deletable: true, editable: true, sortOrder: 14 }
];

// ========== 变量定义 ==========

/** 变量分组 */
export interface VariableGroup {
  groupName: string;
  groupKey: string;
  variables: VariableDef[];
}

/** 变量定义（用于弹窗选择） */
export interface VariableDef {
  varKey: string;
  varLabel: string;
  varDataType: "text" | "number" | "date" | "select" | "radio";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

/** 预定义变量列表 */
export const VARIABLE_GROUPS: VariableGroup[] = [
  {
    groupName: "患者信息",
    groupKey: "patient",
    variables: [
      { varKey: "patientName", varLabel: "姓名", varDataType: "text", required: true },
      {
        varKey: "patientSex",
        varLabel: "性别",
        varDataType: "radio",
        required: true,
        options: [
          { value: "1", label: "男" },
          { value: "2", label: "女" }
        ]
      },
      { varKey: "patientBirthDate", varLabel: "出生日期", varDataType: "date", required: true },
      { varKey: "patientAge", varLabel: "年龄", varDataType: "number", required: true },
      { varKey: "patientNationality", varLabel: "国籍", varDataType: "text" },
      { varKey: "patientBirthPlace", varLabel: "出生地", varDataType: "text" },
      { varKey: "patientNativePlace", varLabel: "籍贯", varDataType: "text" },
      { varKey: "patientEthnic", varLabel: "民族", varDataType: "text" },
      { varKey: "patientIdCard", varLabel: "身份证号", varDataType: "text", required: true },
      { varKey: "patientOccupation", varLabel: "职业", varDataType: "text" },
      {
        varKey: "patientMarital",
        varLabel: "婚姻",
        varDataType: "radio",
        options: [
          { value: "1", label: "未婚" },
          { value: "2", label: "已婚" },
          { value: "3", label: "丧偶" },
          { value: "4", label: "离婚" },
          { value: "5", label: "其他" }
        ]
      },
      { varKey: "patientAddress", varLabel: "现住址", varDataType: "text" },
      { varKey: "patientPhone", varLabel: "电话", varDataType: "text" },
      { varKey: "patientPostcode", varLabel: "邮编", varDataType: "text" },
      { varKey: "patientHealthCard", varLabel: "健康卡号", varDataType: "text" },
      { varKey: "patientMedicalRecordNo", varLabel: "病案号", varDataType: "text" },
      { varKey: "patientAdmissionTimes", varLabel: "第几次住院", varDataType: "number" }
    ]
  },
  {
    groupName: "入院信息",
    groupKey: "admission",
    variables: [
      {
        varKey: "admissionWay",
        varLabel: "入院途径",
        varDataType: "radio",
        options: [
          { value: "1", label: "急诊" },
          { value: "2", label: "门诊" },
          { value: "3", label: "其他医疗机构" },
          { value: "4", label: "其他" }
        ]
      },
      { varKey: "admissionTime", varLabel: "入院时间", varDataType: "date", required: true },
      { varKey: "admissionDept", varLabel: "入院科别", varDataType: "text", required: true },
      { varKey: "admissionWard", varLabel: "病房", varDataType: "text" },
      { varKey: "transferDept", varLabel: "转科科别", varDataType: "text" },
      { varKey: "dischargeTime", varLabel: "出院时间", varDataType: "date" },
      { varKey: "dischargeDept", varLabel: "出院科别", varDataType: "text" },
      { varKey: "hospitalDays", varLabel: "实际住院天数", varDataType: "number" },
      { varKey: "emergencyDiagnosis", varLabel: "门（急）诊诊断", varDataType: "text" },
      { varKey: "emergencyDiagnosisCode", varLabel: "疾病编码", varDataType: "text" },
      { varKey: "admissionDiagnosis", varLabel: "入院西医诊断", varDataType: "text", required: true },
      { varKey: "admissionDiagnosisCode", varLabel: "疾病编码", varDataType: "text" }
    ]
  },
  {
    groupName: "出院信息",
    groupKey: "discharge",
    variables: [
      { varKey: "dischargeDiagnosis", varLabel: "出院诊断", varDataType: "text", required: true },
      { varKey: "dischargeDiagnosisCode", varLabel: "疾病编码", varDataType: "text" },
      {
        varKey: "dischargeCondition",
        varLabel: "出院情况",
        varDataType: "radio",
        options: [
          { value: "1", label: "治愈" },
          { value: "2", label: "好转" },
          { value: "3", label: "未愈" },
          { value: "4", label: "死亡" },
          { value: "5", label: "其他" }
        ]
      },
      {
        varKey: "leaveWay",
        varLabel: "离院方式",
        varDataType: "radio",
        options: [
          { value: "1", label: "医嘱离院" },
          { value: "2", label: "医嘱转院" },
          { value: "3", label: "医嘱转社区" },
          { value: "4", label: "非医嘱离院" },
          { value: "5", label: "死亡" },
          { value: "6", label: "其他" }
        ]
      },
      {
        varKey: "readmissionPlan",
        varLabel: "31天内再住院计划",
        varDataType: "radio",
        options: [
          { value: "1", label: "无" },
          { value: "2", label: "有" }
        ]
      }
    ]
  },
  {
    groupName: "医疗机构",
    groupKey: "hospital",
    variables: [
      { varKey: "hospitalName", varLabel: "医疗机构", varDataType: "text" },
      { varKey: "hospitalCode", varLabel: "组织机构代码", varDataType: "text" },
      {
        varKey: "paymentMethod",
        varLabel: "医疗付款方式",
        varDataType: "radio",
        options: [
          { value: "1", label: "城镇职工医保" },
          { value: "2", label: "城镇居民医保" },
          { value: "3", label: "新农合" },
          { value: "4", label: "贫困救助" },
          { value: "5", label: "商业保险" },
          { value: "6", label: "全公费" },
          { value: "7", label: "全自费" },
          { value: "8", label: "其他社保" },
          { value: "9", label: "其他" }
        ]
      }
    ]
  },
  {
    groupName: "医护人员",
    groupKey: "staff",
    variables: [
      { varKey: "deptDirector", varLabel: "科主任", varDataType: "text" },
      { varKey: "chiefDoctor", varLabel: "主任医师", varDataType: "text" },
      { varKey: "attendingDoctor", varLabel: "主治医师", varDataType: "text" },
      { varKey: "residentDoctor", varLabel: "住院医师", varDataType: "text" },
      { varKey: "nurse", varLabel: "责任护士", varDataType: "text" },
      { varKey: "encodingStaff", varLabel: "编码员", varDataType: "text" }
    ]
  }
];

// ========== 常用医学术语 ==========

/** 术语分组 */
export interface TermGroup {
  groupName: string;
  terms: string[];
}

/** 常用病历术语 */
export const MEDICAL_TERMS: TermGroup[] = [
  {
    groupName: "主诉常用语",
    terms: [
      "发热伴咳嗽、咳痰",
      "头痛、头晕",
      "胸闷、气促",
      "腹痛、腹泻",
      "恶心、呕吐",
      "心悸、心慌",
      "乏力、纳差",
      "关节肿痛",
      "腰痛伴下肢放射痛",
      "皮疹伴瘙痒"
    ]
  },
  {
    groupName: "现病史常用语",
    terms: [
      "患者于",
      "天前无明显诱因出现",
      "呈持续性",
      "呈阵发性",
      "伴恶心、呕吐",
      "休息后可缓解",
      "活动后加重",
      "在当地医院予",
      "为进一步诊治",
      "患病以来精神、食欲、睡眠尚可",
      "患病以来精神差，食欲减退",
      "二便正常",
      "体重无明显变化"
    ]
  },
  {
    groupName: "体格检查常用语",
    terms: [
      "T: 36.5℃  P: 72次/分  R: 18次/分  BP: 120/80mmHg",
      "神志清楚，查体合作",
      "神志不清，查体欠合作",
      "全身皮肤黏膜无黄染",
      "浅表淋巴结未触及肿大",
      "双肺呼吸音清，未闻及干湿性啰音",
      "双肺呼吸音粗，可闻及湿性啰音",
      "心率齐，各瓣膜听诊区未闻及病理性杂音",
      "腹平软，无压痛、反跳痛",
      "腹肌紧张，全腹压痛、反跳痛",
      "肝脾肋下未触及",
      "双下肢无水肿",
      "生理反射存在，病理征未引出",
      "脊柱四肢无畸形，活动自如"
    ]
  },
  {
    groupName: "既往史常用语",
    terms: [
      "既往体健",
      "既往有高血压病史",
      "既往有糖尿病病史",
      "既往有冠心病病史",
      "否认高血压、糖尿病史",
      "否认肝炎、结核等传染病史",
      "否认手术外伤史",
      "否认输血史",
      "否认食物、药物过敏史",
      "预防接种史不详"
    ]
  },
  {
    groupName: "诊断与治疗",
    terms: [
      "建议完善相关检查",
      "予抗感染治疗",
      "予对症支持治疗",
      "建议定期复查",
      "病情稳定，可出院",
      "转上级医院进一步治疗",
      "建议手术治疗",
      "保守治疗",
      "目前诊断明确",
      "继续目前治疗方案"
    ]
  }
];

// ========== 业务类型 ==========

/** 文书记录 */
export interface DocumentRecord {
  id?: string;
  name: string;
  type: "template" | "instance";
  content: EmrElement[];
  patientId?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "draft" | "completed" | "archived";
}
