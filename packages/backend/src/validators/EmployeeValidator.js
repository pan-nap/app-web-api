class EmployeeValidator {
  static validateId(id) {
    if (!id || !/^\d+$/.test(id)) {
      return { valid: false, message: '无效的ID参数' };
    }
    return { valid: true };
  }

  static validateCreate(data) {
    const { username, password, name, phone } = data;

    if (!username) {
      return { valid: false, message: '请填写用户名' };
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return { valid: false, message: '用户名格式不正确，只能包含字母、数字和下划线，长度3-20位' };
    }
    if (!password) {
      return { valid: false, message: '请填写密码' };
    }
    if (!/^.{6,}$/.test(password)) {
      return { valid: false, message: '密码长度不能少于6位' };
    }
    if (!name) {
      return { valid: false, message: '请填写员工姓名' };
    }
    if (!phone) {
      return { valid: false, message: '请填写手机号码' };
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { valid: false, message: '请输入正确的手机号码' };
    }

    return { valid: true };
  }

  static validateUpdate(data) {
    const { username, phone } = data;

    if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return { valid: false, message: '用户名格式不正确，只能包含字母、数字和下划线，长度3-20位' };
    }
    if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
      return { valid: false, message: '请输入正确的手机号码' };
    }

    const hasField = Object.keys(data).some(key => 
      ['username', 'name', 'phone', 'email', 'role', 'status'].includes(key)
    );

    if (!hasField) {
      return { valid: false, message: '至少需要更新一个字段' };
    }

    return { valid: true };
  }

  static validateBatchDelete(data) {
    if (!data.ids || !Array.isArray(data.ids) || data.ids.length === 0) {
      return { valid: false, message: '请选择要删除的员工' };
    }

    const invalidIds = data.ids.filter(id => !/^\d+$/.test(id));
    if (invalidIds.length > 0) {
      return { valid: false, message: '包含无效的员工ID' };
    }

    return { valid: true };
  }
}

export default EmployeeValidator;