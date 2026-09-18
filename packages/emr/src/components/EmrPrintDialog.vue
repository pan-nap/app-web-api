<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="emr-print-dialog__content">
      <!-- 纸张预览（与打印输出同源的标准打印 DOM） -->
      <div ref="bodyRef" class="emr-print-dialog__body">
        <div class="emr-print-dialog__scaled" :style="{ width: sheetWidth * scale + 'px', height: sheetHeight * scale + 'px' }">
          <div class="emr-print-dialog__scaler" :style="{ transform: `scale(${scale})` }">
            <div ref="mountRef" class="emr-print-dialog__mount"></div>
          </div>
        </div>
      </div>

      <!-- 打印设置面板（对齐华速 DocumentPrintOptions，目标打印机仅浏览器打印 / 另存 PDF） -->
      <aside class="emr-print-options">
        <div class="emr-print-options__body">
          <div class="emr-print-options__title">打印</div>
          <section class="emr-print-options__section">
            <div class="emr-print-options__field">
              <label class="emr-print-options__label">目标打印机</label>
              <el-select v-model="target" size="default">
                <el-option label="浏览器打印" value="browser" />
                <el-option label="另存为 PDF" value="pdf" />
              </el-select>
            </div>

            <div class="emr-print-options__field">
              <label class="emr-print-options__label">尺寸和布局</label>
              <div class="emr-print-options__layout">
                <el-select v-model="options.pageSize" size="default">
                  <el-option v-for="p in pageSizeOptions" :key="p" :label="p" :value="p" />
                </el-select>
                <el-select v-model="options.orientation" size="default">
                  <el-option label="纵向" value="portrait" />
                  <el-option label="横向" value="landscape" />
                </el-select>
              </div>
            </div>

            <div class="emr-print-options__field">
              <label class="emr-print-options__label">打印份数</label>
              <el-input-number v-model="options.copies" :min="1" :max="99" :precision="0" size="default" controls-position="right" />
            </div>

            <el-collapse v-model="moreSettings" class="emr-print-options__more">
              <el-collapse-item title="更多设置" name="margins">
                <div class="emr-print-options__margin-unit">边距（mm）</div>
                <div class="emr-print-options__margins">
                  <label class="emr-print-options__margin">
                    <span class="emr-print-options__margin-label">上边距</span>
                    <el-input-number v-model="options.marginTop" :min="0" size="default" controls-position="right" />
                  </label>
                  <label class="emr-print-options__margin">
                    <span class="emr-print-options__margin-label">下边距</span>
                    <el-input-number v-model="options.marginBottom" :min="0" size="default" controls-position="right" />
                  </label>
                  <label class="emr-print-options__margin">
                    <span class="emr-print-options__margin-label">左边距</span>
                    <el-input-number v-model="options.marginLeft" :min="0" size="default" controls-position="right" />
                  </label>
                  <label class="emr-print-options__margin">
                    <span class="emr-print-options__margin-label">右边距</span>
                    <el-input-number v-model="options.marginRight" :min="0" size="default" controls-position="right" />
                  </label>
                </div>
              </el-collapse-item>
            </el-collapse>
          </section>
        </div>
      </aside>
    </div>

    <footer class="flex items-center justify-end h-16 gap-3 px-3">
      <div class="flex items-center">
        <hs-button :disabled="busy" @click="props.close('cancel')">取消</hs-button>
        <bc-button type="primary" :loading="busy" @click="submit">{{ actionText }}</bc-button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import type { PageSettings, PageSize, PageOrientation } from "../types";
import { buildPrintContainer, printEmrDocument, saveEmrDocumentAsPdf } from "../utils/emrPrint";

const props = defineProps<{
  close: (data?: "confirm" | "cancel") => void;
  /** 打印内容源：编辑器 .emr-content 元素 */
  source: HTMLElement | null;
  /** 文书页面设置（纸张、方向、边距） */
  settings: PageSettings | null;
}>();

const bodyRef = ref<HTMLElement | null>(null);
const mountRef = ref<HTMLElement | null>(null);
const scale = ref(1);
const sheetWidth = ref(0);
const sheetHeight = ref(0);
const busy = ref(false);

/** 输出目标：浏览器打印 / 另存为 PDF（不对接桌面打印助手，故无真实系统打印机） */
const target = ref<"browser" | "pdf">("browser");
/** 折叠面板默认收起，与华速一致 */
const moreSettings = ref<string[]>([]);

/** 本地可编辑设置（初始值来自文书 PageSettings），改动即时驱动预览重渲染 */
const options = reactive({
  pageSize: (props.settings?.pageSize ?? "A4") as PageSize,
  orientation: (props.settings?.orientation ?? "portrait") as PageOrientation,
  copies: 1,
  marginTop: props.settings?.marginTop ?? 15,
  marginBottom: props.settings?.marginBottom ?? 15,
  marginLeft: props.settings?.marginLeft ?? 15,
  marginRight: props.settings?.marginRight ?? 15
});

const PAGE_SIZES: PageSize[] = ["A4", "A5", "B5", "Letter"];
const pageSizeOptions = computed<PageSize[]>(() => (PAGE_SIZES.includes(options.pageSize) ? PAGE_SIZES : [...PAGE_SIZES, options.pageSize]));

/** 合并文书原始设置与本地覆盖，作为预览/输出的最终设置 */
const effectiveSettings = computed<PageSettings | null>(() => {
  if (!props.settings) return null;
  return {
    ...props.settings,
    pageSize: options.pageSize,
    orientation: options.orientation,
    marginTop: options.marginTop,
    marginBottom: options.marginBottom,
    marginLeft: options.marginLeft,
    marginRight: options.marginRight
  };
});

const actionText = computed(() => (target.value === "pdf" ? "另存为 PDF" : "打印"));

/** 预览挂载后的标准打印 DOM（非响应式，仅手动管理） */
let previewEl: HTMLElement | null = null;

function clearPreview() {
  previewEl?.remove();
  previewEl = null;
  sheetWidth.value = 0;
  sheetHeight.value = 0;
  scale.value = 1;
}

/** 以打印同源的标准 DOM 渲染多页纸张预览 */
async function renderPreview() {
  clearPreview();
  const settings = effectiveSettings.value;
  if (!props.source || !settings || !mountRef.value) return;
  previewEl = await buildPrintContainer(props.source, settings);
  mountRef.value.appendChild(previewEl);
  await nextTick();
  measureSheet();
  updateScale();
  // 字体迟到会改变内容高度，就绪后再量一次
  document.fonts.ready.then(() => {
    measureSheet();
    updateScale();
  });
}

function measureSheet() {
  if (!previewEl) return;
  sheetWidth.value = previewEl.offsetWidth;
  sheetHeight.value = previewEl.offsetHeight;
}

/** 纸张超出预览区时等比缩小，最大 100% */
function updateScale() {
  const available = (bodyRef.value?.clientWidth ?? 0) - 16;
  if (!sheetWidth.value || available <= 0) return;
  scale.value = Math.min(1, available / sheetWidth.value);
}

/** 执行输出：浏览器打印或另存 PDF，完成后以 confirm 关闭弹窗 */
const submit = async () => {
  const settings = effectiveSettings.value;
  if (!props.source || !settings || busy.value) return;
  busy.value = true;
  try {
    if (target.value === "pdf") {
      await saveEmrDocumentAsPdf(props.source, settings, { copies: options.copies, fileName: "文书" });
    } else {
      await printEmrDocument(props.source, settings, { copies: options.copies });
    }
    props.close("confirm");
  } finally {
    busy.value = false;
  }
};

// 影响纸张盒模型的设置变化即时重渲染预览（份数不影响单页预览，故不监听）
watch(
  () => [options.pageSize, options.orientation, options.marginTop, options.marginBottom, options.marginLeft, options.marginRight],
  () => {
    renderPreview();
  }
);

onMounted(() => {
  renderPreview();
  window.addEventListener("resize", updateScale);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScale);
  clearPreview();
});
</script>

<style scoped>
.emr-print-dialog__content {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 272px;
  overflow: hidden;
}

.emr-print-dialog__body {
  min-width: 0;
  overflow: auto;
  background: #eef1f5;
  padding: 24px;
  box-sizing: border-box;
}

.emr-print-dialog__scaled {
  margin: 0 auto;
  position: relative;
}

.emr-print-dialog__scaler {
  transform-origin: top left;
  position: absolute;
  top: 0;
  left: 0;
}

.emr-print-dialog__mount :deep(.emr-print-page) {
  margin: 0 auto 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

/* ===== 右侧设置面板（对齐华速 DocumentPrintOptions） ===== */
.emr-print-options {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: #fff;
  border-left: 1px solid #e5e8ed;
}

.emr-print-options__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.emr-print-options__title {
  padding: 18px 14px 2px;
  font-size: 16px;
  line-height: 24px;
  color: #30343b;
}

.emr-print-options__section {
  padding: 0 14px 16px;
}

.emr-print-options__field {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 5px;
  min-height: 0;
}

.emr-print-options__field:first-of-type {
  margin-top: 12px;
}

.emr-print-options__field + .emr-print-options__field {
  margin-top: 12px;
}

.emr-print-options__label {
  font-size: 12px;
  line-height: 18px;
  color: #5d6673;
}

.emr-print-options__layout {
  display: flex;
  gap: 6px;
}

.emr-print-options__layout :deep(.el-select) {
  flex: 1;
  min-width: 0;
}

.emr-print-options__more {
  margin-top: 12px;
  padding-top: 4px;
  border: 0;
  border-top: 1px dashed #e5e8ed;
}

.emr-print-options__more :deep(.el-collapse-item__header) {
  height: 36px;
  border-bottom: 0;
  font-size: 12px;
  font-weight: 500;
  color: #30343b;
}

.emr-print-options__more :deep(.el-collapse-item__wrap) {
  border-bottom: 0;
}

.emr-print-options__more :deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

.emr-print-options__margin-unit {
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 18px;
  color: #5d6673;
}

.emr-print-options__margins {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.emr-print-options__margin {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.emr-print-options__margin-label {
  font-size: 12px;
  line-height: 18px;
  color: #5d6673;
}

.emr-print-options :deep(.el-input-number),
.emr-print-options :deep(.el-select) {
  width: 100%;
}
</style>
