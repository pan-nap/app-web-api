/**
 * fetch 响应体的类型化解析辅助。
 * strict 模式下 response.json() 返回 unknown，这里统一转换为目标类型。
 */

export interface ErrorBody {
  error?: { message?: string };
}

/** OpenAI 兼容的 chat completions 响应体 */
export interface ChatCompletionBody {
  choices?: Array<{
    message?: { content?: string };
    delta?: { content?: string };
    finish_reason?: string;
  }>;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}
