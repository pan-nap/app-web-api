import DocumentService from '#services/DocumentService';
import { success, pageSuccess } from '#utils/response';

export async function getDocuments(ctx) {
  const result = await DocumentService.getDocuments(ctx.query);
  pageSuccess(ctx, result.data, result.total, '查询成功');
}

export async function getDocumentById(ctx) {
  const doc = await DocumentService.getDocumentById(ctx.params.id);
  success(ctx, doc, '查询成功');
}
