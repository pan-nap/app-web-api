import { getConnectionWithCharset } from '#config/database';

class OrderModel {
  static async findAll(params = {}) {
    return getConnectionWithCharset(async (connection) => {
      const { school, grade, className, packageName, paymentStatus, currentPage = 1, pageSize = 20 } = params;

      let query = `SELECT DISTINCT o.id, o.order_no as orderNo, o.school, o.grade, o.class_name as className,
        o.package_name as packageName, o.package_amount as packageAmount, o.creator, o.created_at as createdAt,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as studentCount,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id AND payment_status = '已缴费') as paidCount
        FROM orders o WHERE 1=1`;
      let paramsArr = [];

      if (school) {
        query += ' AND o.school LIKE ?';
        paramsArr.push(`%${school}%`);
      }
      if (grade) {
        query += ' AND o.grade = ?';
        paramsArr.push(grade);
      }
      if (className) {
        query += ' AND o.class_name LIKE ?';
        paramsArr.push(`%${className}%`);
      }
      if (packageName) {
        query += ' AND o.package_name = ?';
        paramsArr.push(packageName);
      }

      query += ` ORDER BY o.created_at DESC LIMIT ${parseInt(pageSize)} OFFSET ${(parseInt(currentPage) - 1) * parseInt(pageSize)}`;

      const [orders] = await connection.query(query, paramsArr);

      const countQuery = `SELECT COUNT(DISTINCT o.id) as total FROM orders o WHERE 1=1` +
        (school ? ' AND o.school LIKE ?' : '') +
        (grade ? ' AND o.grade = ?' : '') +
        (className ? ' AND o.class_name LIKE ?' : '') +
        (packageName ? ' AND o.package_name = ?' : '');

      const [countResult] = await connection.query(countQuery, paramsArr);

      return { data: orders, total: countResult[0].total };
    });
  }

  static async findById(id) {
    return getConnectionWithCharset(async (connection) => {
      const [orders] = await connection.query('SELECT * FROM orders WHERE id = ?', [id]);
      return orders.length ? orders[0] : null;
    });
  }

  static async findWithItems(id) {
    return getConnectionWithCharset(async (connection) => {
      const [orders] = await connection.query('SELECT * FROM orders WHERE id = ?', [id]);
      if (!orders.length) {
        return null;
      }

      const order = orders[0];

      const [orderItems] = await connection.query(
        `SELECT oi.id, oi.student_id as studentId, oi.payment_status as paymentStatus,
          oi.payment_time as paymentTime, s.name as studentName, s.id_card as idCard, s.phone as parentPhone
         FROM order_items oi
         LEFT JOIN students s ON oi.student_id = s.id
         WHERE oi.order_id = ?`,
        [id]
      );

      return { ...order, students: orderItems };
    });
  }

  static async findItemsByOrderId(orderId) {
    return getConnectionWithCharset(async (connection) => {
      const [items] = await connection.query(
        `SELECT oi.id, oi.student_id as studentId, oi.payment_status as paymentStatus,
          oi.payment_time as paymentTime, s.name as studentName, s.id_card as idCard, s.phone as parentPhone
         FROM order_items oi
         LEFT JOIN students s ON oi.student_id = s.id
         WHERE oi.order_id = ?`,
        [orderId]
      );
      return items;
    });
  }

  static async findItemById(id) {
    return getConnectionWithCharset(async (connection) => {
      const [items] = await connection.query('SELECT * FROM order_items WHERE id = ?', [id]);
      return items.length ? items[0] : null;
    });
  }

  static async countUnpaidItems(orderId) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        'SELECT COUNT(*) as count FROM order_items WHERE order_id = ? AND payment_status = ?',
        [orderId, '未缴费']
      );
      return result[0].count;
    });
  }

  static async create(data) {
    return getConnectionWithCharset(async (connection) => {
      const { school, grade, className, packageName, packageAmount, creator } = data;
      
      const orderNo = 'ORD' + Date.now().toString().slice(-10) + Math.random().toString(36).substring(2, 6).toUpperCase();
      
      const [result] = await connection.query(
        'INSERT INTO orders (order_no, school, grade, class_name, package_name, package_amount, creator) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [orderNo, school, grade, className, packageName, packageAmount, creator]
      );
      
      return { id: result.insertId, orderNo };
    });
  }

  static async createWithTransaction(data, students) {
    return getConnectionWithCharset(async (connection) => {
      const { school, grade, className, packageName, packageAmount, creator } = data;
      
      const orderNo = 'ORD' + Date.now().toString().slice(-10) + Math.random().toString(36).substring(2, 6).toUpperCase();

      try {
        await connection.beginTransaction();

        const [result] = await connection.query(
          'INSERT INTO orders (order_no, school, grade, class_name, package_name, package_amount, creator) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [orderNo, school, grade, className, packageName, packageAmount, creator]
        );

        const orderId = result.insertId;

        for (const student of students) {
          await connection.query(
            'INSERT INTO order_items (order_id, student_id, payment_status) VALUES (?, ?, ?)',
            [orderId, student.id, '未缴费']
          );
          await connection.query('UPDATE students SET has_order = 1 WHERE id = ?', [student.id]);
        }

        await connection.commit();

        return { orderId, orderNo, total: students.length };
      } catch (err) {
        await connection.rollback();
        throw err;
      }
    });
  }

  static async update(id, data) {
    return getConnectionWithCharset(async (connection) => {
      const { packageName, packageAmount, orderStatus } = data;
      
      const updateFields = [];
      const updateParams = [];

      if (packageName) { updateFields.push('package_name = ?'); updateParams.push(packageName); }
      if (packageAmount) { updateFields.push('package_amount = ?'); updateParams.push(packageAmount); }
      if (orderStatus) { updateFields.push('order_status = ?'); updateParams.push(orderStatus); }

      if (!updateFields.length) {
        return true;
      }

      updateParams.push(id);
      const [result] = await connection.query(`UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`, updateParams);
      return result.affectedRows > 0;
    });
  }

  static async updateItem(id, data) {
    return getConnectionWithCharset(async (connection) => {
      const { paymentStatus, paymentTime } = data;
      
      const updateFields = [];
      const updateParams = [];

      if (paymentStatus) { updateFields.push('payment_status = ?'); updateParams.push(paymentStatus); }
      if (paymentTime) { updateFields.push('payment_time = ?'); updateParams.push(paymentTime); }

      if (!updateFields.length) {
        return true;
      }

      updateParams.push(id);
      const [result] = await connection.query(`UPDATE order_items SET ${updateFields.join(', ')} WHERE id = ?`, updateParams);
      return result.affectedRows > 0;
    });
  }

  static async delete(id) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [id]);
      return result.affectedRows > 0;
    });
  }

  static async deleteWithItems(id) {
    return getConnectionWithCharset(async (connection) => {
      const [orderItems] = await connection.query('SELECT student_id FROM order_items WHERE order_id = ?', [id]);
      const studentIds = orderItems.map(item => item.student_id);

      await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);
      await connection.query('DELETE FROM orders WHERE id = ?', [id]);

      for (const studentId of studentIds) {
        const [count] = await connection.query('SELECT COUNT(*) as total FROM order_items WHERE student_id = ?', [studentId]);
        if (count[0].total === 0) {
          await connection.query('UPDATE students SET has_order = 0 WHERE id = ?', [studentId]);
        }
      }

      return studentIds;
    });
  }

  static async batchDeleteWithItems(ids) {
    return getConnectionWithCharset(async (connection) => {
      const studentIdsSet = new Set();
      
      for (const id of ids) {
        const [orderItems] = await connection.query('SELECT student_id FROM order_items WHERE order_id = ?', [id]);
        orderItems.forEach(item => studentIdsSet.add(item.student_id));
      }

      await connection.query(`DELETE FROM order_items WHERE order_id IN (${ids.map(() => '?').join(', ')})`, ids);
      await connection.query(`DELETE FROM orders WHERE id IN (${ids.map(() => '?').join(', ')})`, ids);

      for (const studentId of studentIdsSet) {
        const [count] = await connection.query('SELECT COUNT(*) as total FROM order_items WHERE student_id = ?', [studentId]);
        if (count[0].total === 0) {
          await connection.query('UPDATE students SET has_order = 0 WHERE id = ?', [studentId]);
        }
      }

      return studentIdsSet.size;
    });
  }

  static async checkAllPaid(orderId) {
    return getConnectionWithCharset(async (connection) => {
      const [result] = await connection.query(
        'SELECT COUNT(*) as total, SUM(CASE WHEN payment_status = ? THEN 1 ELSE 0 END) as paid FROM order_items WHERE order_id = ?',
        ['已缴费', orderId]
      );
      return result[0].total === result[0].paid;
    });
  }

  static async markAsCompleted(orderId) {
    return getConnectionWithCharset(async (connection) => {
      await connection.query('UPDATE orders SET order_status = ? WHERE id = ?', ['已完成', orderId]);
    });
  }
}

export default OrderModel;