---
name: project-structure
description: 后端项目目录结构、分层职责、命名规范、路径别名
---

# 后端项目结构与规范

## 目录结构

```
src/
├── config/              # 配置
│   └── database.js     # MySQL连接池 (mysql2/promise)
├── controllers/         # 控制器（按模块分组，仅处理HTTP请求/响应）
│   └── {module}Controller/
│       ├── index.js           # 统一导出
│       ├── queries.js         # 查询相关 (getList, getById)
│       ├── mutations.js       # 变更相关 (create, update, delete)
│       ├── batchOps.js        # 批量操作 (batchUpdate, batchDelete)
│       └── actions.js         # 动作方法 (如 generatePayCode)
├── services/            # 服务层（业务逻辑）
│   └── {module}Service.js
├── models/              # 模型层（数据访问）
│   └── {module}Model.js
├── validators/          # 验证层（数据验证）
│   └── {module}Validator.js
├── middleware/
│   └── auth.js          # JWT认证
├── routes/
│   └── {module}.js      # 路由定义
├── utils/
│   ├── response.js      # 响应封装 (success/error/pageSuccess/wrap)
│   ├── jwt.js           # JWT工具
│   └── bcrypt.js        # 密码加密
└── index.js            # 入口文件
```

## 分层职责

| 层级 | 职责 | 说明 |
|------|------|------|
| **Controllers** | 处理HTTP请求/响应 | 接收请求、调用Service、返回响应 |
| **Services** | 业务逻辑处理 | 数据验证、业务规则、事务管理 |
| **Models** | 数据访问 | 数据库CRUD操作、SQL编写 |
| **Validators** | 数据验证 | 参数校验、格式检查 |

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `get-student-by-id.js` |
| 导出函数 | camelCase | `getStudentById` |
| 路由路径 | kebab-case | `/student/:id` |
| 模块名 | 单数 | `/student`, `/order` |
| 数据库表 | snake_case | `student_info` |

## 路径别名

```json
{
  "imports": {
    "#config/*": "./src/config/*.js",
    "#controllers/*": "./src/controllers/*.js",
    "#services/*": "./src/services/*.js",
    "#models/*": "./src/models/*.js",
    "#validators/*": "./src/validators/*.js",
    "#middleware/*": "./src/middleware/*.js",
    "#routes/*": "./src/routes/*.js",
    "#utils/*": "./src/utils/*.js"
  }
}
```
