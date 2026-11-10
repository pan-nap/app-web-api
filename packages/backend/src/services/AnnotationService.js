import AnnotationModel from '#models/AnnotationModel';

// P1 批注持久化：落 MySQL（JSON payload），阅片时复现。
// 生产环境（P4）可在此基础上转 DICOM SR/GSPS 标准格式做跨系统交换。
export class AnnotationStore {
  async list(filters = {}) {
    return AnnotationModel.list(filters);
  }

  async save(annotation) {
    if (!annotation || !annotation.annotationUID) {
      throw new Error('批注缺少 annotationUID');
    }
    return AnnotationModel.save(annotation);
  }

  async saveBatch(list) {
    if (!Array.isArray(list)) throw new Error('annotations 必须是数组');
    const saved = [];
    for (const a of list) saved.push(await this.save(a));
    return saved;
  }

  async remove(uid) {
    return AnnotationModel.remove(uid);
  }

  async clearStudy(studyUid) {
    return AnnotationModel.clearStudy(studyUid);
  }
}

export default new AnnotationStore();