import { Utils } from "hs-admin-ui";
import type { DocNode } from "@cashier/emr";
import popup from "./popup.vue";

export interface EditorPopupOptions {
  /** 文书名称 */
  name?: string;
  /** 编辑模式：传入 row 表示编辑 */
  row?: {
    id: string;
    name: string;
    content: DocNode;
  };
}

export function showPopup(options: EditorPopupOptions = {}): Promise<"confirm" | "cancel" | undefined> {
  return new Promise((resolve) => {
    Utils.showPopup(
      popup,
      {
        name: options.name ?? "",
        row: options.row
      },
      {
        title: options.row ? "编辑文书" : "新建文书",
        fullscreen: true,
        showFooter: false,
        success: ({ data }: any) => resolve(data),
        onClose: () => resolve("cancel")
      }
    );
  });
}
