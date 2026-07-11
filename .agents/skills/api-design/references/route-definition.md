---
name: route-definition
description: 路由定义模式、路由注册、完整 Koa Router 示例
---

# 路由定义

## 路由文件模式

**文件：** `src/routes/{module}.js`

```javascript
import Router from '@koa/router';
import {
  getStudents, getStudentById, createStudent,
  updateStudent, deleteStudent,
  batchUpdateStudents, batchDeleteStudents
} from '#controllers/studentController';
import { authMiddleware } from '#middleware/auth';
import { wrap } from '#utils/response';

const router = new Router();

// 固定动作路由 - 放前面
router.post('/student/batch/update', authMiddleware, wrap(batchUpdateStudents));
router.delete('/student/batch', authMiddleware, wrap(batchDeleteStudents));

// 资源型路由 - 放后面
router.get('/student', authMiddleware, wrap(getStudents));
router.post('/student', authMiddleware, wrap(createStudent));
router.get('/student/:id', authMiddleware, wrap(getStudentById));
router.put('/student/:id', authMiddleware, wrap(updateStudent));
router.delete('/student/:id', authMiddleware, wrap(deleteStudent));

export default router;
```

## 路由注册

在 `src/index.js` 中：
```javascript
import studentRouter from '#routes/students';
// ...
app.use(studentRouter.routes()).use(studentRouter.allowedMethods());
```

## 完整 Koa Router 示例

```javascript
import Router from '@koa/router';
import { wrap } from '#utils/response';

const router = new Router();

// ========================================
// 固定路由（动作型）- 必须放在前面！
// ========================================
router.get('/order/items', authMiddleware, wrap(getOrderItems));
router.post('/order/generate-pay-code', authMiddleware, wrap(generatePayCode));
router.delete('/order/batch', authMiddleware, wrap(batchDeleteOrders));

// ========================================
// 资源型路由 - 放在后面
// ========================================
router.get('/order', authMiddleware, wrap(getOrders));
router.post('/order', authMiddleware, wrap(createOrder));
router.get('/order/:id', authMiddleware, wrap(getOrderById));
router.put('/order/:id', authMiddleware, wrap(updateOrder));
router.delete('/order/:id', authMiddleware, wrap(deleteOrder));

export default router;
```
