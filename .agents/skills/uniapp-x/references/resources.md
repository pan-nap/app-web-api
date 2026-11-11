---
name: resources
description: UniApp X 官方文档位置
---

# 文档资源

## 本地文档

```
C:\Program Files\HBuilderX\plugins\hbuilderx-ai-chat\uni-agent\knowledges\uni-app-x\docs
```

> 该镜像随 HBuilderX 版本更新，**与当前编译器版本最匹配，优先于在线文档和本 skill 描述**；蒸汽模式相关必读：
>
> | 主题                     | 本地文件                                  |
> | ------------------------ | ----------------------------------------- |
> | 蒸汽模式总览/开发注意    | `app-vapor.md`                            |
> | 蒸汽模式的逻辑层归属     | `readme.md`（「VDOM模式和蒸汽模式」章节） |
> | uts2js（js 运行时差异）  | `uts/uts2js.md`                           |
> | 样式隔离策略 2.0         | `css/common/style-isolation.md`           |
> | 选择器支持范围           | `css/common/selector.md`                  |
> | flatten 拍平属性         | `component/common.md`（#flatten）         |
> | 下拉刷新/页面滚动        | `api/pull-down-refresh.md`、`page.md`     |
> | uni.request 返回类型注意 | `api/request.md`（#json、#tips）          |
> | 编译到 web               | `web/README.md`                           |
> | 鸿蒙蒸汽模式             | `app-harmony/harmony-vapor.md`            |

## 在线文档

- [uni-app x 官方文档](https://doc.dcloud.net.cn/uni-app-x/)
- [蒸汽模式介绍](https://doc.dcloud.net.cn/uni-app-x/app-vapor.html)
- [样式隔离策略 2.0](https://doc.dcloud.net.cn/uni-app-x/css/common/style-isolation.html)
- [uts2js（蒸汽模式 js 运行时差异）](https://doc.dcloud.net.cn/uni-app-x/uts/uts2js.html)
- [uni-app 升 uni-app x 指南](https://doc.dcloud.net.cn/uni-app-x/uniapptox.html)
- [UTS 介绍](https://doc.dcloud.net.cn/uni-app-x/uts/)
- [UTS 插件开发](https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin.html)
- [UTS 与 TS 差异](https://doc.dcloud.net.cn/uni-app-x/uts/uts_diff_ts.html)
- [HBuilderX 更新日志](https://hx.dcloud.net.cn/Tutorial/changelog/ReleaseNote_alpha)
- [HBuilderX CLI](https://hx.dcloud.net.cn/cli/README)
- [编译器已知问题](https://doc.dcloud.net.cn/uni-app-x/uts/compiler-known-issues.html)
- [uni-app x 语言服务插件（Cursor/VSCode）](https://gitcode.com/dcloud/uni-app-x-ai-rules)
- [集成 Android 原生 SDK](https://doc.dcloud.net.cn/uni-app-x/native/use/android.html)
- [集成 iOS 原生 SDK](https://doc.dcloud.net.cn/uni-app-x/native/use/ios.html)
- [集成鸿蒙原生 SDK](https://doc.dcloud.net.cn/uni-app-x/native/use/harmony.html)
- [AI Rules 规则库](https://gitcode.com/dcloud/uni-app-x-ai-rules)
- [MCP 配置](https://www.npmjs.com/package/@dcloudio/uni-app-x-mcp)

## 按问题类型定位

> 蒸汽模式必读的具体镜像文件已在上面「本地文档」表中列出，不重复；本表只补“按现象找目录”的路子。

| 问题类型                   | 参考文档                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------- |
| **语法/类型/组件/API**     | 本地镜像对应目录：`uts/`、`page/`、`component/`、`api/`                                                 |
| **编译错误**               | 上方「在线文档」的编译器已知问题链接                                                                    |
| **useAttrs / attrs 访问**  | 本 skill [组件使用](component-usage.md)「useAttrs 安全使用规范」；插件内的强类型转换见 uts-plugin skill |
| **Promise 异步 / forEach** | 本 skill [常见问题](common-issues.md)「老写法禁令」                                                     |
