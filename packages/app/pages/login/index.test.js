const fs = require('node:fs')
const path = require('node:path')

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildLoginResponse() {
  return {
    code: 1,
    data: {
      access_token: 'test-token',
      username: 'admin',
      pageTitle: '首页',
      id: '1'
    }
  }
}

function pageUrl(baseUrl, query = '') {
  return `${baseUrl}#/pages/login/index${query}`
}

function accountInput(page) {
  return page.locator('input.login-account-input, .login-account-input input').first()
}

function passwordInput(page) {
  return page.locator('input.login-password-input, .login-password-input input').first()
}

function submitButton(page) {
  return page.locator('button.login-submit-btn, .login-submit-btn button, .login-submit-btn').first()
}

async function clearToken(page) {
  await page.evaluate(() => {
    localStorage.removeItem('TOKEN')
    localStorage.removeItem('TOKEN_deadtime')
  })
}

async function waitForLoginPage(page, url) {
  console.log(`OPEN ${url}`)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForSelector('input.login-account-input, .login-account-input input', { timeout: 30000 })
}

async function runWebTest({ context, baseUrl, projectRoot, testcaseFile }) {
  const page = await context.newPage()
  const screenshotPath = path.join(projectRoot, 'static', 'home-after-login-test.png')
  let loginRequestCount = 0

  await context.route('**/sf-web/login', async (route) => {
    loginRequestCount += 1
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildLoginResponse())
    })
  })

  try {
    console.log(`BASE ${baseUrl}`)
    await waitForLoginPage(page, pageUrl(baseUrl))
    await clearToken(page)

    const defaultAccount = await accountInput(page).inputValue()
    const defaultPassword = await passwordInput(page).inputValue()
    if (defaultAccount !== 'admin' || defaultPassword !== '123456') {
      throw new Error(`默认渲染校验失败，账号=${defaultAccount}，密码=${defaultPassword}`)
    }
    console.log(`PASS ${testcaseFile} 默认渲染账号与密码`)

    loginRequestCount = 0
    await waitForLoginPage(page, pageUrl(baseUrl, '?testMode=empty'))
    await clearToken(page)
    await accountInput(page).fill('a')
    await passwordInput(page).fill('123')
    await submitButton(page).click()
    await wait(800)

    if (!page.url().includes('/pages/login/index')) {
      throw new Error(`非法账号场景跳转异常，当前地址=${page.url()}`)
    }
    const invalidToken = await page.evaluate(() => localStorage.getItem('TOKEN'))
    if (invalidToken) {
      throw new Error(`非法账号场景不应写入 TOKEN，实际=${invalidToken}`)
    }
    if (loginRequestCount !== 0) {
      throw new Error(`非法账号场景不应发起登录请求，实际请求数=${loginRequestCount}`)
    }
    console.log(`PASS ${testcaseFile} 非法账号与密码时阻止登录`)

    loginRequestCount = 0
    await waitForLoginPage(page, pageUrl(baseUrl))
    await clearToken(page)
    await accountInput(page).fill('admin')
    await passwordInput(page).fill('123456')
    await submitButton(page).click()
    await page.waitForSelector('text=退出登录', { timeout: 15000 })
    const loginToken = await page.evaluate(() => localStorage.getItem('TOKEN'))
    if (loginToken !== 'test-token') {
      throw new Error(`登录成功后 TOKEN 校验失败，实际=${loginToken}`)
    }
    if (loginRequestCount < 1) {
      throw new Error('登录成功场景未捕获到登录请求')
    }
    const currentUrl = page.url()
    if (currentUrl.includes('/pages/login/index')) {
      throw new Error(`登录成功后仍停留在登录页，当前地址=${currentUrl}`)
    }
    console.log(`PASS ${testcaseFile} 通过校验后可完成登录跳转`)

    await page.waitForSelector('text=退出登录', { timeout: 15000 })
    await page.screenshot({ path: screenshotPath, fullPage: true })
    if (!fs.existsSync(screenshotPath)) {
      throw new Error(`截图文件未生成: ${screenshotPath}`)
    }
    console.log(`PASS ${testcaseFile} 可以输出登录后首页截图`)
  } finally {
    await page.close()
    await context.unroute('**/sf-web/login')
  }
}

module.exports = {
  runWebTest
}
