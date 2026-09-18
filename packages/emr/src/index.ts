import { App, AppContext } from "vue";
import "./style.css";
import "./assets/iconfont/iconfont.css";

import EmrEditor from "./components/EmrEditor.vue";
import EmrDesigner from "./components/EmrDesigner.vue";
import EmrPrintDialog from "./components/EmrPrintDialog.vue";
import type { EmrDesignerSavePayload } from "./components/EmrDesigner.vue";

export { EmrEditor, EmrDesigner, EmrPrintDialog };
export type { EmrDesignerSavePayload };

// 打印引擎（P2 真实切片分页 + 逐页固定纸张盒 + 页码）
export { printEmrDocument, buildPrintContainer, buildPageStyleText, getPaperDimensionsMm, saveEmrDocumentAsPdf } from "./utils/emrPrint";
export { paginatePrintPages } from "./utils/emrPagination";
export type { PrintPage, PrintParts } from "./utils/emrPagination";
export type { EmrPrintOptions } from "./utils/emrPrint";

interface PluginOptions {
  /**
   *
   * @param url 请求地址
   * @param params 请求参数
   * @param method 请求方式
   * @param option 扩展参数设置
   */
  request: (url: string, params: any, method?: string, config?: any) => Promise<any>;
  /**
   * 命令式标准弹窗（宿主注入 hs-admin-ui 的 Utils.showPopup）
   *
   * @param component 弹窗内容组件
   * @param props 传递给内容组件的 props（popupPlugin 会自动注入 close）
   * @param config 弹窗外壳配置（title/width/height/showFooter/success 等）
   * @returns 关闭弹窗的函数
   */
  showPopup: (component: any, props: Record<string, any>, config: Record<string, any>) => () => Promise<any>;
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
  AttrChange,
  PageSettings,
  PageOrientation,
  PageSize,
  RequiredLevel
} from "./types";

export { DEFAULT_PAGE_SETTINGS, PAGE_SIZE_DIMENSIONS } from "./types";
