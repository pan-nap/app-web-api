import StudentModel from '#models/StudentModel';
import StudentValidator from '#validators/StudentValidator';

class StudentService {
  static async getStudents(params) {
    const result = await StudentModel.findAll(params);
    return { data: result.data, total: result.total };
  }

  static async getStudentById(id) {
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error('学生不存在');
    }
    return student;
  }

  static async createStudent(data) {
    const validation = StudentValidator.validateCreate(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const existing = await StudentModel.findByIdCard(data.idCard);
    if (existing) {
      throw new Error('身份证号已存在');
    }

    const id = await StudentModel.create(data);
    return { id };
  }

  static async updateStudent(id, data) {
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error('无学生数据需要修改');
    }

    const validation = StudentValidator.validateUpdate(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    if (data.idCard) {
      const existing = await StudentModel.findByIdCard(data.idCard, id);
      if (existing) {
        throw new Error('身份证号已存在');
      }
    }

    await StudentModel.update(id, data);
  }

  static async deleteStudent(id) {
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error('无学生数据需要删除');
    }

    if (student.has_order === 1) {
      throw new Error('该学生存在订单，无法删除');
    }

    await StudentModel.delete(id);
  }

  static async batchUpdateStudents(data) {
    const validation = StudentValidator.validateBatchUpdate(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const updatedCount = await StudentModel.batchUpdate(data.students);
    return { updatedCount };
  }

  static async batchDeleteStudents(data) {
    const validation = StudentValidator.validateBatchDelete(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const studentsWithOrder = await StudentModel.findWithOrders(data.ids);
    if (studentsWithOrder.length > 0) {
      throw new Error('部分学生存在订单，无法删除');
    }

    const deletedCount = await StudentModel.batchDelete(data.ids);
    return { deletedCount };
  }
}

export default StudentService;