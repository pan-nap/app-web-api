import { getConnectionWithCharset } from '#config/database';

class DocumentValueModel {

  static async findByDocumentId(documentId) {
    return getConnectionWithCharset(async (connection) => {
      const [rows] = await connection.query(
        'SELECT var_key, var_value FROM document_values WHERE document_id = ?',
        [documentId]
      );
      return rows;
    });
  }

  static async bulkUpsert(documentId, values) {
    return getConnectionWithCharset(async (connection) => {
      // 先删除旧值再批量插入
      await connection.query(
        'DELETE FROM document_values WHERE document_id = ?',
        [documentId]
      );

      if (values.length === 0) return;

      const placeholders = values.map(() => '(?, ?, ?)').join(', ');
      const params = values.flatMap((v) => [documentId, v.varKey, v.varValue]);
      await connection.query(
        `INSERT INTO document_values (document_id, var_key, var_value) VALUES ${placeholders}`,
        params
      );
    });
  }
}

export default DocumentValueModel;
