import Router from '@koa/router';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  batchDeleteDocuments
} from '#controllers/documentController';
import { authMiddleware } from '#middleware/auth';
import { wrap } from '#utils/response';

const router = new Router();

// 批量操作路由
router.post('/document/batch/delete', authMiddleware, wrap(batchDeleteDocuments));

// 资源型路由
router.get('/document', authMiddleware, wrap(getDocuments));
router.post('/document', authMiddleware, wrap(createDocument));
router.get('/document/:id', authMiddleware, wrap(getDocumentById));
router.put('/document/:id', authMiddleware, wrap(updateDocument));
router.delete('/document/:id', authMiddleware, wrap(deleteDocument));

export default router;
