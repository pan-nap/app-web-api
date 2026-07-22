# AI插件与Trae功能差距分析 Spec

## Overview
- **Summary**: 分析当前 AI 插件与 Trae VSCode 插件之间的功能差距，列出所有未实现的核心功能，并评估实现优先级和可行性
- **Purpose**: 明确下一步开发方向，让插件从"纯聊天工具"升级为"AI 辅助编程助手"
- **Target Users**: VSCode 开发者，希望通过 AI 辅助编码、调试、审查的工程师

## Goals
- 梳理 Trae 插件的完整功能体系
- 对比当前 AI 插件已实现的功能
- 列出所有功能差距并分级
- 给出推荐的实现优先级和路线图

## Non-Goals
- 不在此 Spec 中包含具体实现代码
- 不包含每个功能的详细技术设计（另有 Spec）
- 不讨论 UI 细节优化

## Background & Context
当前 AI 插件 v1.0.0 已实现基本的 AI 对话功能：
- 5 个 AI 提供商（OpenAI、Claude、Gemini、豆包、DeepSeek）
- 流式对话、API Key 管理
- WebviewPanel 聊天面板
- 侧边栏视图

但相比 Trae 插件，缺少关键的**代码操作能力**（读/写/编辑文件、搜索代码、执行命令）和**智能体系统**（任务编排、记忆、多步骤执行），目前仅是一个"聊天窗口"，无法直接操作用户的项目代码。

## Trae 插件完整功能体系

### 1. 工作区工具系统 (Workspace Tools)
提供直接操作文件系统的能力，是 AI 辅助编程的基石：
- `Read` - 读取文件内容
- `Write` - 创建新文件
- `Edit` - 精确字符串替换编辑
- `DeleteFile` - 删除文件
- `Glob` - 文件名模式匹配
- `Grep` - 正则内容搜索（基于 ripgrep）
- `LS` - 列出目录结构
- `SearchCodebase` - 语义搜索
- `RunCommand` - 执行终端命令
- `GetDiagnostics` - 读取 Linter/编译错误

### 2. 智能体系统 (Agent System)
- `Task` - 启动子智能体执行复杂任务
- `TodoWrite` - 任务分解与追踪
- Plan/Spec 模式 - 先规划后执行
- 多智能体并行与协作

### 3. 记忆系统 (Memory System)
- 项目级记忆 (`project_memory.md`) - 项目规则、约束、惯例
- 用户画像 (`user_profile.md`) - 跨项目偏好
- 会话记忆 (`session_memory`) - 对话上下文持久化
- 主题追踪 (`topics.md`) - 项目目标、进展、决策记录

### 4. Web 能力
- `WebSearch` - 在线搜索
- `WebFetch` - 抓取网页内容
- `OpenPreview` - 浏览器预览

### 5. Git 集成
- 提交变更
- 推送到远程
- 创建分支
- 创建 MR/PR

### 6. 代码增强工具
- `Skill` 系统 - 可加载的专业能力模块（代码审查、安全扫描、调试等）
- `AdvisorTool` - 策略级审查

### 7. MCP 支持
- Model Context Protocol 集成，支持外部工具接入

### 8. 上下文管理
- 自动附带打开文件内容
- 对话压缩与摘要
- Token 预算管理

### 9. 内联功能
- 内联代码补全
- CodeLens
- 内联装饰

## 当前 AI 插件已实现功能
对照上述体系，当前已实现：

| 功能领域 | 已实现 |
|---------|--------|
| AI 对话 | (已实现) 多模型流式对话 |
| 聊天界面 | (已实现) WebviewPanel + 侧边栏 |
| API Key 管理 | (已实现) SecretStorage |
| 配置管理 | (已实现) 5 个配置项 |
| 工作区工具 | (未实现) |
| 智能体系统 | (未实现) |
| 记忆系统 | (未实现) |
| Web 能力 | (未实现) |
| Git 集成 | (未实现) |
| 代码增强 | (未实现) |
| MCP 支持 | (未实现) |
| 上下文管理 | (未实现) |
| 内联功能 | (未实现) |

## 功能差距分级

### P0 - 核心必要（聊天->助手的关键跨越）
1. **工作区工具系统**：Read、Write、Edit、Grep、Glob、LS、RunCommand
   - 这是让 AI 能够"动手"操作代码的基础设施
   - 无此功能，插件只是聊天玩具

2. **函数调用 (Function Calling / Tool Use)**
   - AI 模型需要能调用上述工具
   - 需要定义工具 Schema 并在对话中注入

3. **上下文感知**
   - 自动读取当前打开文件
   - 工作区目录结构感知

### P1 - 重要增强（助手->专业助手的升级）
4. **智能体系统**：Task 子智能体、TodoWrite、Plan 模式
5. **代码 Diff 预览**：编辑前展示变更
6. **GetDiagnostics**：读取编译/Linter 错误
7. **记忆系统**：项目级 + 会话级记忆

### P2 - 锦上添花（专业助手->全栈平台）
8. **Web 能力**：WebSearch、WebFetch
9. **Git 集成**：提交、推送、创建 MR
10. **MCP 支持**：外部工具集成
11. **Skill 系统**：代码审查、安全扫描等
12. **内联功能**：代码补全、CodeLens

## Acceptance Criteria

### AC-1: 功能差距清单完整
- **Given**: 已分析 Trae 插件和当前 AI 插件
- **When**: 审阅功能差距分析
- **Then**: P0/P1/P2 三级差距清单完整，各功能描述清晰
- **Verification**: `human-judgment`

### AC-2: 实现优先级合理
- **Given**: 功能差距清单
- **When**: 制定实现路线图
- **Then**: P0 功能排在最高优先级，P1/P2 按依赖关系排序
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要实现完整的 Agent 编排系统，还是先做简单的工具调用？
- [ ] 上下文管理采用简单方案（每次都带全部上下文）还是复杂方案（RAG/摘要）？
- [ ] 内联代码补全是否必要（VSCode 已有 GitHub Copilot 等）？
- [ ] 是否保留侧边栏视图模式（已实现但当前未激活）？
