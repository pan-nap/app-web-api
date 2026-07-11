import OrderService from '#services/OrderService';
import { success, pageSuccess } from '#utils/response';

export async function getOrders(ctx) {
  const result = await OrderService.getOrders(ctx.query);
  pageSuccess(ctx, result.data, result.total, '查询成功');
}

export async function getOrderById(ctx) {
  const order = await OrderService.getOrderById(ctx.params.id);
  success(ctx, order, '查询成功');
}

export async function getOrderItems(ctx) {
  const items = await OrderService.getOrderItems(ctx.params.id);
  success(ctx, items, '查询成功');
}