---
name: "uniapp-mobile"
description: "UniApp 移动端开发规范，涵盖页面生命周期、组件使用、状态管理、请求拦截等。Invoke when developing uni-app x mobile applications."
---

# UniApp 移动端开发规范

> 项目级 uni-app x 开发规范，覆盖项目结构、生命周期、组件使用、状态管理、请求封装、编译运行等全流程。

## 快速定位

| 主题 | 说明 | 参考 |
|------|------|------|
| **项目结构** | 项目目录组织、文件位置 | [project-structure](references/project-structure.md) |
| **生命周期** | 页面/组件生命周期使用 | [lifecycle](references/lifecycle.md) |
| **页面开发** | 页面开发完整示例（登录、首页） | [page-development](references/page-development.md) |
| **组件使用** | hs-screen、hs-card、hs-form、hs-button 等 | [component-usage](references/component-usage.md) |
| **text标签** | 文字必须用text标签，字体属性只能在text上设置 | [component-usage](references/component-usage.md) |
| **布局规范** | Flex布局、卡片风格 | [component-usage](references/component-usage.md) |
| **状态管理** | Store设计（Class模式）、数据解耦 | [state-management](references/state-management.md) |
| **UTSJSONObject** | UTSJSONObject与自定义类型转换 | [utsjson-conversion](references/utsjson-conversion.md) |
| **请求封装** | API调用、请求封装 | [request](references/request.md) |
| **拦截器** | 导航拦截、请求拦截 | [interceptors](references/interceptors.md) |
| **工具函数** | lodash、storage、tool等工具 | [utils](references/utils.md) |
| **测试** | 集成测试编写 | [testing](references/testing.md) |
| **编译运行** | CLI命令、构建配置 | [build-run](references/build-run.md) |
| **常见问题** | 编译错误、类型告警等 | [common-issues](references/common-issues.md) |
| **文档资源** | UniApp X官方文档位置 | [resources](references/resources.md) |
| **App 入口** | App.uvue 生命周期、globalData | [core-app](references/core-app.md) |
| **组合式 API** | ref、reactive、computed、watch | [vue-composition-api](references/vue-composition-api.md) |
| **条件编译** | #ifdef / #ifndef 平台差异化代码 | [uts-conditional](references/uts-conditional.md) |
| **函数与模块** | 函数定义、export/import、try-catch、先定义后调用 | [uts-function-module](references/uts-function-module.md) |
| **UVUE CSS** | UCSS 子集、flex 布局差异、不支持 gap/vh/vw、justify-content 不支持 start/end、max-width 不支持百分比 | [css-ucss](references/css-ucss.md) |
| **页面导航** | navigateTo、redirectTo、reLaunch | [features-navigation](references/features-navigation.md) |
| **页面栈** | getCurrentPages、$page、UniPage | [features-get-current-pages](references/features-get-current-pages.md) |
| **dialogPage** | 弹窗页、openDialogPage、closeDialogPage | [features-dialog-page](references/features-dialog-page.md) |
| **数据存储** | setStorageSync、getStorageSync | [features-storage](references/features-storage.md) |
| **事件与系统信息** | uni.$on/$emit、getSystemInfo | [features-api-event-system-info](references/features-api-event-system-info.md) |
| **DOM 操作** | getElementById、ref、UniElement、draw API | [features-dom](references/features-dom.md) |
| **长列表与滚动** | scroll-view、list-view、吸顶、嵌套滚动 | [features-list-scroll](references/features-list-scroll.md) |
| **国际化** | 多语言、lime-i18n、vue-i18n | [features-i18n](references/features-i18n.md) |
| **主题与暗黑** | dark mode、theme.json、setAppTheme | [features-theme-dark](references/features-theme-dark.md) |
| **性能优化** | DOM 数量、transform 动画、长列表 | [best-practices-performance](references/best-practices-performance.md) |
| **选项式转组合式** | API 转换要点、ref 类型、defineExpose | [best-practices-options-to-composition](references/best-practices-options-to-composition.md) |
| **原生 SDK** | 混合开发、嵌入原生工程 | [advanced-native-sdk](references/advanced-native-sdk.md) |

---

## 参考文件索引

### 基础
- [项目结构](references/project-structure.md) — 目录组织、文件位置
- [App 入口](references/core-app.md) — App.uvue 生命周期、globalData
- [生命周期](references/lifecycle.md) — 页面/组件生命周期、Vue API 导入
- [页面开发](references/page-development.md) — 登录页、首页完整示例
- [组件使用](references/component-usage.md) — 全局注册、布局、表单、Props、hs-button、useAttrs、text标签
- [UVUE CSS](references/css-ucss.md) — UCSS 子集、flex 布局差异、gap 不支持、不支持 vh/vw、justify-content 不支持 start/end、max-width 不支持百分比、样式不继承
- [DOM 操作](references/features-dom.md) — UniElement、getElementById、ref、draw API

### UTS 语言
- [UTS 概述](references/uts-overview.md) — UTS 语言基础、变量、类型声明
- [UTS 数据类型](references/uts-data-type.md) — boolean、number、string、UTSJSONObject、type
- [条件编译](references/uts-conditional.md) — #ifdef / #ifndef 平台差异化代码
- [函数与模块](references/uts-function-module.md) — 函数定义、export/import、try-catch
- [组合式 API](references/vue-composition-api.md) — ref、reactive、computed、watch、watchEffect
- [选项式转组合式](references/best-practices-options-to-composition.md) — API 转换要点、ref 类型、defineExpose

### 页面与路由
- [页面导航](references/features-navigation.md) — navigateTo、redirectTo、reLaunch、switchTab
- [页面栈](references/features-get-current-pages.md) — getCurrentPages、$page、UniPage
- [dialogPage 弹窗页](references/features-dialog-page.md) — openDialogPage、与主 page 区别
- [长列表与滚动](references/features-list-scroll.md) — scroll-view、list-view、吸顶、嵌套滚动

### 数据与状态
- [状态管理](references/state-management.md) — Class模式Store、数据解耦、登录登出路由、全局状态
- [UTSJSONObject转换](references/utsjson-conversion.md) — 类型转换标准模式、API速查、复杂对象转换
- [数据存储](references/features-storage.md) — setStorageSync、getStorageSync、UTSJSONObject
- [请求封装](references/request.md) — request封装、Store层调用方式、联网模式
- [拦截器](references/interceptors.md) — 导航拦截、请求拦截、注册

### 事件与主题
- [事件与系统信息](references/features-api-event-system-info.md) — uni.$on/$emit、getSystemInfo
- [国际化](references/features-i18n.md) — 多语言、lime-i18n、vue-i18n、uni.getLocale
- [主题与暗黑](references/features-theme-dark.md) — dark mode、theme.json、setAppTheme

### 工具与工程
- [工具函数](references/utils.md) — storage存储、lodash工具、通用工具
- [测试规范](references/testing.md) — 测试环境、文件位置、结构、命令
- [编译与运行](references/build-run.md) — CLI命令、package.json脚本
- [性能优化](references/best-practices-performance.md) — DOM 数量、transform 动画、长列表分批
- [原生 SDK](references/advanced-native-sdk.md) — 混合开发、嵌入原生工程、导出资源
- [语言服务与 AI](references/tutorial-ls-ai-rules.md) — ls-plugin、AI Rules、MCP 配置

### 参考
- [常见问题](references/common-issues.md) — UTSJSONObject、CSS gap、Promise、forEach等
- [文档资源](references/resources.md) — 本地/在线文档、分类速查
