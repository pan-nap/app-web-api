// ============================================
// MQTT 本地测试服务器（aedes）
// 支持：
//   - MQTT over WebSocket: ws://localhost:8098/mqtt
//   - MQTT over TCP:       mqtt://localhost:1883
// ============================================
import http from 'node:http'
import net from 'node:net'
import aedes from 'aedes'
import websocketStream from 'websocket-stream'

const WS_PORT = 8098
const TCP_PORT = 1883
const WS_PATH = '/mqtt'

// 创建 aedes 实例
const broker = aedes({
  id: 'hs-mqtt-server',
  authenticate: (client, username, password, callback) => {
    const user = username != null ? username.toString() : ''
    console.log(`[认证] client=${client.id}, username=${user}`)
    callback(null, true) // 允许所有连接，方便本地测试
  },
  authorizePublish: (client, packet, callback) => {
    callback(null) // 允许所有发布
  },
  authorizeSubscribe: (client, subscription, callback) => {
    callback(null, subscription) // 允许所有订阅
  }
})

// ---- MQTT over WebSocket ----
const httpServer = http.createServer()
websocketStream.createServer({ server: httpServer, path: WS_PATH }, (stream) => {
  console.log(`[WebSocket] 新连接`)
  broker.handle(stream)
})

httpServer.listen(WS_PORT, () => {
  console.log(`\n✅ MQTT over WebSocket: ws://localhost:${WS_PORT}${WS_PATH}`)
})

// ---- MQTT over TCP ----
broker.on('ready', () => {
  try {
    const tcpServer = net.createServer(broker.handle)
    tcpServer.listen(TCP_PORT, () => {
      console.log(`✅ MQTT over TCP:       mqtt://localhost:${TCP_PORT}`)
    })
    tcpServer.on('error', (err) => {
      console.log(`⚠️ TCP 端口 ${TCP_PORT} 不可用:`, err.message)
    })
  } catch (err) {
    console.log(`⚠️ TCP 服务启动失败:`, err.message)
  }
})

// ---- 事件日志 ----
broker.on('client', (client) => {
  console.log(`[连接] client=${client.id} 已连接`)
})

broker.on('clientDisconnect', (client) => {
  console.log(`[断开] client=${client.id} 已断开`)
})

broker.on('subscribe', (subscriptions, client) => {
  for (const sub of subscriptions) {
    console.log(`[订阅] client=${client?.id}, topic=${sub.topic}`)
  }
})

broker.on('unsubscribe', (subscriptions, client) => {
  for (const topic of subscriptions) {
    console.log(`[取消订阅] client=${client?.id}, topic=${topic}`)
  }
})

broker.on('publish', (packet, client) => {
  // 跳过服务器自己发布的消息，防止循环
  if (client == null) return

  const topic = packet.topic
  const payload = packet.payload?.toString() || ''
  const from = client ? client.id : 'SERVER'
  console.log(`[监听到发布的消息=>>>>] from=${from}, topic=${topic}, payload=${payload}`)

  // 发布消息到指定主题
  broker.publish({
    topic: 'uniappx/test/topic-1',
    payload: `收到消息了：${payload}`,
    qos: 0
  })
})

broker.on('error', (err) => {
  console.error('[错误]', err)
})

console.log('🚀 MQTT 测试服务器启动中...')
console.log('端口: WS=8098/mqtt, TCP=1883')
console.log('账号: admin / hsACTIVEMQ@520（本地测试无需验证）')
