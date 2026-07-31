import { createVNode, render, nextTick, onBeforeUnmount } from "vue";
import DatePickerWrapper from "../components/DatePickerWrapper.vue";
import SelectWrapper from "../components/SelectWrapper.vue";
import InputWrapper from "../components/InputWrapper.vue";
import { getAppContext } from "../index";

/** 通用组件选择器配置 */
interface PickerConfig {
  containerStyle?: string;
  width?: number;
}

/** 通用组件选择器实例 */
interface PickerInstance {
  cleanup: () => void;
}

export const useComponentPicker = () => {
  let currentPicker: PickerInstance | null = null;

  /** 清理当前选择器 */
  function cleanupPicker() {
    if (currentPicker) {
      currentPicker.cleanup();
      currentPicker = null;
    }
  }

  /** 创建动态组件选择器 */
  function createPicker(Component: any, props: Record<string, any>, anchorEl: HTMLElement, config: PickerConfig = {}): PickerInstance {
    cleanupPicker();

    const rect = anchorEl.getBoundingClientRect();
    const { containerStyle, width } = config;

    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      z-index: 9999;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      ${width ? `width: ${width}px;` : ""}
      ${containerStyle || ""}
    `;

    const vnode = createVNode(Component, props);
    const appContext = getAppContext();
    if (appContext) {
      vnode.appContext = appContext;
    }

    render(vnode, container);
    document.body.appendChild(container);

    nextTick(() => {
      const input = container.querySelector("input");
      if (input) {
        input.focus();
      }
    });

    function handleOutsideClick(e: MouseEvent) {
      if (!container.contains(e.target as Node)) {
        cleanup();
      }
    }

    function cleanup() {
      render(null, container);
      container.remove();
      document.removeEventListener("mousedown", handleOutsideClick);
      if (currentPicker?.cleanup === cleanup) {
        currentPicker = null;
      }
    }

    setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 100);

    const instance: PickerInstance = { cleanup };
    currentPicker = instance;
    return instance;
  }

  /** 启动日期选择器 */
  function startDatePicker(anchorEl: HTMLElement, currentValue: string, onChange: (value: string) => void, valueFormat: string = "YYYY-MM-DD") {
    return createPicker(
      DatePickerWrapper,
      {
        modelValue: currentValue,
        valueFormat,
        "onUpdate:modelValue": onChange,
        onChange
      },
      anchorEl,
      { width: 180 }
    );
  }

  /** 启动下拉选择器 */
  function startSelectPicker(
    anchorEl: HTMLElement,
    currentValue: string,
    options: { value: string; label: string }[],
    onChange: (value: string) => void
  ) {
    return createPicker(
      SelectWrapper,
      {
        modelValue: currentValue,
        options,
        "onUpdate:modelValue": onChange,
        onChange
      },
      anchorEl,
      { width: 180 }
    );
  }

  /** 启动文本/数字输入选择器 */
  function startInputPicker(
    anchorEl: HTMLElement,
    currentValue: string,
    onChange: (value: string) => void,
    inputType: "text" | "number" = "text",
    onEnter?: (value: string) => void,
    onEsc?: () => void
  ) {
    const anchorWidth = Math.max(anchorEl.getBoundingClientRect().width, 30);
    return createPicker(
      InputWrapper,
      {
        modelValue: currentValue,
        type: inputType,
        minWidth: anchorWidth,
        "onUpdate:modelValue": onChange,
        onChange,
        onEnter: (val: string) => {
          onEnter?.(val);
        },
        onEsc: () => {
          onEsc?.();
        },
        onBlur: (val: string) => {
          onChange(val);
        }
      },
      anchorEl,
      {}
    );
  }

  onBeforeUnmount(() => {
    cleanupPicker();
  });

  return {
    cleanupPicker,
    startDatePicker,
    startSelectPicker,
    startInputPicker
  };
};
