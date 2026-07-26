FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts ./packages/contracts
COPY packages/core ./packages/core
COPY packages/sdk ./packages/sdk
COPY apps/dashboard ./apps/dashboard
RUN pnpm install --frozen-lockfile && pnpm build

FROM nginx:alpine
RUN apk add --no-cache wget
COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html
COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --spider http://localhost:80
CMD ["nginx", "-g", "daemon off;"]
