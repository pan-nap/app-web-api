import DocumentService from '#services/DocumentService';
import { success } from '#utils/response';

export async function batchDeleteDocuments(ctx) {
  const result = await DocumentService.batchDeleteDocuments(ctx.request.body);
  success(ctx, null, `成功删除 ${result.deletedCount} 条记录`);
}
