import { getConnectionWithCharset } from '#config/database';

class AnnotationModel {
  static async list({ studyUid, sopUid } = {}) {
    return getConnectionWithCharset(async (connection) => {
      let query = `
        SELECT annotation_uid AS annotationUID, study_uid AS studyUid, sop_uid AS sopUid,
               tool_name AS toolName, payload
        FROM pacs_annotations WHERE 1 = 1`;
      const params = [];
      if (studyUid) { query += ' AND study_uid = ?'; params.push(studyUid); }
      if (sopUid) { query += ' AND sop_uid = ?'; params.push(sopUid); }
      query += ' ORDER BY id';
      const [rows] = await connection.query(query, params);
      return rows;
    });
  }

  static async save(annotation) {
    return getConnectionWithCharset(async (connection) => {
      await connection.query(
        `INSERT INTO pacs_annotations (annotation_uid, study_uid, sop_uid, tool_name, payload)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           study_uid = VALUES(study_uid), sop_uid = VALUES(sop_uid),
           tool_name = VALUES(tool_name), payload = VALUES(payload)`,
        [
          annotation.annotationUID, annotation.studyUid, annotation.sopUid || null,
          annotation.toolName || null, JSON.stringify(annotation.payload ?? {}),
        ]
      );
      return {
        annotationUID: annotation.annotationUID,
        studyUid: annotation.studyUid,
        sopUid: annotation.sopUid || null,
        toolName: annotation.toolName || null,
        payload: annotation.payload ?? {},
      };
    });
  }

  static async remove(uid) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        'DELETE FROM pacs_annotations WHERE annotation_uid = ?',
        [uid]
      );
      return result.affectedRows > 0;
    });
  }

  static async clearStudy(studyUid) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        'DELETE FROM pacs_annotations WHERE study_uid = ?',
        [studyUid]
      );
      return result.affectedRows;
    });
  }
}

export default AnnotationModel;