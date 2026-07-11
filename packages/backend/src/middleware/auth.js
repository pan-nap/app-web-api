import { verifyToken } from '#utils/jwt';
import { error } from '#utils/response';

export const authMiddleware = async (ctx, next) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    error(ctx, '未登录，请先登录');
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
     error(ctx, 'token无效或已过期');
    return;
  }

  ctx.state.user = decoded;
  await next();
};