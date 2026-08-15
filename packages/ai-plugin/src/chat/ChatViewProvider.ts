import * as vscode from "vscode";
import { ChatManager } from "./ChatManager";
import { ConfigManager } from "../config";
import { GitService } from "../git/GitService";
import { WebviewMessage } from "../types";
import { getProvider } from "../providers";

/**
 * 侧边栏聊天视图提供者（唯一聊天 UI 实现）。
 * 使用内联 HTML，无额外构建步骤；依赖 esbuild 将整个扩展打包为单文件。
 */
export class ChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "ai-plugin-chat";

  private _view?: vscode.WebviewView;
  private readonly chatManager: ChatManager;
  private readonly configManager: ConfigManager;
  private readonly gitService: GitService;
  private disposables: vscode.Disposable[] = [];
  /** 等待视图就绪后自动触发的 Git 总结请求（侧边栏未打开时由命令触发） */
  private pendingGitSummary = false;

  constructor(chatManager: ChatManager, configManager: ConfigManager) {
    this.chatManager = chatManager;
    this.configManager = configManager;
    this.gitService = new GitService();
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;
    this.disposables.push(webviewView.onDidDispose(() => this.dispose()));

    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage(
      (message: WebviewMessage) => this.handleMessage(message),
      undefined,
      this.disposables
    );

    // 配置变更时同步给前端
    this.disposables.push(
      this.configManager.onDidChange(() => this.sendProviderInfo())
    );

    // 流式输出 & 错误回调
    this.chatManager.setStreamCallback((content) => {
      this._view?.webview.postMessage({
        type: "streamChunk",
        payload: { content }
      } as WebviewMessage);
    });

    this.chatManager.setErrorCallback((error) => {
      this._view?.webview.postMessage({
        type: "error",
        payload: { message: error }
      } as WebviewMessage);
    });

    // 初次就绪：推送当前配置与消息
    this.sendProviderInfo();
    this.sendMessages();
  }

  /** 供命令（如清空聊天）主动刷新视图 */
  public refresh(): void {
    this.sendProviderInfo();
    this.sendMessages();
  }

  /** 供命令触发 Git 总结：视图已打开则直接通知前端，未打开则先打开再触发 */
  public requestGitSummary(): void {
    if (this._view) {
      this._view.webview.postMessage({
        type: "gitSummaryRequested"
      } as WebviewMessage);
    } else {
      this.pendingGitSummary = true;
      vscode.commands.executeCommand("ai-plugin-sidebar.focus");
    }
  }

  private async handleMessage(message: WebviewMessage): Promise<void> {
    switch (message.type) {
      case "ready":
        this.sendProviderInfo();
        this.sendMessages();
        if (this.pendingGitSummary) {
          this.pendingGitSummary = false;
          this._view?.webview.postMessage({
            type: "gitSummaryRequested"
          } as WebviewMessage);
        }
        break;
      case "sendMessage": {
        const content = message.payload?.content as string | undefined;
        if (content?.trim()) {
          try {
            await this.chatManager.sendMessage(content.trim());
          } catch (e: any) {
            console.error("[ai-plugin-view] sendMessage 异常:", e?.message ?? e);
          }
          this.sendMessages();
        }
        break;
      }
      case "stopStreaming":
        this.chatManager.stopStreaming();
        this.sendMessages();
        break;
      case "clearChat":
        this.chatManager.clearMessages();
        this.sendMessages();
        break;
      case "configureProvider":
        await this.configManager.configureProvider();
        this.sendProviderInfo();
        break;
      case "gitSummary": {
        try {
          const summary = await this.gitService.getChangeSummary();
          if (!summary.ok || !summary.context) {
            this._view?.webview.postMessage({
              type: "error",
              payload: { message: summary.message || "没有可总结的变更" }
            } as WebviewMessage);
          } else {
            await this.chatManager.sendGitSummary(summary.display, summary.context);
          }
        } catch (e: any) {
          console.error("[ai-plugin-view] gitSummary 异常:", e?.message ?? e);
          this._view?.webview.postMessage({
            type: "error",
            payload: { message: `Git 总结失败：${e?.message ?? e}` }
          } as WebviewMessage);
        }
        this.sendMessages();
        break;
      }
    }
  }

  private sendProviderInfo(): void {
    const providerId = this.configManager.getActiveProviderId();
    const provider = getProvider(providerId);
    this._view?.webview.postMessage({
      type: "configChange",
      payload: { provider: provider?.getInfo() }
    } as WebviewMessage);
  }

  private sendMessages(): void {
    this._view?.webview.postMessage({
      type: "messages",
      payload: { messages: this.chatManager.getMessages() }
    } as WebviewMessage);
  }

  private dispose(): void {
    this._view = undefined;
    while (this.disposables.length) {
      this.disposables.pop()?.dispose();
    }
  }

  private getHtml(): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  :root {
    --bg: #1e1e1e;
    --bg-elevated: #252526;
    --bg-input: #3c3c3c;
    --border: #3c3c3c;
    --text: #cccccc;
    --text-dim: #888888;
    --accent: #0e639c;
    --accent-hover: #1177bb;
    --danger: #f14c4c;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
    font-size: 13px;
    color: var(--vscode-foreground, var(--text));
    background: var(--vscode-sideBar-background, var(--bg));
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--vscode-panel-border, var(--border));
    background: var(--vscode-sideBarSectionHeader-background, var(--bg-elevated));
  }
  .header-title { font-size: 13px; font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .provider-badge {
    font-size: 11px;
    color: var(--vscode-descriptionForeground, var(--text-dim));
    background: var(--vscode-badge-background, var(--bg-input));
    padding: 2px 8px;
    border-radius: 10px;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .icon-btn {
    border: none;
    background: transparent;
    color: var(--vscode-foreground, var(--text));
    cursor: pointer;
    font-size: 14px;
    padding: 3px 6px;
    border-radius: 4px;
    line-height: 1;
  }
  .icon-btn:hover { background: var(--vscode-toolbar-hoverBackground, var(--bg-input)); }
  .chat-area { flex: 1; overflow-y: auto; padding: 12px; }
  .message { display: flex; margin-bottom: 10px; }
  .message.user { justify-content: flex-end; }
  .message.assistant { justify-content: flex-start; }
  .avatar {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; flex-shrink: 0; user-select: none;
  }
  .message.user .avatar { background: var(--accent); color: #fff; margin-left: 8px; order: 1; }
  .message.assistant .avatar { background: var(--bg-input); color: var(--text-dim); margin-right: 8px; }
  .bubble {
    max-width: 85%;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .message.user .bubble { background: var(--accent); color: #fff; }
  .message.assistant .bubble { background: var(--vscode-editorWidget-background, #2d2d2d); border: 1px solid var(--vscode-widget-border, var(--border)); }
  .error-box {
    background: var(--vscode-inputValidation-errorBackground, #3b2d2d);
    color: var(--danger);
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    margin-bottom: 10px;
    white-space: pre-wrap;
  }
  .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-dim); gap: 8px; }
  .empty .icon { font-size: 40px; }
  .empty .hint { font-size: 12px; opacity: .7; }
  .loading-dots { display: inline-flex; gap: 4px; }
  .dot { width: 6px; height: 6px; background: var(--text-dim); border-radius: 50%; animation: blink 1.4s infinite; }
  .dot:nth-child(2) { animation-delay: .2s; }
  .dot:nth-child(3) { animation-delay: .4s; }
  @keyframes blink { 0%, 80%, 100% { opacity: .2; } 40% { opacity: 1; } }
  .input-area { padding: 10px 12px; border-top: 1px solid var(--vscode-panel-border, var(--border)); }
  .input-wrapper {
    display: flex; align-items: flex-end; gap: 8px;
    background: var(--vscode-input-background, var(--bg-input));
    border: 1px solid var(--vscode-input-border, transparent);
    border-radius: 8px; padding: 6px 8px;
  }
  .input-wrapper:focus-within { border-color: var(--accent); }
  textarea {
    flex: 1; border: none; outline: none; resize: none;
    background: transparent; color: var(--vscode-input-foreground, var(--text));
    font-family: inherit; font-size: 13px; line-height: 1.4;
    max-height: 120px;
  }
  textarea::placeholder { color: var(--vscode-input-placeholderForeground, #666); }
  .send-btn {
    border: none; border-radius: 6px;
    background: var(--accent); color: #fff;
    padding: 6px 14px; cursor: pointer; font-size: 13px;
  }
  .send-btn:hover { background: var(--accent-hover); }
  .send-btn:disabled { opacity: .5; cursor: not-allowed; }
  .stop-btn {
    border: none; border-radius: 6px;
    background: var(--danger); color: #fff;
    padding: 6px 12px; cursor: pointer; font-size: 13px;
  }
</style>
</head>
<body>
  <div class="header">
    <span class="header-title">AI 智能体</span>
    <span class="provider-badge" id="provider">未配置</span>
    <button class="icon-btn" id="gitBtn" title="总结当前 Git 变更（用于提交）">📋</button>
    <button class="icon-btn" id="configBtn" title="配置提供者 / API Key">⚙</button>
    <button class="icon-btn" id="clearBtn" title="清空聊天">🗑</button>
  </div>

  <div class="chat-area" id="chat">
    <div class="empty">
      <div class="icon">👋</div>
      <div>开始聊天吧</div>
      <div class="hint">点击右上角 ⚙ 配置提供者与 API Key</div>
    </div>
  </div>

  <div class="input-area">
    <div class="input-wrapper">
      <textarea id="input" rows="1" placeholder="输入消息，Enter 发送，Shift+Enter 换行"></textarea>
      <button class="send-btn" id="sendBtn">发送</button>
      <button class="stop-btn" id="stopBtn" style="display:none">停止</button>
    </div>
  </div>

<script>
  const vscode = acquireVsCodeApi();
  const chat = document.getElementById('chat');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('sendBtn');
  const stopBtn = document.getElementById('stopBtn');
  const clearBtn = document.getElementById('clearBtn');
  const configBtn = document.getElementById('configBtn');
  const gitBtn = document.getElementById('gitBtn');
  const providerEl = document.getElementById('provider');

  let msgs = [];
  let errMsg = '';
  let streaming = false;

  function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  function scrollToBottom() { chat.scrollTop = chat.scrollHeight; }

  function render() {
    chat.innerHTML = '';
    if (errMsg) {
      const e = document.createElement('div');
      e.className = 'error-box';
      e.textContent = errMsg;
      chat.appendChild(e);
    }
    if (msgs.length === 0 && !errMsg) {
      chat.innerHTML = '<div class="empty"><div class="icon">👋</div><div>开始聊天吧</div><div class="hint">点击右上角 ⚙ 配置提供者与 API Key</div></div>';
      return;
    }
    msgs.forEach((m, i) => {
      const row = document.createElement('div');
      row.className = 'message ' + m.role;
      const avatar = m.role === 'user' ? '我' : 'AI';
      let body;
      if (m.role === 'assistant' && streaming && i === msgs.length - 1 && !m.content) {
        body = '<div class="loading-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
      } else {
        body = escapeHtml(m.content);
      }
      row.innerHTML = '<div class="avatar">' + avatar + '</div><div class="bubble">' + body + '</div>';
      chat.appendChild(row);
    });
    scrollToBottom();
    syncButtons();
  }

  function syncButtons() {
    sendBtn.style.display = streaming ? 'none' : '';
    stopBtn.style.display = streaming ? '' : 'none';
    sendBtn.disabled = !input.value.trim();
  }

  function post(type, payload) {
    vscode.postMessage({ type, payload: payload || {} });
  }

  function send() {
    const text = input.value.trim();
    if (!text || streaming) return;
    input.value = '';
    errMsg = '';
    streaming = true;
    // 本地乐观渲染用户消息 + 空助手气泡（加载动画），流式期间立即可见
    msgs.push({ role: 'user', content: text });
    msgs.push({ role: 'assistant', content: '' });
    post('sendMessage', { content: text });
    render();
  }

  function sendGitSummary() {
    if (streaming) return;
    errMsg = '';
    streaming = true;
    // 本地乐观渲染请求消息 + 空助手气泡
    msgs.push({ role: 'user', content: '📋 请求总结当前 Git 变更…' });
    msgs.push({ role: 'assistant', content: '' });
    post('gitSummary');
    render();
  }

  // 自动增高输入框
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    syncButtons();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  sendBtn.addEventListener('click', send);

  stopBtn.addEventListener('click', () => {
    streaming = false;
    post('stopStreaming');
  });

  clearBtn.addEventListener('click', () => {
    errMsg = '';
    post('clearChat');
  });

  configBtn.addEventListener('click', () => {
    post('configureProvider');
  });

  gitBtn.addEventListener('click', () => {
    sendGitSummary();
  });

  window.addEventListener('message', (e) => {
    const d = e.data;
    switch (d.type) {
      case 'gitSummaryRequested':
        sendGitSummary();
        break;
      case 'messages':
        msgs = d.payload.messages || [];
        streaming = false;
        errMsg = '';
        render();
        break;
      case 'streamChunk': {
        streaming = true;
        const last = msgs[msgs.length - 1];
        if (last && last.role === 'assistant') {
          last.content = (last.content || '') + d.payload.content;
        } else {
          msgs.push({ role: 'assistant', content: d.payload.content });
        }
        render();
        break;
      }
      case 'error':
        streaming = false;
        errMsg = d.payload.message;
        render();
        break;
      case 'configChange': {
        const p = d.payload && d.payload.provider;
        providerEl.textContent = p ? p.name + ' · ' + p.defaultModel : '未配置';
        break;
      }
    }
  });

  post('ready');
</script>
</body>
</html>`;
  }
}
