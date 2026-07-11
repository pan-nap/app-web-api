---
name: "api-design"
description: "RESTful API 设计规范。创建或修改接口路由时使用，确保前后端接口设计一致。"
---

# RESTful API 设计规范

> Koa + MySQL 后端 API 设计规范，覆盖路由设计、项目结构、控制器模式、错误处理等全流程。

## 快速定位

| 主题 | 说明 | 参考 |
|------|------|------|
| **核心原则** | 资源命名、路由类型区分、路由顺序、HTTP 方法优先 | [core-principles](references/core-principles.md) |
| **项目结构** | 目录组织、分层职责、命名规范、路径别名 | [project-structure](references/project-structure.md) |
| **控制器模式** | 控制器写法、数据库查询规则、SQL 规范 | [controller-pattern](references/controller-pattern.md) |
| **路由定义** | 路由文件模式、路由注册、完整示例 | [route-definition](references/route-definition.md) |
| **响应与错误处理** | 响应封装、错误处理、中间件顺序、认证 | [response-error-middleware](references/response-error-middleware.md) |
| **新增模块流程** | 新增模块步骤、路径别名配置、检查清单 | [new-module-flow](references/new-module-flow.md) |

---

## 参考文件索引

### 设计原则
- [核心原则](references/core-principles.md) — 资源命名、路由类型区分、路由顺序、HTTP 方法优先、动态参数验证

### 项目架构
- [项目结构](references/project-structure.md) — 目录组织、分层职责、命名规范、路径别名
- [控制器模式](references/controller-pattern.md) — 控制器文件、数据库规则、SQL 规范
- [路由定义](references/route-definition.md) — 路由文件模式、路由注册、完整 Koa Router 示例
- [响应与错误处理](references/response-error-middleware.md) — 响应封装、错误处理、中间件顺序、认证

### 开发流程
- [新增模块流程](references/new-module-flow.md) — 新增模块步骤、路径别名配置、检查清单