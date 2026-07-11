---
name: controller-pattern
description: 控制器模式、数据库查询规则、SQL 规范
---

# 控制器模式

## 控制器文件

**文件：** `src/controllers/{module}Controller/{operation}.js`

```javascript
import { getConnectionWithCharset } from '#config/database';
import { success, error, pageSuccess } from '#utils/response';

export default function(ctx) {
  return getConnectionWithCharset(async (connection) => {
    // 1. 获取参数（查询用 ctx.query，Body用 ctx.request.body）
    const { name, age } = ctx.request.body;

    // 2. 业务校验
    if (!name) {
      return error(ctx, '请填写名称');
    }

    // 3. 数据库操作（使用 connection.query，不是 pool.execute）
    const [result] = await connection.query(
      'INSERT INTO users (name, age) VALUES (?, ?)',
      [name, age]
    );

    // 4. 返回响应
    success(ctx, { id: result.insertId }, '创建成功');
  });
}
```

## 数据库查询规则

- **始终使用 `connection.query()`** 而非 `pool.execute()`，避免ENUM类型问题
- **直接拼接 LIMIT/OFFSET** 到SQL字符串（不参数化）
- **使用 `getConnectionWithCharset`** 自动管理连接和utf8mb4字符集

## SQL规范

- 使用参数化查询防止SQL注入
- 使用 `connection.query()` 而非 `pool.execute()`（更好的ENUM支持）
- 使用 `utf8mb4` 字符集支持中文
- 数据库操作始终使用 `getConnectionWithCharset()`

## 列表查询参数

分页列表查询的参数格式：
```javascript
const { page = 1, limit = 10, ...filters } = ctx.query;
// SQL: LIMIT ${parseInt(limit)} OFFSET ${(parseInt(page) - 1) * parseInt(limit)}
```
