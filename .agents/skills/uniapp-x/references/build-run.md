---
name: build-run
description: CLI命令、构建配置
---

# 编译与运行

## 编译器组成

- **蒸汽模式（本项目）**：逻辑层编译为 **js** 并在 js 引擎上运行（历史 uts 代码经 `uts2js` 运行）；`template`/`style` 编译为底层**字节码/机器码**；`utssdk/` 插件仍按平台编译为 Kotlin / Swift / ArkTS。
- uvue 基于 **Vite** 扩展；支持 less、sass、scss 等 CSS 预编译（编译时方案，不影响蒸汽模式运行时性能）。
- 升级 HBuilderX 或编译器后会重新编译。
- Android 编译会产生大量临时文件，建议将 `unpackage` 目录加入信任/排除扫描。

## 蒸汽模式版本与运行要求

| 项                | 要求                                                                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| HBuilderX         | 鸿蒙 5.0+、iOS 5.11+、Android 5.21+（本项目 5.24+）                                                                                           |
| 最低系统          | Android 6.0（默认 target 36）、iOS 15、鸿蒙 API 20（鸿蒙 6.0+）                                                                               |
| 编译到 web/小程序 | 仍以 **VDOM 模式**运行，无需为渲染差异写条件编译                                                                                              |
| 视图层编译目标    | 字节码（HBuilderX 5.11+，编译快、性能低约 3%，发行后 wgt 热更需 5.31+）或机器码（C 代码，编译慢）；本项目 `"vapor-render-target": "bytecode"` |

- 性能测试不能用默认的 debug 运行模式：Android **必须打 release 正式包**，鸿蒙可选 release 运行。
- 老旧原生插件可能不支持 Android target 36，报错时需升级插件或在 manifest 降低 target。
- 鸿蒙反复差量编译会打断 deveco 的 Build，偶发 `ninja: error: failed recompaction: Permission denied`，重新运行一次即可。

## 条件编译与静态资源

→ 不在本文重复维护，统一见：

> - 条件编译（#ifdef/#ifndef、常见条件、VUE3-VAPOR）：[条件编译](uts-conditional.md)
> - 静态资源目录（static/、hybrid/、源码不可放 static）：[项目结构](project-structure.md)

## CLI 工具

HBuilderX CLI（`C:\Program Files\HBuilderX\cli.exe`，macOS `…/cli.sh`）。本项目不直接敲 `cli.exe`，而是走一层包装 `node scripts/hx.js <子命令>`——它只做一件事：把 `--project .` 换成绝对路径，并检查 cli 是否存在。

```bash
# 查看版本（这个只能直敲 cli.exe）
cli.exe ver

# 调试运行 Web（本项目脚本名是 dev，没有 dev:web）
node scripts/hx.js launch web --project . --browser Edge

# 发布构建 Android 资源包（日常改完代码的编译验证走这条）
node scripts/hx.js publish app-android --project . --type appResource

# 发布构建 Web
node scripts/hx.js publish web --project . -o ./dist/h5
```

- **`publish app-android --type appResource` 不做类型检查**，只保证能编译出包；类型/运行时问题要真机或 web 用例才暴露。
- 成功标志是两行：`项目 hs-his-app 编译成功。` + `导出 android 成功`。
- ⚠️ **web（h5）测试不走 `cli.exe uniapp.test`**，而是 `node scripts/uni-test.js web`（内部转发到 `scripts/web-test-suite.js`，自己拉 dev server + HBuilderX 内置 playwright）。机制与坑见 [测试规范](testing.md)。

## package.json 脚本

```bash
# 开发运行
pnpm dev                    # Web（注意：不叫 dev:web）
pnpm dev:app-android        # Android App（--playground custom）

# 构建
pnpm build:web              # 构建 Web
pnpm build:app-android      # 构建 Android wgt/appResource

# 测试
pnpm test:web               # H5 全部用例；加 --testcaseFile xxx 跑单个文件
pnpm test:app-android       # Android 用例（走 jest + automator，非 web-test-suite）

# monorepo 下从仓库根指定包
pnpm --filter hs-his-app build:app-android
```
