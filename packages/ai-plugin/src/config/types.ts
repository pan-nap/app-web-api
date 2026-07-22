export interface ExtensionConfig {
  activeProvider: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  apiBaseUrl?: string;
}

export interface ProviderSettings {
  apiKey?: string;
  baseUrl?: string;
}