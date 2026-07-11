import OrderModel from '#models/OrderModel';
import StudentModel from '#models/StudentModel';
import OrderValidator from '#validators/OrderValidator';

class OrderService {
  static async getOrders(params) {
    const result = await OrderModel.findAll(params);
    return { data: result.data, total: result.total };
  }

  static async getOrderById(id) {
    const order = await OrderModel.findWithItems(id);
    if (!order) {
      throw new Error('订单不存在');
    }
    return order;
  }

  static async getOrderItems(orderId) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new Error('订单不存在');
    }

    const items = await OrderModel.findItemsByOrderId(orderId);
    return items;
  }

  static async createOrder(data) {
    const validation = OrderValidator.validateCreate(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const students = await StudentModel.findBySchoolGradeClass(
      data.school,
      data.grade,
      data.className
    );

    if (!students.length) {
      throw new Error('该班级没有可用的学生');
    }

    const result = await OrderModel.createWithTransaction(data, students);
    return result;
  }

  static async updateOrder(id, data) {
    const order = await OrderModel.findById(id);
    if (!order) {
      throw new Error('订单不存在');
    }

    const validation = OrderValidator.validateUpdate(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    await OrderModel.update(id, data);
  }

  static async updateOrderItem(id, data) {
    const item = await OrderModel.findItemById(id);
    if (!item) {
      throw new Error('订单明细不存在');
    }

    const validation = OrderValidator.validateUpdateItem(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    await OrderModel.updateItem(id, data);

    const allPaid = await OrderModel.checkAllPaid(item.order_id);
    if (allPaid) {
      await OrderModel.markAsCompleted(item.order_id);
    }
  }

  static async deleteOrder(id) {
    const order = await OrderModel.findById(id);
    if (!order) {
      throw new Error('订单不存在');
    }

    await OrderModel.deleteWithItems(id);
  }

  static async batchDeleteOrders(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('请提供删除数据');
    }
    
    const validation = OrderValidator.validateBatchDelete(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    await OrderModel.batchDeleteWithItems(data.ids);
    return { deletedCount: data.ids.length };
  }

  static async generatePayCode(orderId) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new Error('订单不存在');
    }

    const unpaidCount = await OrderModel.countUnpaidItems(orderId);
    if (unpaidCount === 0) {
      throw new Error('该订单已全部缴费，无需生成支付码');
    }

    const payCode = 'PAY' + Date.now().toString().slice(-10) + Math.random().toString(36).substring(2, 6).toUpperCase();
    return { payCode, orderNo: order.order_no, amount: order.package_amount, unpaidCount };
  }
}

export default OrderService;