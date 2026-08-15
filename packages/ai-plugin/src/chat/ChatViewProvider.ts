import * as vscode from "vscode";
import { ChatManager } from "./ChatManager";
import { ConfigManager } from "../config";
import { GitService } from "../git/GitService";
import { WebviewMessage } from "../types";
import { getProvider } from "../providers";
import chatHtml from "./webview.html";

/**
 * 侧边栏聊天视图提供者（唯一聊天 UI 实现）。
 * 视图 HTML 在 webview.html 中维护，由 esbuild 以 text loader 内嵌打包。
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
    webviewView.webview.html = chatHtml;

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
}
