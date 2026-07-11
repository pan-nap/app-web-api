import DictionaryService from '#services/DictionaryService';
import { success } from '#utils/response';

export async function createDictionary(ctx) {
  const result = await DictionaryService.createDictionary(ctx.request.body);
  success(ctx, { id: result.id }, '创建成功');
}

export async function updateDictionary(ctx) {
  await DictionaryService.updateDictionary(ctx.params.id, ctx.request.body);
  success(ctx, null, '更新成功');
}

export async function deleteDictionary(ctx) {
  await DictionaryService.deleteDictionary(ctx.params.id);
  success(ctx, null, '删除成功');
}