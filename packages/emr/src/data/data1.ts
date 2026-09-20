export const test_data = {
  patient: {
    patient_name: "张三",
    patient_sex: "1",
    patient_age: "30",
    familyAddr: "北京市平谷区",
    ethnicity: "汉族",
    marital_status_name: "已婚",
    occupation: "程序员"
  },
  patientOrder: {
    no: "20260715001",
    admission_time: "2026-07-15 08:30:00",
    dischargeTime: "2026-07-15 16:00:00"
  }
};
export const test_tem = {
  name: "破伤风注射知情同意书",
  content: {
    templateContent: {
      type: "doc",
      content: [
        {
          type: "header",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "center"
              },
              content: [
                {
                  type: "field",
                  attrs: {
                    "data-id": "3bizcd",
                    "data-extension-type": "field",
                    "data-widget-name": "住院机构",
                    "data-widget-type": "select",
                    "data-widget-type-name": "住院机构",
                    "data-placeholder": "住院机构",
                    "data-min-font-num": 8,
                    "data-group-id": "",
                    "data-checked": "",
                    "data-extension-value": "",
                    "data-readonly": "",
                    "data-required": "",
                    "data-required-warning": "",
                    "data-select-only": "",
                    "data-update-ignore": false,
                    "data-underline": "",
                    "data-version-id": "",
                    "data-ref-key": "organ.company_name",
                    "data-options": "",
                    "data-multiple": false,
                    "data-ref-key-index": 0,
                    "data-ref-key-attr": "",
                    "data-time-format": "",
                    "data-required-exp": ""
                  }
                }
              ]
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          }
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "center"
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: null,
                    fontSize: "20px",
                    color: null
                  }
                }
              ],
              text: "破伤风注射知情同意书"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "尊敬的患者："
            },
            {
              type: "field",
              attrs: {
                "data-id": "ecigf1",
                "data-extension-type": "field",
                "data-widget-name": "患者姓名",
                "data-widget-type": "text",
                "data-widget-type-name": "患者姓名",
                "data-placeholder": "患者姓名",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": false,
                "data-underline": "",
                "data-version-id": "",
                "data-ref-key": "patient.patient_name",
                "data-options": "",
                "data-multiple": false,
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              },
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ]
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "因"
            },
            {
              type: "field",
              attrs: {
                "data-id": "leil8t",
                "data-extension-type": "field",
                "data-widget-name": "文本输入",
                "data-widget-type": "text",
                "data-widget-type-name": "文本输入",
                "data-placeholder": "文本输入",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": false,
                "data-underline": "",
                "data-version-id": "",
                "data-ref-key": "",
                "data-options": "",
                "data-multiple": false,
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              },
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ]
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "建议注射破伤风抗毒素，因破伤风抗毒素是一种免疫血清。对人体是一种异性蛋白，具有抗原性，可发建议注射破伤风抗毒素生过敏反应。因此注射前必须做过敏试验，现将皮试中、皮试后及注射后可能出现的的反应及风险向患者及家属说明:"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "（1）皮试后几分钟可能发生过敏反应，例:皮试处皮肤红肿、皮丘增大有硬结、有痒感。"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "（2）皮试阳性，我们根据医疗操作规范为您进行脱敏注射，注射过程中出现过敏反应。"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "（3）皮试阴性，例:皮试处皮肤无红肿、硬结、皮丘无增大、无痒感，注射破伤风后几分钟至几小时后发生过敏反应，此种情况在医学上称药物迟发过敏反应"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "（4）伤后24h内注射破伤风免疫球蛋白，如不注射，后果自负。"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "如果发生严重过敏反应，例:气促、全身红肿有痒感、休克、我们会第一时间全力配合为您治疗，此种情况很罕见，但不排除发生的可能。以上这些情况的发生均与您个人体质有关，请您理解，并配合我们治疗，谢谢!"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          }
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "上述情况患者及家属及明知，同意皮试试验及注射。"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          }
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "患者本人签名："
            },
            {
              type: "field",
              attrs: {
                "data-id": "zniaxj",
                "data-extension-type": "field",
                "data-widget-name": "患者签名",
                "data-widget-type": "",
                "data-widget-type-name": "患者签名",
                "data-placeholder": "患者签名",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": false,
                "data-underline": "",
                "data-version-id": "",
                "data-ref-key": "",
                "data-options": "",
                "data-multiple": false,
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              },
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ]
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "或家属签名："
            },
            {
              type: "field",
              attrs: {
                "data-id": "joik1x",
                "data-extension-type": "field",
                "data-widget-name": "患者签名",
                "data-widget-type": "",
                "data-widget-type-name": "患者签名",
                "data-placeholder": "患者签名",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": false,
                "data-underline": "",
                "data-version-id": "",
                "data-ref-key": "",
                "data-options": "",
                "data-multiple": false,
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              },
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ]
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: " 与患者关系："
            },
            {
              type: "field",
              attrs: {
                "data-id": "2piyem",
                "data-extension-type": "field",
                "data-widget-name": "文本输入",
                "data-widget-type": "text",
                "data-widget-type-name": "文本输入",
                "data-placeholder": "与患者关系",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": false,
                "data-underline": "",
                "data-version-id": "",
                "data-ref-key": "",
                "data-options": "",
                "data-multiple": false,
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              },
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ]
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "或单位负责人签字："
            },
            {
              type: "field",
              attrs: {
                "data-id": "3qikzj",
                "data-extension-type": "field",
                "data-widget-name": "患者签名",
                "data-widget-type": "",
                "data-widget-type-name": "患者签名",
                "data-placeholder": "患者签名",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": false,
                "data-underline": "",
                "data-version-id": "",
                "data-ref-key": "",
                "data-options": "",
                "data-multiple": false,
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              },
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ]
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: " 职务："
            },
            {
              type: "field",
              attrs: {
                "data-id": "bqiz9a",
                "data-extension-type": "field",
                "data-widget-name": "文本输入",
                "data-widget-type": "text",
                "data-widget-type-name": "文本输入",
                "data-placeholder": "职务",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": false,
                "data-underline": "",
                "data-version-id": "",
                "data-ref-key": "",
                "data-options": "",
                "data-multiple": false,
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              },
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ]
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "  单位："
            },
            {
              type: "field",
              attrs: {
                "data-id": "qqihze",
                "data-extension-type": "field",
                "data-widget-name": "文本输入",
                "data-widget-type": "text",
                "data-widget-type-name": "文本输入",
                "data-placeholder": "单位信息",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": false,
                "data-underline": "",
                "data-version-id": "",
                "data-ref-key": "",
                "data-options": "",
                "data-multiple": false,
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              },
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ]
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          }
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "right"
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ],
              text: "日期："
            },
            {
              type: "field",
              attrs: {
                "data-id": "4ri8et",
                "data-extension-type": "field",
                "data-widget-name": "日期时间",
                "data-widget-type": "date",
                "data-widget-type-name": "日期时间",
                "data-placeholder": "    年    月       日",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": false,
                "data-underline": "",
                "data-version-id": "",
                "data-ref-key": "",
                "data-options": "",
                "data-multiple": false,
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "date",
                "data-required-exp": ""
              },
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun",
                    fontSize: "18px",
                    color: null
                  }
                }
              ]
            }
          ]
        },
        {
          type: "pageBreak"
        },
        {
          type: "pageBreak"
        },
        {
          type: "pageBreak"
        },
        {
          type: "pageBreak"
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null
          }
        }
      ]
    },
    templateSetting: {
      paperSize: "A4",
      orientation: "portrait",
      marginTop: 15,
      marginBottom: 15,
      marginLeft: 15,
      marginRight: 15,
      continuousDisplay: true
    }
  }
};
