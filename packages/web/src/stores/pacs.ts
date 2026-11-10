import { defineStore } from "pinia";
import { Utils } from "hs-admin-ui";

export interface PacsInstance {
  sopInstanceUid: string;
  instanceNumber: number;
}

export interface PacsStudy {
  studyInstanceUid: string;
  patientName?: string;
  patientId?: string;
  modalities?: string[];
  numberOfSeries?: number;
  numberOfInstances?: number;
  series?: { seriesInstanceUid: string; instances: { sopInstanceUid: string }[] }[];
}

export interface AnnotationRecord {
  annotationUID: string;
  studyUid: string;
  sopUid: string;
  toolName: string;
  payload: Record<string, unknown>;
}

// 构造 Cornerstone wadouri 影像标识，走 Vite /sf-web 代理（同源免 CORS）
export const buildImageId = (studyUid: string, sopUid: string) =>
  `wadouri:/sf-web/pacs/studies/${studyUid}/instances/${sopUid}`;

export const usePacsStore = defineStore("pacs", () => {
  const seedDemo = async () => {
    const res = await Utils.useRequest("/sf-web/pacs/demo/seed", {}, "post");
    return res.data as { studyInstanceUid: string; seriesInstanceUid: string; instances: PacsInstance[] };
  };

  const getStudies = async (params: Record<string, unknown> = {}) => {
    const res = await Utils.useRequest("/sf-web/pacs/studies", params, "get");
    return res.data as PacsStudy[];
  };

  const getStudy = async (studyUid: string) => {
    const res = await Utils.useRequest(`/sf-web/pacs/studies/${studyUid}`, {}, "get");
    return res.data as PacsStudy;
  };

  const getAnnotations = async (studyUid: string) => {
    const res = await Utils.useRequest("/sf-web/pacs/annotations", { studyUid }, "get");
    return res.data as AnnotationRecord[];
  };

  const saveAnnotations = async (annotations: AnnotationRecord[]) => {
    const res = await Utils.useRequest("/sf-web/pacs/annotations", { annotations }, "post");
    return res.data;
  };

  const deleteAnnotation = async (uid: string) => {
    const res = await Utils.useRequest(`/sf-web/pacs/annotations/${uid}`, {}, "delete");
    return res.data;
  };

  const clearAnnotations = async (studyUid: string) => {
    const res = await Utils.useRequest(
      `/sf-web/pacs/annotations?studyUid=${encodeURIComponent(studyUid)}`,
      {},
      "delete"
    );
    return res.data;
  };

  return {
    seedDemo,
    getStudies,
    getStudy,
    getAnnotations,
    saveAnnotations,
    deleteAnnotation,
    clearAnnotations
  };
});