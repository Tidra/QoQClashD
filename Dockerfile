# QoQClashD 单入口镜像：同一个 Node 进程既发前端静态资源，又挂 /api/control（agent）
# 与 /api/mihomo（内核 API 同源代理）。内核二进制由面板在运行时自行下载进 /app/kernel，
# 不需要额外的 core 容器。
#
# 镜像里只装 root `dependencies` 那 7 个包（dist-server/server.js 的 4 个 esbuild
# external + h3 + 两个 workspace 链接）。前端库全在 devDependencies 里，由 Vite 打进
# dist/，不参与运行时的 node_modules——所以往 dependencies 里加包等于直接加大镜像。

FROM node:22-alpine AS builder

WORKDIR /app
RUN corepack enable
# 依赖装进容器时不该触发 git hooks 准备。
ENV HUSKY=0

# 先只复制清单做依赖层，源码改动就不会让 pnpm install 层失效。
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
    CORE_STORAGE_DIR=/app/kernel \
    HUSKY=0
WORKDIR /app

# 生产依赖直接装在最终阶段：跨 stage COPY pnpm 的 node_modules 会把软链摊平成两份
# 实体文件，装完再删掉 store 反而更小、也更接近裸机跑的布局。
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/agent/package.json packages/agent/package.json
COPY packages/config-editor/package.json packages/config-editor/package.json
RUN pnpm install --frozen-lockfile --prod --ignore-scripts \
    && pnpm store prune \
    && rm -rf /root/.cache/pnpm /root/.local/share/pnpm

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server

EXPOSE 80
VOLUME ["/app/data", "/app/kernel"]
# 静态资源永远由同一个进程发，200/401 都算活着；只有连不上或 5xx 才判失败。
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PANEL_PORT||80)+'/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist-server/server.js"]
