# PACS 系统开发清单与路线图

> 全院级 PACS（医学影像）系统，基于现有 pnpm monorepo 开源二次开发。
> 最近更新：2026-11-11 ｜ 当前阶段：**P3（IHE/报告/安全）— 安全地基已完成**
> 数据约束：样例/真实 CT 影像 **仅用于本地测试**。

## 路线总览

P1 迷你 PACS → P1.5 真实 CT 本地测试 → P2 Orthanc 生产内核 → **P3 IHE/报告/安全** → P4 高级功能

技术栈：Koa 3 后端（`hs-sf-backend`）+ Vue 3 阅片前端（`hs-sf-web`，内嵌 Cornerstone3D）+ Orthanc 影像内核 + `@cashier/emr` 报告编辑器 + MySQL 元数据/批注/审计。

---

## P1 · Mini-PACS 基础 — 已完成

- [x] dicom-parser 解析 + 最小 DICOM 样本验证
- [x] DICOMweb 风格路由：C-ECHO / STOW-RS / QIDO-RS / WADO-RS
- [x] 演示影像生成器 + seed 端点
- [x] 批注 JSON 持久化 CRUD
- [x] PACS 表结构（Study→Series→Instance）+ 非破坏迁移脚本
- [x] 数据访问层 + 磁盘存储；Jest 测试跑通
- [x] 前端 Cornerstone3D + Vue 阅片页 + 路由 + 浏览器 E2E

## P1.5 · 真实 CT 本地测试 — 已完成

- [x] 批量 STOW-RS 灌库脚本 + 灌入样例 CT（40 切片）
- [x] 窗宽窗位改用 DICOM 元数据预设
- [x] 多切片阅片验证（仅本地测试用）

## P2 · Orthanc 生产内核 — 已完成

- [x] Windows 原生 Orthanc 免安装部署（8042 HTTP / 4242 C-STORE，AET `HS_PACS`）
- [x] `OrthancClient` 封装 + 配置（UID→内部 ID 映射、`/tags?simplify`、元数据纯文本等坑已解）
- [x] `PacsService` 代理 Orthanc，**保持前端契约不变**，`mini`/`orthanc` 后端可切换
- [x] 灌入 CT + C-STORE + 阅片页 E2E
- [x] 启动脚本（`orthanc/start-orthanc.ps1` / `.sh`）+ gitignore（二进制/存储不入库）

## P3 · IHE/HL7 + 报告 + 安全 — 进行中

### 安全地基（本次完成，8 项集成测试通过）

- [x] RBAC 角色授权 `requireRole`（`admin`/`technologist`/`radiologist`/`viewer`；角色以库为准、禁用账号拒绝、admin 超级放行）
- [x] 审计日志 `pacs_audit_log` 表 + 审计中间件（登录/调阅/归档/批注写删，**含拒绝尝试**；审计失败不阻断主请求）
- [x] 全部 `/pacs/*` 加认证；归档限 admin/technologist，批注写删限 admin/radiologist/technologist，读路由任意登录用户
- [x] 登录响应返回 `role`；审计查询接口 `GET /audit`（仅 admin）
- [x] 前端 Cornerstone 影像 XHR 注入 JWT（`dicomImageLoader.internal.setOptions.beforeSend`）+ 按角色禁用写操作按钮（代码完成）
- [x] 本地测试角色账号种子 `scripts/seedPacsUsers.js`（tech/radio/viewer，密码 123456）
- [x] 隔离安全测试 `__tests__/security.test.js`（自建临时账号、定向清理，不触碰已灌影像）
- [ ] **前端浏览器回归验证**（代码已写，尚未在浏览器确认影像加载/gating）← 紧接下一步

### 待开发

- [ ] EMR 结构化报告：复用 `@cashier/emr` + documents 模板，加检查关联 + 报告状态流（草稿/审核/签发）
- [ ] IHE MWL/MPPS + HL7：Orthanc Worklists 插件做模态工作列表，Node 编排 HL7
- [ ] 生产加固：Orthanc 认证 + TLS（本地 loopback 测试暂不需要）

## P4 · 高级功能 — 未开始

- [ ] MPR / 3D 重建 / 电影回放
- [ ] GSPS / SR 标准批注交换（替代当前 JSON 持久化）
- [ ] 运维 / 高可用
- [ ] 移动端阅片（`@cashier/app`）

---

## 下一步开发计划

按优先级与依赖排序，每步含范围与验收标准。

### 步骤 1 · P3-A 前端浏览器回归（紧接，小）

- 范围：在浏览器登录 → 打开阅片页，确认加认证后影像仍正常加载（Cornerstone `beforeSend` 注入 token 生效）；用 `viewer` 账号确认"保存批注/清空批注"按钮被禁用、归档被拒；用 admin 确认 `GET /audit` 能查到调阅/登录记录。
- 验收：admin 阅片正常、低权限写操作被拒且有提示、审计落库可查；无影像加载回归。

### 步骤 2 · P3-B EMR 结构化报告（核心，主力）

- 范围：
  - 新增 `pacs_reports` 表（`study_uid` 关联检查、`template_id`、`content` JSON、`status` 草稿/审核/签发、`author_id`/`reviewer_id`、时间戳），沿用 `pacsSchema.js` 非破坏迁移。
  - 报告 CRUD + 状态流转接口，RBAC：radiologist 可写/签发，admin 全权，viewer 只读；报告动作纳入审计。
  - 前端在阅片页集成 `@cashier/emr` 编辑器面板，报告与当前检查绑定，按角色 gating 编辑/签发按钮。
- 验收：医师在阅片页写报告 → 存草稿 → 审核 → 签发，报告与检查关联、状态流转受角色控制、全程审计；复用现有模板与变量体系。

### 步骤 3 · P3-C IHE MWL/MPPS + HL7（集成）

- 范围：启用 Orthanc Worklists 插件（`orthanc/bin/Plugins/OrthancWorklists.dll` + `worklists.json`）；MWL 工作列表查询接口；MPPS 检查状态回写；Node 侧 HL7 ORM/ORU 消息编排（触发归档/报告）。
- 验收：模态工作列表可查询、检查状态随 MPPS 更新、HL7 消息能驱动归档与报告流程。

### 步骤 4 · P3-D 生产加固（上线前）

- 范围：Orthanc `AuthenticationEnabled` + 后端 `ORTHANC_USER/PASSWORD`；TLS（HTTPS，反向代理或 Node https）；`.env` 从 git 跟踪移除并轮换密钥。
- 验收：Orthanc 需认证、传输加密、密钥不入库。

### 步骤 5 · P4 高级功能（后续）

- MPR/3D/cine、GSPS/SR 标准交换、运维/高可用、移动端阅片。

---

## 附录 A · 运行与验证

```bash
# 后端（packages/backend）
npm start                       # node src/index.js（生产/本地）
npm run dev                     # nodemon 热重载
node scripts/migratePacs.js     # 非破坏迁移：建/补 PACS 表（含 pacs_audit_log）
node scripts/seedPacsUsers.js   # 本地测试角色账号 tech/radio/viewer（密码 123456）
npm test                        # 全部测试（注意：pacs.test.js 会清空 pacs_* 表！）
node test-runner.js __tests__/security.test.js   # 仅跑隔离安全测试（推荐，不碰影像）

# Orthanc 内核（packages/backend/orthanc，免安装）
./start-orthanc.sh              # 或 powershell ./start-orthanc.ps1
# HTTP 8042 / DICOM C-STORE 4242 / AET HS_PACS

# 前端（packages/web）
npm run dev                     # Vite，端口 8091，/sf-web 代理到后端 3001
```

后端模式由 `.env` 的 `PACS_BACKEND` 切换：`orthanc`（默认，代理 Orthanc）/ `mini`（DB+磁盘）。测试经 `test-runner.js` 强制 `PACS_BACKEND=mini` 隔离。

## 附录 B · 关键约定与坑

- 响应契约统一 `{code:1|0, data, msg}`；认证/授权失败返回 HTTP 200 + `code:0`（前端按 code 判定）。
- 五层结构 routes→controllers→services→models→validators；导入别名 `#config/#controllers/#middleware/#models/#routes/#services/#utils/#validators`。
- 迁移单一数据源 `scripts/pacsSchema.js`（`pacsTables` 数组，`CREATE TABLE IF NOT EXISTS`），迁移/初始化/测试共用。
- Orthanc 原生 REST 用内部 ID，**DICOM UID 不能直接当 REST 标识**，需 `/tools/lookup` 映射；`/tags?simplify` 取扁平关键字；`/metadata/*` 返回纯文本。
- Cornerstone wadouri 影像走独立 XHR，不经 `Utils.useRequest`，需 `beforeSend` 手动注入 `Authorization`。
- 角色不放进 JWT（避免改权后旧 token 带旧角色），`requireRole` 每次以库为准。

## 附录 C · 安全 caution（务必遵守）

- `scripts/initAdmin.js` 是**破坏性**脚本（`DROP DATABASE`）——**严禁**对现有库运行。
- `__tests__/pacs.test.js` 的 `cleanPacsData` 会清空 `pacs_*` 表（含已灌 CT）——**不要**跑全量测试套件，单独跑目标测试文件。
- `packages/backend/.env` 仍被 git 跟踪（含 `DB_PASSWORD`/`JWT_SECRET`）——生产前需从跟踪移除并轮换密钥（敏感 git 操作，需确认后执行）。
- 样例/真实 CT 影像**仅本地测试用**；Orthanc 当前 loopback 绑定、未开认证，仅供本地联调。