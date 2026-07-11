import EmployeeService from '#services/EmployeeService';
import { success, pageSuccess } from '#utils/response';

export async function getEmployees(ctx) {
  const result = await EmployeeService.getEmployees(ctx.query);
  pageSuccess(ctx, result.data, result.total, '查询成功');
}

export async function getEmployeeById(ctx) {
  const employee = await EmployeeService.getEmployeeById(ctx.params.id);
  success(ctx, employee, '查询成功');
}