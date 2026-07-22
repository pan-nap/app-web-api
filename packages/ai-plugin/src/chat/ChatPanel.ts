import * as vscode from "vscode";
import { ChatManager } from "./ChatManager";
import { ConfigManager } from "../config";
import { WebviewMessage } from "../types";
import { getProvider } from "../providers";

export class ChatPanel {
  public static currentPanel: ChatPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private readonly chatManager: ChatManager;
  private readonly configManager: ConfigManager;
  private disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, chatManager: ChatManager, configManager: ConfigManager) {
    this.panel = panel;
    this.chatManager = chatManager;
    this.configManager = configManager;

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.onDidChangeViewState(
      (e) => {
        if (e.webviewPanel.visible) {
          this.update();
        }
      },
      null,
      this.disposables
    );

    this.panel.webview.options = {
      enableScripts: true
    };

    this.panel.webview.html = this.getHtml();

    this.setupMessageListener();
    this.setupConfigListener();

    this.chatManager.setStreamCallback((content) => {
      this.panel.webview.postMessage({
        type: "streamChunk",
        payload: { content }
      } as WebviewMessage);
    });

    this.chatManager.setErrorCallback((error) => {
      this.panel.webview.postMessage({
        type: "error",
        payload: { message: error }
      } as WebviewMessage);
    });
  }

  public static createOrShow(context: vscode.ExtensionContext, chatManager: ChatManager, configManager: ConfigManager): ChatPanel {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (ChatPanel.currentPanel) {
      ChatPanel.currentPanel.panel.reveal(column);
      return ChatPanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel("ai-plugin-chat", "AI智能体", column || vscode.ViewColumn.One, {
      enableScripts: true
    });

    ChatPanel.currentPanel = new ChatPanel(panel, context, chatManager, configManager);
    return ChatPanel.currentPanel;
  }

  public static kill(): void {
    ChatPanel.currentPanel?.dispose();
    ChatPanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel): void {
    ChatPanel.currentPanel = new ChatPanel(panel, null as any, null as any, null as any);
  }

  private getHtml(): string {
    return getChatHtml();
  }

  private setupMessageListener(): void {
    this.panel.webview.onDidReceiveMessage(
      async (message: WebviewMessage) => {
        console.log("[ai-plugin-panel] 收到消息:", message.type);
        switch (message.type) {
          case "ready":
            this.sendProviderInfo();
            this.sendMessages();
            break;
          case "sendMessage":
            const content = message.payload?.content;
            console.log("[ai-plugin-panel] 发送消息:", content);
            if (content) {
              try {
                // 先发送消息列表到前端，让前端显示用户消息和空助手消息
                this.sendMessages();
                await this.chatManager.sendMessage(content);
                console.log("[ai-plugin-panel] sendMessage 完成");
              } catch (e: any) {
                console.error("[ai-plugin-panel] sendMessage 异常:", e.message);
              }
              // 流结束后同步最终状态
              this.sendMessages();
            }
            break;
          case "clearChat":
            this.chatManager.clearMessages();
            this.sendMessages();
            break;
          case "getConfig":
            this.sendProviderInfo();
            break;
        }
      },
      null,
      this.disposables
    );
  }

  private setupConfigListener(): void {
    this.configManager.onDidChange(() => {
      this.sendProviderInfo();
    });
  }

  private sendProviderInfo(): void {
    const providerId = this.configManager.getActiveProviderId();
    const provider = getProvider(providerId);

    this.panel.webview.postMessage({
      type: "configChange",
      payload: {
        provider: provider?.getInfo(),
        temperature: this.configManager.getTemperature(),
        maxTokens: this.configManager.getMaxTokens()
      }
    } as WebviewMessage);
  }

  private sendMessages(): void {
    const messages = this.chatManager.getMessages();
    this.panel.webview.postMessage({
      type: "messages",
      payload: { messages }
    } as WebviewMessage);
  }

  private update(): void {
    this.sendProviderInfo();
    this.sendMessages();
  }

  public dispose(): void {
    ChatPanel.currentPanel = undefined;
    this.panel.dispose();

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) x.dispose();
    }
  }
}

function getChatHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI智能体</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; height: 100vh; display: flex; flex-direction: column; background: #1e1e1e; color: #ccc; }
    .header { padding: 12px 16px; background: #252526; border-bottom: 1px solid #3c3c3c; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { margin: 0; font-size: 14px; color: #ccc; }
    .provider { font-size: 11px; color: #888; background: #3c3c3c; padding: 3px 8px; border-radius: 4px; }
    .chat-area { flex: 1; overflow-y: auto; padding: 16px; }
    .message { display: flex; margin-bottom: 12px; }
    .message.user { justify-content: flex-end; }
    .message.assistant { justify-content: flex-start; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0; }
    .message.user .avatar { background: #007acc; color: white; margin-left: 8px; order: 1; }
    .message.assistant .avatar { background: #3c3c3c; color: #888; margin-right: 8px; }
    .content { max-width: 80%; padding: 10px 14px; border-radius: 8px; font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
    .message.user .content { background: #007acc; color: white; }
    .message.assistant .content { background: #2d2d2d; color: #d4d4d4; }
    .input-area { padding: 12px 16px; border-top: 1px solid #3c3c3c; background: #252526; }
    .input-wrapper { display: flex; align-items: center; background: #3c3c3c; border-radius: 8px; padding: 8px 12px; gap: 8px; border: 1px solid transparent; transition: all 0.2s; }
    .input-wrapper:focus-within { border-color: #007acc; background: #2d2d2d; }
    input { flex: 1; border: none; background: transparent; outline: none; color: #ccc; font-size: 14px; padding: 4px 0; }
    input::placeholder { color: #666; }
    input:focus { color: #fff; }
    button { padding: 6px 12px; border: none; background: #007acc; color: white; border-radius: 4px; cursor: pointer; font-size: 12px; }
    button:hover { background: #005a9e; }
    .clear-btn { background: transparent; color: #888; border: 1px solid #4c4c4c; }
    .clear-btn:hover { background: #4c4c4c; color: #ccc; }
    .loading-dots { display: flex; }
    .dot { width: 6px; height: 6px; background: #888; border-radius: 50%; margin: 0 3px; animation: l 1.4s infinite; }
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes l { 0%,80%,100%{transform:scale(0)}40%{transform:scale(1)} }
    .error { background: #3b2d2d; color: #f14c4c; padding: 8px 12px; border-radius: 4px; font-size: 12px; margin-bottom: 12px; }
    .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; }
    .empty .icon { font-size: 48px; margin-bottom: 16px; }
    .empty .text { font-size: 16px; }
    .empty .hint { font-size: 12px; margin-top: 8px; color: #555; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🤖 AI智能体</h1>
    <span id="provider" class="provider"></span>
  </div>
  <div class="chat-area" id="chat">
    <div class="empty">
      <div class="icon">👋</div>
      <div class="text">开始聊天</div>
      <div class="hint">按 Ctrl+Shift+P 配置 API Key</div>
    </div>
  </div>
  <div class="input-area">
    <div class="input-wrapper">
      <input id="input" placeholder="输入消息..." />
      <button id="send">发送</button>
      <button id="clear" class="clear-btn">清空</button>
    </div>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    const chat = document.getElementById('chat');
    const input = document.getElementById('input');
    const sendBtn = document.getElementById('send');
    const clearBtn = document.getElementById('clear');
    const providerEl = document.getElementById('provider');
    let msgs = [];
    let errMsg = '';
    let waitingStream = false;

    function addMsg(role, content) {
      const div = document.createElement('div');
      div.className = 'message ' + role;
      const avatar = role === 'user' ? '你' : 'AI';
      div.innerHTML = '<div class="avatar">' + avatar + '</div><div class="content">' + escapeHtml(content) + '</div>';
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }
    
    function escapeHtml(text) {
      var d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
    }

    function render() {
      chat.innerHTML = '';
      if (errMsg) {
        var errDiv = document.createElement('div');
        errDiv.className = 'error';
        errDiv.id = 'errMsg';
        errDiv.textContent = errMsg;
        chat.appendChild(errDiv);
      }
      if (msgs.length === 0 && !errMsg) {
        chat.innerHTML = '<div class="empty"><div class="icon">👋</div><div class="text">开始聊天</div><div class="hint">按 Ctrl+Shift+P 配置 API Key</div></div>';
        return;
      }
      msgs.forEach(function(m) { addMsg(m.role, m.content); });
    }

    function showLoading() {
      const div = document.createElement('div');
      div.className = 'message assistant';
      div.id = 'loading';
      div.innerHTML = '<div class="avatar">AI</div><div class="content"><div class="loading-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>';
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    function hideLoading() {
      const el = document.getElementById('loading');
      if (el) el.remove();
    }

    sendBtn.onclick = function() {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      errMsg = '';
      waitingStream = true;
      vscode.postMessage({ type: 'sendMessage', payload: { content: text } });
      showLoading();
    };
    
    input.onkeydown = function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    };

    clearBtn.onclick = function() {
      errMsg = '';
      vscode.postMessage({ type: 'clearChat' });
    };

    window.addEventListener('message', function(e) {
      const d = e.data;
      if (d.type === 'messages') {
        if (!waitingStream) hideLoading();
        msgs = d.payload.messages;
        render();
      } else if (d.type === 'streamChunk') {
        waitingStream = false;
        hideLoading();
        if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
          msgs[msgs.length - 1].content += d.payload.content;
          render();
        }
      } else if (d.type === 'error') {
        waitingStream = false;
        hideLoading();
        errMsg = d.payload.message;
        render();
      } else if (d.type === 'configChange') {
        if (d.payload && d.payload.provider) {
          providerEl.textContent = d.payload.provider.name || '';
        }
      }
    });

    vscode.postMessage({ type: 'ready' });
  </script>
</body>
</html>`;
}
