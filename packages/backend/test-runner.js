#!/usr/bin/env node
import { spawn } from 'child_process'
import { fileURLToPath, URL } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const args = process.argv.slice(2)
const jestPath = join(__dirname, 'node_modules', 'jest', 'bin', 'jest.js')

const child = spawn('node', ['--experimental-vm-modules', jestPath, ...args], {
  stdio: 'inherit',
  cwd: __dirname,
  // 测试强制走 mini-PACS（磁盘+MySQL），与 .env 的内核选择隔离；dotenv 不覆盖已存在的环境变量
  env: { ...process.env, NODE_ENV: 'test', PACS_BACKEND: 'mini' }
})

child.on('exit', (code) => {
  process.exit(code)
})
