import OrderService from '#services/OrderService';
import { success } from '#utils/response';

export async function createOrder(ctx) {
  const data = ctx.request.body;
  data.creator = ctx.state.user?.username || 'admin';
  const result = await OrderService.createOrder(data);
  success(ctx, result, `成功创建订单，共 ${result.total} 名学生`);
}

export async function updateOrder(ctx) {
  await OrderService.updateOrder(ctx.params.id, ctx.request.body);
  success(ctx, null, '修改成功');
}

export async function updateOrderItem(ctx) {
  await OrderService.updateOrderItem(ctx.params.id, ctx.request.body);
  success(ctx, null, '更新成功');
}

export async function deleteOrder(ctx) {
  await OrderService.deleteOrder(ctx.params.id);
  success(ctx, null, '删除成功');
}