import { apiClient, loginAsAdmin } from './testUtils.js'

describe('订单管理接口', () => {
  let token
  let createdOrderId

  beforeAll(async () => {
    token = await loginAsAdmin()
  })

  it('GET /order - 分页查询订单列表', async () => {
    const response = await apiClient
      .get('/order')
      .set('Authorization', `Bearer ${token}`)
      .query({ currentPage: 1, pageSize: 10 })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(typeof response.body.total).toBe('number')
  })

  it('POST /order - 创建订单', async () => {
    const response = await apiClient
      .post('/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        school: '第一小学',
        grade: '一年级',
        className: '一班',
        packageName: '测试套餐',
        packageAmount: 1000
      })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('orderId')
    createdOrderId = response.body.data.orderId
  })

  it('GET /order/:id/items - 获取订单项', async () => {
    const response = await apiClient
      .get(`/order/${createdOrderId}/items`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.msg).toBe('查询成功')
  })

  it('POST /order/:id/pay-code - 生成支付码', async () => {
    const response = await apiClient
      .post(`/order/${createdOrderId}/pay-code`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('payCode')
  })

  it('GET /order/:id - 获取单个订单', async () => {
    const response = await apiClient
      .get(`/order/${createdOrderId}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('id', createdOrderId)
  })

  it('PUT /order/:id - 更新订单', async () => {
    const response = await apiClient
      .put(`/order/${createdOrderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        packageName: '更新后的套餐'
      })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
  })

  it('DELETE /order/:id - 删除订单', async () => {
    const response = await apiClient
      .delete(`/order/${createdOrderId}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
  })

  it('POST /order/batch/delete - 批量删除订单', async () => {
    const response = await apiClient
      .post('/order/batch/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ ids: [99998, 99999] })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.msg).toContain('成功删除')
  })
})