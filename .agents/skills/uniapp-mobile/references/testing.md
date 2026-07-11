---
name: testing
description: 集成测试编写
---

# 测试规范

## 测试环境

使用 Jest + Playwright 进行集成测试，通过 HBuilderX CLI 运行。

## 测试文件位置

测试文件放在对应页面目录下：

```
pages/login/
├── index.uvue
└── index.test.js    # 登录页测试

pages/index/
├── index.uvue
└── index.test.js    # 首页测试
```

## 测试结构

```javascript
// pages/login/index.test.js
const fs = require('node:fs')
const path = require('node:path')

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Mock 接口响应
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

// 提取公共选择器
function accountInput(page) {
  return page.locator('input.login-account-input, .login-account-input input').first()
}

async function runWebTest({ context, baseUrl, projectRoot, testcaseFile }) {
  const page = await context.newPage()

  // Mock 接口
  await context.route('**/sf-web/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildLoginResponse())
    })
  })

  try {
    // 测试1：默认渲染校验
    await clearToken(page)
    const defaultAccount = await accountInput(page).inputValue()
    if (defaultAccount !== 'admin') throw new Error('默认渲染校验失败')
    console.log(`PASS ${testcaseFile} 默认渲染账号与密码`)

    // 测试2：非法登录拦截
    await accountInput(page).fill('a')
    await passwordInput(page).fill('123')
    await submitButton(page).click()
    await wait(800)
    if (!page.url().includes('/pages/login/index')) {
      throw new Error('非法账号场景跳转异常')
    }
    console.log(`PASS ${testcaseFile} 非法账号与密码时阻止登录`)

    // 测试3：正常登录跳转
    await accountInput(page).fill('admin')
    await passwordInput(page).fill('123456')
    await submitButton(page).click()
    await page.waitForSelector('text=退出登录', { timeout: 15000 })
    console.log(`PASS ${testcaseFile} 通过校验后可完成登录跳转`)

    // 测试4：截图输出
    await page.screenshot({ path: screenshotPath, fullPage: true })
    console.log(`PASS ${testcaseFile} 可以输出登录后首页截图`)
  } finally {
    await page.close()
    await context.unroute('**/sf-web/login')
  }
}

module.exports = { runWebTest }
```

## 测试命令

```bash
# H5 测试
pnpm --filter @cashier/app test:web

# 测试脚本说明
# 内部调用 `cli.exe uniapp.test web --project . --browser Edge`
```
