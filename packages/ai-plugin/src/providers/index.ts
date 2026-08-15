import { ILLMProvider } from './ILLMProvider';
import { DeepSeekProvider } from './DeepSeekProvider';

const providers: Record<string, ILLMProvider> = {
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
