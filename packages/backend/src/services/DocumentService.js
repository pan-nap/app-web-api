import DocumentModel from '#models/DocumentModel';
import DocumentValidator from '#validators/DocumentValidator';

class DocumentService {
  static async getDocuments(params) {
    const result = await DocumentModel.findAll(params);
    // 处理 content 字段反序列化
    const data = result.data.map((doc) => ({
      ...doc,
      content: doc.content ? JSON.parse(doc.content) : null
    }));
    return { data, total: result.total };
  }

  static async getDocumentById(id) {
    const doc = await DocumentModel.findById(id);
    if (!doc) {
      throw new Error('文书不存在');
    }
    return {
      ...doc,
      content: doc.content ? JSON.parse(doc.content) : null
    };
  }

  static async createDocument(data) {
    const validation = DocumentValidator.validateCreate(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const id = await DocumentModel.create(data);
    return { id };
  }

  static async updateDocument(id, data) {
    const doc = await DocumentModel.findById(id);
    if (!doc) {
      throw new Error('文书不存在');
    }

    const validation = DocumentValidator.validateUpdate(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    await DocumentModel.update(id, data);
  }

  static async deleteDocument(id) {
    const doc = await DocumentModel.findById(id);
    if (!doc) {
      throw new Error('文书不存在');
    }

    await DocumentModel.delete(id);
  }

  static async batchDeleteDocuments(data) {
    const validation = DocumentValidator.validateBatchDelete(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const deletedCount = await DocumentModel.batchDelete(data.ids);
    return { deletedCount };
  }
}

export default DocumentService;
