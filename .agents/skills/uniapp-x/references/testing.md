---
name: testing
description: 集成测试编写
---

# 测试规范

## 真实运行链路（别再照抄 cli.exe uniapp.test）

Web（h5）用例不走 `cli.exe uniapp.test`，而是项目自己的两个脚本：

```
pnpm test:web  ──►  scripts/uni-test.js web  ──►  scripts/web-test-suite.js
                                                  ├ 自己拉起 uni h5 dev server（`uni -p h5 --auto-port 9520`）
                                                  ├ 从 vite 输出里解析 baseUrl（本项目 http://localhost:8099/h5/）
                                                  └ 用 HBuilderX 内置 playwright + channel:"msedge" 跑
```

- 依赖的 playwright 不在项目 `node_modules`，是 `require` HBuilderX 安装目录：`plugins/hbuilderx-for-uniapp-test-lib/node_modules/playwright`。换机器要确认 HBuilderX 装过「uni-app 测试」相关插件。
- web 分支**不消费 `--browser`**（写死 msedge），要换浏览器得改 `web-test-suite.js`。
- 只跑单个文件：

```bash
node scripts/uni-test.js web --testcaseFile pages/login/index.test.js
node scripts/web-test-suite.js --testcaseFile pages/login/index.test.js   # 等价，少一层转发
```

## 测试文件位置

放在被测页面同目录：`pages/login/index.uvue` ↔ `pages/login/index.test.js`。

## 用例结构

必须导出 `runWebTest`，参数由套件注入：

```javascript
const path = require("node:path");

// 接口前缀必须对齐真实路径（api/*.uts 里的 url）。写错不会报错，只会
// "请求没被拦截 → 打到真后端 → 断言诡异地失败或假通过"
const LOGIN_ROUTE = "**/his-web/sys/login";
const VALIDATE_CODE_ROUTE = "**/his-web/sys/validateCode";

// 页面钩子：写在 hs-input / hs-img / hs-button 标签上的 class，
// 靠组件内 defineOptions({ inheritAttrs: false }) + v-bind="attrs" 落到组件根节点
const HOOKS = {
  account: "login-account-input",
  password: "login-password-input",
  code: "login-code-input",
  captcha: "login-captcha-img",
  submit: "login-submit-btn"
};

async function runWebTest({ context, baseUrl, projectRoot, testcaseFile }) {
  const page = await context.newPage();

  // 登录页 onLoad 就拉验证码，route 必须在首次 goto 之前注册
  await context.route(VALIDATE_CODE_ROUTE, async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ code: 1, data: { valid_code_img: CAPTCHA_IMAGE, valid_code_key: "k" } }) });
  });

  try {
    await page.goto(`${baseUrl}#/pages/login/index`, { waitUntil: "domcontentloaded", timeout: 30000 });
    // 每个断言都打一行 PASS，失败靠这行定位而不是靠猜
    console.log(`PASS ${testcaseFile} 默认渲染空表单且 placeholder 透传生效`);
  } finally {
    await page.close();
    await context.unroute(LOGIN_ROUTE);
    await context.unroute(VALIDATE_CODE_ROUTE);
  }
}

module.exports = { runWebTest };
```

- 判定方式是「抛 Error + `console.log(PASS ...)`」，没有 Jest 的 `expect`；跑通与否看 exit code 和 PASS 行数。
- 断言接口是否被拦截，用计数器（`loginRequestCount`）而不是只看跳转结果，否则「校验没拦住、请求发出去了」这种回归看不出来。
- 截图放 `path.join(projectRoot, "unpackage", "test-report", "xxx.png")`，写完立刻 `fs.existsSync` 校验。**绝不能放 `static/`**：该目录下的文件全部会被 copy 进 app 包（实测曾把 19KB 测试截图带进 `unpackage/resources/app-android/…/www/static/`）。

## uni-app x 编译到 web 时的 DOM 差异（选择器踩坑高发区）

> web/小程序端跑的是 **VDOM 模式**，和 App 端（蒸汽模式）是两条渲染链路。组件层改动必须两端都回归。

1. **class 落在自定义元素上，不在真 `<input>` 上**。`<hs-input class="login-account-input">` 经 attrs 透传后，class 在 `<uni-input>` 上，真 `input` 是它的**子节点**。所以选择器要两种写法都兜：

   ```javascript
   `input.${hook}, .${hook} input`; // 组件可能渲染成裸 input，也可能包一层
   ```

2. **`placeholder` 不是原生 attribute**。实测 web 端被渲染成兄弟节点 `<div class="uni-input-placeholder">请输入账号 / 手机号</div>`，`getAttribute("placeholder")` 恒为 `null`。断言要「attribute 或可见文案命中一种即可」，别绑死 uni 的内部 DOM 结构：

   ```javascript
   async function expectPlaceholder(page, hook, text) {
     const attr = await inputByHook(page, hook).getAttribute("placeholder");
     if (attr === text) return;
     if ((await page.getByText(text, { exact: true }).count()) === 0) {
       throw new Error(`placeholder 未透传（既不是 attribute 也没渲染文案）：${text}`);
     }
   }
   ```

3. **图片同理**：`<hs-img>` 的 class 落在外层 `<uni-image>`，而 `src` 在其内部 `<img>` 上。`locator(".login-captcha-img").getAttribute("src")` 会读到空 —— 用 `evaluate` 按「外层是 IMG 就读它，否则读内层 img」取。

4. **失败一定要 dump DOM**。组件层改动最常见的表现是"选择器突然找不到"，没打印 `outerHTML` 只能靠猜：

   ```javascript
   async function dumpFormHtml(page) {
     const html = await page.evaluate(() => (document.querySelector(".hs-form") || document.body).outerHTML.replace(/\s+/g, " ").slice(0, 3000));
     console.log(`DEBUG form html:\n${html}`);
   }
   ```

## 测试钩子 class 的取舍

- 钩子 class 写在**组件标签**上（不是内部元素），因此它同时也是「attrs 显式透传是否生效」的活体回归：透传一坏，所有选择器集体失效，测试立刻红。
- 这类 class 不带任何样式，纯定位用；命名统一 `<页面>-<区域>-<角色>`（`login-account-input`）。
- 别为了测试给组件内部元素塞 `id`：蒸汽模式下组件默认 `isolated`，内部结构是组件的私有实现，测试不应绑它。

## 完整参考实现

`pages/login/index.test.js`（登录页 6 段：空表单+placeholder 透传 / 验证码图经 hs-img 渲染 / 必填缺失拦截且不发请求 / 输入后错误提示自动清除 / 校验通过跳转并写 TOKEN / 登录后截图）。

## 测试命令

→ 命令不在本文重复维护（cli.exe 调试/构建/测试、pnpm 脚本清单统一见 [编译与运行](build-run.md)）。
