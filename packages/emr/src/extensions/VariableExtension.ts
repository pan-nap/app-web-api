import { Node } from "@tiptap/core";

export const VariableExtension = Node.create({
  name: "variable",
  group: "inline",
  inline: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      refKey: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-ref-key") || "",
        renderHTML: (attributes) => {
          return { "data-ref-key": attributes.refKey };
        }
      },
      widgetName: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-widget-name") || "",
        renderHTML: (attributes) => {
          return { "data-widget-name": attributes.widgetName };
        }
      },
      widgetType: {
        default: "text",
        parseHTML: (element) => element.getAttribute("data-widget-type") || "text",
        renderHTML: (attributes) => {
          return { "data-widget-type": attributes.widgetType };
        }
      },
      extensionValue: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-extension-value") || "",
        renderHTML: (attributes) => {
          return { "data-extension-value": attributes.extensionValue };
        }
      },
      options: {
        default: [],
        parseHTML: (element) => {
          const optionsStr = element.getAttribute("data-options");
          if (!optionsStr) return [];
          try {
            const decoded = decodeURIComponent(optionsStr);
            return JSON.parse(decoded);
          } catch {
            return [];
          }
        },
        renderHTML: (attributes) => {
          return { "data-options": JSON.stringify(attributes.options) };
        }
      },
      required: {
        default: false,
        parseHTML: (element) => {
          const required = element.getAttribute("data-required") || element.getAttribute("data-required-warning") || "";
          return required !== "";
        },
        renderHTML: (attributes) => {
          return { "data-required": attributes.required ? "true" : "false" };
        }
      }
    };
  },

  parseHTML() {
    return [{ tag: "span[data-ref-key]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const label = node.attrs.widgetName || node.attrs.refKey;
    let displayValue = node.attrs.extensionValue;

    const options = node.attrs.options;
    if (node.attrs.widgetType === "select" && options && Array.isArray(options)) {
      const option = options.find((opt: any) => String(opt.value) === String(displayValue));
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
