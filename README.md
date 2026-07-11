# 收银系统

基于 pnpm monorepo 架构的全栈管理系统，涵盖 Web 后台配置管理、API 接口服务、UniApp X 移动端。

## 项目结构

```
packages/
├── web/        # Vue 3 + Vite 前端
├── backend/    # Koa 3 后端
└── app/        # UniApp X 移动端
```

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3.5、Pinia 3、Vue Router 5、Element Plus、Vite 8、VXE-Table |
| 移动端 | UniApp X、HBuilderX、hs-design 组件库 |
| 后端 | Koa 3、@koa/router、mysql2、jsonwebtoken、bcryptjs |
| 语言 | TypeScript 6 |
| 运行时 | Node.js ^20.19.0 \|\| >=22.12.0 |
| 包管理 | pnpm workspaces |

---

## 医疗文书管理系统（EMR）

### 前端编辑器

基于 **Tiptap / ProseMirror** 的富文本编辑器，专为医疗文书场景设计。

#### 核心功能

- **基础富文本编辑**：加粗 / 斜体 / 下划线 / 撤销 / 重做
- **A4 纸张布局**：210mm × 297mm + 15mm 内边距 + 阴影，模拟纸质文书
- **变量系统**：
  - 自定义 `Variable` 内联原子节点（`atom: true`），整体选中 / 删除
  - 按分组分类：患者信息、入院信息、出院信息、医疗机构、医护人员
  - 支持文本 / 数字 / 日期 / 下拉 / 单选等数据类型
  - 必填变量标记（红色星号）
  - `insertVariable` / `updateVariable` 自定义命令
- **医疗区块系统**：
  - 自定义 `MedicalBlock` 块级节点，可折叠
  - 14 个标准区块（基本信息、入院诊断、体格检查等）
  - 必填区块校验、可删除 / 可编辑控制
  - `insertMedicalBlock` / `toggleBlockCollapse` / `resetBlock` 自定义命令
- **表格操作**：
  - 可视化行列选择器插入表格
  - 右键菜单：插入行 / 删除行 / 插入列 / 删除列 / 合并单元格 / 拆分单元格
  - 可调整列宽（`resizable: true`）
- **图片插入**：支持文件选择 + Base64 内嵌
- **常用术语**：主诉、现病史、体格检查、既往史、诊断与治疗 5 组术语快捷插入
- **保存前校验**：必填变量未填充、必填区块内容为空时提示错误
- **v-model 双向绑定**：编辑器内容以 ProseMirror JSON 格式与外部同步

#### 编辑器架构

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

#### 关键技术决策

| 决策 | 原因 |
|---|---|
| Tiptap 替代 Slate | Slate 是 React 技术栈，不兼容 Vue 3 |
| `new Editor()` 替代 `useEditor()` | 避免 ProseMirror JSON 直接传入 schema 解析失败 |
| `generateHTML()` 加载内容 | ProseMirror JSON → HTML → `setContent`，避免 schema 不匹配 |
| `StarterKit.configure({ underline: false })` + 独立 `Underline` | 避免 Duplicate extension 警告 |
| `MedicalBlock.content: "block*"` | `"block+"` 要求必须有子节点，空区块会报错 |

### 列表管理

- 文书列表页：搜索（名称 / 类型）、新建、编辑、删除、批量删除
- `vxe-grid` 表格 + 分页
- 弹窗式编辑（全屏），`bc-button` 自带异步 loading

### 后端接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/document` | 分页查询（支持 name / type 筛选） |
| GET | `/document/:id` | 获取单条 |
| POST | `/document` | 创建文书 |
| PUT | `/document/:id` | 更新文书 |
| DELETE | `/document/:id` | 删除文书 |
| POST | `/document/batch/delete` | 批量删除 |

#### 数据表结构（`documents`）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INT AUTO_INCREMENT | 主键 |
| name | VARCHAR(255) | 文书名称 |
| type | ENUM('template','instance') | 模板 / 实例 |
| content | JSON | ProseMirror JSON 内容 |
| patient_id | VARCHAR(255) | 关联患者 |
| status | ENUM('draft','completed','archived') | 状态 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

> 表创建统一在 `packages/backend/scripts/initAdmin.js`，使用 `CREATE TABLE IF NOT EXISTS` 保留已有数据。

#### 后端分层

```
controllers/documentController/   # 请求处理
├── index.js                     # 统一导出
├── queries.js                   # 查询操作
├── mutations.js                 # 变更操作
└── batchOps.js                  # 批量操作
services/DocumentService.js       # 业务逻辑 + content JSON 反序列化
models/DocumentModel.js          # 数据访问层
validators/DocumentValidator.js   # 输入校验
routes/documents.js              # RESTful 路由定义
```

---

## 快速开始

```sh
# 安装依赖
pnpm install

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
