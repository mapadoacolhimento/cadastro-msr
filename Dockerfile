FROM node:20-alpine AS base

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# dependências
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# instala todas as deps
RUN pnpm install --frozen-lockfile

# ─── Build ──────────────────────────────────────────────────
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# gera os clients do Prisma (Postgres + MongoDB)
RUN pnpm generate

# Build do Next.js
RUN pnpm build

# Produção
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# copia apenas o necessário para rodar
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# copia também os engines gerados pelo PrismaPlugin
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/newrelic.cjs ./newrelic.cjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# script de start com New Relic (igual ao package.json)
CMD ["node", "-r", "dotenv/config", "--loader", "newrelic/esm-loader.mjs", "-r", "newrelic", "server.js"]