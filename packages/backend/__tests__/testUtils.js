import request from 'supertest'
import app from '../src/index.js'

export const apiClient = request(app.callback())

export async function loginAsAdmin() {
  const response = await apiClient
    .post('/login')
    .send({ username: 'admin', password: '123456' })
  
  if (response.body && response.body.data && response.body.data.access_token) {
    return response.body.data.access_token
  }
  throw new Error('登录失败: ' + JSON.stringify(response.body))
}
