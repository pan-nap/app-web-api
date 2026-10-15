import Router from '@koa/router';
import { getApiDoc } from '#controllers/apiDocController';

const router = new Router();

// 接口文档端点：公开访问（api-doc.uvue 使用裸 uni.request，无 Authorization 头），
// 返回原始 OpenAPI JSON，因此不套 authMiddleware / wrap 信封。
router.get('/v3/api-docs', getApiDoc);

export default router;
