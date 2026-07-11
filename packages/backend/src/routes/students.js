import Router from '@koa/router';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  batchUpdateStudents,
  batchDeleteStudents
} from '#controllers/studentController';
import { authMiddleware } from '#middleware/auth';
import { wrap } from '#utils/response';

const router = new Router();

// 批量操作路由 - 使用 POST 处理批量删除（因为 DELETE 不能解析 body）
router.put('/student/batch', authMiddleware, wrap(batchUpdateStudents));
router.post('/student/batch/delete', authMiddleware, wrap(batchDeleteStudents));

// 资源型路由 - RESTful 规范，按 HTTP 方法分组
router.get('/student', authMiddleware, wrap(getStudents));
router.post('/student', authMiddleware, wrap(createStudent));
router.get('/student/:id', authMiddleware, wrap(getStudentById));
router.put('/student/:id', authMiddleware, wrap(updateStudent));
router.delete('/student/:id', authMiddleware, wrap(deleteStudent));

export default router;