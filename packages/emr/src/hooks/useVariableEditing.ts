import { ref, reactive, onMounted, onBeforeUnmount, createVNode, render, nextTick } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { EmrEditorProps } from "../types";
import DatePickerWrapper from "../components/DatePickerWrapper.vue";
import SelectWrapper from "../components/SelectWrapper.vue";
import { getAppContext } from "../index";

export const useVariableEditing = (editor: { value: Editor | undefined }, props: EmrEditorProps) => {
  let selectContainer: HTMLElement | null = null;

  /** 启动下拉选择编辑模式，使用 ElSelect 组件 */
  function startSelectEdit(span: HTMLElement, refKey: string, currentValue: string, options: { value: string; label: string }[]) {
    if (selectContainer) {
      cleanupSelect();
    }

    const rect = span.getBoundingClientRect();

    selectContainer = document.createElement("div");
    selectContainer.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      z-index: 9999;
      background: #fff;
      padding: 4px;
      border-radius: 4px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    `;

    const vnode = createVNode(SelectWrapper, {
      modelValue: currentValue,
      options,
      "onUpdate:modelValue": (val: string) => {
        updateVariableValue(refKey, val);
      },
      onChange: (val: string) => {
        updateVariableValue(refKey, val);
      }
    });

    const appContext = getAppContext();
    if (appContext) {
      vnode.appContext = appContext;
    }

    render(vnode, selectContainer);
    document.body.appendChild(selectContainer);

    nextTick(() => {
      const input = selectContainer?.querySelector("input");
      if (input) {
        input.focus();
      }
    });

    setTimeout(() => {
      document.addEventListener("mousedown", handleSelectOutsideClick);
    }, 100);
  }

  /** 清理选择器容器 */
  function cleanupSelect() {
    if (selectContainer) {
      render(null, selectContainer);
      selectContainer.remove();
      selectContainer = null;
      document.removeEventListener("mousedown", handleSelectOutsideClick);
    }
  }

  /** 处理选择器外部点击 */
  function handleSelectOutsideClick(e: MouseEvent) {
    if (selectContainer && !selectContainer.contains(e.target as Node)) {
      cleanupSelect();
    }
  }

  /** 启动日期编辑模式，使用 ElDatePicker 组件 */
  function startDateEdit(span: HTMLElement, refKey: string, currentValue: string) {
    const rect = span.getBoundingClientRect();

    // 创建容器
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: 150px;
      z-index: 9999;
      background: #fff;
      padding: 4px;
      border-radius: 4px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    `;

    // 创建虚拟节点
    const vnode = createVNode(DatePickerWrapper, {
      modelValue: currentValue,
      valueFormat: "YYYY-MM-DD",
      "onUpdate:modelValue": (val: string) => {
        updateVariableValue(refKey, val);
      },
      onChange: (val: string) => {
        updateVariableValue(refKey, val);
        cleanup();
      }
    });

    // 获取 appContext 以确保组件正确渲染
    const appContext = getAppContext();
    if (appContext) {
      vnode.appContext = appContext;
    }

    // 渲染到容器
    render(vnode, container);
    document.body.appendChild(container);

    // 聚焦到输入框
    nextTick(() => {
      const input = container.querySelector("input");
      if (input) {
        input.focus();
        input.select();
      }
    });

    function cleanup() {
      render(null, container);
      container.remove();
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    function handleOutsideClick(e: MouseEvent) {
      if (!container.contains(e.target as Node)) {
        cleanup();
      }
    }

    // 点击外部关闭
    setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 100);
  }

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
      cleanupSelect();
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
          startSelectEdit(variableSpan as HTMLElement, refKey, node.attrs.extensionValue || "", options);
        } else if (isDate) {
          event.preventDefault();
          event.stopPropagation();
          startDateEdit(variableSpan as HTMLElement, refKey, node.attrs.extensionValue || "");
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
    cleanupSelect();
  });

  return {};
};
