import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import type { Editor } from "@tiptap/vue-3";

export const useVariableEditing = (editor: { value: Editor | undefined }) => {
  const showDropdown = ref(false);
  const dropdownOptions = ref<{ value: string; label: string }[]>([]);
  const dropdownCurrentValue = ref("");
  const dropdownRefKey = ref("");
  const dropdownPosition = reactive({ x: 0, y: 0 });
  let dropdownContainer: HTMLElement | null = null;

  function createDropdown() {
    if (dropdownContainer) return;

    dropdownContainer = document.createElement("div");
    dropdownContainer.className = "emr-dropdown-overlay";
    dropdownContainer.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: none;
    `;

    const menu = document.createElement("div");
    menu.className = "emr-dropdown-menu";
    menu.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: 30px;
      padding: 4px 0;
      font-size: 14px;
      max-height: 240px;
      overflow-y: auto;
    `;

    dropdownContainer.appendChild(menu);
    document.body.appendChild(dropdownContainer);

    dropdownContainer.addEventListener("click", (e) => {
      if (e.target === dropdownContainer) {
        closeDropdown();
      }
    });
  }

  function renderDropdown() {
    if (!dropdownContainer) return;

    const menu = dropdownContainer.querySelector(".emr-dropdown-menu") as HTMLElement;
    if (!menu) return;

    menu.innerHTML = "";

    dropdownOptions.value.forEach((option) => {
      const item = document.createElement("div");
      item.className = `emr-dropdown-item${String(option.value) === String(dropdownCurrentValue.value) ? " emr-dropdown-item-selected" : ""}`;
      item.textContent = option.label;
      item.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        color: ${String(option.value) === String(dropdownCurrentValue.value) ? "#0369a1" : "#374151"};
        white-space: nowrap;
        background-color: ${String(option.value) === String(dropdownCurrentValue.value) ? "#e0f2fe" : ""};
      `;
      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "#f3f4f6";
      });
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = String(option.value) === String(dropdownCurrentValue.value) ? "#e0f2fe" : "";
      });
      item.addEventListener("click", () => handleDropdownSelect(option));
      menu.appendChild(item);
    });

    dropdownContainer.style.display = "block";
    menu.style.left = `${dropdownPosition.x}px`;
    menu.style.top = `${dropdownPosition.y}px`;
  }

  function closeDropdown() {
    showDropdown.value = false;
    if (dropdownContainer) {
      dropdownContainer.style.display = "none";
    }
  }

  function handleVariableClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const variableSpan = target.closest(".emr-variable");

    if (!variableSpan || !editor.value) {
      closeDropdown();
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

          createDropdown();
          renderDropdown();
        } else {
          startInlineEdit(variableSpan as HTMLElement, refKey, node.attrs.extensionValue || "");
        }

        return false;
      }
      return true;
    });
  }

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

  function handleDropdownSelect(option: { value: string; label: string }) {
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
    closeDropdown();
  }

  onMounted(() => {
    const contentElement = editor.value?.view?.dom as HTMLElement | null;
    contentElement?.addEventListener("click", handleVariableClick);
  });

  onBeforeUnmount(() => {
    if (dropdownContainer) {
      document.body.removeChild(dropdownContainer);
      dropdownContainer = null;
    }
  });

  return {
    showDropdown,
    dropdownOptions,
    dropdownCurrentValue,
    handleDropdownSelect
  };
};
