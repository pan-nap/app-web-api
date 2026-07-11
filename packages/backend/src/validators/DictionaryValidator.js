class DictionaryValidator {
  static validateId(id) {
    if (!id || !/^\d+$/.test(id)) {
      return { valid: false, message: '无效的ID参数' };
    }
    return { valid: true };
  }

  static validateCreate(data) {
    const { type, label, value } = data;
    
    if (!type) {
      return { valid: false, message: '请填写类型' };
    }
    if (!label) {
      return { valid: false, message: '请填写标签' };
    }
    if (!value) {
      return { valid: false, message: '请填写值' };
    }
    
    return { valid: true };
  }
}

export default DictionaryValidator;