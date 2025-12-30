FROM node:20-alpine AS base

# Install pnpm and OpenSSL (required for Prisma)
RUN apk add --no-cache openssl openssl-dev && \
    corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy dashboard app
COPY apps/dashboard ./apps/dashboard

# Copy lockfile if exists
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Generate Prisma Client
WORKDIR /app/apps/dashboard
RUN pnpm db:generate

# Build dashboard
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl openssl-dev && \
    corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy built app
COPY --from=base /app/apps/dashboard/.next/standalone ./
COPY --from=base /app/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=base /app/apps/dashboard/public ./apps/dashboard/public

# Copy Prisma client and engines (required for runtime)
# Prisma is marked as external in next.config.js, so we need to copy it manually
# In pnpm workspace, Prisma files are in root node_modules
# Standalone build already includes node_modules, but Prisma needs special handling
RUN mkdir -p ./node_modules/.prisma ./node_modules/@prisma

# Copy Prisma files from base image
# pnpm stores packages in .pnpm, but generates symlinks in node_modules
# We need to copy the actual Prisma client and engines
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/dashboard/server.js"]
