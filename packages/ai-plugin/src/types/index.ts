export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface ProviderInfo {
  id: string;
  name: string;
  description: string;
  models: string[];
  defaultModel: string;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamChunk {
  content: string;
  isDone: boolean;
  finishReason?: string;
}

export interface ExtensionConfig {
  activeProvider: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  apiBaseUrl?: string;
}

export interface WebviewMessage {
  type: string;
  payload?: any;
}

export interface WebviewReadyMessage extends WebviewMessage {
  type: 'ready';
}

export interface SendMessageRequest extends WebviewMessage {
  type: 'sendMessage';
  payload: {
    content: string;
  };
}

export interface MessageResponse extends WebviewMessage {
  type: 'messageResponse';
  payload: {
    message: ChatMessage;
    isStreaming: boolean;
  };
}

export interface StreamChunkResponse extends WebviewMessage {
  type: 'streamChunk';
  payload: {
    content: string;
  };
}

export interface ErrorResponse extends WebviewMessage {
  type: 'error';
  payload: {
    message: string;
  };
}

export interface ConfigChangeResponse extends WebviewMessage {
  type: 'configChange';
  payload: {
    provider: ProviderInfo;
  };
}