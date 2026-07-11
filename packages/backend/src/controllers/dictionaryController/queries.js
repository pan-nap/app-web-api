import DictionaryService from '#services/DictionaryService';
import { success, pageSuccess } from '#utils/response';

export async function getDictionary(ctx) {
  const { type, currentPage, pageSize } = ctx.query;
  
  if (currentPage && pageSize) {
    const result = await DictionaryService.getDictionaries({ type, currentPage, pageSize });
    pageSuccess(ctx, result.data, result.total, '查询成功');
  } else {
    const result = await DictionaryService.getDictionariesByType(type);
    success(ctx, result, '查询成功');
  }
}

export async function getDictionaryById(ctx) {
  const result = await DictionaryService.getDictionaryById(ctx.params.id);
  success(ctx, result, '查询成功');
}