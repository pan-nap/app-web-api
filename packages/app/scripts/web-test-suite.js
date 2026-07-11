const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const projectRoot = process.cwd()
const hxRoot = 'C:\\Program Files\\HBuilderX'
const cliPluginPath = path.join(hxRoot, 'plugins', 'uniapp-cli-vite')
const uniCliPath = path.join(cliPluginPath, 'node_modules', '@dcloudio', 'vite-plugin-uni', 'bin', 'uni.js')
const playwright = require(path.join(hxRoot, 'plugins', 'hbuilderx-for-uniapp-test-lib', 'node_modules', 'playwright'))
const pagesDir = path.join(projectRoot, 'pages')

function stripAnsi(text) {
  return text.replace(/\u001b\[[0-9;]*m/g, '')
}

function parseArgs(args) {
  const parsed = {
    testcaseFile: ''
  }

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--testcaseFile' && args[i + 1]) {
      parsed.testcaseFile = args[i + 1]
      i += 1
    }
  }

  return parsed
}

async function launchDevServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [uniCliPath, '-p', 'h5', '--auto-port', '9520'], {
      cwd: cliPluginPath,
      env: {
        ...process.env,
        NODE_ENV: 'development',
        UNI_INPUT_DIR: projectRoot,
        UNI_OUTPUT_DIR: path.join(projectRoot, 'unpackage', 'dist', 'dev', 'h5'),
        UNI_HBUILDERX_PLUGINS: path.join(hxRoot, 'plugins'),
        UNI_PLATFORM: 'h5'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    })

    const onOutput = (chunk) => {
      const text = chunk.toString()
      const plainText = stripAnsi(text)
      process.stdout.write(text)

      const localMatch = plainText.match(/Local:\s+(http:\/\/localhost:\d+\/h5\/)/)
      if (localMatch) {
        resolve({ child, baseUrl: localMatch[1] })
      }
    }

    child.stdout.on('data', onOutput)
    child.stderr.on('data', (chunk) => {
      process.stderr.write(chunk.toString())
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code !== null && code !== 0) {
        reject(new Error(`H5 编译进程异常退出，exit code: ${code}`))
      }
    })
  })
}

function selectTests(testcaseFile) {
  if (!testcaseFile) {
    return collectTestFiles(pagesDir)
  }

  const absolutePath = path.join(projectRoot, testcaseFile)
  if (!fs.existsSync(absolutePath)) {
    return []
  }

  return [testcaseFile]
}

function collectTestFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectTestFiles(fullPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.test.js')) {
      files.push(path.relative(projectRoot, fullPath).replace(/\\/g, '/'))
    }
  }

  return files.sort()
}

function loadTestModule(testcaseFile) {
  const absolutePath = path.join(projectRoot, testcaseFile)
  delete require.cache[require.resolve(absolutePath)]
  const moduleExports = require(absolutePath)

  if (typeof moduleExports.runWebTest !== 'function') {
    throw new Error(`测试文件未导出 runWebTest: ${testcaseFile}`)
  }

  return moduleExports
}

async function run() {
  const { testcaseFile } = parseArgs(process.argv.slice(2))
  const selectedTests = selectTests(testcaseFile)

  if (selectedTests.length === 0) {
    throw new Error(`没有可运行的 Web 迁移用例: ${testcaseFile}`)
  }

  const { child, baseUrl } = await launchDevServer()
  const browser = await playwright.chromium.launch({
    channel: 'msedge',
    headless: true
  })

  try {
    for (const testcaseFile of selectedTests) {
      console.log(`RUN ${testcaseFile}`)
      const testModule = loadTestModule(testcaseFile)
      const context = await browser.newContext()
      try {
        await testModule.runWebTest({ context, baseUrl, projectRoot, testcaseFile })
      } finally {
        await context.close()
      }
    }
  } finally {
    await browser.close()
    child.kill('SIGTERM')
  }
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
