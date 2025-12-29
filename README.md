# Roo Code Test Harness
Easypanel'de kullanım
Aynı docker-compose.yml içinde:
Landing: Port 3000
Dashboard: Port 3001
LiteLLM: Port 4000
Easypanel'de domain yönlendirmesi:
Ana domain → Landing page
/dashboard → Dashboard panel
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
  # Planner/Reviewer (OpenRouter GPT-4o-mini)
  - model_name: gpt-4o-mini-2024-07-18
    litellm_params:
      model: openrouter/openai/gpt-4o-mini
      api_key: os.environ/OPENROUTER_API_KEY
      api_base: https://openrouter.ai/api/v1

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
# Sadece OpenRouter API Key gerekli (tüm modeller için)
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

The project includes both a standalone Dockerfile and a full-stack `docker-compose.yml` for complete deployment.

### Option 1: Docker Compose (Full Stack - Recommended)

Full stack setup with PostgreSQL, Redis, LiteLLM proxy, and Orchestrator:

```bash
# 1. Copy environment file
cp env.example .env

# 2. Edit .env and add your API keys:
#    - OPENAI_API_KEY (for Planner/Reviewer)
#    - OPENROUTER_API_KEY (for Coder models)

# 3. Start all services
docker-compose up -d

# 4. Run orchestrator command
docker-compose run --rm orchestrator run "Your task here"

# 5. Check logs
docker-compose logs -f orchestrator
docker-compose logs -f litellm

# 6. Stop all services
docker-compose down
```

**Services included:**
- ✅ PostgreSQL (port 5432) - LiteLLM logging/analytics
- ✅ Redis (port 6379) - LiteLLM caching/rate limiting
- ✅ LiteLLM Proxy (port 4000) - Model gateway
- ✅ Orchestrator - CLI tool

### Option 2: Standalone Dockerfile

For deploying only the orchestrator (LiteLLM proxy must be external):

```bash
# Build
docker build -t roo-code-orchestrator .

# Run (LiteLLM proxy must be accessible)
docker run --env-file .env roo-code-orchestrator run "Your task here"
```

### Easypanel Configuration

#### For Docker Compose (Full Stack):

1. Create a new app in Easypanel
2. Select "Docker Compose" as the source
3. Point to this repository
4. Set environment variables from `.env.example`:
   - `OPENAI_API_KEY`
   - `OPENROUTER_API_KEY`
   - `LITELLM_MASTER_KEY` (optional)
5. Deploy - all services will start automatically

#### For Standalone Dockerfile:

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
├── .env.example                # Environment variables template
├── Dockerfile                  # Standalone orchestrator build
├── docker-compose.yml          # Full stack (PostgreSQL + Redis + LiteLLM + Orchestrator)
├── litellm_config.yaml         # LiteLLM proxy configuration
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

---

**Developed by ahmet.aslan** | Roo Code Test Harness - Phase 0

