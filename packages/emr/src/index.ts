import { App, AppContext } from "vue";

import EmrEditor from "./components/EmrEditor.vue";
import EmrDesigner from "./components/EmrDesigner.vue";
import type { EmrDesignerSavePayload } from "./components/EmrDesigner.vue";

export { EmrEditor, EmrDesigner };
export type { EmrDesignerSavePayload };

interface PluginOptions {
  /**
   *
   * @param url 请求地址
   * @param params 请求参数
   * @param method 请求方式
   * @param option 扩展参数设置
   */
  request: (url: string, params: any, method?: string, config?: any) => Promise<any>;
}
let PluginItem: PluginOptions | undefined;
let appContext: AppContext;

export function emrEditor(app: App, options?: PluginOptions) {
  app.component("EmrEditor", EmrEditor);
  app.component("EmrDesigner", EmrDesigner);
  appContext = app._context;
  PluginItem = options;
}

export function getPluginItem() {
  return PluginItem;
}

export function getAppContext() {
  return appContext;
}

// 类型
export type {
  EmrElement,
  DocNode,
  EmrNode,
  TextNode,
  ParagraphNode,
  VariableFieldNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  TableHeaderNode,
  PageBreakNode,
  HeadingNode,
  MarkNode,
  MarkType,
  ParagraphAttrs,
  VariableFieldAttrs,
  TableCellAttrs,
  HeadingAttrs,
  TextStyleMarkAttrs,
  EmrEditorProps,
  VariableOption,
  InsertVariableOptions,
  ComponentItem,
  DataField,
  DragPayload,
  VariableChange,
  TemplateContent,
  DocumentRecord,
  AttrChange
} from "./types";
