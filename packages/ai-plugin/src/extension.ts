import * as vscode from "vscode";
import { ConfigManager } from "./config";
import { ChatManager } from "./chat/ChatManager";
import { ChatViewProvider } from "./chat/ChatViewProvider";

export function activate(context: vscode.ExtensionContext): void {
  console.log("[ai-plugin] 激活开始");

  // 配置管理（读取 VS Code 设置 + SecretStorage 存 API Key）
  const configManager = new ConfigManager(context);

  // 聊天管理（消息记录 + 流式请求）
  const chatManager = new ChatManager(configManager);

  // 侧边栏聊天视图
  const viewProvider = new ChatViewProvider(chatManager, configManager);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ChatViewProvider.viewType,
      viewProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  // 命令：打开侧边栏聊天视图
  context.subscriptions.push(
    vscode.commands.registerCommand("ai-plugin.openChat", () => {
      vscode.commands.executeCommand("ai-plugin-sidebar.focus");
    })
  );

  // 命令：配置 AI 提供者（选择模型 + 输入 API Key）
  context.subscriptions.push(
    vscode.commands.registerCommand("ai-plugin.configureProvider", async () => {
      await configManager.configureProvider();
      viewProvider.refresh();
    })
  );

  // 命令：清空聊天记录
  context.subscriptions.push(
    vscode.commands.registerCommand("ai-plugin.clearChat", () => {
      chatManager.clearMessages();
      viewProvider.refresh();
    })
  );

  console.log("[ai-plugin] 激活完成");
}

export function deactivate(): void {
  // 无需特殊清理
}
