import { ChatMessage, ChatOptions } from '../types';
import { getProvider } from '../providers';
import { ConfigManager } from '../config';

/** 生成 Git 提交总结的 system 提示词 */
const GIT_SUMMARY_SYSTEM_PROMPT = `你是一个专业的代码审查助手。用户会提供当前工作区的 Git 变更（文件清单与 diff 摘要）。
请用中文生成一份可直接用于 git commit 的提交总结，严格按以下结构输出：

## 变更概述
用 2-3 句话概括本次实现了什么功能 / 修复了什么 / 为什么改动。

## 修改的文件
逐条列出修改过的文件路径，并简要说明每处改动的用途（没有就写"无"）。

## 新增的文件
逐条列出新增的文件路径及用途（没有就写"无"）。

## 删除的文件
逐条列出删除的文件路径（没有就写"无"）。

## 建议的提交信息
给出 1 条简洁的中文 commit message（一行，不超过 50 字，动词开头，如"新增学生批量导入功能"）。

注意：
- 基于提供的 diff 内容如实总结，不要编造不存在的功能。
- diff 可能被截断，如信息不足请说明"diff 已截断，无法完整判断"。
- 只输出以上结构，不要额外寒暄。`;

interface ChatContext {
  provider: NonNullable<ReturnType<typeof getProvider>>;
  options: ChatOptions;
  apiKey: string;
  baseUrl?: string;
}

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

  private async resolveChatContext(): Promise<ChatContext | null> {
    const providerId = this.configManager.getActiveProviderId();
    const provider = getProvider(providerId);

    if (!provider) {
      this.errorCallback?.('未知的AI提供者');
      return null;
    }

    const apiKey = await this.configManager.getApiKey(providerId);
    if (!apiKey) {
      this.errorCallback?.('请先配置API Key');
      return null;
    }

    const options: ChatOptions = {
      model: provider.defaultModel,
      temperature: this.configManager.getTemperature(),
      maxTokens: this.configManager.getMaxTokens(),
      topP: 1
    };

    return {
      provider,
      options,
      apiKey,
      baseUrl: this.configManager.getApiBaseUrl()
    };
  }

  /** 私有：执行一次流式请求，写入 assistantMessage 并触发流式回调 */
  private async runStream(
    requestMessages: ChatMessage[],
    assistantMessage: ChatMessage,
    ctx: ChatContext
  ): Promise<void> {
    this.isStreaming = true;
    try {
      for await (const chunk of ctx.provider.streamChat(
        requestMessages,
        ctx.options,
        ctx.apiKey,
        ctx.baseUrl
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

  async sendMessage(content: string): Promise<void> {
    if (this.isStreaming) {
      this.errorCallback?.('正在生成响应，请稍后');
      return;
    }

    const ctx = await this.resolveChatContext();
    if (!ctx) return;

    const userMessage: ChatMessage = { role: 'user', content };
    this.addMessage(userMessage);

    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    this.addMessage(assistantMessage);

    await this.runStream(this.messages, assistantMessage, ctx);
  }

  /**
   * 根据 Git 变更生成提交总结。
   * @param display 用户可见的文件变更概览（作为 user 消息展示）
   * @param context 完整 diff 上下文（作为 system 消息发给 AI）
   */
  async sendGitSummary(display: string, context: string): Promise<void> {
    if (this.isStreaming) {
      this.errorCallback?.('正在生成响应，请稍后');
      return;
    }

    const ctx = await this.resolveChatContext();
    if (!ctx) return;

    // 变更概览作为用户消息入历史（便于用户回看）
    const userMessage: ChatMessage = {
      role: 'user',
      content: `【Git 变更总结】\n${display}\n\n请生成一份可用于提交 git 的变更总结。`
    };
    this.addMessage(userMessage);

    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    this.addMessage(assistantMessage);

    // diff 上下文走 system 消息，不入历史（避免污染后续对话的 token 预算）
    const requestMessages: ChatMessage[] = [
      { role: 'system', content: `${GIT_SUMMARY_SYSTEM_PROMPT}\n\n以下是当前工作区的 Git 变更：\n${context}` },
      ...this.messages
    ];

    await this.runStream(requestMessages, assistantMessage, ctx);
  }

  stopStreaming(): void {
    this.isStreaming = false;
  }
}
