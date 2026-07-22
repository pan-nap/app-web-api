import { ILLMProvider } from "./ILLMProvider";
import { ChatMessage, ChatOptions, ChatCompletionResponse, ProviderInfo } from "../types";

export class DeepSeekProvider implements ILLMProvider {
  readonly id = "deepseek";
  readonly name = "DeepSeek";
  readonly description = "深度求索 DeepSeek 系列模型";
  readonly models = ["deepseek-v4-flash", "deepseek-v4-pro", "deepseek-v4-chat"];
  readonly defaultModel = "deepseek-v4-flash";

  getInfo(): ProviderInfo {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      models: this.models,
      defaultModel: this.defaultModel
    };
  }

  async chat(messages: ChatMessage[], options: ChatOptions, apiKey: string, baseUrl?: string): Promise<ChatCompletionResponse> {
    const url = baseUrl || "https://api.deepseek.com/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        top_p: options.topP
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "请求失败" } }));
      throw new Error(error.error?.message || "请求失败");
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || "",
      model: data.model,
      finishReason: data.choices[0]?.finish_reason,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens
          }
        : undefined
    };
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions, apiKey: string, baseUrl?: string): AsyncGenerator<string> {
    const url = baseUrl || "https://api.deepseek.com/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "请求失败" } }));
      throw new Error(error.error?.message || "请求失败");
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6);
          if (dataStr === "[DONE]") return;
          try {
            const data = JSON.parse(dataStr);
            const content = data.choices[0]?.delta?.content || "";
            if (content) yield content;
          } catch {
            continue;
          }
        }
      }
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch("https://api.deepseek.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
