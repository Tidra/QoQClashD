# QoQClashD 单入口镜像：同一个 Node 进程既发前端静态资源，又挂 /api/control（agent）
# 与 /api/mihomo（内核 API 同源代理）。内核二进制由面板在运行时自行下载进 /app/kernel，
# 不需要额外的 core 容器。
FROM node:22-alpine AS builder

WORKDIR /app
RUN corepack enable
# 依赖装进容器时不该触发 git hooks 准备。
ENV HUSKY=0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY postcss.config.js tailwind.config.ts env.d.ts ./
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY packages/agent/package.json packages/agent/package.json
COPY packages/config-editor/package.json packages/config-editor/package.json
RUN pnpm install --frozen-lockfile

COPY src ./src
COPY public ./public
COPY server ./server
COPY packages/agent packages/agent
COPY packages/config-editor packages/config-editor
RUN pnpm build && pnpm build:server

FROM node:22-alpine
ENV NODE_ENV=production \
    PANEL_HOST=0.0.0.0 \
    PANEL_PORT=80 \
    DATA_DIR=/app/data \
    CORE_STORAGE_DIR=/app/kernel
WORKDIR /app
# dist-server/server.js 把 agent 打进去了，只把 yaml/sql.js/tree-kill/ws 留给运行时解析，
# 所以 node_modules 必须整棵树带上（pnpm 的相对软链会随目录一起复制，保持有效）。
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 80
VOLUME ["/app/data", "/app/kernel"]
CMD ["node", "dist-server/server.js"]
