import EmployeeModel from '#models/EmployeeModel';
import { error } from '#utils/response';

// 角色授权：必须置于 authMiddleware 之后。从 DB 水合权威 role/status，
// admin 超级放行；禁用账号拒绝；角色不在允许列表则拒绝。
// 角色不放进 JWT，避免改权后旧 token 仍带旧角色（每次以库为准）。
export const requireRole = (...allowed) => async (ctx, next) => {
  const id = ctx.state.user?.id;
  if (!id) {
    error(ctx, '未登录，请先登录');
    return;
  }

  const user = await EmployeeModel.findById(id);
  if (!user || Number(user.status) !== 1) {
    error(ctx, '账号不存在或已禁用');
    return;
  }

  ctx.state.user = { ...ctx.state.user, name: user.name, role: user.role, status: user.status };

  if (user.role !== 'admin' && !allowed.includes(user.role)) {
    error(ctx, '权限不足，无法执行该操作');
    return;
  }

  await next();
};