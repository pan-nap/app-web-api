import { getConnectionWithCharset } from '#config/database';

class DocumentModel {

  static async findAll(params = {}) {
    return getConnectionWithCharset(async (connection) => {
      const { name, currentPage = 1, pageSize = 20 } = params;

      let query = 'SELECT * FROM documents WHERE 1=1';
      const paramsArr = [];

      if (name) {
        query += ' AND name LIKE ?';
        paramsArr.push(`%${name}%`);
      }

      // 先查总数
      const [countResult] = await connection.query(
        'SELECT COUNT(*) as total FROM documents WHERE 1=1' +
        (name ? ' AND name LIKE ?' : ''),
        paramsArr
      );

      query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
      paramsArr.push(parseInt(pageSize), (parseInt(currentPage) - 1) * parseInt(pageSize));

      const [documents] = await connection.query(query, paramsArr);

      return { data: documents, total: countResult[0].total };
    });
  }

  static async findById(id) {
    return getConnectionWithCharset(async (connection) => {
      const [documents] = await connection.query('SELECT * FROM documents WHERE id = ?', [id]);
      return documents.length ? documents[0] : null;
    });
  }

  static async create(data) {
    return getConnectionWithCharset(async (connection) => {
      const { name, content } = data;
      const [result] = await connection.query(
        'INSERT INTO documents (name, content) VALUES (?, ?)',
        [name, content ? JSON.stringify(content) : null]
      );
      return result.insertId;
    });
  }

  static async update(id, data) {
    return getConnectionWithCharset(async (connection) => {
      const { name, content } = data;

      const updateFields = [];
      const updateParams = [];

      if (name !== undefined) { updateFields.push('name = ?'); updateParams.push(name); }
      if (content !== undefined) { updateFields.push('content = ?'); updateParams.push(JSON.stringify(content)); }

      if (!updateFields.length) {
        return false;
      }

      updateParams.push(id);
      const [result] = await connection.query(
        `UPDATE documents SET ${updateFields.join(', ')} WHERE id = ?`,
        updateParams
      );
      return result.affectedRows > 0;
    });
  }

  static async delete(id) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query('DELETE FROM documents WHERE id = ?', [id]);
      return result.affectedRows > 0;
    });
  }

  static async batchDelete(ids) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        `DELETE FROM documents WHERE id IN (${ids.map(() => '?').join(', ')})`,
        ids
      );
      return result.affectedRows;
    });
  }
}

export default DocumentModel;
