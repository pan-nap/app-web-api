import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { EmrEditorProps } from "../types";
import { useComponentPicker } from "./useComponentPicker";

export const useVariableEditing = (editor: { value: Editor | undefined }, props: EmrEditorProps) => {
  const { cleanupPicker, startDatePicker, startSelectPicker } = useComponentPicker();

  /** 启动数字编辑模式，创建数字输入框 */
  function startNumberEdit(span: HTMLElement, refKey: string, currentValue: string) {
    const rect = span.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(span);

    const input = document.createElement("input");
    input.type = "number";
    input.value = currentValue;
    input.style.position = "fixed";
    input.style.left = `${rect.left}px`;
    input.style.top = `${rect.top}px`;
    const minWidth = Math.max(rect.width, 60);
    input.style.width = `${minWidth}px`;
    input.style.minWidth = `${minWidth}px`;
    input.style.height = `${rect.height}px`;
    input.style.zIndex = "9999";
    input.style.border = "none";
    input.style.borderBottom = "1px solid #000";
    input.style.outline = "none";
    input.style.background = "#dcfce7";
    input.style.fontSize = computedStyle.fontSize;
    input.style.fontFamily = computedStyle.fontFamily;
    input.style.fontWeight = computedStyle.fontWeight;
    input.style.lineHeight = computedStyle.lineHeight;
    input.style.color = "#000";
    input.style.textAlign = "center";
    input.style.padding = "0 4px";
    input.style.margin = "0";
    input.style.boxSizing = "border-box";

    const measureEl = document.createElement("span");
    measureEl.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: pre;
      font-size: ${computedStyle.fontSize};
      font-family: ${computedStyle.fontFamily};
      font-weight: ${computedStyle.fontWeight};
      padding: 0 4px;
      box-sizing: border-box;
    `;
    document.body.appendChild(measureEl);

    function updateInputWidth() {
      measureEl.textContent = input.value || " ";
      const textWidth = measureEl.getBoundingClientRect().width;
      input.style.width = `${Math.max(textWidth, minWidth)}px`;
    }

    updateInputWidth();

    function finishEdit(save: boolean) {
      if (save) {
        updateVariableValue(refKey, input.value);
      }
      measureEl.remove();
      input.remove();
    }

    input.addEventListener("input", updateInputWidth);
    input.addEventListener("blur", () => finishEdit(true));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finishEdit(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        finishEdit(false);
      }
    });

    document.body.appendChild(input);
    input.focus();
    input.select();
  }

  /** 启动内联文本编辑模式，创建输入框替代变量显示 */
  function startInlineEdit(span: HTMLElement, refKey: string, currentValue: string) {
    const rect = span.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(span);

    const input = document.createElement("input");
    input.type = "text";
    input.value = currentValue;
    input.style.position = "fixed";
    input.style.left = `${rect.left}px`;
    input.style.top = `${rect.top}px`;
    const minWidth = Math.max(rect.width, 30);
    input.style.width = `${minWidth}px`;
    input.style.minWidth = `${minWidth}px`;
    input.style.height = `${rect.height}px`;
    input.style.zIndex = "9999";
    input.style.border = "none";
    input.style.borderBottom = "1px solid #000";
    input.style.outline = "none";
    input.style.background = "#fef3c7";
    input.style.fontSize = computedStyle.fontSize;
    input.style.fontFamily = computedStyle.fontFamily;
    input.style.fontWeight = computedStyle.fontWeight;
    input.style.lineHeight = computedStyle.lineHeight;
    input.style.color = "#000";
    input.style.textAlign = "center";
    input.style.padding = "0 4px";
    input.style.margin = "0";
    input.style.boxSizing = "border-box";

    const measureEl = document.createElement("span");
    measureEl.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: pre;
      font-size: ${computedStyle.fontSize};
      font-family: ${computedStyle.fontFamily};
      font-weight: ${computedStyle.fontWeight};
      letter-spacing: ${computedStyle.letterSpacing};
      padding: 0 4px;
      box-sizing: border-box;
    `;
    document.body.appendChild(measureEl);

    function updateInputWidth() {
      measureEl.textContent = input.value || " ";
      const textWidth = measureEl.getBoundingClientRect().width;
      input.style.width = `${Math.max(textWidth, minWidth)}px`;
    }

    updateInputWidth();

    function finishEdit(save: boolean) {
      if (save) {
        updateVariableValue(refKey, input.value.trim());
      }
      measureEl.remove();
      input.remove();
    }

    input.addEventListener("blur", () => finishEdit(true));
    input.addEventListener("input", updateInputWidth);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finishEdit(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        finishEdit(false);
      }
    });

    document.body.appendChild(input);
    input.focus();
    input.select();
  }

  /** 更新指定变量的值 */
  function updateVariableValue(refKey: string, value: string) {
    if (!editor.value) return;

    const transaction = editor.value.state.tr;

    editor.value.state.doc.descendants((node, pos) => {
      if (node.type.name === "variable" && node.attrs.refKey === refKey) {
        transaction.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          extensionValue: value
        });
        return false;
      }
      return true;
    });

    editor.value.view.dispatch(transaction);
  }

  /** 处理变量点击事件，区分不同类型的编辑方式 */
  function handleVariableClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const variableSpan = target.closest(".emr-variable");

    if (!variableSpan || !editor.value) {
      cleanupPicker();
      return;
    }

    const refKey = variableSpan.getAttribute("data-ref-key");
    if (!refKey) return;

    editor.value.state.doc.descendants((node, pos) => {
      if (node.type.name === "variable" && node.attrs.refKey === refKey) {
        const widgetType = node.attrs.widgetType || "text";
        const options = node.attrs.options || [];
        const isSelect = widgetType === "select" && options.length > 0;
        const isDate = widgetType === "date";
        const isNumber = widgetType === "number";

        if (isSelect) {
          event.preventDefault();
          event.stopPropagation();
          startSelectPicker(variableSpan as HTMLElement, node.attrs.extensionValue || "", options, (val) => updateVariableValue(refKey, val));
        } else if (isDate) {
          event.preventDefault();
          event.stopPropagation();
          startDatePicker(variableSpan as HTMLElement, node.attrs.extensionValue || "", (val) => updateVariableValue(refKey, val));
        } else if (isNumber) {
          event.preventDefault();
          event.stopPropagation();
          startNumberEdit(variableSpan as HTMLElement, refKey, node.attrs.extensionValue || "");
        } else {
          startInlineEdit(variableSpan as HTMLElement, refKey, node.attrs.extensionValue || "");
        }

        return false;
      }
      return true;
    });
  }

  onMounted(() => {
    if (props.disabled) return;
    const contentElement = editor.value?.view?.dom as HTMLElement | null;
    contentElement?.addEventListener("click", handleVariableClick);
  });

  onBeforeUnmount(() => {
    cleanupPicker();
  });

  return {};
};
