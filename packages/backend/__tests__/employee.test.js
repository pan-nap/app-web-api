import { apiClient, loginAsAdmin } from './testUtils.js'

describe('员工管理接口', () => {
  let token
  let createdEmployeeId

  beforeAll(async () => {
    token = await loginAsAdmin()
  })

  it('GET /employee - 分页查询员工列表', async () => {
    const response = await apiClient
      .get('/employee')
      .set('Authorization', `Bearer ${token}`)
      .query({ currentPage: 1, pageSize: 10 })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(typeof response.body.total).toBe('number')
  })

  it('POST /employee - 创建员工', async () => {
    const response = await apiClient
      .post('/employee')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'testuser',
        password: '123456',
        name: '测试员工',
        phone: '13900139000',
        email: 'test@example.com',
        role: 'user',
        status: 1
      })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('id')
    createdEmployeeId = response.body.data.id
  })

  it('GET /employee/:id - 获取单个员工', async () => {
    const response = await apiClient
      .get(`/employee/${createdEmployeeId}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('id', createdEmployeeId)
    expect(response.body.data).toHaveProperty('name', '测试员工')
  })

  it('PUT /employee/:id - 更新员工', async () => {
    const response = await apiClient
      .put(`/employee/${createdEmployeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '更新后的员工',
        phone: '13900139001'
      })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
  })

  it('DELETE /employee/:id - 删除员工', async () => {
    const response = await apiClient
      .delete(`/employee/${createdEmployeeId}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
  })

  it('POST /employee/batch/delete - 批量删除员工', async () => {
    const response = await apiClient
      .post('/employee/batch/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ ids: [99998, 99999] })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.msg).toContain('成功删除')
  })
})