import { Utils } from "hs-admin-ui";
import popup from "./popup.vue";

export function showPopup(row?: any) {
  return new Promise((resolve) => {
    Utils.showPopup(
      popup,
      { row },
      {
        title: row ? "编辑员工" : "新增员工",
        success: ({ data }) => resolve(data),
        showFooter: false
      }
    );
  });
}