import * as vscode from "vscode";
import { ExtensionConfig } from "./types";
import { getProvider, getAllProviders } from "../providers";

const CONFIG_SECTION = "ai-plugin";

export class ConfigManager {
  private configuration: vscode.WorkspaceConfiguration;
  private secretStorage: vscode.SecretStorage;

  constructor(context: vscode.ExtensionContext) {
    this.configuration = vscode.workspace.getConfiguration(CONFIG_SECTION);
    this.secretStorage = context.secrets;
  }

  getConfig(): ExtensionConfig {
    return {
      activeProvider: this.configuration.get<string>("activeProvider", "openai"),
      defaultModel: this.configuration.get<string>("defaultModel", "gpt-4o"),
      temperature: this.configuration.get<number>("temperature", 0.7),
      maxTokens: this.configuration.get<number>("maxTokens", 4096),
      apiBaseUrl: this.configuration.get<string>("apiBaseUrl")
    };
  }

  getActiveProviderId(): string {
    return this.configuration.get<string>("activeProvider", "openai");
  }

  getDefaultModel(): string {
    return this.configuration.get<string>("defaultModel", "gpt-4o");
  }

  getTemperature(): number {
    return this.configuration.get<number>("temperature", 0.7);
  }

  getMaxTokens(): number {
    return this.configuration.get<number>("maxTokens", 4096);
  }

  getApiBaseUrl(): string | undefined {
    return this.configuration.get<string>("apiBaseUrl");
  }

  async getApiKey(providerId: string): Promise<string | undefined> {
    const key = `ai-plugin.${providerId}.apiKey`;
    return this.secretStorage.get(key);
  }

  async setApiKey(providerId: string, apiKey: string): Promise<void> {
    const key = `ai-plugin.${providerId}.apiKey`;
    await this.secretStorage.store(key, apiKey);
  }

  async clearApiKey(providerId: string): Promise<void> {
    const key = `ai-plugin.${providerId}.apiKey`;
    await this.secretStorage.delete(key);
  }

  async promptForApiKey(providerId: string): Promise<string | undefined> {
    const provider = getProvider(providerId);
    const providerName = provider?.name || providerId;

    const input = await vscode.window.showInputBox({
      prompt: `请输入 ${providerName} 的 API Key`,
      password: true,
      placeHolder: "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
    });

    if (input) {
      await this.setApiKey(providerId, input);
      return input;
    }

    return undefined;
  }

  async configureProvider(): Promise<void> {
    const providers = getAllProviders();
    const activeProviderId = this.getActiveProviderId();

    const items = providers.map((p) => ({
      label: p.name,
      description: p.id,
      provider: p,
      isActive: p.id === activeProviderId
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: "选择要配置的AI提供者"
    });

    if (!selected) return;

    const provider = selected.provider;

    // 设置为当前激活的提供商
    await this.configuration.update("activeProvider", provider.id, vscode.ConfigurationTarget.Global);
    // 同步更新默认模型为当前提供商的默认模型
    await this.configuration.update("defaultModel", provider.defaultModel, vscode.ConfigurationTarget.Global);

    const apiKey = await this.getApiKey(provider.id);

    if (!apiKey) {
      await this.promptForApiKey(provider.id);
      return;
    }

    const action = await vscode.window.showQuickPick(["修改API Key", "清除API Key", "取消"], {
      placeHolder: `${provider.name} 的 API Key 已配置`
    });

    if (action === "修改API Key") {
      await this.promptForApiKey(provider.id);
    } else if (action === "清除API Key") {
      await this.clearApiKey(provider.id);
      vscode.window.showInformationMessage(`${provider.name} 的 API Key 已清除`);
    }
  }

  onDidChange(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(CONFIG_SECTION)) {
        this.configuration = vscode.workspace.getConfiguration(CONFIG_SECTION);
        callback();
      }
    });
  }
}
