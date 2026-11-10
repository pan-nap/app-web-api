import AuditModel from '#models/AuditModel';

export class AuditService {
  async record(entry) {
    return AuditModel.record(entry);
  }

  async list(filters = {}) {
    return AuditModel.list(filters);
  }
}

export default new AuditService();