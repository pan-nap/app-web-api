import { Utils } from "hs-admin-ui";
import type { VariableDef } from "@/types/emr";
import VariableSelectPopup from "./popup.vue";

export function showVariableSelectPopup(): Promise<VariableDef | undefined> {
  return new Promise((resolve) => {
    Utils.showPopup(
      VariableSelectPopup,
      {},
      {
        title: "选择变量",
        showFooter: false,
        success: ({ data }: { data?: "cancel" | VariableDef }) => {
          if (data === "cancel") {
            resolve(undefined);
          } else {
            resolve(data);
          }
        },
        onClose: () => resolve(undefined)
      }
    );
  });
}
