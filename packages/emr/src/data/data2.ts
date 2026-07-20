export const data2 = {
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
export const temData2 = {
  name: "西医住院病案首页",
  content: {
    templateContent: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: "left"
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "医疗机构"
            },
            {
              type: "field",
              attrs: {
                "data-id": "7ce3b0",
                "data-extension-type": "field",
                "data-widget-name": "文本输入",
                "data-widget-type": "text",
                "data-widget-type-name": "文本输入",
                "data-placeholder": "医疗机构",
                "data-min-font-num": 14,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": "",
                "data-underline": 1,
                "data-version-id": "",
                "data-ref-key": "patient.company",
                "data-options": "",
                "data-multiple": "",
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              }
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "​（组织机构代码："
            },
            {
              type: "field",
              attrs: {
                "data-id": "7ce3b0",
                "data-extension-type": "field",
                "data-widget-name": "文本输入",
                "data-widget-type": "text",
                "data-widget-type-name": "文本输入",
                "data-placeholder": "医疗机构",
                "data-min-font-num": 14,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "山东华速互联网医院",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": "",
                "data-underline": 1,
                "data-version-id": "",
                "data-ref-key": "organ.credit_code",
                "data-options": "",
                "data-multiple": "",
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              }
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "​）"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "left"
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "医疗付款方式："
            },
            {
              type: "field",
              attrs: {
                "data-id": "63a08e",
                "data-extension-type": "field",
                "data-widget-name": "选项下拉框",
                "data-widget-type": "select",
                "data-widget-type-name": "选择下拉框",
                "data-placeholder": "请选择",
                "data-min-font-num": 10,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": "",
                "data-underline": 1,
                "data-version-id": "",
                "data-ref-key": "patientOrder.medFeePaymtdName",
                "data-options":
                  "%5B%7B%22label%22%3A%22%E5%9F%8E%E9%95%87%E8%81%8C%E5%B7%A5%E5%9F%BA%E6%9C%AC%E5%8C%BB%E7%96%97%E4%BF%9D%E9%99%A9%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%9F%8E%E9%95%87%E5%B1%85%E6%B0%91%E5%9F%BA%E6%9C%AC%E5%8C%BB%E7%96%97%E4%BF%9D%E9%99%A9%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%96%B0%E5%9E%8B%E5%86%9C%E6%9D%91%E5%90%88%E4%BD%9C%E5%8C%BB%E7%96%97%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E8%B4%AB%E5%9B%B0%E6%95%91%E5%8A%A9%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%95%86%E4%B8%9A%E5%8C%BB%E7%96%97%E4%BF%9D%E9%99%A9%22%2C%22value%22%3A4%7D%2C%7B%22label%22%3A%22%E5%85%A8%E5%85%AC%E8%B4%B9%22%2C%22value%22%3A5%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%E7%A4%BE%E4%BC%9A%E4%BF%9D%E9%99%A9%22%2C%22value%22%3A6%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A7%7D%5D",
                "data-multiple": "",
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              }
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "center"
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
                    fontFamily: "SimSun, STSong",
                    fontSize: "20pt",
                    color: ""
                  }
                },
                {
                  type: "bold"
                }
              ],
              text: "西 医 住 院 病 案 首 页"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "center"
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
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                },
                {
                  type: "bold"
                }
              ],
              text: "健康卡号"
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "："
            },
            {
              type: "field",
              attrs: {
                "data-id": "08894d",
                "data-extension-type": "field",
                "data-widget-name": "文本输入",
                "data-widget-type": "text",
                "data-widget-type-name": "文本输入",
                "data-placeholder": "健康卡号",
                "data-min-font-num": 8,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": "",
                "data-underline": 1,
                "data-version-id": "",
                "data-ref-key": "patient.healthCardNumber",
                "data-options": "",
                "data-multiple": "",
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              }
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "​  "
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                },
                {
                  type: "bold"
                }
              ],
              text: "第"
            },
            {
              type: "field",
              attrs: {
                "data-id": 686847,
                "data-extension-type": "field",
                "data-widget-name": "文本输入",
                "data-widget-type": "text",
                "data-widget-type-name": "文本输入",
                "data-placeholder": null,
                "data-min-font-num": 3,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": "",
                "data-underline": 1,
                "data-version-id": "",
                "data-ref-key": "patientOrder.inpatientCount",
                "data-options": "",
                "data-multiple": "",
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              }
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                },
                {
                  type: "bold"
                }
              ],
              text: "​次住院"
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "  "
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                },
                {
                  type: "bold"
                }
              ],
              text: "病案号"
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "："
            },
            {
              type: "field",
              attrs: {
                "data-id": "c94eb0",
                "data-extension-type": "field",
                "data-widget-name": "文本输入",
                "data-widget-type": "text",
                "data-widget-type-name": "文本输入",
                "data-placeholder": "病案号",
                "data-min-font-num": 10,
                "data-group-id": "",
                "data-checked": "",
                "data-extension-value": "",
                "data-readonly": "",
                "data-required": "",
                "data-required-warning": "",
                "data-select-only": "",
                "data-update-ignore": "",
                "data-underline": 1,
                "data-version-id": "",
                "data-ref-key": "patient.sn",
                "data-options": "",
                "data-multiple": "",
                "data-ref-key-index": 0,
                "data-ref-key-attr": "",
                "data-time-format": "",
                "data-required-exp": ""
              }
            },
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "​"
            }
          ]
        },
        {
          type: "table",
          content: [
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "姓名"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f32f53",
                            "data-extension-type": "field",
                            "data-widget-name": "患者姓名",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "患者姓名",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "理想",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.patient_name",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 性别"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "94c5f4",
                            "data-extension-type": "field",
                            "data-widget-name": "患者性别",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "性别",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "男",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.patient_sex",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E7%94%B7%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%B3%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.男 2.女"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " 出生日期"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "94fe1b",
                            "data-extension-type": "field",
                            "data-widget-name": "日期时间",
                            "data-widget-type": "date",
                            "data-widget-type-name": "日期时间",
                            "data-placeholder": "     年  月  日",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "2007-07-10",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.birth_date",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​​ 年龄"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "9845bc",
                            "data-extension-type": "field",
                            "data-widget-name": "数字输入",
                            "data-widget-type": "number",
                            "data-widget-type-name": "数字输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "19岁",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.patient_age",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​岁 国籍"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "68969e",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "国籍",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "中国",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.nationality",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​（年龄不足1周岁的）年龄"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a808aa",
                            "data-extension-type": "field",
                            "data-widget-name": "数字输入",
                            "data-widget-type": "number",
                            "data-widget-type-name": "数字输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "0",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.age_month",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​月 新生儿出生体重"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "7b20b8",
                            "data-extension-type": "field",
                            "data-widget-name": "数字输入",
                            "data-widget-type": "number",
                            "data-widget-type-name": "数字输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.nwbBirWt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​克 新生儿入院体重"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "361e87",
                            "data-extension-type": "field",
                            "data-widget-name": "数字输入",
                            "data-widget-type": "number",
                            "data-widget-type-name": "数字输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.nwbAdmWt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​克"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "出生地"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "81c2ec",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "省",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.province",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​省"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "(区、市)"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "8c64b8",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "市",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.city",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​市"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f6fa26",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "县",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.district",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​县 籍贯"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "e4f0af",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "省区市",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "undefinedundefinedundefined",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.native_area",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​省"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "(区、市)"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "5e96b0",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "市",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.city",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​市 民族"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c4ad86",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "民族",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.ethnic_group",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​身份证号"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "00cebe",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "身份证号",
                            "data-min-font-num": 12,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.idCard",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 职业"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "adef06",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "职业",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "医生",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.occupation",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " 婚姻"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "07c381",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "婚姻",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.marital_status_name",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%AA%E5%A9%9A%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%B7%B2%E5%A9%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E4%B8%A7%E5%81%B6%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E7%A6%BB%E5%A9%9A%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.未婚 2.已婚 3.丧偶 4.离婚 5.其他​​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "现住址"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f8d179",
                            "data-extension-type": "field",
                            "data-widget-name": "详细家庭住址",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "详细地址",
                            "data-min-font-num": 20,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.address",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " 电话"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f34481",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "电话",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.familyAddr",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " 邮编"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "2d1c8b",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "邮编",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.currAddPposcode",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​​​​​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "户口地址"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "cd5b08",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "户口地址",
                            "data-min-font-num": 30,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.household_address",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 邮编"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "6333d4",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "邮编",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.household_postal",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​​​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "工作单位及地址"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "1152aa",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "工作单位及地址",
                            "data-min-font-num": 16,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.work_address",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 单位电话"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "0121e2",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "单位电话",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.work_phone",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 邮编"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "664a13",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "邮编",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.work_postal",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "联系人姓名"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "53f836",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "联系人姓名",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "理想",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.contact_person",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 关系"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "9d95fc",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "关系",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "1",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.contact_relationship",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 地址"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a2db21",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "联系人地址",
                            "data-min-font-num": 10,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "14565235626",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.contact_phone",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 电话"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3b7998",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "联系人电话",
                            "data-min-font-num": 9,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "14565235626",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patient.contact_phone",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "入院途径"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "1b94d5",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "入院途径",
                            "data-min-font-num": 13,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "急诊",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.admission_pathway",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%80%A5%E8%AF%8A%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E9%97%A8%E8%AF%8A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%E5%8C%BB%E7%96%97%E6%9C%BA%E6%9E%84%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.急诊 2.门诊 3.其他医疗机构 4.其他​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "入院时间"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "8d1494",
                            "data-extension-type": "field",
                            "data-widget-name": "日期时间",
                            "data-widget-type": "date",
                            "data-widget-type-name": "日期时间",
                            "data-placeholder": "     年  月  日  时  分",
                            "data-min-font-num": 13,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "2026-07-10 10:46:56",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.admission_time",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 入院科别"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3e2e71",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "入院科别",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.admCaty",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 病房"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "866b69",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "病房",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.admWard",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 转科科别"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "bfe58a",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "转科科别",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.refldeptCatyName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "出院时间"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "4c2fcb",
                            "data-extension-type": "field",
                            "data-widget-name": "日期时间",
                            "data-widget-type": "date",
                            "data-widget-type-name": "日期时间",
                            "data-placeholder": "     年  月  日  时  分",
                            "data-min-font-num": 13,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.discharge_time",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 出院科别"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "1877c7",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院科别",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.dscgCaty",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 病房"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "72ff9b",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "病房",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.dscgWard",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 实际住院"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "7f3731",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.inpatientDays",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​天"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "门（急）诊诊断​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 603060,
                            "data-extension-type": "field",
                            "data-widget-name": "诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "门急诊诊断",
                            "data-min-font-num": 20,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.outpatientWesternDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          text: " "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "疾病编码"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "407f17",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "疾病编码",
                            "data-min-font-num": 9,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.outpatientWesternDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "入院西医诊断"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c4fada",
                            "data-extension-type": "field",
                            "data-widget-name": "入院西医诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "入院西医诊断",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.admissionWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​  疾病编码"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3b58a0",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "疾病编码",
                            "data-min-font-num": 9,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.admissionWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "入院中医诊断"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "686e5a",
                            "data-extension-type": "field",
                            "data-widget-name": "入院中医诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "入院中医诊断",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.admissionTcmDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "79a34f",
                            "data-extension-type": "field",
                            "data-widget-name": "入院中医诊断证型",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "入院中医诊断证型",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.admissionTcmSyndromeType",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "疾病编码"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "73be24",
                            "data-extension-type": "field",
                            "data-widget-name": "诊断编码",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "诊断编码",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.outpatientWesternDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "住院期间是否相关知情告知"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ef37b0",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "选择",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.InformedNotification",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%98%AF%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%90%A6%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.是 2.否"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " 是否为疑难重症病例"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "75043f",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": null,
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.difficultAndSevereCase",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%98%AF%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%90%A6%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.是 2.否"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "入住重症监护病房"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "e4e7a8",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "选择",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.icu",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%98%AF%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%90%A6%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.是 2.否"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " 抢救"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "8873b3",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.rescCnt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​次 成功"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ac5196",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.rescSuccCnt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​次"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "出院诊断"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "center"
                      },
                      content: [
                        {
                          type: "text",
                          text: "疾病编码"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [91],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "入院病情"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [89],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "出院情况"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "出院诊断"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "疾病编码"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "center"
                      },
                      content: [
                        {
                          type: "text",
                          text: "入院病情"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "center"
                      },
                      content: [
                        {
                          type: "text",
                          text: "出院情况"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f70fcd",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "36d672",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [91],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "73eed8",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [89],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "73eed8",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "cd4370",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "0c6c96",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "df4fef",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "d246ac",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "情况",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%B2%BB%E6%84%88%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%BD%E8%BD%AC%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%84%88%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "919a87",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "e19c31",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [91],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f4b360",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [89],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "cd1772",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "情况",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%B2%BB%E6%84%88%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%BD%E8%BD%AC%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%84%88%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "afd9fd",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "6f0905",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "e501ec",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "55bdde",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "情况",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%B2%BB%E6%84%88%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%BD%E8%BD%AC%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%84%88%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "8651a1",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "296b33",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [91],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "871bbb",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [89],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "e50685",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "情况",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%B2%BB%E6%84%88%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%BD%E8%BD%AC%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%84%88%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3993,
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "1f2aaa",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "71e90e",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "e20ea0",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "情况",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%B2%BB%E6%84%88%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%BD%E8%BD%AC%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%84%88%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": 768950,
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": 660535,
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [91],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": 606518,
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [89],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "9e720f",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "情况",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%B2%BB%E6%84%88%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%BD%E8%BD%AC%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%84%88%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "841fca",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ec0bd3",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "37a585",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "386fd4",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "情况",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%B2%BB%E6%84%88%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%BD%E8%BD%AC%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%84%88%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f390a8",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ffe3a4",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [91],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": 332824,
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [89],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "aaed36",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "情况",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%B2%BB%E6%84%88%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%BD%E8%BD%AC%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%84%88%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [94],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "6fa074",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "出院诊断",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "44d2b7",
                            "data-extension-type": "field",
                            "data-widget-name": "出院诊断",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options": "",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [72],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "fc1b02",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "病情",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B8%B4%E5%BA%8A%E6%9C%AA%E7%A1%AE%E5%AE%9A%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%83%85%E5%86%B5%E4%B8%8D%E6%98%8E%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
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
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "02f3d5",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "情况",
                            "data-min-font-num": 0,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dischargeWesternMedicineDiagnosis",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%B2%BB%E6%84%88%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%A5%BD%E8%BD%AC%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%84%88%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "入院病情："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "10pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.有，2.临床未确定，3.情况不明，4.无 出院情况：1.治愈，2.好转，3.未愈，4.死亡，5.其他"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "损伤、中毒的外部原因"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "7fd8e9",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "外部原因",
                            "data-min-font-num": 19,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.damgIntxExtRea",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "疾病编码"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "b749e4",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "疾病编码",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.damg_intx_ext_rea_disecode",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "病理诊断"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ca1572",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "病理诊断",
                            "data-min-font-num": 12,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.pd",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 疾病编码"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "65c546",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "疾病编码",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.pd",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 病理号"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "117bb5",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "病理号",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.pathologyNumber",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "药物过敏"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "8af48e",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "选择",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.drugDicmFlag",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.有 2.无,过敏药物"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c38c02",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "过敏药物",
                            "data-min-font-num": 10,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dicmDrugName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 死亡患者尸检"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "54a93f",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "是否",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dieAutpFlag",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%98%AF%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%90%A6%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​ 1.是 2.否"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "血型"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "7ae848",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "血型",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.aboName",
                            "data-options":
                              "%5B%7B%22label%22%3A%22A%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22B%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22O%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22AB%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E4%B8%8D%E8%AF%A6%22%2C%22value%22%3A4%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%9F%A5%22%2C%22value%22%3A5%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.A 2.B 3.O 4.AB 5.不详 6.未查 "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "RH"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "13921e",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "RH血型选择",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.rhName",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E9%98%B4%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E9%98%B3%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E4%B8%8D%E8%AF%A6%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E6%9F%A5%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​ 1.阴 2.阳 3.不详 4.未查"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "TNM分期"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ac5a83",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "TNM分期选择",
                            "data-min-font-num": 14,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.bkupDegName",
                            "data-options":
                              "%5B%7B%22label%22%3A%22T%E5%88%86%E6%9C%9F%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22N%E5%88%86%E6%9C%9F%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22M%E5%88%86%E6%9C%9F%22%2C%22value%22%3A2%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          text: " 1.T分期 2.N分期 3.M分期"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "科 主 任"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "6ce833",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.deptdrtName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 主任(副主任)医师"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "867ec2",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.chfdrName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​  主治医师"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 982813,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.atddrName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​  住院医师"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "99f21d",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.doctorName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "责任护士"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "bd637b",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 4,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "patientOrder.nurseName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 进修医师"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "25472c",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.rainDrName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​​  主诊医师"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "041d5a",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.chfpdrName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 编码员"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a3c26c",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.codrName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 8,
                    rowspan: 1,
                    colwidth: [94, 72, 91, 89, 94, 76, 72, 88],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "justify"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "病案质量"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f89aae",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "请选择",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.medcasQltName",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E7%94%B2%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%B9%99%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E4%B8%99%22%2C%22value%22%3A2%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.甲2.乙3.丙"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " 质控医师"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "8522ba",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.qltctrlDrName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 质控护士"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "b30018",
                            "data-extension-type": "field",
                            "data-widget-name": "姓名",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "姓名",
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.qltctrlNursName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ 日期"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "81ff92",
                            "data-extension-type": "field",
                            "data-widget-name": "日期时间",
                            "data-widget-type": "date",
                            "data-widget-type-name": "日期时间",
                            "data-placeholder": "    年   月   日",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.qltctrlDate",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "pageBreak"
        },
        {
          type: "table",
          content: [
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 2,
                    colwidth: [76],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "手术及"
                        }
                      ]
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "操作名称"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 2,
                    colwidth: [86],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "手术及"
                        }
                      ]
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "操作编码"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 2,
                    colwidth: [65],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "手术及"
                        }
                      ]
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "操作日期"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 2,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "center"
                      },
                      content: [
                        {
                          type: "text",
                          text: "手术级别"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 3,
                    rowspan: 1,
                    colwidth: [57, 58, 63],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "手术及操作医师"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 2,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "center"
                      },
                      content: [
                        {
                          type: "text",
                          text: "切口愈合等级"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 2,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "center"
                      },
                      content: [
                        {
                          type: "text",
                          text: "麻醉方式"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 2,
                    colwidth: [105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "center"
                      },
                      content: [
                        {
                          type: "text",
                          text: "麻醉医师"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [57],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "术者"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "Ⅰ助"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [63],
                    align: null
                  },
                  content: [
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
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "Ⅱ助"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "0b217b",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作名称",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "名称",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "oprnOprtName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [86],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f17255",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作编码",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "oprnOprtCode",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [65],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          text: "​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ef1341",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作日期",
                            "data-widget-type": "date",
                            "data-widget-type-name": "日期时间",
                            "data-placeholder": "日期",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "oprnOprtDate",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ed2ec8",
                            "data-extension-type": "field",
                            "data-widget-name": "手术级别",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "级别",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%221%22%2C%22value%22%3A%221%22%7D%2C%7B%22label%22%3A%222%22%2C%22value%22%3A%222%22%7D%2C%7B%22label%22%3A%223%22%2C%22value%22%3A%223%22%7D%2C%7B%22label%22%3A%224%22%2C%22value%22%3A%224%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "oprnLvName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [57],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ee88c7",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "术者",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "operName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "02e595",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "I助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "asitName1",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [63],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "4e9b45",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "II助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "asitName2",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "79668b",
                            "data-extension-type": "field",
                            "data-widget-name": "切口愈合等级",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "等级",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%220%22%2C%22value%22%3A%220%22%7D%2C%7B%22label%22%3A%22I%2F%E7%94%B2%22%2C%22value%22%3A%22I%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B9%99%22%2C%22value%22%3A%22I%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B8%99%22%2C%22value%22%3A%22I%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22II%2F%E7%94%B2%22%2C%22value%22%3A%22II%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B9%99%22%2C%22value%22%3A%22II%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B8%99%22%2C%22value%22%3A%22II%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22III%2F%E7%94%B2%22%2C%22value%22%3A%22III%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B9%99%22%2C%22value%22%3A%22III%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B8%99%22%2C%22value%22%3A%22III%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "sincHealLv",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "6e2525",
                            "data-extension-type": "field",
                            "data-widget-name": "麻醉方式",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "方式",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%2C%22value%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%7D%2C%7B%22label%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%2C%22value%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%2C%22value%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "anstMtdName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "917fc4",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "医生",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3ddda0",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作名称",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "名称",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 1,
                            "data-ref-key-attr": "oprnOprtName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [86],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "bf9a3e",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作编码",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 1,
                            "data-ref-key-attr": "oprnOprtCode",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [65],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c7b071",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作日期",
                            "data-widget-type": "date",
                            "data-widget-type-name": "日期时间",
                            "data-placeholder": "日期",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 1,
                            "data-ref-key-attr": "oprnOprtDate",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c49428",
                            "data-extension-type": "field",
                            "data-widget-name": "手术级别",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "级别",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%221%22%2C%22value%22%3A%221%22%7D%2C%7B%22label%22%3A%222%22%2C%22value%22%3A%222%22%7D%2C%7B%22label%22%3A%223%22%2C%22value%22%3A%223%22%7D%2C%7B%22label%22%3A%224%22%2C%22value%22%3A%224%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 1,
                            "data-ref-key-attr": "oprnLvName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [57],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "36c09c",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "术者",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 1,
                            "data-ref-key-attr": "operName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "6f8e58",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "I助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 1,
                            "data-ref-key-attr": "asitName1",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [63],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "b9b55a",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "II助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 1,
                            "data-ref-key-attr": "asitName2",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "eb0a66",
                            "data-extension-type": "field",
                            "data-widget-name": "切口愈合等级",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "等级",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%220%22%2C%22value%22%3A%220%22%7D%2C%7B%22label%22%3A%22I%2F%E7%94%B2%22%2C%22value%22%3A%22I%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B9%99%22%2C%22value%22%3A%22I%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B8%99%22%2C%22value%22%3A%22I%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22II%2F%E7%94%B2%22%2C%22value%22%3A%22II%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B9%99%22%2C%22value%22%3A%22II%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B8%99%22%2C%22value%22%3A%22II%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22III%2F%E7%94%B2%22%2C%22value%22%3A%22III%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B9%99%22%2C%22value%22%3A%22III%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B8%99%22%2C%22value%22%3A%22III%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 1,
                            "data-ref-key-attr": "sincHealLv",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "e9896c",
                            "data-extension-type": "field",
                            "data-widget-name": "麻醉方式",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "方式",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%2C%22value%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%7D%2C%7B%22label%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%2C%22value%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%2C%22value%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 1,
                            "data-ref-key-attr": "anstMtdName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ed2b8f",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "医生",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3822ba",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作名称",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "名称",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 2,
                            "data-ref-key-attr": "oprnOprtName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [86],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3eb59e",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作编码",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 2,
                            "data-ref-key-attr": "oprnOprtCode",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [65],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a8fd93",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作日期",
                            "data-widget-type": "date",
                            "data-widget-type-name": "日期时间",
                            "data-placeholder": "日期",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 2,
                            "data-ref-key-attr": "oprnOprtDate",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "735a1e",
                            "data-extension-type": "field",
                            "data-widget-name": "手术级别",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "级别",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%221%22%2C%22value%22%3A%221%22%7D%2C%7B%22label%22%3A%222%22%2C%22value%22%3A%222%22%7D%2C%7B%22label%22%3A%223%22%2C%22value%22%3A%223%22%7D%2C%7B%22label%22%3A%224%22%2C%22value%22%3A%224%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 2,
                            "data-ref-key-attr": "oprnLvName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [57],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "30185f",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "术者",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 2,
                            "data-ref-key-attr": "operName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": 854178,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "I助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 2,
                            "data-ref-key-attr": "asitName1",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [63],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "43611e",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "II助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 2,
                            "data-ref-key-attr": "asitName2",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "945d58",
                            "data-extension-type": "field",
                            "data-widget-name": "切口愈合等级",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "等级",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%220%22%2C%22value%22%3A%220%22%7D%2C%7B%22label%22%3A%22I%2F%E7%94%B2%22%2C%22value%22%3A%22I%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B9%99%22%2C%22value%22%3A%22I%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B8%99%22%2C%22value%22%3A%22I%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22II%2F%E7%94%B2%22%2C%22value%22%3A%22II%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B9%99%22%2C%22value%22%3A%22II%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B8%99%22%2C%22value%22%3A%22II%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22III%2F%E7%94%B2%22%2C%22value%22%3A%22III%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B9%99%22%2C%22value%22%3A%22III%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B8%99%22%2C%22value%22%3A%22III%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 2,
                            "data-ref-key-attr": "sincHealLv",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "05c2e8",
                            "data-extension-type": "field",
                            "data-widget-name": "麻醉方式",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "方式",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%2C%22value%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%7D%2C%7B%22label%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%2C%22value%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%2C%22value%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 2,
                            "data-ref-key-attr": "anstMtdName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "109f16",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "医生",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a76ef1",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作名称",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "名称",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 3,
                            "data-ref-key-attr": "oprnOprtName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [86],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "1b3415",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作编码",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 3,
                            "data-ref-key-attr": "oprnOprtCode",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [65],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "d13a02",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作日期",
                            "data-widget-type": "date",
                            "data-widget-type-name": "日期时间",
                            "data-placeholder": "日期",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 3,
                            "data-ref-key-attr": "oprnOprtDate",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c46ecd",
                            "data-extension-type": "field",
                            "data-widget-name": "手术级别",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "级别",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%221%22%2C%22value%22%3A%221%22%7D%2C%7B%22label%22%3A%222%22%2C%22value%22%3A%222%22%7D%2C%7B%22label%22%3A%223%22%2C%22value%22%3A%223%22%7D%2C%7B%22label%22%3A%224%22%2C%22value%22%3A%224%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 3,
                            "data-ref-key-attr": "oprnLvName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [57],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "6670dd",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "术者",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 3,
                            "data-ref-key-attr": "operName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "276ef4",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "I助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 3,
                            "data-ref-key-attr": "operName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [63],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c16b61",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "II助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 3,
                            "data-ref-key-attr": "asitName2",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "87c381",
                            "data-extension-type": "field",
                            "data-widget-name": "切口愈合等级",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "等级",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%220%22%2C%22value%22%3A%220%22%7D%2C%7B%22label%22%3A%22I%2F%E7%94%B2%22%2C%22value%22%3A%22I%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B9%99%22%2C%22value%22%3A%22I%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B8%99%22%2C%22value%22%3A%22I%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22II%2F%E7%94%B2%22%2C%22value%22%3A%22II%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B9%99%22%2C%22value%22%3A%22II%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B8%99%22%2C%22value%22%3A%22II%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22III%2F%E7%94%B2%22%2C%22value%22%3A%22III%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B9%99%22%2C%22value%22%3A%22III%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B8%99%22%2C%22value%22%3A%22III%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 3,
                            "data-ref-key-attr": "sincHealLv",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "d22099",
                            "data-extension-type": "field",
                            "data-widget-name": "麻醉方式",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "方式",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%2C%22value%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%7D%2C%7B%22label%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%2C%22value%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%2C%22value%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 3,
                            "data-ref-key-attr": "anstMtdName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": 580545,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "医生",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [76],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "d01378",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作名称",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "名称",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 4,
                            "data-ref-key-attr": "oprnOprtName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [86],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": 578878,
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作编码",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "编码",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 4,
                            "data-ref-key-attr": "oprnOprtCode",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [65],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a27d5b",
                            "data-extension-type": "field",
                            "data-widget-name": "手术操作日期",
                            "data-widget-type": "date",
                            "data-widget-type-name": "日期时间",
                            "data-placeholder": "日期",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 4,
                            "data-ref-key-attr": "oprnOprtDate",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c944e6",
                            "data-extension-type": "field",
                            "data-widget-name": "手术级别",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "级别",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%221%22%2C%22value%22%3A%221%22%7D%2C%7B%22label%22%3A%222%22%2C%22value%22%3A%222%22%7D%2C%7B%22label%22%3A%223%22%2C%22value%22%3A%223%22%7D%2C%7B%22label%22%3A%224%22%2C%22value%22%3A%224%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 4,
                            "data-ref-key-attr": "oprnLvName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [57],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "d2b0ed",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "术者",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 4,
                            "data-ref-key-attr": "operName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": 151926,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "I助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 4,
                            "data-ref-key-attr": "asitName1",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [63],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3f03eb",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "II助",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 4,
                            "data-ref-key-attr": "asitName2",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [58],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "af4e30",
                            "data-extension-type": "field",
                            "data-widget-name": "切口愈合等级",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "等级",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%220%22%2C%22value%22%3A%220%22%7D%2C%7B%22label%22%3A%22I%2F%E7%94%B2%22%2C%22value%22%3A%22I%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B9%99%22%2C%22value%22%3A%22I%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22I%2F%E4%B8%99%22%2C%22value%22%3A%22I%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22I%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22II%2F%E7%94%B2%22%2C%22value%22%3A%22II%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B9%99%22%2C%22value%22%3A%22II%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22II%2F%E4%B8%99%22%2C%22value%22%3A%22II%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22II%2F%E5%85%B6%E5%AE%83%22%7D%2C%7B%22label%22%3A%22III%2F%E7%94%B2%22%2C%22value%22%3A%22III%2F%E7%94%B2%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B9%99%22%2C%22value%22%3A%22III%2F%E4%B9%99%22%7D%2C%7B%22label%22%3A%22III%2F%E4%B8%99%22%2C%22value%22%3A%22III%2F%E4%B8%99%22%7D%2C%7B%22label%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%2C%22value%22%3A%22III%2F%E5%85%B6%E5%AE%83%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 4,
                            "data-ref-key-attr": "sincHealLv",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [54],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "bc48f1",
                            "data-extension-type": "field",
                            "data-widget-name": "麻醉方式",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "方式",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%85%A8%E8%BA%AB%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%90%B8%E5%85%A5%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%9D%99%E8%84%89%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%9F%BA%E7%A1%80%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E6%A4%8E%E7%AE%A1%E5%86%85%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%9B%9B%E7%BD%91%E8%86%9C%E4%B8%8B%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A1%AC%E8%84%8A%E6%A4%8E%E8%86%9C%E5%A4%96%E8%85%94%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%BB%8E%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E8%8A%82%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%8C%BA%E5%9F%9F%E9%98%BB%E6%BB%9E%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%B1%80%E9%83%A8%E6%B5%B8%E6%B6%A6%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E8%A1%A8%E9%9D%A2%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%2C%22value%22%3A%22%E9%9D%99%E5%90%B8%E5%A4%8D%E5%90%88%E5%85%A8%E9%BA%BB%22%7D%2C%7B%22label%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E9%92%88%E8%8D%AF%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%2C%22value%22%3A%22%E7%A5%9E%E7%BB%8F%E4%B8%9B%E4%B8%8E%E7%A1%AC%E8%86%9C%E5%A4%96%E9%98%BB%E6%BB%9E%E5%A4%8D%E5%90%88%E9%BA%BB%E9%86%89%22%7D%2C%7B%22label%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%2C%22value%22%3A%22%E5%85%A8%E9%BA%BB%E5%A4%8D%E5%90%88%E5%85%A8%E8%BA%AB%E9%99%8D%E6%B8%A9%22%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%2C%22value%22%3A%22%E5%85%B6%E4%BB%96%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 4,
                            "data-ref-key-attr": "anstMtdName",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c7f62b",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "医生",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 0,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.oprnOprt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 10,
                    rowspan: 1,
                    colwidth: [76, 86, 65, 54, 57, 58, 63, 58, 54, 105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "Ⅰ类手术切口预防性应用抗菌药物；"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " "
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "947d36",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "选择",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.applicationOfAntibiotics",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%98%AF%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%90%A6%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.是 2.否"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: " 使用持续时间"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "9b9e2d",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "小时 联合用药："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "42f8ad",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "选择",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.drugCombination",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%98%AF%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%90%A6%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.是 2.否"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 10,
                    rowspan: 1,
                    colwidth: [76, 86, 65, 54, 57, 58, 63, 58, 54, 105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "输血品种"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: " 1.红细胞"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3816641192273592300,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3818761882304987000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: " 2.血小板"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: " 3.血浆"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: " 4.全血"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "5.自体血回输"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: " 6.白蛋白"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 3819505460866138000,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "7.其他"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "9b9e2d",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.durationOfAntimicrobialUse",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: " 输血反应："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a9604f",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "请选择",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.transfusionReaction",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E8%BE%93%22%2C%22value%22%3A2%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.有 2.无 3.未输"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 10,
                    rowspan: 1,
                    colwidth: [76, 86, 65, 54, 57, 58, 63, 58, 54, 105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "离院方式"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "2112d4",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "选择离院方式",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dscgWay",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E5%8C%BB%E5%98%B1%E7%A6%BB%E9%99%A2%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E5%8C%BB%E5%98%B1%E8%BD%AC%E9%99%A2%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E5%8C%BB%E5%98%B1%E8%BD%AC%E7%A4%BE%E5%8C%BA%E5%8D%AB%E7%94%9F%E6%9C%8D%E5%8A%A1%E6%9C%BA%E6%9E%84%2F%E4%B9%A1%E9%95%87%E5%8D%AB%E7%94%9F%E6%9C%8D%E5%8A%A1%E9%99%A2%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E9%9D%9E%E5%8C%BB%E5%98%B1%E7%A6%BB%E9%99%A2%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E6%AD%BB%E4%BA%A1%22%2C%22value%22%3A4%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%22%2C%22value%22%3A5%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          text: " 1.医嘱离院 2.医嘱转院，拟接收医疗机构："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "482edd",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "接收医疗机构",
                            "data-min-font-num": 12,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.acpMedinsName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          text: "3.医嘱转社区卫生服务机构/乡镇卫生院，拟接收医疗机构名称："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "9e4908",
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
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.acpMedinsName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          text: " 4.非医嘱离院 5.死亡 6.其他"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 10,
                    rowspan: 1,
                    colwidth: [76, 86, 65, 54, 57, 58, 63, 58, 54, 105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "justify"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "是否有出院31天内再住院计划"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3d367f",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "请选择",
                            "data-min-font-num": 3,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dscg31daysRinpFlag",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.无 2.有，"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "目的："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "4f0f4a",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "目的",
                            "data-min-font-num": 17,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.dscg31daysRinpPup",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: " "
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 10,
                    rowspan: 1,
                    colwidth: [76, 86, 65, 54, 57, 58, 63, 58, 54, 105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "justify"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "颅脑损伤患者昏迷时间"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "：入院前"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 942464,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.brnDamgBfadmComaDura",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "天"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "1b58fb",
                            "data-extension-type": "field",
                            "data-widget-name": "输入数字",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.brnDamgBfadmComaDura",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "小时"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "173e54",
                            "data-extension-type": "field",
                            "data-widget-name": "输入数字",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.brnDamgBfadmComaDura",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "分钟 入院后"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "d3b0e9",
                            "data-extension-type": "field",
                            "data-widget-name": "输入数字",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.brnDamgAfadmComaDura",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "天"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "5a3aa5",
                            "data-extension-type": "field",
                            "data-widget-name": "输入数字",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.brnDamgAfadmComaDura",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "小时"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "91f62c",
                            "data-extension-type": "field",
                            "data-widget-name": "输入数字",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "数字",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.brnDamgAfadmComaDura",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "分钟"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 10,
                    rowspan: 1,
                    colwidth: [76, 86, 65, 54, 57, 58, 63, 58, 54, 105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "住院费用(元)"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "：总费用："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "4abdb2",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "总费用",
                            "data-min-font-num": 10,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.medfeeSumamt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "  （自付金额："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "62c3b3",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "自付金额",
                            "data-min-font-num": 10,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.selfPayAmt",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "）"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "1.综合医疗服务类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（1）一般医疗服务费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "08489a",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 7,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.ordnMedServfee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（2）一般治疗操作费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "90aff4",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 7,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.ordnTrtOprtFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（3）护理费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "2673a0",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 10,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.nursFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（4）其他费用："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "b07b60",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 12,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.comMedServOthFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "2.诊断类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（5）病理诊断费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3b8a3a",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.palgDiagFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（6）实验室诊断费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "dfbe33",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 9,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.labDiagFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（7）影像学诊断费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a4d055",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 9,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.rdhyDiagFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（8）临床诊断项目费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "16556c",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 9,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.clncDiseFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "3.治疗类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（9）非手术治疗项目费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "65d031",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.nsrgtrtItemFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（临床物理治疗费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "09c732",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 7,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.clncPhysTrtFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "）"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（10）手术治疗费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "d617c7",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.gtrtTrtFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（麻醉费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "c3f628",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 7,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.anstFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: " 手术费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "3f9064",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 7,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.rgtrtFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "）"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "4.康复类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（11）康复费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "39e40c",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 12,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.rhabFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "5.中医类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（12）中医治疗费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "b66de9",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 10,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.tcmTrtFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "6.西药类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（13）西药费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "de3dc9",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 12,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.wmFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（抗菌药物费用："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 27486,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.abtlMednFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "）"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "7.中药类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（14）中成药费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "e862ef",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 11,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.tcmpatFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（15）中草药费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "111bac",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.tcmherbFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "8.血液和血液制品类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（16）血费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "f9ef3c",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 5,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.bloFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（17）白蛋白类制品费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "29dcc8",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.albuFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（18）球蛋白类制品费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "eb70aa",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 9,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.glonFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（19）凝血因子类制品费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": 48637,
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 9,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.clotfacFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（20）细胞因子类制品费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a64120",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 10,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.cykiFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "9.耗材类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（21）检查用一次性医用材料费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "d824d9",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 10,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.examDspoMatlFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（22）治疗用一次性医用材料费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "2c86c2",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 9,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.trtDspoMatlFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（23）手术用一次性医用材料费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "a21eec",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.oprnDspoMatlFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "10.其他类："
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "（24）其他费："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "bea489",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": null,
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.othFee",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "​"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  attrs: {
                    colspan: 10,
                    rowspan: 1,
                    colwidth: [76, 86, 65, 54, 57, 58, 63, 58, 54, 105],
                    align: null
                  },
                  content: [
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "抗菌药物使用情况："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "7a9209",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "请选择",
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "emrDiagnosisRef.antimicrobialUse",
                            "data-options":
                              "%5B%7B%22label%22%3A%22i%E8%81%94%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22ii%E8%81%94%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22iii%E8%81%94%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22iv%E8%81%94%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%3Eiv%E8%81%94%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "输液反应："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "e20eb6",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "输液反应选择",
                            "data-min-font-num": 2,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.infusionReaction",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%9C%AA%E8%BE%93%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E6%9C%89%C2%A0%C2%A0%C2%A0%22%2C%22value%22%3A2%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          text: " 0.未输 1.无 2.有，引发的药物："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "d4c22f",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "引发药物",
                            "data-min-font-num": 18,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.initiatorDrug",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "临床表现："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "0eae4d",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "临床表现",
                            "data-min-font-num": 30,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.clinicalPicture",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "住院有无跌倒或坠床及伤害程度："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "21b2aa",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "请选择",
                            "data-min-font-num": 10,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.hospitalizationInjury",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E4%B8%80%E7%BA%A7%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E4%BA%8C%E7%BA%A7%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E4%B8%89%E7%BA%A7%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E6%9C%AA%E9%80%A0%E6%88%90%E4%BC%A4%E5%AE%B3%22%2C%22value%22%3A3%7D%2C%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A4%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          text: "1.一级 2.二级 3.三级 4.未造成伤害 5.无"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "跌倒或坠床的原因："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "dd77b9",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": null,
                            "data-min-font-num": 8,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.causeOfInjury",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E5%81%A5%E5%BA%B7%E5%8E%9F%E5%9B%A0%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E6%B2%BB%E7%96%97%E3%80%81%E8%8D%AF%E7%89%A9%E3%80%81%E9%BA%BB%E9%86%89%E5%8E%9F%E5%9B%A0%22%2C%22value%22%3A1%7D%2C%7B%22label%22%3A%22%E7%8E%AF%E5%A2%83%E5%9B%A0%E7%B4%A0%22%2C%22value%22%3A2%7D%2C%7B%22label%22%3A%22%E5%85%B6%E4%BB%96%E5%8E%9F%E5%9B%A0%22%2C%22value%22%3A3%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​ "
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            }
                          ],
                          text: "1.健康原因 2.治疗、药物、麻醉原因 3.环境因素 4.其他原因"
                        }
                      ]
                    },
                    {
                      type: "paragraph",
                      attrs: {
                        textAlign: "left"
                      },
                      content: [
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "医院感染情况："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "ddc0c8",
                            "data-extension-type": "field",
                            "data-widget-name": "选项下拉框",
                            "data-widget-type": "select",
                            "data-widget-type-name": "选择下拉框",
                            "data-placeholder": "请选择",
                            "data-min-font-num": 6,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.hospitalInfection",
                            "data-options":
                              "%5B%7B%22label%22%3A%22%E6%97%A0%22%2C%22value%22%3A0%7D%2C%7B%22label%22%3A%22%E6%9C%89%22%2C%22value%22%3A1%7D%5D",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          text: "1.无 2.有感染部位"
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "6b9ffb",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "感染部位",
                            "data-min-font-num": 20,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.siteOfInfection",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "SimSun, STSong",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "，医院感染名称："
                        },
                        {
                          type: "field",
                          attrs: {
                            "data-id": "5f5af0",
                            "data-extension-type": "field",
                            "data-widget-name": "文本输入",
                            "data-widget-type": "text",
                            "data-widget-type-name": "文本输入",
                            "data-placeholder": "医院感染名称",
                            "data-min-font-num": 20,
                            "data-group-id": "",
                            "data-checked": "",
                            "data-extension-value": "",
                            "data-readonly": "",
                            "data-required": "",
                            "data-required-warning": "",
                            "data-select-only": "",
                            "data-update-ignore": "",
                            "data-underline": 1,
                            "data-version-id": "",
                            "data-ref-key": "charge.nosocomialInfectionName",
                            "data-options": "",
                            "data-multiple": "",
                            "data-ref-key-index": 0,
                            "data-ref-key-attr": "",
                            "data-time-format": "",
                            "data-required-exp": ""
                          }
                        },
                        {
                          type: "text",
                          marks: [
                            {
                              type: "textStyle",
                              attrs: {
                                fontFamily: "",
                                fontSize: "11pt",
                                color: ""
                              }
                            },
                            {
                              type: "bold"
                            }
                          ],
                          text: "​"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "left"
          }
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "left"
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "说明：（一）医疗付费方式：1.城镇职工基本医疗保险 2.城镇居民基本医疗保险 3.新型农村合作医疗 4.贫困救助 5. 商业医疗保险 6.全公费 7.全自费 8.其他社会保险 9.其他"
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "left"
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    fontFamily: "SimSun, STSong",
                    fontSize: "11pt",
                    color: ""
                  }
                }
              ],
              text: "（二）凡可由医院信息系统提供住院费用清单的，住院病案首页中可不填写“住院费用”。"
            }
          ]
        }
      ]
    },
    templateSetting: {}
  }
};
