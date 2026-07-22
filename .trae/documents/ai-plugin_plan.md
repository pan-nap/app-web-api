# VSCode AI智能体插件实现计划

## 1. 项目调研结论

当前项目是一个 pnpm monorepo 结构，包含以下包：
- `packages/web`: Vue 3 + Element Plus 前端管理系统
- `packages/backend`: Koa 后端服务
- `packages/app`: UniApp X 移动端应用
- `packages/emr`: 基于 Tiptap 的医疗文书编辑器

**VSCode 扩展开发特殊性：**
- VSCode 扩展有独特的 `package.json` 字段（`engines.vscode`、`activationEvents`、`contributes`）
- 使用 esbuild/vsce 打包，而非 Vite
- 需要使用 VSCode API（SecretStorage、Settings、Webview）
- TypeScript 编译目标为 CommonJS（Node.js 环境）

## 2. 架构设计

### 2.1 核心设计原则

- **Provider 模式**：设计统一的 `ILLMProvider` 接口，各模型厂商实现该接口
- **配置分离**：API Key 存储在 VSCode SecretStorage（安全），其他配置存储在 Settings
- **流式响应**：支持 SSE 流式输出，提升用户体验
- **Webview 面板**：使用 Webview 实现聊天界面，提供完整 UI 控制

### 2.2 模块划分

```
packages/ai-plugin/
├── src/
│   ├── providers/           # LLM 提供者接口及实现
│   │   ├── index.ts         # Provider 工厂/注册表
│   │   ├── ILLMProvider.ts  # 统一接口定义
│   │   ├── OpenAIProvider.ts
│   │   ├── ClaudeProvider.ts
│   │   ├── GeminiProvider.ts
│   │   └── DoubaoProvider.ts
│   ├── config/              # 配置管理
│   │   ├── index.ts         # Settings + SecretStorage 封装
│   │   └── types.ts         # 配置类型定义
│   ├── chat/                # 聊天功能
│   │   ├── ChatManager.ts   # 聊天状态管理
│   │   └── ChatPanel.ts     # Webview 面板管理
│   ├── utils/               # 工具函数
│   │   ├── http.ts          # HTTP 请求封装
│   │   └── stream.ts        # 流式响应处理
│   ├── extension.ts         # 扩展入口
│   └── types/               # 公共类型
│       └── index.ts
├── webview/                 # Webview 前端资源
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── style.css
│   ├── vite.config.ts
│   └── package.json
├── esbuild.config.mjs       # esbuild 打包配置
├── package.json             # VSCode 扩展配置
├── tsconfig.json            # TypeScript 配置
└── vsc-extension-quickstart.md
```

### 2.3 ILLMProvider 接口设计

```typescript
interface ILLMProvider {
  id: string;                    // 提供者唯一标识
  name: string;                  // 显示名称
  models: string[];              // 支持的模型列表
  chat(messages: ChatMessage[], options: ChatOptions): Promise<string>;
  streamChat(messages: ChatMessage[], options: ChatOptions): AsyncGenerator<string>;
  validateApiKey(apiKey: string): Promise<boolean>;
}
```

## 3. 文件清单

| 文件路径 | 说明 | 类型 |
|---------|------|------|
| `packages/ai-plugin/package.json` | VSCode 扩展配置（engines、activationEvents、contributes） | 新建 |
| `packages/ai-plugin/tsconfig.json` | TypeScript 配置（目标 ESNext，CommonJS 模块） | 新建 |
| `packages/ai-plugin/esbuild.config.mjs` | esbuild 打包配置 | 新建 |
| `packages/ai-plugin/src/extension.ts` | 扩展入口，注册命令和事件 | 新建 |
| `packages/ai-plugin/src/types/index.ts` | 公共类型定义（ChatMessage、ChatOptions 等） | 新建 |
| `packages/ai-plugin/src/providers/ILLMProvider.ts` | LLM 提供者统一接口 | 新建 |
| `packages/ai-plugin/src/providers/index.ts` | Provider 工厂和注册表 | 新建 |
| `packages/ai-plugin/src/providers/OpenAIProvider.ts` | OpenAI 兼容接口实现 | 新建 |
| `packages/ai-plugin/src/providers/ClaudeProvider.ts` | Claude API 实现 | 新建 |
| `packages/ai-plugin/src/providers/GeminiProvider.ts` | Gemini API 实现 | 新建 |
| `packages/ai-plugin/src/providers/DoubaoProvider.ts` | 豆包 API 实现 | 新建 |
| `packages/ai-plugin/src/config/types.ts` | 配置类型定义 | 新建 |
| `packages/ai-plugin/src/config/index.ts` | Settings + SecretStorage 封装 | 新建 |
| `packages/ai-plugin/src/utils/http.ts` | HTTP 请求封装（支持流式） | 新建 |
| `packages/ai-plugin/src/chat/ChatManager.ts` | 聊天状态管理 | 新建 |
| `packages/ai-plugin/src/chat/ChatPanel.ts` | Webview 面板管理 | 新建 |
| `packages/ai-plugin/webview/package.json` | Webview 前端依赖配置 | 新建 |
| `packages/ai-plugin/webview/vite.config.ts` | Webview 构建配置 | 新建 |
| `packages/ai-plugin/webview/src/main.ts` | Webview 入口 | 新建 |
| `packages/ai-plugin/webview/src/App.vue` | Webview 聊天界面 | 新建 |
| `packages/ai-plugin/webview/src/style.css` | Webview 样式 | 新建 |

## 4. 实现步骤

### 步骤 1：创建扩展基础结构

1. 创建 `packages/ai-plugin` 目录
2. 初始化 `package.json`，添加 VSCode 扩展必需字段
3. 配置 `tsconfig.json`（目标 ESNext，module CommonJS）
4. 创建 `esbuild.config.mjs` 打包配置

### 步骤 2：定义类型系统

1. 创建 `src/types/index.ts`，定义：
   - `ChatMessage`：消息结构（role: user/assistant/system, content: string）
   - `ChatOptions`：聊天选项（model, temperature, maxTokens）
   - `ProviderConfig`：提供者配置

### 步骤 3：实现 Provider 接口

1. 创建 `ILLMProvider.ts` 统一接口
2. 实现 `OpenAIProvider.ts`（兼容 OpenAI API 格式）
3. 实现 `ClaudeProvider.ts`（Anthropic Claude API）
4. 实现 `GeminiProvider.ts`（Google Gemini API）
5. 实现 `DoubaoProvider.ts`（字节跳动豆包 API）
6. 创建 `index.ts` Provider 工厂

### 步骤 4：配置管理

1. 创建 `config/types.ts` 配置类型
2. 创建 `config/index.ts`：
   - 使用 `vscode.workspace.getConfiguration()` 管理 Settings
   - 使用 `vscode.SecretStorage` 存储 API Key
   - 提供 `getApiKey()`、`setApiKey()`、`getActiveProvider()` 等方法

### 步骤 5：HTTP 工具封装

1. 创建 `utils/http.ts`：
   - 封装 `fetch` 请求
   - 支持普通请求和流式 SSE 请求
   - 处理 API Key 认证

### 步骤 6：聊天功能实现

1. 创建 `ChatManager.ts`：
   - 管理聊天会话状态
   - 调用 Provider 进行请求
   - 处理流式响应

2. 创建 `ChatPanel.ts`：
   - 创建 Webview 面板
   - 处理消息通信（postMessage）
   - 加载 Webview 前端资源

### 步骤 7：扩展入口

1. 创建 `extension.ts`：
   - 注册命令 `ai-plugin.openChat`
   - 激活时初始化配置和面板
   - 注册配置变更监听

### 步骤 8：Webview 前端

1. 创建 `webview/package.json`，添加 Vue 3 + Vite 依赖
2. 创建 `vite.config.ts`，配置构建输出到 `dist/webview`
3. 创建 `src/App.vue` 聊天界面（消息列表、输入框、发送按钮）
4. 创建 `src/main.ts` 和 `src/style.css`

## 5. 配置管理设计

### 5.1 VSCode Settings 配置

```json
"ai-plugin.activeProvider": {
  "type": "string",
  "default": "openai",
  "description": "当前激活的 AI 提供者"
},
"ai-plugin.defaultModel": {
  "type": "string",
  "default": "gpt-4o",
  "description": "默认使用的模型"
},
"ai-plugin.temperature": {
  "type": "number",
  "default": 0.7,
  "minimum": 0,
  "maximum": 2
},
"ai-plugin.maxTokens": {
  "type": "number",
  "default": 4096,
  "minimum": 1,
  "maximum": 128000
}
```

### 5.2 SecretStorage 存储

- 每个 Provider 的 API Key 存储在 SecretStorage 中，Key 格式：`ai-plugin.${providerId}.apiKey`
- 使用 `vscode.secrets.get()` 和 `vscode.secrets.store()` 进行读写

## 6. 支持的大模型

| 提供者 | 标识 | API 端点 | 支持模型示例 |
|--------|------|----------|-------------|
| OpenAI | openai | https://api.openai.com/v1 | gpt-4o, gpt-4, gpt-3.5-turbo |
| Claude | claude | https://api.anthropic.com/v1 | claude-3-opus-20240229, claude-3-sonnet-20240229 |
| Gemini | gemini | https://generativelanguage.googleapis.com/v1 | gemini-pro, gemini-1.5-pro |
| 豆包 | doubao | https://api.doubao.com/v1 | doubao-pro-128k |

## 7. 命令注册

| 命令 ID | 说明 | 快捷键 |
|---------|------|--------|
| `ai-plugin.openChat` | 打开 AI 聊天面板 | Ctrl+Shift+P -> "AI 聊天" |
| `ai-plugin.configureProvider` | 配置当前提供者 | - |
| `ai-plugin.clearChat` | 清空聊天记录 | - |

## 8. 依赖清单

### 扩展端依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `vscode` | ^1.80.0 | VSCode API 类型定义 |
| `@types/node` | ^20.0.0 | Node.js 类型定义 |
| `esbuild` | ^0.21.0 | 打包工具 |

### Webview 端依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `vue` | ^3.5.0 | 前端框架 |
| `vite` | ^5.0.0 | 构建工具 |
| `@vitejs/plugin-vue` | ^5.0.0 | Vue 插件 |

## 9. 风险处理

1. **API Key 安全**：使用 VSCode SecretStorage 而非明文存储
2. **网络错误**：添加重试机制和错误提示
3. **流式响应中断**：监听 AbortController 取消请求
4. **模型兼容性**：每个 Provider 独立实现，便于维护和扩展
5. **VSCode 版本兼容**：设置 `engines.vscode` 最低版本为 1.80.0

## 10. 构建与发布

### 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式（监听变更自动重建）
pnpm run dev

# 构建扩展
pnpm run build

# 打包成 .vsix（需要安装 vsce）
pnpm run package
```

### 扩展安装

开发阶段使用 VSCode "扩展: 从 VSIX 安装" 或直接按 F5 启动调试。

---

**计划完成，请确认是否开始执行。**