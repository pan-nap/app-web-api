import { onMounted, onBeforeUnmount } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { EmrEditorProps } from "../types";
import { useComponentPicker } from "./useComponentPicker";

export const useVariableEditing = (editor: { value: Editor | undefined }, props: EmrEditorProps) => {
  const { cleanupPicker, startDatePicker, startSelectPicker, startInputPicker } = useComponentPicker();

  /** 缓存的编辑器 DOM 引用（卸载时使用，避免访问已销毁的 editor.view） */
  let contentElement: HTMLElement | null = null;

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
        const currentValue = node.attrs.extensionValue || "";

        if (isSelect) {
          event.preventDefault();
          startSelectPicker(variableSpan as HTMLElement, currentValue, options, (val) => updateVariableValue(refKey, val));
        } else if (isDate) {
          event.preventDefault();
          startDatePicker(variableSpan as HTMLElement, currentValue, (val) => updateVariableValue(refKey, val));
        } else if (isNumber) {
          event.preventDefault();
          startInputPicker(variableSpan as HTMLElement, currentValue, (val) => updateVariableValue(refKey, val), "number");
        } else {
          event.preventDefault();
          startInputPicker(variableSpan as HTMLElement, currentValue, (val) => updateVariableValue(refKey, val), "text");
        }

        return false;
      }
      return true;
    });
  }

  onMounted(() => {
    if (props.disabled) return;
    contentElement = editor.value?.view?.dom as HTMLElement | null;
    contentElement?.addEventListener("click", handleVariableClick);
  });

  onBeforeUnmount(() => {
    cleanupPicker();
    // 使用缓存的 DOM 引用，不再访问 editor.value.view（卸载时编辑器可能已销毁）
    contentElement?.removeEventListener("click", handleVariableClick);
    contentElement = null;
  });

  return {};
};
