import Router from '@koa/router';
import {
  getDictionary,
  getDictionaryById,
  createDictionary,
  updateDictionary,
  deleteDictionary
} from '#controllers/dictionaryController';
import { authMiddleware } from '#middleware/auth';
import { wrap } from '#utils/response';

const router = new Router();

// 资源型路由
router.get('/dictionary', authMiddleware, wrap(getDictionary));
router.post('/dictionary', authMiddleware, wrap(createDictionary));
router.get('/dictionary/:id', authMiddleware, wrap(getDictionaryById));
router.put('/dictionary/:id', authMiddleware, wrap(updateDictionary));
router.delete('/dictionary/:id', authMiddleware, wrap(deleteDictionary));

export default router;
