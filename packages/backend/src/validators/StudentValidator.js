class StudentValidator {
  static validateCreate(data) {
    const { name, gender, school, grade, className, idCard } = data;
    
    if (!name || !gender || !school || !grade || !className || !idCard) {
      return { valid: false, message: '请填写必填字段' };
    }

    if (idCard.length !== 18) {
      return { valid: false, message: '身份证号必须为 18 位' };
    }

    return { valid: true };
  }

  static validateUpdate(data) {
    const { idCard } = data;
    
    if (idCard && idCard.length !== 18) {
      return { valid: false, message: '身份证号必须为 18 位' };
    }

    const hasUpdateField = ['name', 'gender', 'school', 'grade', 'className', 'idCard', 'phone', 'status'].some(key => data[key] !== undefined);
    
    if (!hasUpdateField) {
      return { valid: false, message: '没有需要更新的字段' };
    }

    return { valid: true };
  }

  static validateBatchUpdate(data) {
    const { students } = data;
    
    if (!students?.length) {
      return { valid: false, message: '请选择要更新的学生' };
    }

    return { valid: true };
  }

  static validateBatchDelete(data) {
    const { ids } = data;
    
    if (!ids?.length) {
      return { valid: false, message: '请选择要删除的学生' };
    }

    return { valid: true };
  }
}

export default StudentValidator;