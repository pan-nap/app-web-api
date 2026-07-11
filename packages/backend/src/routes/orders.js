import Router from '@koa/router';
import {
  getOrders,
  getOrderById,
  getOrderItems,
  createOrder,
  updateOrder,
  updateOrderItem,
  deleteOrder,
  batchDeleteOrders,
  generatePayCode
} from '#controllers/orderController';
import { authMiddleware } from '#middleware/auth';
import { wrap } from '#utils/response';

const router = new Router();

// 资源型路由 - RESTful 规范
router.get('/order', authMiddleware, wrap(getOrders));
router.post('/order', authMiddleware, wrap(createOrder));
router.get('/order/:id', authMiddleware, wrap(getOrderById));
router.put('/order/:id', authMiddleware, wrap(updateOrder));
router.delete('/order/:id', authMiddleware, wrap(deleteOrder));

// 订单子资源路由 - RESTful 规范
router.get('/order/:id/items', authMiddleware, wrap(getOrderItems));
router.put('/order/item/:id', authMiddleware, wrap(updateOrderItem));

// 订单动作路由 - 使用 POST /order/:id/pay-code
router.post('/order/:id/pay-code', authMiddleware, wrap(generatePayCode));

// 批量操作路由 - 使用 POST 处理批量删除（因为 DELETE 不能解析 body）
router.post('/order/batch/delete', authMiddleware, wrap(batchDeleteOrders));

export default router;