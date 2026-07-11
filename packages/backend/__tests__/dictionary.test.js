import { apiClient, loginAsAdmin } from './testUtils.js'

describe('字典管理接口', () => {
  let token
  let createdDictId

  beforeAll(async () => {
    token = await loginAsAdmin()
  })

  it('POST /dictionary - 创建字典', async () => {
    const response = await apiClient
      .post('/dictionary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'test_type',
        label: '测试标签',
        value: 'test_value',
        sort_order: 1
      })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('id')
    createdDictId = response.body.data.id
  })

  it('GET /dictionary - 获取所有字典', async () => {
    const response = await apiClient
      .get('/dictionary')
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(typeof response.body.data).toBe('object')
  })

  it('GET /dictionary/:id - 获取单个字典', async () => {
    const response = await apiClient
      .get(`/dictionary/${createdDictId}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('id', createdDictId)
  })

  it('PUT /dictionary/:id - 更新字典', async () => {
    const response = await apiClient
      .put(`/dictionary/${createdDictId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        label: '更新后的标签',
        value: 'updated_value'
      })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
  })

  it('DELETE /dictionary/:id - 删除字典', async () => {
    const response = await apiClient
      .delete(`/dictionary/${createdDictId}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
  })

  it('DELETE /dictionary/:id - 删除不存在的字典', async () => {
    const response = await apiClient
      .delete('/dictionary/99999')
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(0)
  })
})
