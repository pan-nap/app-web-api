import { ILLMProvider } from "./ILLMProvider";
import { ChatMessage, ChatOptions, ChatCompletionResponse, ProviderInfo } from "../types";

export class GeminiProvider implements ILLMProvider {
  readonly id = "gemini";
  readonly name = "Gemini";
  readonly description = "Google Gemini 系列模型";
  readonly models = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro", "gemini-pro-vision"];
  readonly defaultModel = "gemini-1.5-pro";

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
    const url = (baseUrl || "https://generativelanguage.googleapis.com/v1") + `/models/${options.model}:generateContent?key=${apiKey}`;

    const geminiMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens,
          topP: options.topP
        }
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "请求失败" } }));
      throw new Error(error.error?.message || "请求失败");
    }

    const data = await response.json();
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
      model: options.model,
      finishReason: data.candidates?.[0]?.finishReason
    };
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions, apiKey: string, baseUrl?: string): AsyncGenerator<string> {
    const url = (baseUrl || "https://generativelanguage.googleapis.com/v1") + `/models/${options.model}:streamGenerateContent?key=${apiKey}`;

    const geminiMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens,
          topP: options.topP
        }
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
          try {
            const data = JSON.parse(dataStr);
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro?key=${apiKey}`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
