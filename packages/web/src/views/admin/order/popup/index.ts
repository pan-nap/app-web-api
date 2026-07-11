import { Utils } from "hs-admin-ui";
import popup from "./popup.vue";

export function showPopup(row?: any) {
  return new Promise((resolve) => {
    Utils.showPopup(
      popup,
      { row },
      {
        title: row ? "编辑订单" : "创建订单",
        success: ({ data }) => resolve(data),
        showFooter: false
      }
    );
  });
}