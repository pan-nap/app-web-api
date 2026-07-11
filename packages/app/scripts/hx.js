const { spawnSync } = require('node:child_process')
const { existsSync } = require('node:fs')

const cliPath = 'C:\\Program Files\\HBuilderX\\cli.exe'
const rawArgs = process.argv.slice(2)
const args = []

for (let i = 0; i < rawArgs.length; i += 1) {
  const arg = rawArgs[i]

  if (arg === '--project' && rawArgs[i + 1] === '.') {
    args.push(arg, process.cwd())
    i += 1
    continue
  }
  args.push(arg)
}

if (!existsSync(cliPath)) {
  console.error(`HBuilderX CLI 不存在: ${cliPath}`)
  process.exit(1)
}

const result = spawnSync(cliPath, args, {
  cwd: process.cwd(),
  stdio: 'inherit'
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 0)
