export const success = (ctx, data = null, message = '操作成功', code = 1) => {
  ctx.body = {
    code,
    data,
    msg: message
  };
};

export const error = (ctx, message = '操作失败', code = 0) => {
  ctx.body = {
    code,
    data: null,
    msg: message
  };
};

export const pageSuccess = (ctx, data = [], total = 0, message = '查询成功', code = 1) => {
  ctx.body = {
    code,
    data,
    total,
    msg: message
  };
};

export const wrap = (fn) => {
  return async (ctx, next) => {
    try {
      await fn(ctx, next);
    } catch (err) {
      console.error('控制器错误:', err);
      const message = err.sqlMessage || err.message || '操作失败';
      error(ctx, message);
    }
  };
};
