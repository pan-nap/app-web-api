# 收银系统

基于 pnpm monorepo 架构的全栈管理系统，涵盖 Web 后台管理、API 接口服务、UniApp X 移动端（含 IM 即时通讯、蓝牙、音视频通话）。

## 项目结构

```
packages/
├── web/        # Vue 3 + Vite 前端后台
├── backend/    # Koa 3 后端 API
└── app/        # UniApp X 移动端
```

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3.5、Pinia 3、Vue Router 5、Element Plus、Vite 8、VXE-Table |
| 移动端 | UniApp X、HBuilderX、hs-design 组件库、UTS 原生插件 |
| 后端 | Koa 3、@koa/router、mysql2、jsonwebtoken、bcryptjs、@koa/multer |
| 语言 | TypeScript 6 |
| 运行时 | Node.js ^20.19.0 \|\| >=22.12.0 |
| 包管理 | pnpm workspaces |

---

## 功能模块总览

### 一、Web 端（后台管理）

默认路由 `/admin`，包含以下 6 个管理模块：

#### 1. 登录认证

- 用户名 + 密码登录
- JWT Token 鉴权（所有接口需携带 Token）
- 登录后自动拉取字典数据缓存到 localStorage
- 退出登录清除 Token

#### 2. 学生管理（`/admin/student`）

- 学生列表：vxe-grid 分页展示，支持按姓名/学校/年级/班级/状态筛选
- 新建学生：弹窗表单录入
- 编辑学生：弹窗表单修改
- 禁用/启用学生状态切换
- 批量修改：弹窗批量修改学生信息
- 批量删除：勾选后批量删除
- 删除确认：二次确认弹窗

#### 3. 订单管理（`/admin/order`）

- 订单列表：vxe-grid 分页展示，支持按订单号/学校/年级/班级/状态筛选
- 创建订单：弹窗表单，选择套餐、学校、年级、班级
- 订单详情：独立详情弹窗，展示订单基本信息 + 订单明细（学生缴费列表）
- 生成支付码：为订单生成支付二维码
- 订单明细管理：查看 / 更新子项缴费状态
- 删除订单：二次确认
- 批量删除

#### 4. 员工管理（`/admin/employee`）

- 员工列表：vxe-grid 分页展示，支持按姓名/手机/角色筛选
- 新建员工：弹窗表单录入
- 编辑员工：弹窗表单修改
- 禁用/启用员工状态切换
- 删除员工：二次确认
- 批量删除

#### 5. 字典管理（`/admin/dictionary`）

- 字典列表：vxe-grid 分页展示
- 新增字典项
- 编辑字典项
- 删除字典项
- 字典类型：school（学校）、grade（年级）、class（班级）等
- 预置初始数据：4 所学校 + 6 个年级 + 4 个班级

#### 6. 医疗文书管理（`/admin/documents`）

基于 **Tiptap / ProseMirror** 的富文本编辑器，专为医疗文书场景设计。

**列表管理：**
- 文书列表：vxe-grid 分页展示，支持按名称/类型筛选
- 新建文书：全屏编辑器弹窗
- 编辑文书：全屏编辑器弹窗，加载已有内容
- 删除文书：二次确认
- 批量删除

**编辑器核心功能：**
- 基础富文本编辑：加粗 / 斜体 / 下划线 / 撤销 / 重做
- A4 纸张布局：210mm × 297mm + 15mm 内边距 + 阴影，模拟纸质文书
- 变量系统：
  - 自定义 `Variable` 内联原子节点（`atom: true`），整体选中 / 删除
  - 按分组分类：患者信息、入院信息、出院信息、医疗机构、医护人员
  - 支持文本 / 数字 / 日期 / 下拉 / 单选等数据类型
  - 必填变量标记（红色星号）
  - `insertVariable` / `updateVariable` 自定义命令
- 医疗区块系统：
  - 自定义 `MedicalBlock` 块级节点，可折叠
  - 14 个标准区块（基本信息、入院诊断、体格检查等）
  - 必填区块校验、可删除 / 可编辑控制
  - `insertMedicalBlock` / `toggleBlockCollapse` / `resetBlock` 自定义命令
- 表格操作：
  - 可视化行列选择器插入表格（最大 8×8）
  - 右键菜单：插入行 / 删除行 / 插入列 / 删除列 / 合并单元格 / 拆分单元格
  - 可调整列宽（`resizable: true`）
- 图片插入：文件选择 + Base64 内嵌
- 常用术语：主诉、现病史、体格检查、既往史、诊断与治疗 5 组术语快捷插入
- 保存前校验：必填变量未填充、必填区块内容为空时提示错误
- v-model 双向绑定：编辑器内容以 ProseMirror JSON 格式与外部同步

**编辑器架构：**

```
documents/
├── index.vue                    # 列表页（vxe-grid）
├── gridOptions.ts               # 表格列配置
├── popup/
│   ├── index.ts                 # 弹窗入口
│   ├── popup.vue                # 编辑弹窗（全屏）
│   └── table-insert/            # 表格插入弹窗
├── editor/
│   ├── EmrEditor.vue            # 编辑器主组件
│   ├── EmrToolbar.vue           # 工具栏组件
│   └── extensions/
│       ├── Variable.ts          # 变量节点扩展
│       └── MedicalBlock.ts      # 医疗区块节点扩展
├── composables/
│   └── useEmrValidation.ts      # 保存前校验
└── types/
    └── emr.ts                   # 类型定义 + 常量
```

**关键技术决策：**

| 决策 | 原因 |
|---|---|
| Tiptap 替代 Slate | Slate 是 React 技术栈，不兼容 Vue 3 |
| `new Editor()` 替代 `useEditor()` | 避免 ProseMirror JSON 直接传入 schema 解析失败 |
| `generateHTML()` 加载内容 | ProseMirror JSON → HTML → `setContent`，避免 schema 不匹配 |
| `StarterKit.configure({ underline: false })` + 独立 `Underline` | 避免 Duplicate extension 警告 |
| `MedicalBlock.content: "block*"` | `"block+"` 要求必须有子节点，空区块会报错 |

#### 7. 文件上传（`/admin/upload`）

- 单文件上传
- 批量上传（最多 20 个）
- 拖拽上传
- 上传进度展示
- 文件删除（单个/批量）
- 自定义子目录存储（防路径遍历攻击）
- 文件大小限制：500MB

---

### 二、移动端（App）

基于 UniApp X + UTS 原生插件开发，支持 Android / iOS / H5 多端。

#### 主包页面

| 页面 | 路径 | 功能 |
|---|---|---|
| 首页 | `pages/index/index` | 应用主页 |
| 登录 | `pages/login/index` | 用户登录认证 |
| 学生 | `pages/student/index` | 学生信息展示与管理 |
| MQTT | `pages/mqtt/index` | MQTT 消息推送测试页 |
| STOMP | `pages/stomp/index` | STOMP 协议测试页 |
| 蓝牙 | `pages/bluetooth/index` | 蓝牙设备连接与通信（仅 App） |

#### 子包：IM 即时通讯（`page_im`）

| 页面 | 路径 | 功能 |
|---|---|---|
| IM 登录 | `page_im/login/index` | 腾讯 IM SDK 登录 |
| 聊天 | `page_im/chat/index` | 即时通讯聊天页面 |
| 视频播放 | `page_im/video-player/index` | 视频消息播放 |
| 图片预览 | `page_im/image-preview/index` | 图片消息预览 |

#### 子包：音视频通话（`page_room`，仅 App）

| 页面 | 路径 | 功能 |
|---|---|---|
| 视频通话 | `page_room/room/index` | 腾讯 TRTC 实时音视频通话 |

#### UTS 原生插件

| 插件 | 功能 | 平台 |
|---|---|---|
| `hs-im` | 腾讯 IM SDK 封装（消息收发、会话管理、音视频信令） | Android / iOS / H5 / Harmony |
| `hs-trtc` | 腾讯 TRTC 实时音视频通话 | Android / iOS / Harmony |
| `hs-bluetooth` | 蓝牙设备扫描、连接、数据收发 | Android / iOS |

#### Store 状态管理

| Store | 功能 |
|---|---|
| `user.uts` | 用户登录态、Token 管理 |
| `student.uts` | 学生数据管理 |
| `im.uts` | IM 连接状态、消息、会话管理 |

#### 工具层

| 工具 | 功能 |
|---|---|
| `request.uts` | 网络请求封装（统一鉴权、错误处理） |
| `storage.uts` | 本地存储封装 |
| `mqtt.uts` | MQTT 客户端封装 |
| `stomp.uts` | STOMP 协议客户端封装 |
| `device.uts` | 设备信息获取 |
| `dom.uts` | DOM 操作辅助 |
| `lodash.uts` | 常用工具函数 |
| `tool.uts` | 通用工具函数 |

---

### 三、后端 API

所有接口前缀 `/sf-web`，需 JWT Token 鉴权（登录接口除外）。

#### 认证接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/login` | 用户登录，返回 JWT Token |
| POST | `/logout` | 退出登录 |
| GET | `/home` | 健康检查 |

#### 学生接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/student` | 分页查询（支持姓名/学校/年级/班级/状态筛选） |
| GET | `/student/:id` | 获取单条 |
| POST | `/student` | 创建学生 |
| PUT | `/student/:id` | 更新学生 |
| DELETE | `/student/:id` | 删除学生 |
| PUT | `/student/batch` | 批量修改 |
| POST | `/student/batch/delete` | 批量删除 |

#### 订单接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/order` | 分页查询（支持订单号/学校/年级/班级/状态筛选） |
| GET | `/order/:id` | 获取单条 |
| POST | `/order` | 创建订单 |
| PUT | `/order/:id` | 更新订单 |
| DELETE | `/order/:id` | 删除订单 |
| GET | `/order/:id/items` | 获取订单明细（子项列表） |
| PUT | `/order/item/:id` | 更新订单明细 |
| POST | `/order/:id/pay-code` | 生成支付码 |
| POST | `/order/batch/delete` | 批量删除 |

#### 员工接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/employee` | 分页查询（支持姓名/手机/角色筛选） |
| GET | `/employee/:id` | 获取单条 |
| POST | `/employee` | 创建员工 |
| PUT | `/employee/:id` | 更新员工 |
| DELETE | `/employee/:id` | 删除员工 |
| POST | `/employee/batch/delete` | 批量删除 |

#### 字典接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/dictionary` | 查询字典（按 type 分组） |
| GET | `/dictionary/:id` | 获取单条 |
| POST | `/dictionary` | 新增字典项 |
| PUT | `/dictionary/:id` | 更新字典项 |
| DELETE | `/dictionary/:id` | 删除字典项 |

#### 文书接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/document` | 分页查询（支持 name / type 筛选） |
| GET | `/document/:id` | 获取单条（content 自动 JSON 反序列化） |
| POST | `/document` | 创建文书 |
| PUT | `/document/:id` | 更新文书 |
| DELETE | `/document/:id` | 删除文书 |
| POST | `/document/batch/delete` | 批量删除 |

#### 文件上传接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/upload` | 单文件上传（multipart/form-data，支持子目录） |
| POST | `/upload/batch` | 批量上传（最多 20 个） |
| DELETE | `/upload` | 删除单个文件 |
| DELETE | `/upload/batch` | 批量删除文件 |

---

### 数据库表结构

> 表创建统一在 `packages/backend/scripts/initAdmin.js`，使用 `CREATE TABLE IF NOT EXISTS` 保留已有数据。

#### `user` 用户表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT AUTO_INCREMENT | 主键 |
| username | VARCHAR(50) UNIQUE | 用户名 |
| password | VARCHAR(255) | 密码（bcrypt 加密） |
| name | VARCHAR(50) | 姓名 |
| phone | VARCHAR(20) | 手机号 |
| email | VARCHAR(100) | 邮箱 |
| role | VARCHAR(20) | 角色（默认 user） |
| status | TINYINT | 状态（1 启用 / 0 禁用） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

> 预置管理员账号：admin / 123456

#### `students` 学生表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT AUTO_INCREMENT | 主键 |
| name | VARCHAR(50) | 姓名 |
| gender | ENUM('男','女') | 性别 |
| school | VARCHAR(100) | 学校 |
| grade | VARCHAR(20) | 年级 |
| class_name | VARCHAR(50) | 班级 |
| id_card | VARCHAR(18) UNIQUE | 身份证号 |
| phone | VARCHAR(20) | 手机号 |
| status | TINYINT | 状态（1 启用 / 0 禁用） |
| has_order | TINYINT | 是否有订单 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### `orders` 订单表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT AUTO_INCREMENT | 主键 |
| order_no | VARCHAR(50) UNIQUE | 订单编号 |
| school | VARCHAR(100) | 学校 |
| grade | VARCHAR(20) | 年级 |
| class_name | VARCHAR(50) | 班级 |
| package_name | VARCHAR(100) | 套餐名称 |
| package_amount | DECIMAL(10,2) | 套餐金额 |
| order_status | ENUM('待处理','已完成','已取消') | 订单状态 |
| creator | VARCHAR(50) | 创建人 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### `order_items` 订单明细表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT AUTO_INCREMENT | 主键 |
| order_id | INT FK | 关联订单 |
| student_id | INT FK | 关联学生 |
| payment_status | ENUM('已缴费','未缴费') | 缴费状态 |
| payment_time | DATETIME | 缴费时间 |
| created_at | TIMESTAMP | 创建时间 |

#### `documents` 文书表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT AUTO_INCREMENT | 主键 |
| name | VARCHAR(255) | 文书名称 |
| type | ENUM('template','instance') | 模板 / 实例 |
| content | LONGTEXT | ProseMirror JSON 内容 |
| patient_id | VARCHAR(100) | 关联患者 |
| status | ENUM('draft','completed','archived') | 状态 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

#### `dictionaries` 字典表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT AUTO_INCREMENT | 主键 |
| type | VARCHAR(50) | 字典类型（school/grade/class） |
| label | VARCHAR(100) | 显示标签 |
| value | VARCHAR(100) | 值 |
| sort_order | INT | 排序号 |
| created_at | TIMESTAMP | 创建时间 |

---

### 后端分层架构

```
src/
├── routes/                    # 路由定义（RESTful）
│   ├── auth.js               # 认证路由
│   ├── students.js           # 学生路由
│   ├── orders.js             # 订单路由
│   ├── employees.js          # 员工路由
│   ├── dictionary.js         # 字典路由
│   ├── documents.js          # 文书路由
│   ├── upload.js             # 上传路由（multer 中间件）
│   └── index.js              # 路由注册入口
├── controllers/              # 请求处理层
│   ├── authController/
│   ├── studentController/
│   ├── orderController/
│   ├── employeeController/
│   ├── dictionaryController/
│   ├── documentController/
│   └── uploadController/
├── services/                 # 业务逻辑层
│   ├── AuthService.js
│   ├── StudentService.js
│   ├── OrderService.js
│   ├── EmployeeService.js
│   ├── DictionaryService.js
│   └── DocumentService.js
├── models/                   # 数据访问层
│   ├── StudentModel.js
│   ├── OrderModel.js
│   ├── EmployeeModel.js
│   ├── DictionaryModel.js
│   └── DocumentModel.js
├── validators/               # 输入校验层
│   ├── StudentValidator.js
│   ├── OrderValidator.js
│   ├── EmployeeValidator.js
│   ├── DictionaryValidator.js
│   └── DocumentValidator.js
├── middleware/
│   └── auth.js              # JWT 认证中间件
├── config/
│   └── database.js          # 数据库连接池配置
└── utils/
    └── response.js          # 统一响应格式（wrap/success/error/pageSuccess）
```

---

## 快速开始

```sh
# 安装依赖
pnpm install

# 初始化数据库（首次运行）
pnpm --filter backend node scripts/initAdmin.js

# 启动前端开发
pnpm --filter web dev

# 启动后端
pnpm --filter backend dev
```

## 构建部署

```sh
# 前端构建
pnpm --filter web build

# 后端构建
pnpm --filter backend build
```
