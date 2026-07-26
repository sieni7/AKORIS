FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts ./packages/contracts
COPY packages/core ./packages/core
COPY apps/api ./apps/api
RUN pnpm install --frozen-lockfile && pnpm build

FROM node:20-alpine
WORKDIR /app
RUN addgroup -S akoris && adduser -S akoris -G akoris
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
RUN mkdir -p /app/registry /app/.akoris && chown -R akoris:akoris /app
USER akoris
EXPOSE 3000
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',r=>{process.exit(r.statusCode===200?0:1)})"
CMD ["node", "dist/server.js"]
