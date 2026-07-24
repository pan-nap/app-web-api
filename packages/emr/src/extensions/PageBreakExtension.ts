import { Node } from "@tiptap/core";

export const PageBreakExtension = Node.create({
  name: "pageBreak",
  group: "block",
  selectable: false,

  parseHTML() {
    return [{ tag: "div.page-break" }, { tag: "hr.page-break" }];
  },

  renderHTML() {
    return [
      "div",
      {
        class: "page-break",
        "data-page-break": ""
      },
      ["span", { class: "page-break-text" }, "分页符"]
    ];
  }
});
