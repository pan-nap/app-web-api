import DictionaryModel from '#models/DictionaryModel';
import DictionaryValidator from '#validators/DictionaryValidator';

class DictionaryService {
  static async getDictionaries(params = {}) {
    const { type, currentPage, pageSize } = params;
    return DictionaryModel.findAll(type, parseInt(currentPage), parseInt(pageSize));
  }

  static async getDictionariesByType(type = null) {
    const result = await DictionaryModel.findByType(type);
    return result.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push({ label: item.label, value: item.value });
      return acc;
    }, {});
  }

  static async getDictionaryById(id) {
    const validation = DictionaryValidator.validateId(id);
    if (!validation.valid) throw new Error(validation.message);
    
    const result = await DictionaryModel.findById(id);
    if (!result) throw new Error('字典项不存在');
    
    return result;
  }

  static async createDictionary(data) {
    const validation = DictionaryValidator.validateCreate(data);
    if (!validation.valid) throw new Error(validation.message);
    
    const { type, label, value, sort_order = 0 } = data;
    return { id: await DictionaryModel.create({ type, label, value, sort_order }) };
  }

  static async updateDictionary(id, data) {
    const validation = DictionaryValidator.validateId(id);
    if (!validation.valid) throw new Error(validation.message);
    
    const existing = await DictionaryModel.findById(id);
    if (!existing) throw new Error('字典项不存在');
    
    const { type, label, value, sort_order } = data;
    const updateData = {};
    if (type !== undefined) updateData.type = type;
    if (label !== undefined) updateData.label = label;
    if (value !== undefined) updateData.value = value;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    
    if (Object.keys(updateData).length === 0) throw new Error('至少需要更新一个字段');
    
    await DictionaryModel.update(id, updateData);
  }

  static async deleteDictionary(id) {
    const validation = DictionaryValidator.validateId(id);
    if (!validation.valid) throw new Error(validation.message);
    
    const result = await DictionaryModel.delete(id);
    if (!result) throw new Error('操作失败');
  }
}

export default DictionaryService;