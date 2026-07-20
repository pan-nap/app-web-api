import DocumentValueService from '#services/DocumentValueService';
import { success } from '#utils/response';

export async function saveDocumentValues(ctx) {
  const result = await DocumentValueService.saveValues(ctx.params.id, ctx.request.body);
  success(ctx, result, '保存成功');
}
