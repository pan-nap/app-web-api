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

  /** 获取文书的模板结构内容（文书均为纯模板，客户动态数据存于 document_values） */
  static async getTemplateContent(documentId) {
    const doc = await DocumentModel.findById(documentId);
    if (!doc) {
      throw new Error('文书不存在');
    }

    return doc.content ? JSON.parse(doc.content) : null;
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
