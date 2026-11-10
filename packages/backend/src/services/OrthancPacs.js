import OrthancClient from '#services/OrthancClient';
import { orthancConfig } from '#config/orthanc';

// Orthanc 内核适配器（P2）：对外暴露与 P1 mini-PACS 完全一致的方法签名与返回结构，
// 使前端 /sf-web/pacs/* 契约与 MySQL 批注 CRUD 无需改动。
// Orthanc REST 资源路径只接受内部 ID，不接受 DICOM UID，故先经 /tools/lookup 映射。

const str = (v) => (v == null ? null : String(v));
const num = (v) => (v == null || v === '' ? null : Number(v));

// DICOM JSON 模型（DICOMweb QIDO 返回）取值助手
const dv = (model, tag) => model[tag]?.Value?.[0];
const pn = (model, tag) => {
  const v = dv(model, tag);
  return v == null ? null : typeof v === 'object' ? (v.Alphabetic ?? null) : String(v);
};

// UID -> Orthanc 内部 ID
async function resolveId(uid, type) {
  const found = await OrthancClient.lookup(uid);
  const match = (found || []).find((f) => !type || f.Type === type) || (found || [])[0];
  return match ? match.ID : null;
}

// 将 Orthanc simplify 标签映射为 mini-PACS parse() 的元数据结构
function mapInstanceMeta(tags, transferSyntaxUid) {
  return {
    sopClassUid: str(tags.SOPClassUID),
    sopInstanceUid: str(tags.SOPInstanceUID),
    studyInstanceUid: str(tags.StudyInstanceUID),
    seriesInstanceUid: str(tags.SeriesInstanceUID),
    patientName: str(tags.PatientName),
    patientId: str(tags.PatientID),
    patientSex: str(tags.PatientSex),
    studyDate: str(tags.StudyDate),
    studyTime: str(tags.StudyTime),
    accessionNumber: str(tags.AccessionNumber),
    modality: str(tags.Modality),
    studyId: str(tags.StudyID),
    seriesNumber: str(tags.SeriesNumber),
    instanceNumber: str(tags.InstanceNumber),
    rows: num(tags.Rows),
    cols: num(tags.Columns),
    bitsAllocated: num(tags.BitsAllocated),
    transferSyntaxUid: str(transferSyntaxUid),
    hasPixelData: 'PixelData' in tags,
    pixelDataLength: num(tags.PixelData) ?? 0,
  };
}

async function instanceMeta(instanceId, fileSize) {
  const [tags, transferSyntax, pixelOffset] = await Promise.all([
    OrthancClient.getInstanceTags(instanceId),
    OrthancClient.getInstanceMetadata(instanceId, 'TransferSyntax').catch(() => null),
    OrthancClient.getInstanceMetadata(instanceId, 'PixelDataOffset').catch(() => null),
  ]);
  const meta = mapInstanceMeta(tags, transferSyntax);
  let size = fileSize;
  if (size == null) {
    const inst = await OrthancClient.getInstance(instanceId).catch(() => null);
    size = inst?.FileSize;
  }
  // PixelData 通常为文件最后一个元素：字节数 = 文件大小 - 像素数据偏移
  const offset = Number(pixelOffset);
  if (Number.isFinite(offset) && Number.isFinite(size) && size > offset) {
    meta.pixelDataLength = size - offset;
  }
  return meta;
}

// 限制并发，避免多切片检查一次性发起过多 HTTP 请求
async function mapLimit(items, limit, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += limit) {
    out.push(...(await Promise.all(items.slice(i, i + limit).map(fn))));
  }
  return out;
}

// DICOMweb QIDO 研究列表 -> mini-PACS findStudies 结构
function mapQidoStudy(model) {
  return {
    studyInstanceUid: str(dv(model, '0020000D')),
    patientName: pn(model, '00100010'),
    patientId: str(dv(model, '00100020')),
    patientSex: str(dv(model, '00100040')),
    studyDate: str(dv(model, '00080020')),
    studyTime: str(dv(model, '00080030')),
    accessionNumber: str(dv(model, '00080050')),
    studyId: str(dv(model, '00200010')),
    modalities: model['00080061']?.Value ?? [],
    numberOfSeries: Number(dv(model, '00201206') ?? 0),
    numberOfInstances: Number(dv(model, '00201208') ?? 0),
  };
}

const OrthancPacs = {
  aeTitle: orthancConfig.dicomAet,

  // STOW-RS：上传到 Orthanc，返回与 mini 一致的元数据
  async store(buffer) {
    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    const uploaded = await OrthancClient.uploadInstance(buf);
    if (!uploaded?.ID) throw new Error('Orthanc 归档失败：未返回实例 ID');
    return instanceMeta(uploaded.ID);
  },

  // QIDO-RS：经 DICOMweb 查询检查列表（含 modalities 与实例计数）
  async queryStudies({ patientId, modality, studyDate } = {}) {
    const params = {};
    if (patientId) params.PatientID = patientId;
    if (studyDate) params.StudyDate = studyDate;
    if (modality) params.ModalitiesInStudy = modality;
    const models = await OrthancClient.dicomwebStudies(params);
    return (models || []).map(mapQidoStudy);
  },

  // 检查详情：study + series + instances，映射为 mini getStudy 结构
  async getStudy(studyUid) {
    const studyId = await resolveId(studyUid, 'Study');
    if (!studyId) return null;
    const study = await OrthancClient.getStudy(studyId);
    const seriesResources = await OrthancClient.getStudySeries(studyId);

    const series = [];
    for (const s of seriesResources || []) {
      const instances = await OrthancClient.getSeriesInstances(s.ID, true);
      const metas = await mapLimit(instances || [], 8, (i) => instanceMeta(i.ID, i.FileSize));
      metas.sort((a, b) => (num(a.instanceNumber) ?? 0) - (num(b.instanceNumber) ?? 0));
      series.push({
        seriesInstanceUid: str(s.MainDicomTags?.SeriesInstanceUID),
        modality: str(s.MainDicomTags?.Modality),
        seriesNumber: str(s.MainDicomTags?.SeriesNumber),
        numberOfInstances: (instances || []).length,
        instances: metas,
      });
    }
    series.sort((a, b) => (num(a.seriesNumber) ?? 0) - (num(b.seriesNumber) ?? 0));

    const t = study.MainDicomTags || {};
    const p = study.PatientMainDicomTags || {};
    const modalities = [...new Set(series.map((s) => s.modality).filter(Boolean))];
    return {
      studyInstanceUid: str(t.StudyInstanceUID),
      patientName: str(p.PatientName),
      patientId: str(p.PatientID),
      patientSex: str(p.PatientSex),
      studyDate: str(t.StudyDate),
      studyTime: str(t.StudyTime),
      accessionNumber: str(t.AccessionNumber),
      studyId: str(t.StudyID),
      modalities,
      series,
    };
  },

  // WADO-RS：经 lookup 定位实例后取回原始 DICOM 字节
  async getInstanceBuffer(studyUid, sopUid) {
    const instanceId = await resolveId(sopUid, 'Instance');
    if (!instanceId) return null;
    return OrthancClient.getInstanceFile(instanceId);
  },

  async stats() {
    const s = await OrthancClient.stats();
    return {
      studies: s.CountStudies ?? 0,
      series: s.CountSeries ?? 0,
      instances: s.CountInstances ?? 0,
    };
  },
};

export default OrthancPacs;