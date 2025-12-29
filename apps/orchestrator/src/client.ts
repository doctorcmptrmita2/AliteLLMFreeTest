/**
 * LiteLLM client with fallback logic for coder models
 * Supports timeout, retry with exponential backoff, and model fallback chain
 */

interface LiteLLMRequest {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
}

interface LiteLLMResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

interface ClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeoutMs: number;
}

// Model configurations (all via OpenRouter)
const PLANNER_MODEL = 'openrouter/openai/gpt-4o-mini';
const REVIEWER_MODEL = 'openrouter/openai/gpt-4o-mini';

const CODER_MODELS = [
  // Premium models (high-performance)
  'openrouter/deepseek/deepseek-v3.2', // High-performance reasoning model (GPT-5 class)
  'openrouter/anthropic/claude-sonnet-4.5', // Best coding performance, state-of-the-art
  'openrouter/x-ai/grok-4.1-fast', // Best agentic tool calling, 2M context
  'openrouter/z-ai/glm-4.6', // Superior coding performance, 200K context
  'openrouter/google/gemini-2.5-flash', // Advanced reasoning, coding, 1M context
  'openrouter/amazon/nova-2-lite-v1', // Fast, cost-effective reasoning, 1M context
  'openrouter/qwen/qwen3-30b-a3b', // Cost-effective reasoning, 40K context
  
  // Free tier fallback models
  'openrouter/xiaomi/mimo-v2-flash:free',
  'openrouter/kwaipilot/kat-coder-pro:free',
  'openrouter/mistralai/devstral-2512:free',
  'openrouter/qwen/qwen3-coder:free',
] as const;

export class LiteLLMClient {
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
  }

  /**
   * Call LiteLLM API with timeout and retry logic
   */
  private async callAPI(
    request: LiteLLMRequest,
    retryCount = 0
  ): Promise<LiteLLMResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        const status = response.status;

        // Retry on 429, 5xx, or network errors (only 1 retry)
        if (retryCount < 1 && (status === 429 || status >= 500)) {
          const backoffMs = Math.pow(2, retryCount) * 1000; // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          return this.callAPI(request, retryCount + 1);
        }

        throw new Error(
          `LiteLLM API error (${status}): ${errorText}`
        );
      }

      const data = (await response.json()) as LiteLLMResponse;
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        // Retry on timeout/network errors (only 1 retry)
        if (retryCount < 1 && (error.name === 'AbortError' || error.message.includes('fetch'))) {
          const backoffMs = Math.pow(2, retryCount) * 1000;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          return this.callAPI(request, retryCount + 1);
        }
        throw error;
      }

      throw new Error(`Unexpected error: ${String(error)}`);
    }
  }

  /**
   * Call planner model (GPT-4o-mini)
   */
  async plan(task: string): Promise<string> {
    const request: LiteLLMRequest = {
      model: PLANNER_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a planning assistant. Break down the given task into a clear, step-by-step plan. Output only the plan, no explanations.',
        },
        {
          role: 'user',
          content: `Task: ${task}\n\nCreate a detailed plan:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    };

    const response = await this.callAPI(request);
    return response.choices[0]?.message?.content ?? '';
  }

  /**
   * Call coder model with fallback chain
   */
  async code(task: string, plan: string): Promise<string> {
    const systemPrompt = `You are a coding assistant. Generate code based on the task and plan. Output clean, production-ready code with proper error handling.`;

    const userPrompt = `Task: ${task}\n\nPlan:\n${plan}\n\nGenerate the code:`;

    let lastError: Error | null = null;

    // Try each coder model in order
    for (const model of CODER_MODELS) {
      try {
        const request: LiteLLMRequest = {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4000,
        };

        const response = await this.callAPI(request);
        return response.choices[0]?.message?.content ?? '';
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        // Continue to next model
        console.warn(`Model ${model} failed: ${lastError.message}`);
      }
    }

    // All models failed
    throw new Error(
      `All coder models failed. Last error: ${lastError?.message ?? 'Unknown'}`
    );
  }

  /**
   * Call reviewer model (GPT-4o-mini)
   */
  async review(task: string, plan: string, code: string): Promise<string> {
    const request: LiteLLMRequest = {
      model: REVIEWER_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a code reviewer. Review the code against the task and plan. Identify issues, suggest improvements, and verify completeness.',
        },
        {
          role: 'user',
          content: `Task: ${task}\n\nPlan:\n${plan}\n\nCode:\n${code}\n\nReview:`,
        },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    };

    const response = await this.callAPI(request);
    return response.choices[0]?.message?.content ?? '';
  }
}

