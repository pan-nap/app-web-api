import * as vscode from "vscode";

class MyViewProvider implements vscode.WebviewViewProvider {
  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    console.log("[ai-plugin] resolveWebviewView 被调用了！！！");
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = "<html><body><h1>TEST WORKS!</h1></body></html>";
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("[ai-plugin] 激活开始");

  const provider = new MyViewProvider();
  console.log("[ai-plugin] 提供者实例:", provider);
  console.log("[ai-plugin] 类型检查:", provider instanceof vscode.WebviewViewProvider);

  const disposable = vscode.window.registerWebviewViewProvider("ai-plugin-chat", provider);
  context.subscriptions.push(disposable);
  console.log("[ai-plugin] 注册完成:", disposable);

  console.log("[ai-plugin] 激活完成");

  setTimeout(async () => {
    console.log("[ai-plugin] 尝试打开视图");
    await vscode.commands.executeCommand("workbench.action.openView", "ai-plugin-chat");
  }, 2000);
}

export function deactivate() {
  console.log("[ai-plugin] 已停用");
}
