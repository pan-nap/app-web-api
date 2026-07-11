import { getConnectionWithCharset } from '#config/database';

class DictionaryModel {
  static async findAll(type = null, currentPage = 1, pageSize = 10) {
    return getConnectionWithCharset(async (connection) => {
      let query = 'SELECT id, type, label, value, sort_order FROM dictionaries';
      let countQuery = 'SELECT COUNT(*) as total FROM dictionaries';
      let params = [];
      let countParams = [];

      if (type) {
        query += ' WHERE type = ? ORDER BY sort_order';
        countQuery += ' WHERE type = ?';
        params.push(type);
        countParams.push(type);
      } else {
        query += ' ORDER BY type, sort_order';
      }

      const offset = (currentPage - 1) * pageSize;
      query += ' LIMIT ? OFFSET ?';
      params.push(pageSize, offset);

      const [result] = await connection.query(query, params);
      const [countResult] = await connection.query(countQuery, countParams);

      return {
        data: result,
        total: countResult[0].total
      };
    });
  }

  static async findByType(type = null) {
    return getConnectionWithCharset(async (connection) => {
      let query = 'SELECT type, label, value FROM dictionaries';
      let params = [];

      if (type) {
        query += ' WHERE type = ? ORDER BY sort_order';
        params.push(type);
      } else {
        query += ' ORDER BY type, sort_order';
      }

      const [result] = await connection.query(query, params);
      return result;
    });
  }

  static async findById(id) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        'SELECT id, type, label, value, sort_order FROM dictionaries WHERE id = ?',
        [id]
      );
      return result.length > 0 ? result[0] : null;
    });
  }

  static async create(data) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        'INSERT INTO dictionaries (type, label, value, sort_order) VALUES (?, ?, ?, ?)',
        [data.type, data.label, data.value, data.sort_order]
      );
      return result.insertId;
    });
  }

  static async update(id, data) {
    return getConnectionWithCharset(async (connection) => {
      const updateFields = [];
      const params = [];

      if (data.type !== undefined) {
        updateFields.push('type = ?');
        params.push(data.type);
      }
      if (data.label !== undefined) {
        updateFields.push('label = ?');
        params.push(data.label);
      }
      if (data.value !== undefined) {
        updateFields.push('value = ?');
        params.push(data.value);
      }
      if (data.sort_order !== undefined) {
        updateFields.push('sort_order = ?');
        params.push(data.sort_order);
      }

      params.push(id);

      await connection.query(
        `UPDATE dictionaries SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );
    });
  }

  static async delete(id) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.execute(
        'DELETE FROM dictionaries WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    });
  }
}

export default DictionaryModel;