import { apiClient, loginAsAdmin } from './testUtils.js'

describe('学生管理接口', () => {
  let token
  let createdStudentId

  beforeAll(async () => {
    token = await loginAsAdmin()
  })

  it('GET /student - 分页查询学生列表', async () => {
    const response = await apiClient
      .get('/student')
      .set('Authorization', `Bearer ${token}`)
      .query({ currentPage: 1, pageSize: 10 })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(typeof response.body.total).toBe('number')
  })

  it('POST /student - 创建学生', async () => {
    const response = await apiClient
      .post('/student')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '测试学生',
        gender: '男',
        school: '第一学校',
        grade: '一年级',
        className: '一班',
        phone: '13800138000',
        idCard: '110101199001011234'
      })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('id')
    createdStudentId = response.body.data.id
  })

  it('GET /student/:id - 获取单个学生', async () => {
    const response = await apiClient
      .get(`/student/${createdStudentId}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('id', createdStudentId)
  })

  it('PUT /student/:id - 更新学生', async () => {
    const response = await apiClient
      .put(`/student/${createdStudentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '更新后的学生'
      })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
  })

  it('DELETE /student/:id - 删除学生', async () => {
    const response = await apiClient
      .delete(`/student/${createdStudentId}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
  })

  it('POST /student/batch/delete - 批量删除学生', async () => {
    const response = await apiClient
      .post('/student/batch/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ ids: [99998, 99999] })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.msg).toContain('成功删除')
  })

  it('PUT /student/batch - 批量更新学生', async () => {
    const response = await apiClient
      .put('/student/batch')
      .set('Authorization', `Bearer ${token}`)
      .send({ students: [{ id: 99998, status: 1 }, { id: 99999, status: 1 }] })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.msg).toContain('成功更新')
  })
})