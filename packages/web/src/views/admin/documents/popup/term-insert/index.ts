import { Utils } from "hs-admin-ui";
import TermInsertPopup from "./popup.vue";

export function showTermInsertPopup(): Promise<string | undefined> {
  return new Promise((resolve) => {
    Utils.showPopup(
      TermInsertPopup,
      {},
      {
        title: "常用病历术语",
        showFooter: false,
        success: ({ data }: { data?: "cancel" | string }) => {
          if (data !== "cancel") resolve(data);
          else resolve(undefined);
        },
        onClose: () => resolve(undefined)
      }
    );
  });
}
