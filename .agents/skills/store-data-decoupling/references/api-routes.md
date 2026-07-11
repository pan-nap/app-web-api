---
name: api-routes
description: API 设计规范参考、模块路由速查表
---

# API 设计规范参考

以下为各模块的路由设计，遵循 api-design 规范（资源型用动态路由，动作型用固定路由）。

## 字典管理

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /dictionary | 查询列表（支持分页） |
| POST | /dictionary | 创建字典项 |
| GET | /dictionary/:id | 按ID查询 |
| PUT | /dictionary/:id | 更新字典项 |
| DELETE | /dictionary/:id | 删除字典项 |

## 学生管理

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /student | 查询列表 |
| POST | /student | 创建学生 |
| GET | /student/:id | 按ID查询 |
| PUT | /student/:id | 更新学生 |
| DELETE | /student/:id | 删除学生 |
| PUT | /student/batch | 批量更新 |
| POST | /student/batch/delete | 批量删除 |

## 订单管理

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /order | 查询列表 |
| POST | /order | 创建订单 |
| GET | /order/:id | 按ID查询 |
| PUT | /order/:id | 更新订单 |
| DELETE | /order/:id | 删除订单 |
| GET | /order/:id/items | 获取订单项列表 |
| PUT | /order/item/:id | 更新订单项 |
| POST | /order/:id/pay-code | 生成支付码 |
| POST | /order/batch/delete | 批量删除 |

## 员工管理

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /employee | 查询列表 |
| POST | /employee | 创建员工 |
| GET | /employee/:id | 按ID查询 |
| PUT | /employee/:id | 更新员工 |
| DELETE | /employee/:id | 删除员工 |
| POST | /employee/batch/delete | 批量删除 |

> 由于 HTTP DELETE 方法不能解析请求体（body），批量删除接口统一使用 POST 方法。子资源路由使用 `/parent/:parentId/child` 格式，动作路由使用 `/resource/:id/action` 格式。
