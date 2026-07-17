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
# Store dir outside /app so it survives the dev bind-mount replacing /app at runtime.
ENV PNPM_CONFIG_STORE_DIR=/pnpm-store

# ---------------------------------------------------------------------------
# deps — install dependencies in their own layer
# ---------------------------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --ignore-scripts: postinstall needs prisma/schema.prisma, not copied into this layer.
RUN pnpm install --frozen-lockfile --ignore-scripts

# ---------------------------------------------------------------------------
# dev — hot-reloading dev server; source is bind-mounted by docker-compose
# ---------------------------------------------------------------------------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
# Carry the store forward too, for the same reason as above.
COPY --from=deps /pnpm-store /pnpm-store
COPY . .
RUN pnpm exec prisma generate
EXPOSE 3000
CMD ["pnpm", "dev"]
