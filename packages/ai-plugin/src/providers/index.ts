import { ILLMProvider } from './ILLMProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { ClaudeProvider } from './ClaudeProvider';
import { GeminiProvider } from './GeminiProvider';
import { DoubaoProvider } from './DoubaoProvider';
import { DeepSeekProvider } from './DeepSeekProvider';

const providers: Record<string, ILLMProvider> = {
  openai: new OpenAIProvider(),
  claude: new ClaudeProvider(),
  gemini: new GeminiProvider(),
  doubao: new DoubaoProvider(),
  deepseek: new DeepSeekProvider()
};

export function getProvider(providerId: string): ILLMProvider | undefined {
  return providers[providerId];
}

export function getAllProviders(): ILLMProvider[] {
  return Object.values(providers);
}

export function registerProvider(provider: ILLMProvider): void {
  providers[provider.id] = provider;
}

export type ProviderId = keyof typeof providers;