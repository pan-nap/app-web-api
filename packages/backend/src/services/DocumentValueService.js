import DocumentValueModel from '#models/DocumentValueModel';
import DocumentModel from '#models/DocumentModel';

class DocumentValueService {

  /** 获取文书的变量值列表，返回 { varKey: varValue } 映射 */
  static async getValuesByDocumentId(documentId) {
    const doc = await DocumentModel.findById(documentId);
    if (!doc) {
      throw new Error('文书不存在');
    }

    const rows = await DocumentValueModel.findByDocumentId(documentId);
    const values = {};
    for (const row of rows) {
      values[row.var_key] = row.var_value;
    }
    return values;
  }

  /** 获取实例关联的模板内容 */
  static async getTemplateContent(documentId) {
    const doc = await DocumentModel.findById(documentId);
    if (!doc) {
      throw new Error('文书不存在');
    }

    // 如果本身就是模板，直接返回自己的 content
    if (doc.type === 'template') {
      return doc.content ? JSON.parse(doc.content) : null;
    }

    // 实例类型：通过 template_id 找到关联模板
    if (!doc.template_id) {
      throw new Error('该实例未关联模板');
    }

    const template = await DocumentModel.findById(doc.template_id);
    if (!template) {
      throw new Error('关联模板不存在');
    }

    return template.content ? JSON.parse(template.content) : null;
  }

  /** 批量保存文书变量值 */
  static async saveValues(documentId, values) {
    const doc = await DocumentModel.findById(documentId);
    if (!doc) {
      throw new Error('文书不存在');
    }

    if (!values || typeof values !== 'object') {
      throw new Error('变量值格式不正确');
    }

    const entries = Object.entries(values)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([varKey, varValue]) => ({ varKey, varValue: String(varValue) }));

    await DocumentValueModel.bulkUpsert(documentId, entries);
    return { savedCount: entries.length };
  }
}

export default DocumentValueService;
