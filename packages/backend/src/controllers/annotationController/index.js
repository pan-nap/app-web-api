import annotationStore from '#services/AnnotationService';
import { success, error } from '#utils/response';

// GET /pacs/annotations?studyUid=&sopUid=
export async function listAnnotations(ctx) {
  const { studyUid, sopUid } = ctx.query;
  success(ctx, await annotationStore.list({ studyUid, sopUid }), '查询成功');
}

// POST /pacs/annotations  body: 单个批注 或 { annotations: [...] }
export async function saveAnnotations(ctx) {
  const body = ctx.request.body;
  if (Array.isArray(body?.annotations)) {
    const saved = await annotationStore.saveBatch(body.annotations);
    success(ctx, saved, '批注批量保存成功');
    return;
  }
  const saved = await annotationStore.save(body);
  success(ctx, saved, '批注保存成功');
}

// DELETE /pacs/annotations/:uid
export async function deleteAnnotation(ctx) {
  const removed = await annotationStore.remove(ctx.params.uid);
  if (!removed) {
    error(ctx, '批注不存在');
    return;
  }
  success(ctx, null, '批注删除成功');
}

// DELETE /pacs/annotations?studyUid=  清空某检查的全部批注
export async function clearStudyAnnotations(ctx) {
  const { studyUid } = ctx.query;
  if (!studyUid) {
    error(ctx, '缺少 studyUid');
    return;
  }
  const count = await annotationStore.clearStudy(studyUid);
  success(ctx, { count }, '批注已清空');
}