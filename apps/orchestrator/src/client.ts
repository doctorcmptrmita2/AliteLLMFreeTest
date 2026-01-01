/**
 * LiteLLM client with fallback logic for coder models
 * Supports timeout, retry with exponential backoff, model fallback chain, and tool calling
 */

import * as fs from 'fs/promises';
import * as path from 'path';

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface LiteLLMRequest {
  model: string;
  messages: Array<{ 
    role: 'system' | 'user' | 'assistant' | 'tool'; 
    content: string | null;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  tools?: Array<{
    type: 'function';
    function: {
      name: string;
      description: string;
      parameters: Record<string, any>;
    };
  }>;
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
}

interface LiteLLMResponse {
  choices: Array<{
    message: {
      role: string;
      content: string | null;
      tool_calls?: ToolCall[];
    };
    finish_reason?: string;
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

// CF-X Model Configurations (3 different tiers)
type CFXModelTier = 'normal' | 'premium' | 'cheap';

interface CFXModelConfig {
  planner: string;
  coder: string;
  reviewer: string;
}

const CFX_MODELS: Record<CFXModelTier, CFXModelConfig> = {
  // CF-X-Normal: Balanced performance and cost
  normal: {
    planner: 'openrouter/deepseek/deepseek-v3.2',
    coder: 'openrouter/x-ai/grok-4.1-fast',
    reviewer: 'openrouter/google/gemini-2.5-flash',
  },
  // CF-X-Premium: Best quality, all Claude Sonnet 4.5
  premium: {
    planner: 'openrouter/anthropic/claude-sonnet-4.5',
    coder: 'openrouter/anthropic/claude-sonnet-4.5',
    reviewer: 'openrouter/anthropic/claude-sonnet-4.5',
  },
  // CF-X-Cheap: Fast and cost-effective
  cheap: {
    planner: 'openrouter/openai/gpt-4o-mini',
    coder: 'openrouter/x-ai/grok-4.1-fast', // Still use Grok for tool calling
    reviewer: 'openrouter/openai/gpt-4o-mini',
  },
};

// Legacy constants (kept for backward compatibility, but use CFX_MODELS instead)
// const CF_X_PLANNER = CFX_MODELS.normal.planner;
// const CF_X_CODER = CFX_MODELS.normal.coder;
// const CF_X_REVIEWER = CFX_MODELS.normal.reviewer;

const CODER_MODELS = [
  // Premium models (high-performance)
  'openrouter/deepseek/deepseek-v3.2', // High-performance reasoning model (GPT-5 class)
  'openrouter/minimax/minimax-m2.1', // Lightweight, optimized for coding, 204K context
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

// Tool definitions for file operations (ultra-minimal to reduce token usage)
// Only write_file - most critical tool for file creation
const AVAILABLE_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'write_file',
      description: 'Create file',
      parameters: {
        type: 'object',
        properties: {
          file_path: { type: 'string' },
          content: { type: 'string' },
        },
        required: ['file_path', 'content'],
        additionalProperties: false,
      },
    },
  },
];

// Workspace root directory (can be configured via environment variable)
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || process.cwd();

export class LiteLLMClient {
  private config: ClientConfig;
  private executedFiles: string[] = []; // Track files created/modified during execution

  constructor(config: ClientConfig) {
    this.config = config;
  }

  /**
   * Get list of files created/modified during execution
   */
  getExecutedFiles(): string[] {
    return [...this.executedFiles];
  }

  /**
   * Reset executed files list
   */
  resetExecutedFiles(): void {
    this.executedFiles = [];
  }

  /**
   * Execute a tool call
   */
  private async executeTool(toolName: string, args: any): Promise<string> {
    try {
      switch (toolName) {
        case 'write_file': {
          const filePath = path.join(WORKSPACE_ROOT, args.file_path);
          const dir = path.dirname(filePath);
          
          // Ensure directory exists
          await fs.mkdir(dir, { recursive: true });
          
          // Write file
          await fs.writeFile(filePath, args.content, 'utf-8');
          
          if (!this.executedFiles.includes(args.file_path)) {
            this.executedFiles.push(args.file_path);
          }
          
          return `File "${args.file_path}" written successfully (${args.content.length} bytes)`;
        }

        case 'read_file': {
          const filePath = path.join(WORKSPACE_ROOT, args.file_path);
          const content = await fs.readFile(filePath, 'utf-8');
          return `File "${args.file_path}" content:\n${content}`;
        }

        case 'list_files': {
          const dirPath = path.join(WORKSPACE_ROOT, args.directory_path || '.');
          const entries = await fs.readdir(dirPath, { withFileTypes: true });
          
          const files = entries
            .filter(e => e.isFile())
            .map(e => `📄 ${e.name}`);
          const dirs = entries
            .filter(e => e.isDirectory())
            .map(e => `📁 ${e.name}/`);
          
          return `Files in "${args.directory_path || '.'}":\n${[...dirs, ...files].join('\n')}`;
        }


        default:
          return `Unknown tool: ${toolName}`;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `Error executing ${toolName}: ${errorMessage}`;
    }
  }

  /**
   * Call LiteLLM API with tool calling support
   * Handles tool calls in a loop until model returns final response
   */
  private async callAPIWithTools(
    request: LiteLLMRequest,
    maxToolIterations = 10
  ): Promise<{ content: string; toolCalls: ToolCall[] }> {
    const messages = [...request.messages];
    let iterations = 0;

    while (iterations < maxToolIterations) {
      // Add tools to request (ensure max_tokens is set to prevent context length errors)
      const requestWithTools: LiteLLMRequest = {
        ...request,
        messages,
        tools: AVAILABLE_TOOLS,
        tool_choice: request.tool_choice || 'auto',
        max_tokens: request.max_tokens || 2048, // Ensure max_tokens is set
      };

      const response = await this.callAPI(requestWithTools);
      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No response from API - empty choices array');
      }

      const message = choice.message;
      if (!message) {
        throw new Error('No message in API response');
      }
      
      // Log finish reason for debugging
      if (choice.finish_reason) {
        console.log(`📊 Finish reason: ${choice.finish_reason}`);
      }

      // Add assistant message to conversation
      messages.push({
        role: 'assistant',
        content: message.content,
        tool_calls: message.tool_calls,
      });

      // If no tool calls, return final response
      if (!message.tool_calls || message.tool_calls.length === 0) {
        // Ensure we have content, even if empty
        const finalContent = message.content || 'Task completed successfully.';
        return {
          content: finalContent,
          toolCalls: [],
        };
      }
      
      // If model made tool calls but also provided content, that's also acceptable
      // (some models provide both tool calls and explanatory text)
      if (message.content && message.content.trim().length > 0) {
        // Model provided content along with tool calls - this is fine
        // Continue to execute tools, but note the content
        console.log(`📝 Model provided content along with tool calls: ${message.content.substring(0, 100)}...`);
      }

      // Execute tool calls
      console.log(`🔧 Executing ${message.tool_calls.length} tool call(s)...`);
      let allToolsSucceeded = true;
      for (const toolCall of message.tool_calls) {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          const result = await this.executeTool(toolCall.function.name, args);
          
          console.log(`✅ Tool ${toolCall.function.name} executed: ${result.substring(0, 100)}...`);

          // Add tool response to conversation
          messages.push({
            role: 'tool',
            content: result,
            tool_call_id: toolCall.id,
          });
        } catch (error) {
          allToolsSucceeded = false;
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`❌ Tool ${toolCall.function.name} failed:`, errorMessage);
          
          messages.push({
            role: 'tool',
            content: `Error: ${errorMessage}`,
            tool_call_id: toolCall.id,
          });
        }
      }

      // After tool execution, add a user message to guide model to provide final response
      // Only if model didn't provide content along with tool calls
      // This ensures model provides a summary/confirmation instead of just tool calls
      if (!message.content || message.content.trim().length === 0) {
        messages.push({
          role: 'user',
          content: allToolsSucceeded 
            ? 'Tool execution completed successfully. Please provide a brief summary confirming what was accomplished. Do NOT call any more tools.'
            : 'Tool execution completed with some errors. Please provide a brief summary of what was accomplished and any issues encountered. Do NOT call any more tools.',
        });
      }

      iterations++;
    }

    // If we've exhausted iterations, try to find the last assistant message with content
    // Look backwards through messages to find the last assistant message with content
    let lastContent = 'Maximum tool iterations reached. Task may be incomplete.';
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg && msg.role === 'assistant' && msg.content && msg.content.trim().length > 0) {
        lastContent = msg.content;
        break;
      }
    }
    
    // If we have executed files, include that in the response
    const executedFiles = this.getExecutedFiles();
    if (executedFiles.length > 0) {
      lastContent += `\n\nFiles created/modified: ${executedFiles.join(', ')}`;
    }
    
    return {
      content: lastContent,
      toolCalls: [],
    };
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
            'You are a planning assistant. Break down the given task into a clear, step-by-step plan. Output ONLY the plan text. Do NOT use any tools, functions, or API calls. Output plain text only, no markdown, no explanations.',
        },
        {
          role: 'user',
          content: `Task: ${task}\n\nCreate a detailed step-by-step plan. Output only the plan text:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    };

    const response = await this.callAPI(request);
    return response.choices[0]?.message?.content ?? '';
  }

  /**
   * Call coder model with fallback chain and tool calling support
   */
  async code(task: string, plan: string, useTools = false): Promise<string> {
    const systemPrompt = `You are a coding assistant. Generate code based on the task and plan. ${
      useTools 
        ? 'Use write_file tool to create files. Always use write_file to create files.'
        : 'Output the code directly as text. Do not use tools.'
    }`;

    const userPrompt = `Task: ${task}\n\nPlan:\n${plan}\n\n${
      useTools
        ? 'Generate and implement the code using tools. Create or modify files as needed.'
        : 'Generate the code. Output the code directly:'
    }`;

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
          // Only include tools if useTools is true
          ...(useTools ? { 
            tools: AVAILABLE_TOOLS,
            tool_choice: 'auto' 
          } : { 
            tool_choice: 'none' 
          }),
        };

        if (useTools) {
          const result = await this.callAPIWithTools(request);
          return result.content || 'Code generation completed (check executed files)';
        } else {
          const response = await this.callAPI(request);
          return response.choices[0]?.message?.content ?? '';
        }
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
            'You are a code reviewer. Review the code against the task and plan. Identify issues, suggest improvements, and verify completeness. Output ONLY your review text. Do NOT use any tools, functions, or API calls. Output plain text review only.',
        },
        {
          role: 'user',
          content: `Task: ${task}\n\nPlan:\n${plan}\n\nCode:\n${code}\n\nReview the code. Output only your review text:`,
        },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    };

    const response = await this.callAPI(request);
    return response.choices[0]?.message?.content ?? '';
  }

  /**
   * CF-X Model: 3-layer workflow with smart tool usage
   * Plan → Code → Review using specific models
   * Plan stage analyzes if tools are needed
   * Code stage uses tools only if required
   */
  async cfX(task: string, tier: CFXModelTier = 'normal'): Promise<{ plan: string; code: string; review: string; executedFiles: string[]; needsTools: boolean }> {
    const models = CFX_MODELS[tier];
    const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
    
    // Step 1: Plan - Analyze task and determine if tools are needed
    console.log(`📋 CF-X-${tierName}: Planning with ${models.planner}...`);
    this.resetExecutedFiles(); // Reset for this execution
    
    const planRequest: LiteLLMRequest = {
      model: models.planner,
      messages: [
        {
          role: 'system',
          content:
            'You are a planning assistant. Analyze the task and create a step-by-step plan. IMPORTANT: At the end of your plan, add a line: "TOOLS_NEEDED: YES" or "TOOLS_NEEDED: NO" based on whether the task requires file operations (create, read, modify files). Simple tasks like greetings, questions, or explanations do NOT need tools.',
        },
        {
          role: 'user',
          content: `Task: ${task}\n\nAnalyze this task and create a detailed step-by-step plan. At the end, specify if tools are needed:\n- TOOLS_NEEDED: YES (if task requires creating/reading/modifying files)\n- TOOLS_NEEDED: NO (if task is simple greeting, question, or explanation)\n\nOutput only the plan text with TOOLS_NEEDED at the end:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    };
    const planResponse = await this.callAPI(planRequest);
    const plan = planResponse.choices[0]?.message?.content ?? '';
    
    // Extract TOOLS_NEEDED from plan
    const toolsNeededMatch = plan.match(/TOOLS_NEEDED:\s*(YES|NO)/i);
    const needsTools = toolsNeededMatch?.[1]?.toUpperCase() === 'YES' || false;
    
    console.log(`🔍 Plan analysis: Tools ${needsTools ? 'REQUIRED' : 'NOT REQUIRED'}`);

    // Step 2: Code - Use tools only if needed
    console.log(`💻 CF-X-${tierName}: Coding with ${models.coder} (tools: ${needsTools ? 'enabled' : 'disabled'})...`);
    
    const codeRequest: LiteLLMRequest = {
      model: models.coder,
      messages: [
        {
          role: 'system',
          content: needsTools
            ? 'You are a coding assistant. You MUST use write_file tool to create files. NEVER output code as text. When task asks to create a file, call write_file with file_path and content.'
            : 'You are a coding assistant. Provide helpful responses, explanations, or code examples. Do NOT use any tools. Output your response as plain text.',
        },
        {
          role: 'user',
          content: needsTools
            ? `Task: ${task}\n\nPlan:\n${plan}\n\nCRITICAL INSTRUCTIONS:
1. You MUST use the write_file tool to create files. Do NOT output code as plain text.
2. If the task asks to create a file (e.g., "create denem.php"), you MUST call write_file tool.
3. Example: For "create denem.php with a function", call write_file with:
   - file_path: "denem.php"
   - content: The complete PHP code with the function
4. After calling write_file tool and receiving confirmation, you MUST provide a brief summary message confirming what was done.
5. Always use tools - never output code as text only.

Now implement the task using tools. After tool execution, provide a brief summary.`
            : `Task: ${task}\n\nPlan:\n${plan}\n\nProvide a helpful response or explanation. Do NOT use any tools. Output your response as plain text:`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
      tool_choice: needsTools ? 'auto' : 'none',
    };
    
    const codeResult = needsTools 
      ? await this.callAPIWithTools(codeRequest)
      : { content: (await this.callAPI(codeRequest)).choices[0]?.message?.content ?? '', toolCalls: [] };
    
    const code = codeResult.content || (needsTools ? `Code implemented using tools. Files created/modified: ${this.getExecutedFiles().join(', ')}` : '');
    const executedFiles = this.getExecutedFiles();
    
    if (executedFiles.length > 0) {
      console.log(`📁 Files created/modified: ${executedFiles.join(', ')}`);
    }

    // Step 3: Review
    console.log(`🔍 CF-X-${tierName}: Reviewing with ${models.reviewer}...`);
    const reviewRequest: LiteLLMRequest = {
      model: models.reviewer,
      messages: [
        {
          role: 'system',
          content:
            'You are a code reviewer. Review the code/response against the task and plan. Identify issues, suggest improvements, and verify completeness. Check for bugs, security issues, and best practices. Output ONLY your review text. Do NOT use any tools, functions, or API calls. Output plain text review only.',
        },
        {
          role: 'user',
          content: `Task: ${task}\n\nPlan:\n${plan}\n\nCode/Response:\n${code}\n\nReview the code/response. Output only your review text:`,
        },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    };
    const reviewResponse = await this.callAPI(reviewRequest);
    const review = reviewResponse.choices[0]?.message?.content ?? '';

    return { 
      plan, 
      code, 
      review,
      executedFiles: this.getExecutedFiles(),
      needsTools,
    };
  }
}

