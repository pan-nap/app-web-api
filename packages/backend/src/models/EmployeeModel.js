import { getConnectionWithCharset } from '#config/database';

class EmployeeModel {
  static async findAll(params = {}) {
    return getConnectionWithCharset(async (connection) => {
      const { name, phone, currentPage = 1, pageSize = 10 } = params;
      let query = 'SELECT id, username, name, phone, email, role, status, created_at, updated_at FROM user';
      let countQuery = 'SELECT COUNT(*) as total FROM user';
      let paramsArr = [];
      let countParams = [];

      const conditions = [];
      if (name) {
        conditions.push('name LIKE ?');
        paramsArr.push(`%${name}%`);
        countParams.push(`%${name}%`);
      }
      if (phone) {
        conditions.push('phone LIKE ?');
        paramsArr.push(`%${phone}%`);
        countParams.push(`%${phone}%`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
        countQuery += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY created_at DESC';

      const offset = (currentPage - 1) * pageSize;
      query += ' LIMIT ? OFFSET ?';
      paramsArr.push(parseInt(pageSize), offset);

      const [result] = await connection.query(query, paramsArr);
      const [countResult] = await connection.query(countQuery, countParams);

      return {
        data: result,
        total: countResult[0].total
      };
    });
  }

  static async findById(id) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        'SELECT id, username, name, phone, email, role, status, created_at, updated_at FROM user WHERE id = ?',
        [id]
      );
      return result.length > 0 ? result[0] : null;
    });
  }

  static async findByPhone(phone, excludeId = null) {
    return getConnectionWithCharset(async (connection) => {
      let query = 'SELECT id FROM user WHERE phone = ?';
      let params = [phone];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const [result] = await connection.query(query, params);
      return result.length > 0 ? result[0] : null;
    });
  }

  static async findByUsername(username, excludeId = null) {
    return getConnectionWithCharset(async (connection) => {
      let query = 'SELECT id FROM user WHERE username = ?';
      let params = [username];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const [result] = await connection.query(query, params);
      return result.length > 0 ? result[0] : null;
    });
  }

  static async create(data) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        'INSERT INTO user (username, password, name, phone, email, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [data.username, data.password, data.name, data.phone, data.email || '', data.role || 'user', data.status || 1]
      );
      return result.insertId;
    });
  }

  static async update(id, data) {
    return getConnectionWithCharset(async (connection) => {
      const updateFields = [];
      const params = [];

      if (data.username !== undefined) {
        updateFields.push('username = ?');
        params.push(data.username);
      }
      if (data.name !== undefined) {
        updateFields.push('name = ?');
        params.push(data.name);
      }
      if (data.phone !== undefined) {
        updateFields.push('phone = ?');
        params.push(data.phone);
      }
      if (data.email !== undefined) {
        updateFields.push('email = ?');
        params.push(data.email);
      }
      if (data.role !== undefined) {
        updateFields.push('role = ?');
        params.push(data.role);
      }
      if (data.status !== undefined) {
        updateFields.push('status = ?');
        params.push(data.status);
      }

      params.push(id);

      await connection.query(
        `UPDATE user SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        params
      );
    });
  }

  static async delete(id) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.execute(
        'DELETE FROM user WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    });
  }

  static async batchDelete(ids) {
    return getConnectionWithCharset(async (connection) => {
      const placeholders = ids.map(() => '?').join(',');
      const [result] = await connection.execute(
        `DELETE FROM user WHERE id IN (${placeholders})`,
        ids
      );
      return result.affectedRows;
    });
  }
}

export default EmployeeModel;