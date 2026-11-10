<template>
  <div class="pacs-page">
    <div class="toolbar">
      <el-button-group>
        <el-button
          v-for="t in operationTools"
          :key="t.name"
          :type="activeTool === t.name ? 'primary' : 'default'"
          size="small"
          @click="setActiveTool(t.name)"
        >
          {{ t.label }}
        </el-button>
      </el-button-group>
      <el-divider direction="vertical" />
      <el-button-group>
        <el-button
          v-for="t in annotationTools"
          :key="t.name"
          :type="activeTool === t.name ? 'primary' : 'default'"
          size="small"
          @click="setActiveTool(t.name)"
        >
          {{ t.label }}
        </el-button>
      </el-button-group>
      <el-divider direction="vertical" />
      <el-button size="small" @click="resetView">重置视图</el-button>
      <el-button size="small" type="success" :loading="saving" @click="saveAnnotations">保存批注</el-button>
      <el-button size="small" @click="reloadAnnotations">复现批注</el-button>
      <el-button size="small" type="danger" @click="clearAnnotations">清空批注</el-button>
    </div>

    <div class="info-bar">
      <el-tag size="small">{{ patientInfo || "未加载" }}</el-tag>
      <el-select
        v-model="currentSeriesUid"
        size="small"
        class="series-select"
        placeholder="选择序列"
        @change="selectSeries"
      >
        <el-option
          v-for="s in seriesList"
          :key="s.seriesInstanceUid"
          :label="`${s.modality || '?'} · ${s.numberOfInstances} 幅`"
          :value="s.seriesInstanceUid"
        />
      </el-select>
      <el-select
        v-model="currentWindowIndex"
        size="small"
        class="window-select"
        placeholder="窗宽窗位"
        @change="applyWindow"
      >
        <el-option v-for="(w, i) in windowPresets" :key="i" :label="w.label" :value="String(i)" />
      </el-select>
      <el-tag size="small" type="info">切片 {{ currentSlice }} / {{ totalSlices }}</el-tag>
      <el-tag size="small" type="warning">工具：{{ activeToolLabel }}</el-tag>
      <span class="status">{{ statusText }}</span>
      <span class="hint">左键操作 · 右键缩放 · 中键平移 · 滚轮翻片</span>
    </div>

    <div v-loading="loading" class="viewer-wrap">
      <div ref="viewerRef" class="viewer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { HsMessage } from "hs-admin-ui";
import { init as coreInit, RenderingEngine, Enums as csEnums, Types as csTypes, metaData } from "@cornerstonejs/core";
import {
  init as toolsInit,
  addTool,
  ToolGroupManager,
  Enums as csToolsEnums,
  annotation,
  WindowLevelTool,
  PanTool,
  ZoomTool,
  StackScrollTool,
  LengthTool,
  AngleTool,
  EllipticalROITool,
  RectangleROITool,
  ArrowAnnotateTool,
  BidirectionalTool
} from "@cornerstonejs/tools";
import dicomImageLoader from "@cornerstonejs/dicom-image-loader";
import { usePacsStore, buildImageId } from "@/stores/pacs";

const pacsStore = usePacsStore();

const RENDERING_ENGINE_ID = "pacsEngine";
const VIEWPORT_ID = "pacsStack";
const TOOL_GROUP_ID = "pacsToolGroup";

const ALL_TOOLS = [
  WindowLevelTool,
  PanTool,
  ZoomTool,
  StackScrollTool,
  LengthTool,
  AngleTool,
  EllipticalROITool,
  RectangleROITool,
  ArrowAnnotateTool,
  BidirectionalTool
];
// 可绑定到左键的工具（操作 + 批注）
const PRIMARY_TOOLS = [
  WindowLevelTool,
  LengthTool,
  AngleTool,
  EllipticalROITool,
  RectangleROITool,
  ArrowAnnotateTool,
  BidirectionalTool
];

const operationTools = [
  { name: WindowLevelTool.toolName, label: "窗宽窗位" },
  { name: PanTool.toolName, label: "平移" },
  { name: ZoomTool.toolName, label: "缩放" }
];
const annotationTools = [
  { name: LengthTool.toolName, label: "长度" },
  { name: AngleTool.toolName, label: "角度" },
  { name: EllipticalROITool.toolName, label: "椭圆ROI" },
  { name: RectangleROITool.toolName, label: "矩形ROI" },
  { name: ArrowAnnotateTool.toolName, label: "箭头标注" },
  { name: BidirectionalTool.toolName, label: "双向径线" }
];

const viewerRef = ref<HTMLDivElement>();
const loading = ref(true);
const saving = ref(false);
const statusText = ref("初始化中...");
const patientInfo = ref("");
const currentSlice = ref(1);
const totalSlices = ref(0);
const seriesList = ref<any[]>([]);
const currentSeriesUid = ref("");
const windowPresets = ref<{ label: string; center: number; width: number }[]>([]);
const currentWindowIndex = ref("0");
const activeTool = ref(WindowLevelTool.toolName);

const activeToolLabel = computed(() => {
  const all = [...operationTools, ...annotationTools];
  return all.find((t) => t.name === activeTool.value)?.label || activeTool.value;
});

let renderingEngine: RenderingEngine | null = null;
let viewport: csTypes.IStackViewport | null = null;
let toolGroup: ReturnType<typeof ToolGroupManager.createToolGroup> = null;
let currentStudyUid = "";
let imageIds: string[] = [];
let imageIdToSop: Record<string, string> = {};

// Cornerstone 全局初始化（仅一次）
let csReady = false;
async function ensureInit() {
  if (csReady) return;
  await coreInit();
  await toolsInit();
  dicomImageLoader.init({ maxWebWorkers: 1, useLegacyMetadataProvider: true });
  ALL_TOOLS.forEach((t) => addTool(t));
  csReady = true;
}

function setActiveTool(toolName: string) {
  if (!toolGroup) return;
  PRIMARY_TOOLS.forEach((t) => toolGroup!.setToolPassive(t.toolName));
  toolGroup.setToolActive(toolName, {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }]
  });
  activeTool.value = toolName;
}

function onStackNewImage(e: Event) {
  const idx = (e as CustomEvent).detail?.imageIdIndex ?? 0;
  currentSlice.value = idx + 1;
}

async function setupViewer() {
  await ensureInit();
  const element = viewerRef.value!;
  renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID);
  renderingEngine.enableElement({
    viewportId: VIEWPORT_ID,
    type: csEnums.ViewportType.STACK,
    element,
    defaultOptions: { background: [0, 0, 0] }
  });
  viewport = renderingEngine.getViewport(VIEWPORT_ID) as csTypes.IStackViewport;

  toolGroup = ToolGroupManager.createToolGroup(TOOL_GROUP_ID);
  ALL_TOOLS.forEach((t) => toolGroup!.addTool(t.toolName));
  toolGroup.addViewport(VIEWPORT_ID, RENDERING_ENGINE_ID);
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Auxiliary }]
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Secondary }]
  });
  toolGroup.setToolActive(StackScrollTool.toolName, {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Wheel }]
  });
  setActiveTool(WindowLevelTool.toolName);

  element.addEventListener(csEnums.Events.STACK_NEW_IMAGE, onStackNewImage);
}

async function loadStudy() {
  loading.value = true;
  try {
    const studies = await pacsStore.getStudies();
    if (studies.length > 0) {
      currentStudyUid = studies[0].studyInstanceUid;
      const detail = await pacsStore.getStudy(currentStudyUid);
      seriesList.value = (detail.series || []) as any[];
      patientInfo.value = `${detail.patientName || ""} / ${detail.patientId || ""}`;
    } else {
      const seed = await pacsStore.seedDemo();
      currentStudyUid = seed.studyInstanceUid;
      seriesList.value = [
        {
          seriesInstanceUid: seed.seriesInstanceUid,
          modality: "CT",
          numberOfInstances: seed.instances.length,
          instances: seed.instances.map((i, idx) => ({
            sopInstanceUid: i.sopInstanceUid,
            instanceNumber: idx + 1
          }))
        }
      ];
      patientInfo.value = "Demo^Patient / DEMO-0001";
    }

    const primary = [...seriesList.value].sort(
      (a, b) => (b.numberOfInstances || 0) - (a.numberOfInstances || 0)
    )[0];
    if (!primary) {
      statusText.value = "无可用序列";
      return;
    }
    await selectSeries(primary.seriesInstanceUid);
    await reloadAnnotations();
    statusText.value = "就绪";
  } catch (e: any) {
    statusText.value = "加载失败";
    HsMessage.error("影像加载失败：" + (e?.message || e));
    console.error("[PACS] loadStudy error:", e);
  } finally {
    loading.value = false;
  }
}

async function selectSeries(seriesUid: string) {
  const series = seriesList.value.find((s) => s.seriesInstanceUid === seriesUid);
  if (!series || !viewport) return;
  currentSeriesUid.value = seriesUid;
  const instances = [...(series.instances || [])].sort(
    (a: any, b: any) => (a.instanceNumber || 0) - (b.instanceNumber || 0)
  );
  const sopUids = instances.map((i: any) => i.sopInstanceUid);
  imageIds = sopUids.map((s) => buildImageId(currentStudyUid, s));
  imageIdToSop = Object.fromEntries(imageIds.map((id, i) => [id, sopUids[i]]));
  totalSlices.value = imageIds.length;
  currentSlice.value = 1;
  await viewport.setStack(imageIds, 0);
  readWindowPresets();
  applyWindow(0);
  viewport.render();
}

const toArray = (v: any) => (Array.isArray(v) ? v : v == null ? [] : [v]);

function readWindowPresets() {
  windowPresets.value = [];
  currentWindowIndex.value = "0";
  if (!imageIds.length) return;
  const voi = metaData.get("voiLutModule", imageIds[0]) as any;
  const centers = toArray(voi?.windowCenter);
  const widths = toArray(voi?.windowWidth);
  const n = Math.min(centers.length, widths.length);
  for (let i = 0; i < n; i++) {
    const center = Number(centers[i]);
    const width = Number(widths[i]);
    if (!Number.isFinite(center) || !Number.isFinite(width) || width <= 0) continue;
    windowPresets.value.push({ label: `窗位 ${center} / 窗宽 ${width}`, center, width });
  }
}

function applyWindow(index: number | string) {
  const w = windowPresets.value[Number(index)];
  currentWindowIndex.value = String(index);
  if (!w || !viewport) return;
  viewport.setProperties({ voiRange: { lower: w.center - w.width / 2, upper: w.center + w.width / 2 } });
  viewport.render();
}

async function reloadAnnotations() {
  try {
    const records = await pacsStore.getAnnotations(currentStudyUid);
    const element = viewerRef.value!;
    for (const r of records) {
      const payload: any = r.payload;
      const currentImageId = buildImageId(currentStudyUid, r.sopUid);
      if (payload?.metadata) payload.metadata.referencedImageId = currentImageId;
      try {
        annotation.state.addAnnotation(payload, element);
      } catch (err) {
        console.warn("[PACS] 恢复批注失败:", err);
      }
    }
    viewport?.render();
  } catch (e: any) {
    console.warn("[PACS] 加载批注失败:", e);
  }
}

async function saveAnnotations() {
  saving.value = true;
  try {
    const all = (annotation.state.getAllAnnotations() || []) as any[];
    const records = all
      .map((a) => {
        const imageId = a.metadata?.referencedImageId;
        const sopUid = imageIdToSop[imageId];
        return {
          annotationUID: a.annotationUID,
          studyUid: currentStudyUid,
          sopUid,
          toolName: a.metadata?.toolName,
          payload: JSON.parse(JSON.stringify(a))
        };
      })
      .filter((r) => r.sopUid && r.annotationUID);

    if (records.length === 0) {
      HsMessage.info("当前没有批注可保存");
      return;
    }
    await pacsStore.saveAnnotations(records);
    HsMessage.success(`已保存 ${records.length} 条批注`);
  } catch (e: any) {
    HsMessage.error("保存失败：" + (e?.message || e));
    console.error("[PACS] save error:", e);
  } finally {
    saving.value = false;
  }
}

async function clearAnnotations() {
  annotation.state.removeAllAnnotations();
  await pacsStore.clearAnnotations(currentStudyUid);
  viewport?.render();
  HsMessage.success("批注已清空");
}

function resetView() {
  viewport?.resetCamera();
  applyWindow(0);
  viewport?.render();
}

onMounted(async () => {
  await setupViewer();
  await loadStudy();
});

onBeforeUnmount(() => {
  const element = viewerRef.value;
  if (element) element.removeEventListener(csEnums.Events.STACK_NEW_IMAGE, onStackNewImage);
  ToolGroupManager.destroyToolGroup(TOOL_GROUP_ID);
  renderingEngine?.destroy();
});
</script>

<style scoped>
.pacs-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  gap: 8px;
  box-sizing: border-box;
}
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.info-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.series-select {
  width: 150px;
}
.window-select {
  width: 180px;
}
.status {
  color: #67c23a;
}
.hint {
  color: #909399;
  margin-left: auto;
}
.viewer-wrap {
  flex: 1;
  min-height: 480px;
  position: relative;
  background: #000;
  border-radius: 4px;
  overflow: hidden;
}
.viewer {
  width: 100%;
  height: 100%;
  min-height: 480px;
}
</style>