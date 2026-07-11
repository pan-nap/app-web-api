---
name: core-principles
description: API 资源命名、路由类型区分、路由顺序、HTTP 方法优先、动态参数验证
---

# 核心原则

## 资源命名

**使用单数名词**（而非复数）：

| 规范 | 示例 |
|------|------|
| **正确** | `/order`、`/student`、`/user` |
| **错误** | `/orders`、`/students`、`/users` |

## 资源型 vs 动作型路由

| 类型 | 路由方式 | 示例 |
|------|---------|------|
| **资源型** | 使用动态路由 | `GET /order/:id` |
| **子资源型** | 嵌套动态路由 | `GET /order/:id/items` |
| **动作型** | 使用固定路由 | `POST /order/:id/pay-code` |

> 由于 HTTP DELETE 方法不能解析请求体（body），所有涉及批量删除的动作型路由统一使用 POST 方法，路径格式为 `/resource/batch/delete`。

## 路由顺序

**固定路由永远放在动态路由前面**，避免动态路由拦截静态路由：

```javascript
// ✅ 正确：固定路由在前
router.get('/order/items', ...)
router.post('/order/generate-pay-code', ...)
router.delete('/order/batch', ...)

router.get('/order/:id', ...)
router.put('/order/:id', ...)
router.delete('/order/:id', ...)

// ❌ 错误：动态路由在前会拦截静态路由
router.get('/order/:id', ...)
router.get('/order/items', ...)  // 永远匹配不到！
```

## HTTP 方法优先

**能用 HTTP 方法就不用路径后缀**：

| 规范 | 示例 |
|------|------|
| **正确** | `PUT /order/:id`、`DELETE /order/:id` |
| **错误** | `POST /order/:id/update`、`POST /order/:id/del` |

## 动态参数验证

**动态参数验证应在控制器中进行**，而非路由层。控制器中验证参数类型（如 id 是否为数字），路由层只负责分发。
