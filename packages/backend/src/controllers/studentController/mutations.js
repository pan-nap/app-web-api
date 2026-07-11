import StudentService from '#services/StudentService';
import { success } from '#utils/response';

export async function createStudent(ctx) {
  const result = await StudentService.createStudent(ctx.request.body);
  success(ctx, result, '新增成功');
}

export async function updateStudent(ctx) {
  await StudentService.updateStudent(ctx.params.id, ctx.request.body);
  success(ctx, null, '修改成功');
}

export async function deleteStudent(ctx) {
  await StudentService.deleteStudent(ctx.params.id);
  success(ctx, null, '删除成功');
}