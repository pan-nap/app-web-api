---
name: build-run
description: CLI命令、构建配置
---

# 编译与运行

## 编译器组成

- **uts 编译器** + **uvue 编译器**；uts 会调用各平台编译器（Kotlin、Swift 等）。
- uvue 基于 **Vite** 扩展；支持 less、sass、scss 等 CSS 预编译。
- 升级 HBuilderX 或编译器后会重新编译。
- Android 编译会产生大量 kt、class 等临时文件，建议将 `unpackage` 目录加入信任/排除扫描。

## 条件编译

```typescript
// #ifdef APP-ANDROID
import Build from 'android.os.Build'
// #endif

// #ifdef APP-IOS
// iOS 专用代码
// #endif

// #ifndef H5
// 非 H5 时编译
// #endif
```

- **#ifdef**：当某条件成立时编译；**#ifndef**：当某条件不成立时编译。
- 可用于 template、style、script。
- 常见条件：**APP-ANDROID**、**APP-IOS**、**APP-HARMONY**、**H5**、**MP-WEIXIN**、**UNI-APP-X**。

## 静态资源

- 图片、字体、音视频：放在项目根目录 **static/**（或 uni_modules 的 /static）。
- web-view 本地 html：放在 **/hybrid**。
- 不要把 .uts、.uvue 等源码放在 static 目录下。

## CLI 工具

使用 HBuilderX CLI 工具：

```bash
# 前提
# 环境变量 Path 已添加 C:\Program Files\HBuilderX

# 查看版本
cli.exe ver

# 调试运行 Web
cli.exe launch web --project . --browser Edge

# 发布构建 Web
cli.exe publish web --project . -o ./dist/h5

# 运行测试
cli.exe uniapp.test web --project . --testcaseFile pages/login/index.test.js --browser chrome
```

## package.json 脚本

```bash
# 开发运行
pnpm dev:web                # Web
pnpm dev:app-android        # Android App

# 构建
pnpm build:web              # 构建 Web

# 测试
pnpm test:web               # H5 测试

# 通过 pnpm --filter 指定包
pnpm --filter @cashier/app dev:web
```
