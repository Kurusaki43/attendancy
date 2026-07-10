# syntax=docker/dockerfile:1

ARG NODE_VERSION=24-alpine

# ---------------------------------------------------------------------------
# base — shared setup for every stage below
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base
# openssl/libc6-compat: required by Prisma's engines on Alpine.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
RUN corepack enable
# Skip husky's git-hook install — there's no .git directory in the build context.
ENV HUSKY=0

# ---------------------------------------------------------------------------
# deps — install dependencies in their own cached layer
# ---------------------------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# dev — hot-reloading dev server; source is bind-mounted by docker-compose
# ---------------------------------------------------------------------------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate
EXPOSE 3000
CMD ["pnpm", "dev"]

# ---------------------------------------------------------------------------
# builder — production build (Prisma client + Next standalone output)
# ---------------------------------------------------------------------------
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate

# `next build`'s page-data-collection phase imports src/lib/env/env.ts, which eagerly validates
# process.env via Zod — these are throwaway values that only need to satisfy that schema's shape
# (url/non-empty-string) during the build. Real secrets are injected into the *running* container
# via docker-compose's env_file/environment, never baked into this image.
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db" \
    JWT_ACCESS_SECRET="build-time-placeholder" \
    JWT_REFRESH_SECRET="build-time-placeholder" \
    JWT_ACCESS_EXPIRES_IN="15m" \
    JWT_REFRESH_EXPIRES_IN="30d" \
    OTP_EXPIRED_IN="15m" \
    GOOGLE_CLIENT_ID="build-time-placeholder" \
    GOOGLE_CLIENT_SECRET="build-time-placeholder" \
    GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback" \
    TURNSTILE_SITE_KEY="build-time-placeholder"

RUN pnpm build

# ---------------------------------------------------------------------------
# runner — minimal production image, runs as a non-root user
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
