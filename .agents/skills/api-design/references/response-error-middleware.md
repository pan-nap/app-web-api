---
name: response-error-middleware
description: 响应封装、错误处理、中间件顺序、认证
---

# 响应封装

| 函数 | 用途 | 响应字段 |
|------|------|----------|
| `success(ctx, data, msg)` | 普通成功 | code, data, msg |
| `error(ctx, msg, code)` | 错误响应 | code=0, data=null, msg |
| `pageSuccess(ctx, list, total, msg)` | 分页查询 | code, data(list), total, msg |
| `wrap(fn)` | 错误包装 | 自动捕获错误，返回500 |

# 错误处理

**不要在控制器中写 try-catch** - `wrap()` 函数自动处理错误。

```javascript
// ❌ 错误写法
export default async function(ctx) {
  try {
    // ...
  } catch (err) {
    error(ctx, '服务器内部错误', 500);
  }
}

// ✅ 正确写法
export default function(ctx) {
  return getConnectionWithCharset(async (connection) => {
    // 无需 try-catch
  });
}
```

**例外情况：** 只有需要手动释放资源时才保留 try-finally。其他情况使用 `getConnectionWithCharset` 自动管理。

# 中间件顺序

```javascript
app.use(cors());
app.use(async (ctx, next) => {
  // 文件上传路由跳过 bodyParser
  if (ctx.path.startsWith('/upload')) {
    await next();
  } else {
    await bodyParser()(ctx, next);
  }
});
app.use(staticFiles);
app.use(router.routes()).use(router.allowedMethods());
app.use(errorHandler);
```

# 认证

需要认证的路由使用 `authMiddleware`：
```javascript
router.get('/student', authMiddleware, wrap(getStudents));
```

中间件从 `Authorization: Bearer <token>` 头部提取JWT，并将用户信息挂载到 `ctx.state.user`。
