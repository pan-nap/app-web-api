import DocumentValueService from '#services/DocumentValueService';
import { success } from '#utils/response';

export async function getDocumentValues(ctx) {
  const values = await DocumentValueService.getValuesByDocumentId(ctx.params.id);
  success(ctx, values, '查询成功');
}

/** 获取实例关联的模板结构内容 */
export async function getDocumentTemplate(ctx) {
  const templateContent = await DocumentValueService.getTemplateContent(ctx.params.id);
  success(ctx, templateContent, '查询成功');
}
