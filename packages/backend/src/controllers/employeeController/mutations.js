import EmployeeService from '#services/EmployeeService';
import { success } from '#utils/response';

export async function createEmployee(ctx) {
  const result = await EmployeeService.createEmployee(ctx.request.body);
  success(ctx, { id: result.id }, '新增成功');
}

export async function updateEmployee(ctx) {
  await EmployeeService.updateEmployee(ctx.params.id, ctx.request.body);
  success(ctx, null, '修改成功');
}

export async function deleteEmployee(ctx) {
  await EmployeeService.deleteEmployee(ctx.params.id);
  success(ctx, null, '删除成功');
}