class DocumentValidator {
  static validateCreate(data) {
    const { name } = data;

    if (!name || !name.trim()) {
      return { valid: false, message: '文书标题不能为空' };
    }

    return { valid: true };
  }

  static validateUpdate(data) {
    const hasUpdateField = ['name', 'type', 'content', 'patientId', 'status'].some(
      key => data[key] !== undefined
    );

    if (!hasUpdateField) {
      return { valid: false, message: '没有需要更新的字段' };
    }

    if (data.name !== undefined && !data.name.trim()) {
      return { valid: false, message: '文书标题不能为空' };
    }

    return { valid: true };
  }

  static validateBatchDelete(data) {
    const { ids } = data;

    if (!ids?.length) {
      return { valid: false, message: '请选择要删除的文书' };
    }

    return { valid: true };
  }
}

export default DocumentValidator;
