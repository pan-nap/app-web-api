const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const projectRoot = process.cwd()
const hxRoot = 'C:\\Program Files\\HBuilderX'
const testLibNodeModules = path.join(hxRoot, 'plugins', 'hbuilderx-for-uniapp-test-lib', 'node_modules')
const cliPluginPath = path.join(hxRoot, 'plugins', 'uniapp-cli-vite')
const automatorDistPath = path.join(cliPluginPath, 'node_modules', '@dcloudio', 'uni-automator', 'dist')
const jestPath = path.join(testLibNodeModules, 'jest', 'bin', 'jest.js')
const environmentPath = path.join(automatorDistPath, 'environment.js')
const teardownPath = path.join(automatorDistPath, 'teardown.js')
const envConfigPath = path.join(projectRoot, 'scripts', '.tmp', 'uni-test-env.cjs')
const baseEnvPath = path.join(projectRoot, 'env.js')

const platformArg = process.argv[2]
const extraArgs = process.argv.slice(3)

function parseExtraArgs(args) {
  const parsed = {
    browserName: 'chrome',
    testcaseFile: '',
    deviceId: '',
    jestArgs: []
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]

    if (arg === '--browser' && args[i + 1]) {
      parsed.browserName = String(args[i + 1]).toLowerCase()
      i += 1
      continue
    }

    if (arg === '--testcaseFile' && args[i + 1]) {
      parsed.testcaseFile = args[i + 1]
      i += 1
      continue
    }

    if (arg === '--device_id' && args[i + 1]) {
      parsed.deviceId = args[i + 1]
      i += 1
      continue
    }

    parsed.jestArgs.push(arg)
  }

  return parsed
}

const parsedArgs = parseExtraArgs(extraArgs)

if (platformArg === 'web') {
  const webSuiteArgs = [path.join(projectRoot, 'scripts', 'web-test-suite.js')]
  if (parsedArgs.testcaseFile) {
    webSuiteArgs.push('--testcaseFile', parsedArgs.testcaseFile)
  }

  const result = spawnSync(process.execPath, webSuiteArgs, {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  process.exit(result.status ?? 0)
}

const browserMap = {
  chrome: { platform: 'h5', browser: 'chromium' },
  safari: { platform: 'h5', browser: 'webkit' },
  firefox: { platform: 'h5', browser: 'firefox' }
}

function getBrowserExecutable(browserName) {
  const playwright = require(path.join(testLibNodeModules, 'playwright'))

  if (browserName === 'webkit') {
    return playwright.webkit.executablePath()
  }

  if (browserName === 'firefox') {
    return playwright.firefox.executablePath()
  }

  return playwright.chromium.executablePath()
}

const platformMap = {
  web: () => {
    const selected = browserMap[parsedArgs.browserName] || browserMap.chrome
    return {
      automatorPlatform: selected.platform,
      browser: selected.browser,
      passthroughArgs: parsedArgs.jestArgs
    }
  },
  'app-android': () => ({ automatorPlatform: 'android', passthroughArgs: parsedArgs.jestArgs }),
  'app-ios': () => ({ automatorPlatform: 'ios', passthroughArgs: parsedArgs.jestArgs }),
  'app-harmony': () => ({ automatorPlatform: 'harmony', passthroughArgs: parsedArgs.jestArgs }),
  'mp-weixin': () => ({ automatorPlatform: 'mp-weixin', passthroughArgs: parsedArgs.jestArgs })
}

if (!platformMap[platformArg]) {
  console.error(`不支持的测试平台: ${platformArg}`)
  process.exit(1)
}

if (!fs.existsSync(jestPath)) {
  console.error(`Jest 不存在: ${jestPath}`)
  process.exit(1)
}

if (!fs.existsSync(environmentPath) || !fs.existsSync(teardownPath)) {
  console.error('uni-automator 运行环境不存在，请检查 HBuilderX 安装')
  process.exit(1)
}

const { automatorPlatform, browser, passthroughArgs } = platformMap[platformArg]()
const baseEnvConfig = fs.existsSync(baseEnvPath) ? require(baseEnvPath) : {}
const mergedEnvConfig = {
  ...baseEnvConfig,
  cliPath: cliPluginPath,
  projectPath: projectRoot,
  platform: automatorPlatform,
  compile: true
}

if (parsedArgs.deviceId) {
  if (automatorPlatform === 'android') {
    mergedEnvConfig['app-plus'] = mergedEnvConfig['app-plus'] || {}
    mergedEnvConfig['app-plus'].android = mergedEnvConfig['app-plus'].android || {}
    mergedEnvConfig['app-plus'].android.id = parsedArgs.deviceId
  }

  if (automatorPlatform === 'ios') {
    mergedEnvConfig['app-plus'] = mergedEnvConfig['app-plus'] || {}
    mergedEnvConfig['app-plus'].ios = mergedEnvConfig['app-plus'].ios || {}
    mergedEnvConfig['app-plus'].ios.id = parsedArgs.deviceId
  }
}

if (browser) {
  mergedEnvConfig.h5 = {
    ...(mergedEnvConfig.h5 || {}),
    options: {
      ...((mergedEnvConfig.h5 && mergedEnvConfig.h5.options) || {}),
      headless: true
    },
    executablePath: getBrowserExecutable(browser)
  }
}

fs.mkdirSync(path.dirname(envConfigPath), { recursive: true })
fs.writeFileSync(envConfigPath, `module.exports = ${JSON.stringify(mergedEnvConfig, null, 2)}\n`)

const nodePathEntries = [testLibNodeModules]
if (process.env.NODE_PATH) {
  nodePathEntries.push(process.env.NODE_PATH)
}

const jestArgs = [
  jestPath,
  '-i',
  '--forceExit',
  `--env=${environmentPath}`,
  `--globalTeardown=${teardownPath}`,
  ...passthroughArgs
]

if (parsedArgs.testcaseFile) {
  jestArgs.push(parsedArgs.testcaseFile)
}

const result = spawnSync(process.execPath, jestArgs, {
  cwd: projectRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_PATH: nodePathEntries.join(path.delimiter),
    UNI_AUTOMATOR_CONFIG: envConfigPath,
    BROWSER: browser || process.env.BROWSER || 'chromium'
  }
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 0)
