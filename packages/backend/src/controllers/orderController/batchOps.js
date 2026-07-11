import OrderService from '#services/OrderService';
import { success } from '#utils/response';

export async function batchDeleteOrders(ctx) {
  const result = await OrderService.batchDeleteOrders(ctx.request.body);
  success(ctx, null, `成功删除 ${result.deletedCount} 条订单`);
}