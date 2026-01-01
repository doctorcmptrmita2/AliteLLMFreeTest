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

# Copy Prisma files for migrations
COPY --from=base /app/apps/dashboard/prisma ./apps/dashboard/prisma
COPY --from=base /app/apps/dashboard/node_modules/.prisma ./apps/dashboard/node_modules/.prisma
COPY --from=base /app/apps/dashboard/node_modules/@prisma ./apps/dashboard/node_modules/@prisma

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Create entrypoint script to run migrations before starting
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo 'cd /app/apps/dashboard' >> /entrypoint.sh && \
    echo 'echo "Running Prisma migrations..."' >> /entrypoint.sh && \
    echo 'npx prisma migrate deploy || echo "Migration failed or already applied - continuing..."' >> /entrypoint.sh && \
    echo 'echo "Starting dashboard server..."' >> /entrypoint.sh && \
    echo 'exec node /app/apps/dashboard/server.js' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
