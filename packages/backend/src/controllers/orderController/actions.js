import OrderService from '#services/OrderService';
import { success } from '#utils/response';

export async function generatePayCode(ctx) {
  const result = await OrderService.generatePayCode(ctx.params.id);
  success(ctx, result, '支付码生成成功');
}