import { getConnectionWithCharset } from '#config/database';

class AuditModel {
  static async record(entry) {
    return getConnectionWithCharset(async (connection) => {
      await connection.query(
        `INSERT INTO pacs_audit_log
         (user_id, username, action, resource_type, resource_id, study_uid, ip, user_agent, status_code, result_code, detail)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.userId ?? null,
          entry.username ?? null,
          entry.action,
          entry.resourceType ?? null,
          entry.resourceId ?? null,
          entry.studyUid ?? null,
          entry.ip ?? null,
          entry.userAgent ? String(entry.userAgent).slice(0, 255) : null,
          entry.statusCode ?? null,
          entry.resultCode ?? null,
          entry.detail ? JSON.stringify(entry.detail) : null,
        ]
      );
    });
  }

  static async list({ username, action, studyUid, currentPage = 1, pageSize = 20 } = {}) {
    return getConnectionWithCharset(async (connection) => {
      const conditions = [];
      const params = [];
      if (username) { conditions.push('username LIKE ?'); params.push(`%${username}%`); }
      if (action) { conditions.push('action = ?'); params.push(action); }
      if (studyUid) { conditions.push('study_uid = ?'); params.push(studyUid); }
      const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
      const size = Number(pageSize) || 20;
      const offset = ((Number(currentPage) || 1) - 1) * size;
      const [rows] = await connection.query(
        `SELECT id, user_id AS userId, username, action, resource_type AS resourceType,
                resource_id AS resourceId, study_uid AS studyUid, ip, user_agent AS userAgent,
                status_code AS statusCode, result_code AS resultCode, detail, created_at AS createdAt
         FROM pacs_audit_log${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
        [...params, size, offset]
      );
      const [countRows] = await connection.query(
        `SELECT COUNT(*) AS total FROM pacs_audit_log${where}`,
        params
      );
      return { data: rows, total: countRows[0].total };
    });
  }
}

export default AuditModel;