class OrderValidator {
  static validateCreate(data) {
    const { school, grade, className, packageName, packageAmount } = data;
    
    if (!school || !grade || !className || !packageName || !packageAmount) {
      return { valid: false, message: '请填写必填字段' };
    }

    if (typeof packageAmount !== 'number' || packageAmount <= 0) {
      return { valid: false, message: '套餐金额必须大于 0' };
    }

    return { valid: true };
  }

  static validateUpdate(data) {
    const { packageAmount } = data;
    
    if (packageAmount !== undefined && (typeof packageAmount !== 'number' || packageAmount <= 0)) {
      return { valid: false, message: '套餐金额必须大于 0' };
    }

    const hasUpdateField = ['packageName', 'packageAmount', 'orderStatus'].some(key => data[key] !== undefined);
    
    if (!hasUpdateField) {
      return { valid: false, message: '没有需要更新的字段' };
    }

    return { valid: true };
  }

  static validateUpdateItem(data) {
    const { paymentStatus } = data;
    
    if (paymentStatus && !['已缴费', '未缴费'].includes(paymentStatus)) {
      return { valid: false, message: '缴费状态只能是 已缴费 或 未缴费' };
    }

    const hasUpdateField = ['paymentStatus', 'paymentTime'].some(key => data[key] !== undefined);
    
    if (!hasUpdateField) {
      return { valid: false, message: '没有需要更新的字段' };
    }

    return { valid: true };
  }

  static validateBatchDelete(data) {
    const { ids } = data;
    
    if (!ids?.length) {
      return { valid: false, message: '请选择要删除的订单' };
    }

    return { valid: true };
  }

  static validateGeneratePayCode(data) {
    const { orderId } = data;
    
    if (!orderId) {
      return { valid: false, message: '请提供订单ID' };
    }

    if (typeof orderId !== 'number') {
      return { valid: false, message: '订单ID必须是数字' };
    }

    return { valid: true };
  }
}

export default OrderValidator;