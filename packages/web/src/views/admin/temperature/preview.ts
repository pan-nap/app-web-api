/** 免登录预览入口：直接挂载体温单 canvas，用于验证实际绘制效果 */
import { renderTemperatureSheet } from "./renderer";
import { mockSheetData } from "./mock";

const canvas = document.getElementById("sheet") as HTMLCanvasElement;
renderTemperatureSheet(canvas, mockSheetData);
