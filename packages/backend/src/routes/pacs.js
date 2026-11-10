import Router from '@koa/router';
import { echo, stow, qido, studyDetail, wado, seed } from '#controllers/pacsController';
import {
  listAnnotations,
  saveAnnotations,
  deleteAnnotation,
  clearStudyAnnotations,
} from '#controllers/annotationController';
import { wrap } from '#utils/response';

// Mini-PACS 演示路由（DICOMweb 风格，简化版）。
// 学习/测试用，未加认证；生产环境应加 authMiddleware 并替换为真实 PACS 内核。
const router = new Router({ prefix: '/pacs' });

router.get('/echo', wrap(echo)); // C-ECHO 连通性验证
router.post('/demo/seed', wrap(seed)); // 生成演示检查
router.post('/studies', wrap(stow)); // STOW-RS 接收影像
router.get('/studies', wrap(qido)); // QIDO-RS 查询检查
router.get('/studies/:studyUid', wrap(studyDetail)); // 检查详情
router.get('/studies/:studyUid/instances/:sopUid', wrap(wado)); // WADO-RS 调阅

// 批注 JSON 持久化
router.get('/annotations', wrap(listAnnotations));
router.post('/annotations', wrap(saveAnnotations));
router.delete('/annotations/:uid', wrap(deleteAnnotation));
router.delete('/annotations', wrap(clearStudyAnnotations));

export default router;