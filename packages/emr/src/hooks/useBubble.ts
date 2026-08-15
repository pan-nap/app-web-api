import { createVNode, render, nextTick, onBeforeUnmount } from "vue";
import { getAppContext } from "../index";

/** 气泡弹窗配置 */
interface BubbleOptions {
  /** 触发方式 */
  trigger?: "click" | "hover";
  /** 偏移量 */
  offset?: number;
  /** 层级 */
  zIndex?: number;
  /** 过渡动画 */
  transition?: string;
  /** 禁用 */
  disabled?: boolean;
  /** 容器自定义样式 */
  containerClass?: string;
  /** 不关闭的DOM选择器（class名） */
  noCloseClass?: string;
}

/** 气泡弹窗实例 */
interface BubbleInstance {
  /** 关闭弹窗 */
  close: () => void;
  /** 更新弹窗内容 */
  update: (content: any) => void;
  /** 获取显示状态 */
  isVisible: () => boolean;
}

/** 气泡弹窗位置信息 */
interface BubblePosition {
  x: number;
  y: number;
}

/**
 * 命令式气泡弹窗Hook
 * 通过函数调用方式弹起气泡，弹窗内容作为函数入参传递
 */
export const useBubble = () => {
  let currentBubble: BubbleInstance | null = null;
  let hoverTimer: number | null = null;

  /** 清理当前弹窗 */
  function closeBubble() {
    if (currentBubble) {
      currentBubble.close();
      currentBubble = null;
    }
  }

  /** 计算弹窗位置 */
  function calculatePosition(anchorEl: HTMLElement, popupEl: HTMLElement, offset: number): BubblePosition {
    const { left = 0, top = 0, height = 0 } = anchorEl.getBoundingClientRect();
    let x = left;
    let y = top + height + offset;

    const popupRect = popupEl.getBoundingClientRect();
    const popupWidth = popupRect.width;
    const popupHeight = popupRect.height;

    // 右侧超出视口
    const { innerWidth, innerHeight } = window;
    if (x + popupWidth > innerWidth) {
      x = innerWidth - popupWidth - 10;
    }

    // 底部超出视口，改为向上展开
    if (y + popupHeight > innerHeight) {
      y = top - popupHeight - offset;
    }

    // 左侧不能小于0
    if (x < 0) x = 10;

    return { x, y };
  }

  /**
   * 显示气泡弹窗
   * @param anchorEl 触发元素
   * @param content 弹窗内容（VNode、组件、渲染函数均可）
   * @param options 配置选项
   */
  function showBubble(anchorEl: HTMLElement, content: any, options: BubbleOptions = {}): BubbleInstance {
    if (options.disabled) return { close: () => {}, update: () => {}, isVisible: () => false };

    closeBubble();

    const { offset = 0, zIndex = 9999, transition = "all .15s ease", containerClass = "", noCloseClass = "no-close" } = options;

    const isVisible = { value: false };

    // 创建容器
    const container = document.createElement("div");
    container.className = `bubble-popup ${containerClass}`;
    container.style.cssText = `
      position: fixed;
      z-index: ${zIndex};
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
      overflow: hidden;
      transition: ${transition};
      opacity: 0;
    `;

    // 创建内容VNode并渲染
    function renderContent(contentArg: any) {
      let vnode;
      if (typeof contentArg === "function") {
        vnode = contentArg(close);
      } else if (contentArg && typeof contentArg === "object" && "__v_isVNode" in contentArg) {
        vnode = contentArg;
      } else {
        vnode = createVNode(contentArg, {});
      }

      const appContext = getAppContext();
      if (appContext) {
        vnode.appContext = appContext;
      }
      render(vnode, container);
    }

    renderContent(content);
    document.body.appendChild(container);

    // 计算位置并显示
    function applyPosition() {
      const pos = calculatePosition(anchorEl, container, offset);
      container.style.left = `${pos.x}px`;
      container.style.top = `${pos.y}px`;
    }

    // 动画展开
    function animateOpen() {
      const targetHeight = container.scrollHeight;
      container.style.height = "0px";
      container.style.opacity = "0";

      requestAnimationFrame(() => {
        container.style.height = `${targetHeight}px`;
        container.style.opacity = "1";
        applyPosition();

        setTimeout(() => {
          container.style.height = "auto";
        }, 200);
      });
    }

    // 动画关闭
    function animateClose(callback: () => void) {
      const currentHeight = container.offsetHeight;
      container.style.height = `${currentHeight}px`;

      requestAnimationFrame(() => {
        container.style.height = "0px";
        container.style.opacity = "0";
        setTimeout(callback, 200);
      });
    }

    isVisible.value = true;

    nextTick(() => {
      applyPosition();
      animateOpen();
    });

    /** 关闭弹窗 */
    function close() {
      if (!isVisible.value) return;
      isVisible.value = false;
      animateClose(() => {
        render(null, container);
        container.remove();
        document.removeEventListener("mousedown", handleOutsideClick);
        if (currentBubble?.close === close) {
          currentBubble = null;
        }
      });
    }

    /** 更新弹窗内容 */
    function update(newContent: any) {
      renderContent(newContent);
      nextTick(() => {
        applyPosition();
        if (container.style.height !== "auto") {
          container.style.height = "auto";
        }
      });
    }

    /** 点击外部关闭 */
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (container.contains(target)) return;
      if (anchorEl.contains(target)) return;
      if (target.closest(`.${noCloseClass}`)) return;
      close();
    }

    /** hover模式鼠标进入弹窗 */
    function handleMouseEnter() {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    }

    /** hover模式鼠标离开弹窗 */
    function handleMouseLeave() {
      hoverTimer = window.setTimeout(close, 100);
    }

    // 延迟绑定事件，避免触发时立即关闭
    setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 100);

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    const instance: BubbleInstance = {
      close,
      update,
      isVisible: () => isVisible.value
    };

    currentBubble = instance;
    return instance;
  }

  /**
   * 绑定hover触发
   * @param anchorEl 触发元素
   * @param getContent 获取弹窗内容的函数
   * @param options 配置选项
   */
  function bindHover(anchorEl: HTMLElement, getContent: () => any, options: BubbleOptions = {}) {
    function handleMouseEnter() {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      showBubble(anchorEl, getContent(), { ...options, trigger: "hover" });
    }

    function handleMouseLeave() {
      hoverTimer = window.setTimeout(closeBubble, 100);
    }

    anchorEl.addEventListener("mouseenter", handleMouseEnter);
    anchorEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      anchorEl.removeEventListener("mouseenter", handleMouseEnter);
      anchorEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }

  /**
   * 绑定click触发
   * @param anchorEl 触发元素
   * @param getContent 获取弹窗内容的函数
   * @param options 配置选项
   */
  function bindClick(anchorEl: HTMLElement, getContent: () => any, options: BubbleOptions = {}) {
    function handleClick(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (currentBubble?.isVisible()) {
        closeBubble();
      } else {
        showBubble(anchorEl, getContent(), { ...options, trigger: "click" });
      }
    }

    anchorEl.addEventListener("click", handleClick);
    return () => {
      anchorEl.removeEventListener("click", handleClick);
    };
  }

  onBeforeUnmount(() => {
    closeBubble();
    if (hoverTimer) clearTimeout(hoverTimer);
  });

  return {
    showBubble,
    closeBubble,
    bindHover,
    bindClick
  };
};
