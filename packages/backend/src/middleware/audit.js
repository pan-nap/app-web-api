import auditService from '#services/AuditService';

// 审计中间件：置于路由最外层，先放行 auth/role/handler，再落审计，
// 因此未登录/权限不足的拒绝尝试与成功操作都会被记录。
// 审计写入失败绝不影响主请求（仅 console.error）。
export const auditLog = (action, resourceType, opts = {}) => async (ctx, next) => {
  await next();
  try {
    const user = ctx.state.user || {};
    const body = ctx.body;
    const resultCode = body && typeof body === 'object' && 'code' in body ? body.code : null;
    const idParam = opts.idParam;
    const resourceId = idParam ? (ctx.params?.[idParam] ?? ctx.query?.[idParam] ?? null) : null;
    const studyUid = ctx.params?.studyUid ?? ctx.query?.studyUid ?? null;
    await auditService.record({
      userId: user.id ?? null,
      username: user.username ?? ctx.request.body?.username ?? null,
      action,
      resourceType,
      resourceId,
      studyUid,
      ip: ctx.ip,
      userAgent: ctx.get('user-agent'),
      statusCode: ctx.status,
      resultCode,
      detail: opts.detail ? opts.detail(ctx) : null,
    });
  } catch (err) {
    console.error('审计写入失败:', err.message);
  }
};