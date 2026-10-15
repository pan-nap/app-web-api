/**
 * 接口文档服务
 *
 * 生成拍平结构的接口文档 JSON，供前端 api-doc.uvue 拉取解析。
 * 说明：
 * 1. api-doc.uvue 读取的是原始 { tags, apis } 结构（非 { code, data, msg } 信封），
 *    且参数按扁平字段读取（parame.name / parame.type / parame.description / parame.required）。
 * 2. 刻意不用 OpenAPI 的 paths+方法名嵌套 key（如 {"get":{...}}）：
 *    uni-app x 的 UTSJSONObject 自带只读方法 get/set，构造时赋值 key "get" 会抛
 *    "Cannot assign to read only property 'get'"。所以每个端点拍平为对象，method 作为字符串值。
 */

// 便捷构造参数描述对象
const p = (name, type, description, required = false) => ({
  name,
  type,
  description,
  required
});

// 路径参数（:id 类）
const idParam = (desc = '资源ID') => p('id', 'string', desc, true);

// 通用分页查询参数
const pageParams = () => [
  p('page', 'integer', '页码', false),
  p('pageSize', 'integer', '每页条数', false)
];

/**
 * 接口模块声明表：每个模块含 tag（分类名）与 endpoints（端点列表）。
 * 端点字段：method / path / summary / parameters
 */
const modules = [
  {
    tag: '认证授权',
    description: '登录、登出与健康检查',
    endpoints: [
      { method: 'post', path: '/login', summary: '用户登录', parameters: [p('username', 'string', '用户名', true), p('password', 'string', '密码', true)] },
      { method: 'post', path: '/logout', summary: '退出登录', parameters: [] },
      { method: 'get', path: '/home', summary: '服务状态检查', parameters: [] }
    ]
  },
  {
    tag: '学生管理',
    description: '学生信息的增删改查与批量操作',
    endpoints: [
      { method: 'get', path: '/student', summary: '查询学生列表', parameters: [p('idCard', 'string', '身份证号', false), ...pageParams()] },
      { method: 'post', path: '/student', summary: '创建学生', parameters: [p('name', 'string', '姓名', true), p('idCard', 'string', '身份证号', true)] },
      { method: 'get', path: '/student/{id}', summary: '查询学生详情', parameters: [idParam('学生ID')] },
      { method: 'put', path: '/student/{id}', summary: '更新学生', parameters: [idParam('学生ID')] },
      { method: 'delete', path: '/student/{id}', summary: '删除学生', parameters: [idParam('学生ID')] },
      { method: 'put', path: '/student/batch', summary: '批量更新学生', parameters: [] },
      { method: 'post', path: '/student/batch/delete', summary: '批量删除学生', parameters: [] }
    ]
  },
  {
    tag: '订单管理',
    description: '收银订单、明细与收款码',
    endpoints: [
      { method: 'get', path: '/order', summary: '查询订单列表', parameters: [...pageParams()] },
      { method: 'post', path: '/order', summary: '创建订单', parameters: [] },
      { method: 'get', path: '/order/{id}', summary: '查询订单详情', parameters: [idParam('订单ID')] },
      { method: 'put', path: '/order/{id}', summary: '更新订单', parameters: [idParam('订单ID')] },
      { method: 'delete', path: '/order/{id}', summary: '删除订单', parameters: [idParam('订单ID')] },
      { method: 'get', path: '/order/{id}/items', summary: '查询订单明细', parameters: [idParam('订单ID')] },
      { method: 'put', path: '/order/item/{id}', summary: '更新订单明细', parameters: [idParam('订单明细ID')] },
      { method: 'post', path: '/order/{id}/pay-code', summary: '生成收款码', parameters: [idParam('订单ID')] },
      { method: 'post', path: '/order/batch/delete', summary: '批量删除订单', parameters: [] }
    ]
  },
  {
    tag: '字典管理',
    description: '系统字典项维护',
    endpoints: [
      { method: 'get', path: '/dictionary', summary: '查询字典列表', parameters: [...pageParams()] },
      { method: 'post', path: '/dictionary', summary: '创建字典', parameters: [] },
      { method: 'get', path: '/dictionary/{id}', summary: '查询字典详情', parameters: [idParam('字典ID')] },
      { method: 'put', path: '/dictionary/{id}', summary: '更新字典', parameters: [idParam('字典ID')] },
      { method: 'delete', path: '/dictionary/{id}', summary: '删除字典', parameters: [idParam('字典ID')] }
    ]
  },
  {
    tag: '员工管理',
    description: '员工信息的增删改查与批量操作',
    endpoints: [
      { method: 'get', path: '/employee', summary: '查询员工列表', parameters: [...pageParams()] },
      { method: 'post', path: '/employee', summary: '创建员工', parameters: [] },
      { method: 'get', path: '/employee/{id}', summary: '查询员工详情', parameters: [idParam('员工ID')] },
      { method: 'put', path: '/employee/{id}', summary: '更新员工', parameters: [idParam('员工ID')] },
      { method: 'delete', path: '/employee/{id}', summary: '删除员工', parameters: [idParam('员工ID')] },
      { method: 'post', path: '/employee/batch/delete', summary: '批量删除员工', parameters: [] }
    ]
  },
  {
    tag: '文书管理',
    description: '文书模板与变量值',
    endpoints: [
      { method: 'get', path: '/document', summary: '查询文书列表', parameters: [...pageParams()] },
      { method: 'post', path: '/document', summary: '创建文书', parameters: [] },
      { method: 'get', path: '/document/{id}', summary: '查询文书详情', parameters: [idParam('文书ID')] },
      { method: 'put', path: '/document/{id}', summary: '更新文书', parameters: [idParam('文书ID')] },
      { method: 'delete', path: '/document/{id}', summary: '删除文书', parameters: [idParam('文书ID')] },
      { method: 'post', path: '/document/batch/delete', summary: '批量删除文书', parameters: [] },
      { method: 'get', path: '/document/{id}/template', summary: '查询文书模板', parameters: [idParam('文书ID')] },
      { method: 'get', path: '/document/{id}/values', summary: '查询文书变量值', parameters: [idParam('文书ID')] },
      { method: 'put', path: '/document/{id}/values', summary: '保存文书变量值', parameters: [idParam('文书ID')] }
    ]
  },
  {
    tag: '文件上传',
    description: '单文件/批量上传与删除',
    endpoints: [
      { method: 'post', path: '/upload', summary: '上传单个文件', parameters: [p('path', 'string', '存储子目录', false)] },
      { method: 'post', path: '/upload/batch', summary: '批量上传文件', parameters: [p('path', 'string', '存储子目录', false)] },
      { method: 'delete', path: '/upload', summary: '删除文件', parameters: [] },
      { method: 'delete', path: '/upload/batch', summary: '批量删除文件', parameters: [] }
    ]
  }
];

/**
 * 将模块声明表转换为接口文档对象。
 * apis 为拍平的端点列表：{ path, method, summary, tags, parameters, description }
 * @returns {{ info: object, tags: Array, apis: Array }}
 */
function buildApiDoc() {
  const tags = modules.map((m) => ({ name: m.tag, description: m.description }));
  const apis = [];

  for (const m of modules) {
    for (const ep of m.endpoints) {
      apis.push({
        path: ep.path,
        method: ep.method.toUpperCase(),
        summary: ep.summary,
        tags: m.tag,
        description: m.description,
        parameters: ep.parameters
      });
    }
  }

  return {
    openapi: '3.0.1-flatten',
    info: {
      title: '收银系统后端接口文档',
      version: '1.0.0'
    },
    tags,
    apis
  };
}

export default class ApiDocService {
  static getApiDoc() {
    return buildApiDoc();
  }
}
