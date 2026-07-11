import Router from '@koa/router';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  batchDeleteEmployees
} from '#controllers/employeeController';
import { authMiddleware } from '#middleware/auth';
import { wrap } from '#utils/response';

const router = new Router();

// 资源型路由 - RESTful 规范
router.get('/employee', authMiddleware, wrap(getEmployees));
router.post('/employee', authMiddleware, wrap(createEmployee));
router.get('/employee/:id', authMiddleware, wrap(getEmployeeById));
router.put('/employee/:id', authMiddleware, wrap(updateEmployee));
router.delete('/employee/:id', authMiddleware, wrap(deleteEmployee));

// 批量操作路由 - 使用 POST 处理批量删除（因为 DELETE 不能解析 body）
router.post('/employee/batch/delete', authMiddleware, wrap(batchDeleteEmployees));

export default router;