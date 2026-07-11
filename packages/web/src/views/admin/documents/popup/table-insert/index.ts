import { Utils } from "hs-admin-ui";
import TableInsertPopup from "./popup.vue";

export interface TableSize {
  rows: number;
  cols: number;
}

export function showTableInsertPopup(): Promise<TableSize | undefined> {
  return new Promise((resolve) => {
    Utils.showPopup(
      TableInsertPopup,
      {},
      {
        title: "插入表格",
        showFooter: false,
        success: ({ data }: { data?: "cancel" | TableSize }) => {
          if (data !== "cancel") resolve(data);
          else resolve(undefined);
        },
        onClose: () => resolve(undefined)
      }
    );
  });
}
