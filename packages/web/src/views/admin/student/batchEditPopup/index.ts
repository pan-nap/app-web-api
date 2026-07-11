import { Utils } from "hs-admin-ui";
import type { Student } from "@/types";
import popup from "./popup.vue";

export function showBatchEditPopup(rows: Student[]) {
  return new Promise((resolve) => {
    Utils.showPopup(
      popup,
      { rows },
      {
        title: "批量修改",
        width: "400px",
        height: "300px",
        success: ({ data }) => resolve(data),
        showFooter: false
      }
    );
  });
}
