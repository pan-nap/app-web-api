import { Utils } from "hs-admin-ui";
import popup from "./popup.vue";

export function showDetail(row: any) {
  return new Promise((resolve) => {
    Utils.showPopup(
      popup,
      { row },
      {
        title: "订单详情",
        success: ({ data }) => resolve(data),
        showFooter: false,
        width: "900px"
      }
    );
  });
}