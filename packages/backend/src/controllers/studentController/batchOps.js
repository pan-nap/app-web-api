import StudentService from '#services/StudentService';
import { success } from '#utils/response';

export async function batchUpdateStudents(ctx) {
  const result = await StudentService.batchUpdateStudents(ctx.request.body);
  success(ctx, null, `成功更新 ${result.updatedCount} 条记录`);
}

export async function batchDeleteStudents(ctx) {
  const result = await StudentService.batchDeleteStudents(ctx.request.body);
  success(ctx, null, `成功删除 ${result.deletedCount} 条记录`);
}