import { Utils } from "hs-admin-ui";
import type { EmrElement } from "@cashier/emr";
import { DEFAULT_EDITOR_VALUE } from "@cashier/emr";
import EditorPopup from "./popup.vue";

export interface EditorPopupOptions {
  /** 文书名称 */
  name?: string;
  /** 文书类型 */
  docType?: "template" | "instance";
  /** 编辑模式：传入 row 表示编辑 */
  row?: {
    id: string;
    name: string;
    type: "template" | "instance";
    content: EmrElement[];
    patientId?: string;
  };
}

export function showPopup(options: EditorPopupOptions = {}): Promise<"confirm" | "cancel" | undefined> {
  return new Promise((resolve) => {
    Utils.showPopup(
      EditorPopup,
      {
        name: options.name ?? "",
        docType: options.docType ?? "template",
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
