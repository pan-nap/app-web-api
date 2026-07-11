import { apiClient, loginAsAdmin } from './testUtils.js'

describe('认证接口', () => {
  it('POST /login - 成功登录', async () => {
    const response = await apiClient
      .post('/login')
      .send({ username: 'admin', password: '123456' })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
    expect(response.body.data).toHaveProperty('access_token')
    expect(response.body.data).toHaveProperty('username')
  })

  it('POST /login - 用户名错误', async () => {
    const response = await apiClient
      .post('/login')
      .send({ username: 'wrong', password: '123456' })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(0)
    expect(response.body.msg).toBe('账号或密码错误')
  })

  it('POST /login - 密码错误', async () => {
    const response = await apiClient
      .post('/login')
      .send({ username: 'admin', password: 'wrong' })
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(0)
    expect(response.body.msg).toBe('账号或密码错误')
  })

  it('POST /logout - 退出登录', async () => {
    const token = await loginAsAdmin()
    const response = await apiClient
      .post('/logout')
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.code).toBe(1)
  })
})
