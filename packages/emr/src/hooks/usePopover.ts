// import { defineComponent, ref, watch, nextTick, onBeforeUnmount, h, Teleport, Transition, type PropType, type VNode, type Ref } from "vue";
// import { createPopper, type Instance, type Placement } from "@popperjs/core";

// type TriggerType = "click" | "hover" | "focus";

// // ---------- 全局事件委托 ----------
// type PopoverContext = {
//   id: symbol;
//   triggerRef: Ref<HTMLElement | null>;
//   popperRef: Ref<HTMLElement | null>;
//   close: () => void;
//   noCloseClass?: string;
//   isActive: () => boolean;
// };

// const popoverRegistry = new Set<PopoverContext>();
// let globalListenerCount = 0;

// const globalClickHandler = (e: MouseEvent) => {
//   const target = e.target as HTMLElement;
//   for (const ctx of popoverRegistry) {
//     if (!ctx.isActive()) continue;
//     const trigger = ctx.triggerRef.value;
//     const popper = ctx.popperRef.value;
//     if (trigger?.contains(target) || popper?.contains(target)) continue;
//     if (ctx.noCloseClass && target.closest(`.${ctx.noCloseClass}`)) continue;
//     ctx.close();
//   }
// };

// const addGlobalListener = () => {
//   if (globalListenerCount === 0) {
//     document.addEventListener("mousedown", globalClickHandler);
//   }
//   globalListenerCount++;
// };

// const removeGlobalListener = () => {
//   globalListenerCount--;
//   if (globalListenerCount === 0) {
//     document.removeEventListener("mousedown", globalClickHandler);
//   }
// };

// // ---------- 组件定义 ----------
// export default defineComponent({
//   name: "LazyPopover",
//   props: {
//     trigger: {
//       type: String as PropType<TriggerType>,
//       default: "hover",
//       validator: (v: string) => ["click", "hover", "focus"].includes(v)
//     },
//     placement: { type: String as PropType<Placement>, default: "bottom" },
//     visible: { type: Boolean, default: false },
//     disabled: { type: Boolean, default: false },
//     offset: { type: Number, default: 10 },
//     showAfter: { type: Number, default: 0 },
//     hideAfter: { type: Number, default: 0 },
//     autoClose: { type: Number, default: 0 },
//     popperClass: { type: String, default: "" },
//     width: { type: [String, Number] as PropType<string | number>, default: "" },
//     appendToBody: { type: Boolean, default: true },
//     content: { type: String, default: "" },
//     closeOnClickOutside: { type: Boolean, default: true },
//     noCloseClass: { type: String, default: "" }
//   },
//   emits: ["update:visible", "show", "hide"],

//   setup(props, { emit, slots, expose }) {
//     const internalVisible = ref(props.visible);
//     const triggerRef: Ref<HTMLElement | null> = ref(null);
//     const popperRef: Ref<HTMLElement | null> = ref(null);

//     let popperInstance: Instance | null = null;
//     let showTimer: ReturnType<typeof setTimeout> | null = null;
//     let hideTimer: ReturnType<typeof setTimeout> | null = null;
//     let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;
//     let hoverHideTimer: ReturnType<typeof setTimeout> | null = null;

//     const ctx: PopoverContext = {
//       id: Symbol("popover"),
//       triggerRef,
//       popperRef,
//       close: () => hide(),
//       noCloseClass: props.noCloseClass,
//       isActive: () => internalVisible.value && props.closeOnClickOutside
//     };

//     const clearAllTimers = () => {
//       if (showTimer) {
//         clearTimeout(showTimer);
//         showTimer = null;
//       }
//       if (hideTimer) {
//         clearTimeout(hideTimer);
//         hideTimer = null;
//       }
//       if (autoCloseTimer) {
//         clearTimeout(autoCloseTimer);
//         autoCloseTimer = null;
//       }
//       if (hoverHideTimer) {
//         clearTimeout(hoverHideTimer);
//         hoverHideTimer = null;
//       }
//     };

//     const createPopperInstance = () => {
//       if (!triggerRef.value || !popperRef.value) return;
//       if (popperInstance) {
//         popperInstance.destroy();
//         popperInstance = null;
//       }
//       popperInstance = createPopper(triggerRef.value, popperRef.value, {
//         placement: props.placement,
//         modifiers: [
//           { name: "offset", options: { offset: [0, props.offset] } },
//           { name: "flip" },
//           { name: "preventOverflow", options: { boundary: "viewport" } },
//           {
//             name: "computeStyles",
//             options: { gpuAcceleration: false }
//           }
//         ]
//       });
//     };

//     const destroyPopperInstance = () => {
//       if (popperInstance) {
//         popperInstance.destroy();
//         popperInstance = null;
//       }
//     };

//     const show = () => {
//       if (props.disabled) return;
//       clearAllTimers();
//       if (props.showAfter > 0) {
//         showTimer = setTimeout(() => {
//           internalVisible.value = true;
//         }, props.showAfter);
//       } else {
//         internalVisible.value = true;
//       }
//     };

//     const hide = () => {
//       if (props.disabled) return;
//       clearAllTimers();
//       if (props.hideAfter > 0) {
//         hideTimer = setTimeout(() => {
//           internalVisible.value = false;
//         }, props.hideAfter);
//       } else {
//         internalVisible.value = false;
//       }
//     };

//     const scheduleHoverHide = () => {
//       if (props.trigger !== "hover") return;
//       if (hoverHideTimer) clearTimeout(hoverHideTimer);
//       hoverHideTimer = setTimeout(() => {
//         hide();
//         hoverHideTimer = null;
//       }, 150);
//     };

//     const cancelHoverHide = () => {
//       if (hoverHideTimer) {
//         clearTimeout(hoverHideTimer);
//         hoverHideTimer = null;
//       }
//     };

//     const toggle = () => {
//       if (internalVisible.value) hide();
//       else show();
//     };

//     expose({ show, hide, toggle });

//     watch(
//       () => props.visible,
//       (val) => {
//         if (val !== internalVisible.value) {
//           internalVisible.value = val;
//         }
//       }
//     );

//     watch(internalVisible, (newVal) => {
//       emit("update:visible", newVal);
//       if (newVal) {
//         emit("show");
//         nextTick(() => {
//           createPopperInstance();
//           if (props.autoClose > 0) {
//             clearAllTimers();
//             autoCloseTimer = setTimeout(() => {
//               hide();
//             }, props.autoClose);
//           }
//           if (props.closeOnClickOutside) {
//             if (!popoverRegistry.has(ctx)) {
//               popoverRegistry.add(ctx);
//               addGlobalListener();
//             }
//           }
//         });
//       } else {
//         emit("hide");
//         destroyPopperInstance();
//         clearAllTimers();
//         if (popoverRegistry.has(ctx)) {
//           popoverRegistry.delete(ctx);
//           removeGlobalListener();
//         }
//       }
//     });

//     onBeforeUnmount(() => {
//       destroyPopperInstance();
//       clearAllTimers();
//       if (popoverRegistry.has(ctx)) {
//         popoverRegistry.delete(ctx);
//         removeGlobalListener();
//       }
//     });

//     // ---- 事件处理器 ----
//     const onTriggerClick = () => {
//       if (props.trigger === "click") toggle();
//     };
//     const onTriggerMouseEnter = () => {
//       if (props.trigger === "hover") {
//         cancelHoverHide();
//         show();
//       }
//     };
//     const onTriggerMouseLeave = () => {
//       if (props.trigger === "hover") {
//         scheduleHoverHide();
//       }
//     };
//     const onTriggerFocus = () => {
//       if (props.trigger === "focus") show();
//     };
//     const onTriggerBlur = () => {
//       if (props.trigger === "focus") hide();
//     };
//     const onContentEnter = () => {
//       if (props.trigger === "hover") {
//         cancelHoverHide();
//         if (!internalVisible.value) {
//           internalVisible.value = true;
//         }
//       }
//     };
//     const onContentLeave = () => {
//       if (props.trigger === "hover") {
//         scheduleHoverHide();
//       }
//     };

//     // ---- 渲染函数（作用域插槽） ----
//     return (): VNode[] => {
//       const scope = {
//         visible: internalVisible.value,
//         show: internalVisible.value,
//         open: show,
//         close: hide,
//         toggle
//       };

//       const referenceSlot = slots.reference ? slots.reference(scope) : null;
//       const defaultSlot = slots.default ? slots.default(scope) : null;
//       const contentSlot = slots.content ? slots.content(scope) : null;
//       const contentChildren = defaultSlot || contentSlot || props.content;

//       const referenceNode = h(
//         "span",
//         {
//           ref: triggerRef,
//           class: "lazy-popover__reference",
//           onClick: onTriggerClick,
//           onMouseenter: onTriggerMouseEnter,
//           onMouseleave: onTriggerMouseLeave,
//           onFocus: onTriggerFocus,
//           onBlur: onTriggerBlur
//         },
//         [referenceSlot]
//       );

//       let popoverNode: VNode | null = null;
//       if (internalVisible.value) {
//         const contentVNode = h(
//           "div",
//           {
//             ref: popperRef,
//             class: ["lazy-popover", props.popperClass],
//             style: {
//               width: props.width ? (typeof props.width === "number" ? props.width + "px" : props.width) : ""
//             },
//             onMouseenter: onContentEnter,
//             onMouseleave: onContentLeave
//           },
//           contentChildren
//         );

//         const transitionNode = h(
//           Transition,
//           {
//             name: "popover",
//             appear: true
//           },
//           { default: () => contentVNode }
//         );

//         popoverNode = props.appendToBody ? h(Teleport, { to: "body" }, [transitionNode]) : transitionNode;
//       }

//       return [referenceNode, popoverNode as VNode];
//     };
//   }
// });
