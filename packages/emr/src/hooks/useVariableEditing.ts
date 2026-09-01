import { onMounted, onBeforeUnmount } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { EmrEditorProps } from "../types";
import { useComponentPicker } from "./useComponentPicker";

export const useVariableEditing = (editor: { value: Editor | undefined }, props: EmrEditorProps) => {
  const { cleanupPicker, startDatePicker, startSelectPicker, startInputPicker } = useComponentPicker();

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
          event.stopPropagation();
          startSelectPicker(variableSpan as HTMLElement, currentValue, options, (val) => updateVariableValue(refKey, val));
        } else if (isDate) {
          event.preventDefault();
          event.stopPropagation();
          startDatePicker(variableSpan as HTMLElement, currentValue, (val) => updateVariableValue(refKey, val));
        } else if (isNumber) {
          event.preventDefault();
          event.stopPropagation();
          startInputPicker(variableSpan as HTMLElement, currentValue, (val) => updateVariableValue(refKey, val), "number");
        } else {
          event.preventDefault();
          event.stopPropagation();
          startInputPicker(variableSpan as HTMLElement, currentValue, (val) => updateVariableValue(refKey, val), "text");
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
    const contentElement = editor.value?.view?.dom as HTMLElement | null;
    contentElement?.removeEventListener("click", handleVariableClick);
  });

  return {};
};
