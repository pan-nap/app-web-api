import StudentService from '#services/StudentService';
import { success, pageSuccess } from '#utils/response';

export async function getStudents(ctx) {
  const result = await StudentService.getStudents(ctx.query);
  pageSuccess(ctx, result.data, result.total, '查询成功');
}

export async function getStudentById(ctx) {
  const student = await StudentService.getStudentById(ctx.params.id);
  success(ctx, student, '查询成功');
}