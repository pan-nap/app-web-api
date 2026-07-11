---
name: project-structure
description: 项目目录结构、文件位置
---

# 项目结构

```
packages/app/
├── components/              # 自定义全局组件（自动注册）
│   └── hs-screen/          # 页面容器组件
│       └── hs-screen.uvue
├── interceptors/            # 拦截器
│   ├── index.uts           # 拦截器入口
│   ├── navigate.uts        # 页面导航拦截（登录校验）
│   └── request.uts         # 请求拦截（自动携带Token）
├── pages/                   # 页面目录
│   ├── index/              # 首页
│   │   ├── index.uvue
│   │   └── index.test.js   # 首页测试用例
│   └── login/              # 登录页
│       ├── index.uvue
│       └── index.test.js   # 登录页测试用例
├── scripts/                 # 脚本目录
│   ├── hx.js               # HBuilderX CLI启动脚本
│   ├── uni-test.js         # 测试脚本
│   └── .tmp/               # 临时文件（已排除git提交）
├── static/                  # 静态资源（图片、字体等，不参与编译仅复制）
├── store/                   # 状态管理（Class模式）
│   ├── user.uts            # 用户状态
│   └── student.uts         # 学生信息状态
├── style/                   # 全局样式
├── uni_modules/             # 插件市场模块
│   └── hs-design/          # 组件库
├── utils/                   # 工具函数
│   ├── device.uts          # 设备信息
│   ├── dom.uts             # DOM 操作
│   ├── lodash.uts          # 工具函数封装（isArray、assign、debounce等）
│   ├── request.uts         # 请求封装
│   ├── storage.uts         # 本地存储（支持过期时间）
│   └── tool.uts            # 通用工具（showToast等）
├── App.uvue                # 应用入口（应用生命周期、globalData、全局样式）
├── config.json             # 接口配置（baseUrl）
├── main.uts                # 主入口文件（注册拦截器）
├── manifest.json           # 应用配置（需含 `uni-app-x` 节点）
├── pages.json              # 页面路由、导航栏、tabBar 配置
├── uni.scss                # 内置样式变量
└── package.json            # 脚本配置
```

## 补充说明

### uni-app x 项目标识

- `manifest.json` 中**必须存在 `"uni-app-x": {}` 节点**，否则项目被识别为老版 uni-app。
- 页面后缀必须为 **`.uvue`**，且需在 `pages.json` 中注册。

### pages.json

- 配置**首页**（pages 数组第一项）、页面路径、窗口样式、原生导航栏、tabBar 等。
- 新建/删除页面时需同步增删 `pages` 中的项。

### 静态资源

- 图片、字体等静态资源统一放 **static/**，编译时自动复制到产物。
- 不要把参与编译的源码（.uts、.uvue）放在 static 目录下。

### 新建项目

- HBuilderX：**文件 > 新建 > 项目**，选择「新建 uni-app 项目」，底部**必须勾选「uni-app x」**。
- uni-app x 仅支持 Vue3。
