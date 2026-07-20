import { Node } from "@tiptap/core";

export const PageBreakExtension = Node.create({
  name: "pageBreak",
  group: "block",
  selectable: false,

  parseHTML() {
    return [
      { tag: "hr.page-break" },
      { tag: "div[data-page-break]" }
    ];
  },

  renderHTML() {
    return [
      "hr",
      {
        class: "page-break",
        "data-page-break": ""
      }
    ];
  }
});
