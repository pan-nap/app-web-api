import EmployeeService from '#services/EmployeeService';
import { success } from '#utils/response';

export async function batchDeleteEmployees(ctx) {
  const result = await EmployeeService.batchDeleteEmployees(ctx.request.body);
  success(ctx, null, `成功删除 ${result.deletedCount} 条记录`);
}