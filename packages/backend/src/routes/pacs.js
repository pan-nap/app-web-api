import Router from '@koa/router';
import { echo, stow, qido, studyDetail, wado, seed } from '#controllers/pacsController';
import {
  listAnnotations,
  saveAnnotations,
  deleteAnnotation,
  clearStudyAnnotations,
} from '#controllers/annotationController';
import { authMiddleware } from '#middleware/auth';
import { requireRole } from '#middleware/rbac';
import { auditLog } from '#middleware/audit';
import { wrap } from '#utils/response';

// PACS 路由（DICOMweb 风格）。P3 起全部需登录；写操作按角色授权；敏感操作落审计。
// 角色：admin 全权；technologist 可归档；radiologist 可批注/报告；其余（user/viewer）只读。
// 审计中间件置最外层，未登录/权限不足的拒绝尝试同样记录。
const router = new Router({ prefix: '/pacs' });

// 读：任意登录用户
router.get('/echo', authMiddleware, wrap(echo)); // C-ECHO 连通性验证
router.get('/studies', auditLog('study.list', 'study'), authMiddleware, wrap(qido)); // QIDO-RS 查询
router.get(
  '/studies/:studyUid',
  auditLog('study.view', 'study', { idParam: 'studyUid' }),
  authMiddleware,
  wrap(studyDetail)
); // 检查详情
// WADO-RS 调阅原始字节：逐切片审计噪声大，访问审计以 study.view 为粒度覆盖
router.get('/studies/:studyUid/instances/:sopUid', authMiddleware, wrap(wado));

// 归档：admin / technologist
router.post(
  '/studies',
  auditLog('instance.ingest', 'instance'),
  authMiddleware,
  requireRole('admin', 'technologist'),
  wrap(stow)
); // STOW-RS 接收影像
router.post(
  '/demo/seed',
  auditLog('demo.seed', 'study'),
  authMiddleware,
  requireRole('admin', 'technologist'),
  wrap(seed)
); // 生成演示检查

// 批注读：任意登录用户
router.get('/annotations', authMiddleware, wrap(listAnnotations));
// 批注写删：admin / radiologist / technologist
router.post(
  '/annotations',
  auditLog('annotation.save', 'annotation'),
  authMiddleware,
  requireRole('admin', 'radiologist', 'technologist'),
  wrap(saveAnnotations)
);
router.delete(
  '/annotations/:uid',
  auditLog('annotation.delete', 'annotation', { idParam: 'uid' }),
  authMiddleware,
  requireRole('admin', 'radiologist', 'technologist'),
  wrap(deleteAnnotation)
);
router.delete(
  '/annotations',
  auditLog('annotation.clear', 'annotation'),
  authMiddleware,
  requireRole('admin', 'radiologist', 'technologist'),
  wrap(clearStudyAnnotations)
);

export default router;