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
  env: { ...process.env, NODE_ENV: 'test' }
})

child.on('exit', (code) => {
  process.exit(code)
})
