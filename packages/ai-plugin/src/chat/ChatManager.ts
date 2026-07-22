import { ChatMessage, ChatOptions } from '../types';
import { getProvider } from '../providers';
import { ConfigManager } from '../config';

export class ChatManager {
  private messages: ChatMessage[] = [];
  private configManager: ConfigManager;
  private isStreaming = false;
  private streamCallback?: (content: string) => void;
  private errorCallback?: (error: string) => void;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  addMessage(message: ChatMessage): void {
    this.messages.push(message);
  }

  clearMessages(): void {
    this.messages = [];
  }

  setStreamCallback(callback: (content: string) => void): void {
    this.streamCallback = callback;
  }

  setErrorCallback(callback: (error: string) => void): void {
    this.errorCallback = callback;
  }

  isStreamingNow(): boolean {
    return this.isStreaming;
  }

  async sendMessage(content: string): Promise<void> {
    if (this.isStreaming) {
      this.errorCallback?.('正在生成响应，请稍后');
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content };
    this.addMessage(userMessage);

    const providerId = this.configManager.getActiveProviderId();
    const provider = getProvider(providerId);
    
    if (!provider) {
      this.errorCallback?.('未知的AI提供者');
      return;
    }

    const apiKey = await this.configManager.getApiKey(providerId);
    if (!apiKey) {
      this.errorCallback?.('请先配置API Key');
      return;
    }

    const options: ChatOptions = {
      model: provider.defaultModel,
      temperature: this.configManager.getTemperature(),
      maxTokens: this.configManager.getMaxTokens(),
      topP: 1
    };

    const baseUrl = this.configManager.getApiBaseUrl();
    this.isStreaming = true;

    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    this.addMessage(assistantMessage);

    try {
      for await (const chunk of provider.streamChat(
        this.messages,
        options,
        apiKey,
        baseUrl
      )) {
        if (!this.isStreaming) break;
        assistantMessage.content += chunk;
        this.streamCallback?.(chunk);
      }
    } catch (error: any) {
      this.errorCallback?.(error.message || '请求失败');
      this.messages.pop();
    } finally {
      this.isStreaming = false;
    }
  }

  stopStreaming(): void {
    this.isStreaming = false;
  }
}