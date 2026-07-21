import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { VariableChange } from "../types/emr";
import { getValueByPath } from "../utils/templateUtils";

export const useVariableEditing = (editor: { value: Editor | undefined }) => {
  const showDropdown = ref(false);
  const dropdownOptions = ref<{ value: string; label: string }[]>([]);
  const dropdownCurrentValue = ref("");
  const dropdownRefKey = ref("");
  const dropdownPosition = reactive({ x: 0, y: 0 });

  const dropdownStyle = computed(() => ({
    left: `${dropdownPosition.x}px`,
    top: `${dropdownPosition.y}px`
  }));

  const handleVariableClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const variableSpan = target.closest(".emr-variable");

    if (!variableSpan || !editor.value) {
      showDropdown.value = false;
      return;
    }

    const refKey = variableSpan.getAttribute("data-ref-key");
    if (!refKey) return;

    editor.value.state.doc.descendants((node, pos) => {
      if (node.type.name === "variable" && node.attrs.refKey === refKey) {
        const widgetType = node.attrs.widgetType || "text";
        const options = node.attrs.options || [];
        const hasDropdown = widgetType === "select" && options.length > 0;

        if (hasDropdown) {
          event.preventDefault();
          event.stopPropagation();

          dropdownOptions.value = options;
          dropdownCurrentValue.value = node.attrs.extensionValue || "";
          dropdownRefKey.value = refKey;

          const rect = variableSpan.getBoundingClientRect();
          dropdownPosition.x = rect.left;
          dropdownPosition.y = rect.bottom;
          showDropdown.value = true;
        } else {
          startInlineEdit(variableSpan as HTMLElement, refKey, node.attrs.extensionValue || "");
        }

        return false;
      }
      return true;
    });
  };

  const startInlineEdit = (span: HTMLElement, refKey: string, currentValue: string) => {
    const rect = span.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(span);

    const input = document.createElement("input");
    input.type = "text";
    input.value = currentValue;

    input.style.position = "fixed";
    input.style.left = `${rect.left}px`;
    input.style.top = `${rect.top}px`;
    input.style.minWidth = `${Math.max(rect.width, 30)}px`;
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

    const finishEdit = (save: boolean) => {
      if (save) {
        updateVariableValue(refKey, input.value.trim());
      }
      input.remove();
    };

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
  };

  const updateVariableValue = (refKey: string, value: string) => {
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
  };

  const handleDropdownSelect = (option: { value: string; label: string }) => {
    if (!editor.value || !dropdownRefKey.value) return;

    const transaction = editor.value.state.tr;

    editor.value.state.doc.descendants((node, pos) => {
      if (node.type.name === "variable" && node.attrs.refKey === dropdownRefKey.value) {
        transaction.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          extensionValue: String(option.value)
        });
        return false;
      }
      return true;
    });

    editor.value.view.dispatch(transaction);
    showDropdown.value = false;
  };

  const compareVariables = (originalData: Record<string, any>): VariableChange[] => {
    if (!editor.value) return [];

    const changes: VariableChange[] = [];

    editor.value.state.doc.descendants((node) => {
      if (node.type.name === "variable") {
        const refKey = node.attrs.refKey;
        if (refKey) {
          const currentValue = node.attrs.extensionValue || "";
          const oldValue = getValueByPath(originalData, refKey) || "";

          if (currentValue !== oldValue) {
            changes.push({
              refKey,
              widgetName: node.attrs.widgetName || refKey,
              oldValue,
              newValue: currentValue
            });
          }
        }
      }

      return true;
    });

    return changes;
  };

  const getVariables = (): Record<string, any> => {
    if (!editor.value) return {};

    const variables: Record<string, any> = {};

    editor.value.state.doc.descendants((node) => {
      if (node.type.name === "variable") {
        const refKey = node.attrs.refKey;
        if (refKey) {
          const value = node.attrs.extensionValue || "";
          const parts = refKey.split(".");
          let current = variables;

          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
              current[part] = value;
            } else {
              if (!current[part]) {
                current[part] = {};
              }
              current = current[part];
            }
          }
        }
      }

      return true;
    });

    return variables;
  };

  const updateVariables = (data: Record<string, any>) => {
    if (!editor.value) return;

    const transaction = editor.value.state.tr;

    editor.value.state.doc.descendants((node, pos) => {
      if (node.type.name === "variable") {
        const refKey = node.attrs.refKey;
        if (refKey) {
          const newValue = getValueByPath(data, refKey);
          if (newValue !== undefined && newValue !== node.attrs.extensionValue) {
            transaction.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              extensionValue: String(newValue)
            });
          }
        }
      }
      return true;
    });

    editor.value.view.dispatch(transaction);
  };

  onMounted(() => {
    const contentElement = editor.value?.view?.dom;
    contentElement?.addEventListener("click", handleVariableClick);
  });
  onBeforeUnmount(() => {
    const contentElement = editor.value?.view?.dom;
    contentElement?.removeEventListener("click", handleVariableClick);
  });

  return {
    showDropdown,
    dropdownOptions,
    dropdownCurrentValue,
    dropdownStyle,
    handleVariableClick,
    handleDropdownSelect,
    compareVariables,
    getVariables,
    updateVariables
  };
};
