import dicomParser from 'dicom-parser';
import PacsModel from '#models/PacsModel';
import { instanceRelPath, writeInstance, readInstance } from '#utils/pacsStorage';
import { isOrthancBackend } from '#config/orthanc';
import OrthancPacs from '#services/OrthancPacs';

// P1 持久化版 Mini-PACS：元数据索引落 MySQL，原始 DICOM 字节落磁盘。
// 数据模型遵循 DICOM 四级层次：Patient → Study → Series → Instance（Patient 内嵌于 Study）。
// 生产环境（P2）将在此基础上接入 Orthanc 内核承担真实 DICOM 网络与归档。
const isValidUid = (uid) =>
  typeof uid === 'string' && uid.length > 0 && uid.length <= 64 && /^[0-9.]+$/.test(uid);

export class PacsStore {
  constructor(aeTitle = 'HS_PACS_DEMO') {
    this.aeTitle = aeTitle;
  }

  // 解析 DICOM 数据集，抽取关键元数据（tag 为 DICOM 标准十六进制编码）
  parse(buffer) {
    const ds = dicomParser.parseDicom(new Uint8Array(buffer));
    const str = (tag) => ds.string(tag) || null;
    const meta = {
      sopClassUid: str('x00080016'),
      sopInstanceUid: str('x00080018'),
      studyInstanceUid: str('x0020000d'),
      seriesInstanceUid: str('x0020000e'),
      patientName: str('x00100010'),
      patientId: str('x00100020'),
      patientSex: str('x00100040'),
      studyDate: str('x00080020'),
      studyTime: str('x00080030'),
      accessionNumber: str('x00080050'),
      modality: str('x00080060'),
      studyId: str('x00200010'),
      seriesNumber: str('x00200011'),
      instanceNumber: str('x00200013'),
      rows: ds.uint16('x00280010') || null,
      cols: ds.uint16('x00280011') || null,
      bitsAllocated: ds.uint16('x00280100') || null,
      transferSyntaxUid: str('x00020010'),
    };
    const pd = ds.elements.x7fe00010;
    meta.hasPixelData = Boolean(pd);
    meta.pixelDataLength = pd ? pd.length : 0;
    return meta;
  }

  // STOW-RS：接收并归档一份 DICOM 实例（写磁盘 + 按四级层次 upsert 索引）
  async store(buffer) {
    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    const meta = this.parse(buf);
    for (const uid of [meta.studyInstanceUid, meta.seriesInstanceUid, meta.sopInstanceUid]) {
      if (!isValidUid(uid)) {
        throw new Error('DICOM 缺少必要或非法的 UID 标签（Study/Series/SOP Instance）');
      }
    }
    const relPath = instanceRelPath(meta.studyInstanceUid, meta.seriesInstanceUid, meta.sopInstanceUid);
    await writeInstance(relPath, buf);
    await PacsModel.upsertStudy(meta);
    await PacsModel.upsertSeries(meta);
    await PacsModel.upsertInstance(meta, relPath);
    return meta;
  }

  // QIDO-RS：按患者 / modality / 日期 查询检查列表
  async queryStudies(filters = {}) {
    const rows = await PacsModel.findStudies(filters);
    return rows.map((r) => ({ ...r, modalities: r.modalities ? r.modalities.split(',') : [] }));
  }

  async getStudy(studyUid) {
    const study = await PacsModel.findStudy(studyUid);
    if (!study) return null;
    const seriesRows = await PacsModel.findSeriesByStudy(studyUid);
    const series = [];
    for (const s of seriesRows) {
      const instances = await PacsModel.findInstancesBySeries(s.seriesInstanceUid);
      series.push({
        seriesInstanceUid: s.seriesInstanceUid,
        modality: s.modality,
        seriesNumber: s.seriesNumber,
        numberOfInstances: s.numberOfInstances,
        instances,
      });
    }
    const modalities = [...new Set(seriesRows.map((s) => s.modality).filter(Boolean))];
    return { ...study, modalities, series };
  }

  // WADO-RS：取回原始 DICOM 字节（从磁盘读）
  async getInstanceBuffer(studyUid, sopUid) {
    const filePath = await PacsModel.findInstanceFile(studyUid, sopUid);
    if (!filePath) return null;
    return readInstance(filePath);
  }

  async stats() {
    return PacsModel.stats();
  }
}

const mini = new PacsStore();

// 门面：按 PACS_BACKEND 在 mini-PACS（磁盘+MySQL）与 Orthanc 内核间切换。
// 默认 mini，保证未部署 Orthanc 时仍可运行；设 PACS_BACKEND=orthanc 启用内核链路。
const backend = () => (isOrthancBackend() ? OrthancPacs : mini);

export default {
  get aeTitle() {
    return backend().aeTitle;
  },
  store: (buffer) => backend().store(buffer),
  queryStudies: (filters) => backend().queryStudies(filters),
  getStudy: (studyUid) => backend().getStudy(studyUid),
  getInstanceBuffer: (studyUid, sopUid) => backend().getInstanceBuffer(studyUid, sopUid),
  stats: () => backend().stats(),
};