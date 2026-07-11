import DocumentService from '#services/DocumentService';
import { success } from '#utils/response';

export async function createDocument(ctx) {
  const result = await DocumentService.createDocument(ctx.request.body);
  success(ctx, result, '新增成功');
}

export async function updateDocument(ctx) {
  await DocumentService.updateDocument(ctx.params.id, ctx.request.body);
  success(ctx, null, '修改成功');
}

export async function deleteDocument(ctx) {
  await DocumentService.deleteDocument(ctx.params.id);
  success(ctx, null, '删除成功');
}
