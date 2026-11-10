import Router from '@koa/router';
import { listAudit } from '#controllers/auditController';
import { authMiddleware } from '#middleware/auth';
import { requireRole } from '#middleware/rbac';
import { wrap } from '#utils/response';

const router = new Router({ prefix: '/audit' });

// 审计查询仅管理员可见
router.get('/', authMiddleware, requireRole('admin'), wrap(listAudit));

export default router;