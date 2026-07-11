import EmployeeModel from '#models/EmployeeModel';
import EmployeeValidator from '#validators/EmployeeValidator';
import { hashPassword } from '#utils/bcrypt';

class EmployeeService {
  static async getEmployees(params) {
    const result = await EmployeeModel.findAll(params);
    return { data: result.data, total: result.total };
  }

  static async getEmployeeById(id) {
    const validation = EmployeeValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      throw new Error('员工不存在');
    }
    return employee;
  }

  static async createEmployee(data) {
    const validation = EmployeeValidator.validateCreate(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const existingByUsername = await EmployeeModel.findByUsername(data.username);
    if (existingByUsername) {
      throw new Error('用户名已存在');
    }

    const existingByPhone = await EmployeeModel.findByPhone(data.phone);
    if (existingByPhone) {
      throw new Error('手机号码已存在');
    }

    const hashedPassword = await hashPassword(data.password);
    const id = await EmployeeModel.create({ ...data, password: hashedPassword });
    return { id };
  }

  static async updateEmployee(id, data) {
    const validation = EmployeeValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      throw new Error('员工不存在');
    }

    const updateValidation = EmployeeValidator.validateUpdate(data);
    if (!updateValidation.valid) {
      throw new Error(updateValidation.message);
    }

    if (data.username && data.username !== employee.username) {
      const existing = await EmployeeModel.findByUsername(data.username, id);
      if (existing) {
        throw new Error('用户名已存在');
      }
    }

    if (data.phone && data.phone !== employee.phone) {
      const existing = await EmployeeModel.findByPhone(data.phone, id);
      if (existing) {
        throw new Error('手机号码已存在');
      }
    }

    await EmployeeModel.update(id, data);
  }

  static async deleteEmployee(id) {
    const validation = EmployeeValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      throw new Error('员工不存在');
    }

    await EmployeeModel.delete(id);
  }

  static async batchDeleteEmployees(data) {
    const validation = EmployeeValidator.validateBatchDelete(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const deletedCount = await EmployeeModel.batchDelete(data.ids);
    return { deletedCount };
  }
}

export default EmployeeService;