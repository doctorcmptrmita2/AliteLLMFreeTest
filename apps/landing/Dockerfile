FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy landing app
COPY apps/landing ./apps/landing

# Copy lockfile if exists
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Build landing page
WORKDIR /app/apps/landing
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy built app
COPY --from=base /app/apps/landing/.next/standalone ./
COPY --from=base /app/apps/landing/.next/static ./apps/landing/.next/static
COPY --from=base /app/apps/landing/public ./apps/landing/public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/landing/server.js"]


