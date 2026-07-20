// 组件
export { default as EmrEditor } from "./components/EmrEditor.vue";

// 类型
export type { EmrElement, DocumentRecord } from "./types/emr";

// 默认值
export const DEFAULT_EDITOR_VALUE = {
  type: "doc",
  content: []
};
