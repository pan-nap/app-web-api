export const demoData: Record<string, string> = {
  patientName: "张三",
  patientSex: "1",
  patientAge: "31",
  admissionTime: "2026-07-10",
  diagnosis: "上呼吸道感染",
  bloodResult: "WBC 6.5×10⁹/L",
  urineResult: "尿蛋白(-)",
  treatment1: "予抗感染治疗",
  treatment2: "建议休息一周"
};

export const temData = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "患者姓名：" },
        {
          type: "variable",
          attrs: {
            varKey: "patientName",
            varLabel: "患者姓名",
            varDataType: "text",
            required: true
          }
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "性别：" },
        {
          type: "variable",
          attrs: {
            varKey: "patientSex",
            varLabel: "性别",
            varDataType: "radio",
            options: [
              { value: "1", label: "男" },
              { value: "2", label: "女" }
            ]
          }
        },
        { type: "text", text: " 年龄：" },
        {
          type: "variable",
          attrs: {
            varKey: "patientAge",
            varLabel: "年龄",
            varDataType: "number"
          }
        },
        { type: "text", text: "岁" }
      ]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "入院时间：" },
        {
          type: "variable",
          attrs: {
            varKey: "admissionTime",
            varLabel: "入院时间",
            varDataType: "date"
          }
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "诊断结果：" },
        {
          type: "variable",
          attrs: {
            varKey: "diagnosis",
            varLabel: "诊断结果",
            varDataType: "text"
          }
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "检查项目" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            { type: "tableHeader", content: [{ type: "text", text: "检查名称" }] },
            { type: "tableHeader", content: [{ type: "text", text: "结果" }] },
            { type: "tableHeader", content: [{ type: "text", text: "参考值" }] }
          ]
        },
        {
          type: "tableRow",
          content: [
            { type: "tableCell", content: [{ type: "text", text: "血常规" }] },
            {
              type: "tableCell",
              content: [
                {
                  type: "variable",
                  attrs: {
                    varKey: "bloodResult",
                    varLabel: "血常规结果",
                    varDataType: "text"
                  }
                }
              ]
            },
            { type: "tableCell", content: [{ type: "text", text: "正常" }] }
          ]
        },
        {
          type: "tableRow",
          content: [
            { type: "tableCell", content: [{ type: "text", text: "尿常规" }] },
            {
              type: "tableCell",
              content: [
                {
                  type: "variable",
                  attrs: {
                    varKey: "urineResult",
                    varLabel: "尿常规结果",
                    varDataType: "text"
                  }
                }
              ]
            },
            { type: "tableCell", content: [{ type: "text", text: "正常" }] }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "治疗建议：" }]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "1. " },
        {
          type: "variable",
          attrs: {
            varKey: "treatment1",
            varLabel: "治疗建议1",
            varDataType: "text"
          }
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "2. " },
        {
          type: "variable",
          attrs: {
            varKey: "treatment2",
            varLabel: "治疗建议2",
            varDataType: "text"
          }
        }
      ]
    }
  ]
};
