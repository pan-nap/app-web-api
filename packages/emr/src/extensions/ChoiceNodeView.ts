/**
 * 单选/复选控件节点视图（NodeView）
 *
 * 与下拉选择（浮层点选）不同：单选框/复选框将选项以「标记 + 文字」横向依次平铺展示；
 * - 设计态（编辑器可编辑）：点击标记切换选中值；点击选项文字就地编辑 label
 * - 只读态：纯静态展示，不响应交互
 * 多选值以逗号分隔字符串存入 extensionValue（如 "1,3"）。
 */
import type { NodeViewRendererProps } from "@tiptap/core";

/** 使用本视图渲染的控件类型 */
export const CHOICE_WIDGET_TYPES = ["radio", "checkbox"];

/** 解析多选值（逗号分隔字符串 → 值数组） */
function parseValues(value: string): string[] {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** 创建单选/复选控件节点视图 */
export const createChoiceNodeView = (props: NodeViewRendererProps) => {
  const { editor, getPos } = props;
  let node = props.node;

  const dom = document.createElement("span");
  dom.className = "emr-choice emr-variable";
  dom.setAttribute("contenteditable", "false");

  const itemsEl = document.createElement("span");
  itemsEl.className = "emr-choice-items";
  dom.appendChild(itemsEl);

  /** 设计态（编辑器可编辑）才允许切换选中/就地编辑 */
  const isEditable = () => editor.isEditable;

  /** 同步根节点 data-* 属性（供设计器点击选中、属性面板与打印识别） */
  function syncDataAttrs() {
    const attrs = node.attrs || {};
    const dataMap: Record<string, string> = {
      "data-ref-key": attrs.refKey || "",
      "data-widget-name": attrs.widgetName || "",
      "data-widget-type": attrs.widgetType || "",
      "data-placeholder": attrs.placeholder || "",
      "data-required": attrs.required ? "true" : "false",
      "data-required-level": attrs.requiredLevel || "none",
      "data-underline": attrs.underline ? "true" : "false",
      "data-readonly": attrs.readonly ? "true" : "false",
      "data-select-only": attrs.selectOnly ? "true" : "false"
    };
    Object.entries(dataMap).forEach(([key, value]) => dom.setAttribute(key, value));
    dom.classList.toggle("emr-variable-underline", !!attrs.underline);
  }

  /** 写回节点属性（触发视图 update 重渲染） */
  function dispatchAttrs(patch: Record<string, any>) {
    if (typeof getPos !== "function") return;
    const pos = getPos();
    if (typeof pos !== "number") return;
    editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...patch }));
  }

  /** 切换选中值：单选替换为单个值，多选以逗号分隔追加/移除 */
  function toggleValue(value: string) {
    if (!isEditable()) return;
    if (node.attrs.widgetType === "checkbox") {
      const values = parseValues(node.attrs.extensionValue);
      const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      dispatchAttrs({ extensionValue: next.join(",") });
      return;
    }
    // 单选：点击已选项不取消（标准单选行为）
    if (node.attrs.extensionValue !== value) {
      dispatchAttrs({ extensionValue: value });
    }
  }

  /** 就地编辑选项文字（仅设计态）；回车/失焦提交，Esc 取消 */
  function beginEditLabel(labelEl: HTMLElement, optionIndex: number) {
    if (!isEditable() || labelEl.isContentEditable) return;

    const originalText = labelEl.textContent || "";
    labelEl.contentEditable = "true";
    labelEl.classList.add("is-editing");
    labelEl.focus();

    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(labelEl);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const finish = (commit: boolean) => {
      labelEl.removeEventListener("keydown", handleKeydown);
      labelEl.removeEventListener("blur", handleBlur);
      labelEl.contentEditable = "false";
      labelEl.classList.remove("is-editing");

      const nextText = (labelEl.textContent || "").trim();
      const options = Array.isArray(node.attrs.options) ? [...node.attrs.options] : [];
      if (commit && nextText && nextText !== originalText && options[optionIndex]) {
        options[optionIndex] = { ...options[optionIndex], label: nextText };
        dispatchAttrs({ options });
        return;
      }
      // 未提交 / 未变更：还原原始文字（提交时会由 update 重渲染替换节点）
      labelEl.textContent = originalText;
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        finish(true);
      } else if (event.key === "Escape") {
        event.preventDefault();
        finish(false);
      }
    };
    const handleBlur = () => finish(true);

    labelEl.addEventListener("keydown", handleKeydown);
    labelEl.addEventListener("blur", handleBlur);
  }

  /** 渲染选项列表（标记 + 文字） */
  function renderItems() {
    syncDataAttrs();
    itemsEl.replaceChildren();

    const attrs = node.attrs || {};
    const options: Array<{ label: string; value: string }> = Array.isArray(attrs.options) ? attrs.options : [];
    const isCheckbox = attrs.widgetType === "checkbox";
    const selected = parseValues(attrs.extensionValue);

    if (options.length === 0) {
      // 无选项时降级为普通变量占位展示
      const emptyEl = document.createElement("span");
      emptyEl.className = "emr-choice-empty";
      emptyEl.textContent = attrs.placeholder || attrs.widgetName || "请配置选项";
      itemsEl.appendChild(emptyEl);
      return;
    }

    options.forEach((option, index) => {
      const value = String(option.value);
      const item = document.createElement("span");
      item.className = "emr-choice-item";
      item.setAttribute("data-value", value);
      if (selected.includes(value)) item.classList.add("is-checked");

      const mark = document.createElement("span");
      mark.className = `emr-choice-mark ${isCheckbox ? "is-checkbox" : "is-radio"}`;
      mark.setAttribute("contenteditable", "false");

      const label = document.createElement("span");
      label.className = "emr-choice-label";
      label.setAttribute("contenteditable", "false");
      label.textContent = option.label ?? value;

      item.append(mark, label);
      item.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (target.closest(".emr-choice-label")) {
          beginEditLabel(label, index);
          return;
        }
        toggleValue(value);
      });

      itemsEl.appendChild(item);
    });
  }

  renderItems();

  return {
    dom,
    update: (updatedNode: typeof node) => {
      if (updatedNode.type !== node.type) return false;
      // 控件类型已切走（单选/复选 → 其他）：返回 false 触发重建，回退默认渲染
      if (!CHOICE_WIDGET_TYPES.includes(updatedNode.attrs.widgetType)) return false;
      node = updatedNode;
      renderItems();
      return true;
    },
    // 控件内部交互（切换选中/编辑文字）由本视图自行处理，避免 ProseMirror 干预
    stopEvent: () => true,
    ignoreMutation: () => true
  };
};
