import { getConnectionWithCharset } from '#config/database';

class StudentModel {
  static async findAll(params = {}) {
    return getConnectionWithCharset(async (connection) => {
      const { school, grade, className, idCard, name, status, currentPage = 1, pageSize = 20 } = params;

      let query = 'SELECT *, class_name as className, id_card as idCard FROM students WHERE 1=1';
      let paramsArr = [];

      if (idCard) {
        query += ' AND id_card = ?';
        paramsArr.push(idCard);
      }
      if (school) {
        query += ' AND school = ?';
        paramsArr.push(school);
      }
      if (grade) {
        query += ' AND grade = ?';
        paramsArr.push(grade);
      }
      if (className) {
        query += ' AND class_name = ?';
        paramsArr.push(className);
      }
      if (name) {
        query += ' AND name LIKE ?';
        paramsArr.push(`%${name}%`);
      }
      if (status !== undefined) {
        query += ' AND status = ?';
        paramsArr.push(status);
      }

      query += ` ORDER BY created_at DESC LIMIT ${parseInt(pageSize)} OFFSET ${(parseInt(currentPage) - 1) * parseInt(pageSize)}`;

      const [students] = await connection.query(query, paramsArr);

      const [countResult] = await connection.query('SELECT COUNT(*) as total FROM students WHERE 1=1' +
        (idCard ? ' AND id_card = ?' : '') +
        (school ? ' AND school = ?' : '') +
        (grade ? ' AND grade = ?' : '') +
        (className ? ' AND class_name = ?' : '') +
        (name ? ' AND name LIKE ?' : '') +
        (status !== undefined ? ' AND status = ?' : ''), paramsArr);

      return { data: students, total: countResult[0].total };
    });
  }

  static async findById(id) {
    return getConnectionWithCharset(async (connection) => {
      const [students] = await connection.query('SELECT * FROM students WHERE id = ?', [id]);
      return students.length ? students[0] : null;
    });
  }

  static async findBySchoolGradeClass(school, grade, className) {
    return getConnectionWithCharset(async (connection) => {
      const [students] = await connection.query(
        'SELECT * FROM students WHERE school = ? AND grade = ? AND class_name = ? AND status = 1',
        [school, grade, className]
      );
      return students;
    });
  }

  static async findByIdCard(idCard, excludeId = null) {
    return getConnectionWithCharset(async (connection) => {
      let query = 'SELECT * FROM students WHERE id_card = ?';
      let params = [idCard];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const [students] = await connection.query(query, params);
      return students.length ? students[0] : null;
    });
  }

  static async findWithOrders(ids) {
    return getConnectionWithCharset(async (connection) => {
      const [students] = await connection.query(
        `SELECT id FROM students WHERE id IN (${ids.map(() => '?').join(', ')}) AND has_order = 1`,
        ids
      );
      return students;
    });
  }

  static async create(data) {
    return getConnectionWithCharset(async (connection) => {
      const { name, gender, school, grade, className, idCard, phone } = data;
      const [result] = await connection.query(
        'INSERT INTO students (name, gender, school, grade, class_name, id_card, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, gender, school, grade, className, idCard, phone || '', 1]
      );
      return result.insertId;
    });
  }

  static async update(id, data) {
    return getConnectionWithCharset(async (connection) => {
      const { name, gender, school, grade, className, idCard, phone, status } = data;

      const updateFields = [];
      const updateParams = [];

      if (name) { updateFields.push('name = ?'); updateParams.push(name); }
      if (gender) { updateFields.push('gender = ?'); updateParams.push(gender); }
      if (school) { updateFields.push('school = ?'); updateParams.push(school); }
      if (grade) { updateFields.push('grade = ?'); updateParams.push(grade); }
      if (className) { updateFields.push('class_name = ?'); updateParams.push(className); }
      if (idCard) { updateFields.push('id_card = ?'); updateParams.push(idCard); }
      if (phone !== undefined) { updateFields.push('phone = ?'); updateParams.push(phone); }
      if (status !== undefined) { updateFields.push('status = ?'); updateParams.push(status); }

      if (!updateFields.length) {
        return false;
      }

      updateParams.push(id);
      const [result] = await connection.query(`UPDATE students SET ${updateFields.join(', ')} WHERE id = ?`, updateParams);
      return result.affectedRows > 0;
    });
  }

  static async batchUpdate(students) {
    return getConnectionWithCharset(async (connection) => {
      let updatedCount = 0;
      for (const student of students) {
        const { id, name, gender, school, grade, className, idCard, phone, status } = student;

        const updateFields = [];
        const updateParams = [];

        if (name) { updateFields.push('name = ?'); updateParams.push(name); }
        if (gender) { updateFields.push('gender = ?'); updateParams.push(gender); }
        if (school) { updateFields.push('school = ?'); updateParams.push(school); }
        if (grade) { updateFields.push('grade = ?'); updateParams.push(grade); }
        if (className) { updateFields.push('class_name = ?'); updateParams.push(className); }
        if (idCard) { updateFields.push('id_card = ?'); updateParams.push(idCard); }
        if (phone !== undefined) { updateFields.push('phone = ?'); updateParams.push(phone); }
        if (status !== undefined) { updateFields.push('status = ?'); updateParams.push(status); }

        if (updateFields.length > 0) {
          updateParams.push(id);
          const [result] = await connection.query(`UPDATE students SET ${updateFields.join(', ')} WHERE id = ?`, updateParams);
          updatedCount += result.affectedRows;
        }
      }
      return updatedCount;
    });
  }

  static async delete(id) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query('DELETE FROM students WHERE id = ?', [id]);
      return result.affectedRows > 0;
    });
  }

  static async batchDelete(ids) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        `DELETE FROM students WHERE id IN (${ids.map(() => '?').join(', ')})`,
        ids
      );
      return result.affectedRows;
    });
  }

  static async updateHasOrder(studentId, hasOrder) {
    return getConnectionWithCharset(async (connection) => {
      await connection.query('UPDATE students SET has_order = ? WHERE id = ?', [hasOrder, studentId]);
    });
  }

  static async clearHasOrderIfNoOrders(studentIds) {
    return getConnectionWithCharset(async (connection) => {
      for (const studentId of studentIds) {
        const [count] = await connection.query('SELECT COUNT(*) as total FROM order_items WHERE student_id = ?', [studentId]);
        if (count[0].total === 0) {
          await connection.query('UPDATE students SET has_order = 0 WHERE id = ?', [studentId]);
        }
      }
    });
  }
}

export default StudentModel;