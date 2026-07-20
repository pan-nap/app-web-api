import { Node } from "@tiptap/core";

export const VariableExtension = Node.create({
  name: "variable",
  group: "inline",
  inline: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      varKey: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-var-key"),
        renderHTML: (attributes) => {
          return { "data-var-key": attributes.varKey };
        }
      },
      varLabel: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-var-label"),
        renderHTML: (attributes) => {
          return { "data-var-label": attributes.varLabel };
        }
      },
      varDataType: {
        default: "text",
        parseHTML: (element) => element.getAttribute("data-var-type") || "text",
        renderHTML: (attributes) => {
          return { "data-var-type": attributes.varDataType };
        }
      },
      varValue: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-var-value"),
        renderHTML: (attributes) => {
          return { "data-var-value": attributes.varValue };
        }
      },
      options: {
        default: [],
        parseHTML: (element) => {
          const optionsStr = element.getAttribute("data-options");
          return optionsStr ? JSON.parse(optionsStr) : [];
        },
        renderHTML: (attributes) => {
          return { "data-options": JSON.stringify(attributes.options) };
        }
      },
      required: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-required") === "true",
        renderHTML: (attributes) => {
          return { "data-required": attributes.required ? "true" : "false" };
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-var-key]"
      }
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const label = node.attrs.varLabel || node.attrs.varKey;
    let displayValue = node.attrs.varValue;

    if (node.attrs.varDataType === "radio" && node.attrs.options && Array.isArray(node.attrs.options)) {
      const option = node.attrs.options.find((opt: any) => opt.value === displayValue);
      if (option) {
        displayValue = option.label;
      }
    }

    if (!displayValue) {
      displayValue = `[${label}]`;
    }

    return [
      "span",
      {
        ...HTMLAttributes,
        class: "emr-variable",
        contenteditable: "false"
      },
      displayValue
    ];
  }
});
