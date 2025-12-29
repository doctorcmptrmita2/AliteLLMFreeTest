# Roo Code Test Harness

Planner → Coder → Reviewer workflow test harness using LiteLLM + OpenRouter.

## 🎯 Overview

This monorepo implements a controlled baseline for testing the Planner → Coder → Reviewer workflow inside Roo Code, using LiteLLM as a proxy to OpenRouter's free coder models.

## 📋 Architecture

- **apps/orchestrator**: TypeScript CLI that orchestrates the workflow
  - `plan`: Generate a plan for a task
  - `code`: Generate code with plan context
  - `review`: Review code with plan + code context
  - `run`: Execute full pipeline (plan → code → review)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- LiteLLM proxy running (see LiteLLM Setup below)

### Installation

```bash
# Install dependencies
pnpm install

# Build orchestrator
pnpm build
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your LiteLLM configuration:
```env
LITELLM_BASE_URL=http://localhost:4000/v1
LITELLM_API_KEY=optional-key
REQUEST_TIMEOUT_MS=120000
```

### Usage

```bash
# Run full pipeline
pnpm --filter @roo-code/orchestrator run build
node apps/orchestrator/dist/index.js run "Create a simple REST API endpoint"

# Or use individual commands
node apps/orchestrator/dist/index.js plan "Create a simple REST API endpoint"
node apps/orchestrator/dist/index.js code "Create a simple REST API endpoint" --context "<plan>"
node apps/orchestrator/dist/index.js review "Create a simple REST API endpoint" --context "PLAN:\n<plan>\n\nCODE:\n<code>"
```

## 🔧 LiteLLM Setup

### Local Development

1. Install LiteLLM:
```bash
pip install litellm
```

2. Create `litellm_config.yaml`:
```yaml
model_list:
  # Planner/Reviewer (OpenAI)
  - model_name: gpt-4o-mini-2024-07-18
    litellm_params:
      model: gpt-4o-mini-2024-07-18
      api_key: os.environ/OPENAI_API_KEY

  # Coder models (OpenRouter free tier)
  - model_name: openrouter/xiaomi/mimo-v2-flash:free
    litellm_params:
      model: openrouter/xiaomi/mimo-v2-flash:free
      api_key: os.environ/OPENROUTER_API_KEY
      api_base: https://openrouter.ai/api/v1

  - model_name: openrouter/kwaipilot/kat-coder-pro:free
    litellm_params:
      model: openrouter/kwaipilot/kat-coder-pro:free
      api_key: os.environ/OPENROUTER_API_KEY
      api_base: https://openrouter.ai/api/v1

  - model_name: openrouter/mistralai/devstral-2512:free
    litellm_params:
      model: openrouter/mistralai/devstral-2512:free
      api_key: os.environ/OPENROUTER_API_KEY
      api_base: https://openrouter.ai/api/v1

  - model_name: openrouter/qwen/qwen3-coder:free
    litellm_params:
      model: openrouter/qwen/qwen3-coder:free
      api_key: os.environ/OPENROUTER_API_KEY
      api_base: https://openrouter.ai/api/v1

general_settings:
  master_key: optional-master-key
  database_url: optional-sqlite:///litellm.db
```

3. Set environment variables:
```bash
export OPENAI_API_KEY=sk-xxx
export OPENROUTER_API_KEY=sk-or-v1-xxx
```

4. Start LiteLLM proxy:
```bash
litellm --config litellm_config.yaml --port 4000
```

### Model Fallback Chain

The orchestrator uses the following fallback order for coder models:
1. `openrouter/xiaomi/mimo-v2-flash:free` (default)
2. `openrouter/kwaipilot/kat-coder-pro:free` (fallback 1)
3. `openrouter/mistralai/devstral-2512:free` (fallback 2)
4. `openrouter/qwen/qwen3-coder:free` (fallback 3)

If a model returns 429 (rate limit) or 5xx error, the orchestrator automatically tries the next model. Each request has 1 retry with exponential backoff.

## 🐳 Docker Deployment (Easypanel)

The project includes a Dockerfile for easy deployment on Easypanel or any Docker-compatible platform.

### Build

```bash
docker build -t roo-code-orchestrator .
```

### Run

```bash
docker run --env-file .env roo-code-orchestrator run "Your task here"
```

### Easypanel Configuration

1. Create a new app in Easypanel
2. Select "Docker" as the source
3. Point to this repository
4. Set environment variables from `.env.example`
5. Ensure LiteLLM proxy is accessible (either as a separate service or external URL)

## 📁 Project Structure

```
.
├── apps/
│   └── orchestrator/          # CLI orchestrator
│       ├── src/
│       │   ├── index.ts        # CLI entry point
│       │   └── client.ts       # LiteLLM client with fallback
│       ├── package.json
│       └── tsconfig.json
├── package.json                # Workspace root
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .env.example
├── Dockerfile
└── README.md
```

## 🔒 Security Notes

- Never commit `.env` files
- API keys should be stored securely (environment variables, secrets manager)
- LiteLLM proxy should be behind authentication in production

## 🧪 Testing Workflow

1. Start LiteLLM proxy locally
2. Run `orchestrator run "<task>"` with a simple task
3. Verify:
   - Plan is generated
   - Code is generated (check fallback if needed)
   - Review is generated
4. Test individual commands (`plan`, `code`, `review`)

## 📝 Phase 1 (Future): VS Code Extension

The orchestrator is designed to be modular. Future VS Code extension will:
- Stream model output in real-time
- Apply "File/Action/Anchor/Replace With" changes
- Display Proof tables and validations
- Use orchestrator as a reusable package

## 📄 License

MIT

