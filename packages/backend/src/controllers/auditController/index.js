import auditService from '#services/AuditService';
import { pageSuccess } from '#utils/response';

// GET /audit?username=&action=&studyUid=&currentPage=&pageSize=  （仅 admin）
export async function listAudit(ctx) {
  const { username, action, studyUid, currentPage, pageSize } = ctx.query;
  const { data, total } = await auditService.list({ username, action, studyUid, currentPage, pageSize });
  pageSuccess(ctx, data, total, '查询成功');
}