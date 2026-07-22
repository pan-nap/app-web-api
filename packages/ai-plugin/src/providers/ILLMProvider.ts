import { ChatMessage, ChatOptions, ChatCompletionResponse, ProviderInfo } from '../types';

export interface ILLMProvider {
  id: string;
  name: string;
  description: string;
  models: string[];
  defaultModel: string;

  getInfo(): ProviderInfo;

  chat(
    messages: ChatMessage[],
    options: ChatOptions,
    apiKey: string,
    baseUrl?: string
  ): Promise<ChatCompletionResponse>;

  streamChat(
    messages: ChatMessage[],
    options: ChatOptions,
    apiKey: string,
    baseUrl?: string
  ): AsyncGenerator<string>;

  validateApiKey(apiKey: string): Promise<boolean>;
}