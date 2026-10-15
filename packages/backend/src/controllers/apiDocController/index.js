import ApiDocService from '#services/ApiDocService';

/**
 * 获取接口文档（OpenAPI 格式）
 *
 * 直接返回原始 { tags, paths } 结构，不使用统一 { code, data, msg } 信封，
 * 以适配前端 api-doc.uvue 的解析逻辑。
 */
export async function getApiDoc(ctx) {
  ctx.set('Content-Type', 'application/json; charset=utf-8');
  ctx.body = ApiDocService.getApiDoc();
}
