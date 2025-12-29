# Multi-stage build for Roo Code Orchestrator
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Set working directory
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY tsconfig.base.json ./

# Copy orchestrator app
COPY apps/orchestrator ./apps/orchestrator

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build orchestrator
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy only production files
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./
COPY --from=base /app/apps/orchestrator/dist ./apps/orchestrator/dist
COPY --from=base /app/apps/orchestrator/package.json ./apps/orchestrator/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Make orchestrator executable
RUN chmod +x ./apps/orchestrator/dist/index.js

# Set entrypoint
ENTRYPOINT ["node", "./apps/orchestrator/dist/index.js"]

# Default command (can be overridden)
CMD ["--help"]

