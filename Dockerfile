# QoQClashD 单入口镜像：同一个 Node 进程既发前端静态资源，又挂 /api/control（agent）
# 与 /api/mihomo（内核 API 同源代理）。内核二进制由面板在运行时自行下载进 /app/kernel，
# 不需要额外的 core 容器。
#
# 镜像里只装 root `dependencies` 那 4 个包，也就是 dist-server/server.js 剩下的 esbuild
# external：sql.js / tree-kill / ws / yaml。h3、两个 workspace 包和所有前端库都放在
# devDependencies 里，由 esbuild 与 Vite 分别打进 dist-server/ 和 dist/，不参与运行时的
# node_modules——所以往 dependencies 里加包等于直接加大镜像。
#
# 两个 build stage 都钉在 $BUILDPLATFORM：多架构构建时 arm64 那一趟原本要在 QEMU 用户态里
# 跑 pnpm 与 vite/esbuild，Node 在模拟下会 SIGILL（exit 132，日志里是 `qemu: uncaught target
# signal 4`）。而这四颗依赖与所有构建产物都是跨架构的纯 JS/WASM，在原生 amd64 上装一次、
# 编一次就够了，真正跟架构走的东西一个都不在这几层里。只有最终阶段按目标架构拉，且里面
# 一次 Node 都不执行（HEALTHCHECK 是运行时跑的，届时已在原生 arm64 上）。
FROM --platform=$BUILDPLATFORM node:22-alpine AS base
# corepack 装的 pnpm 软链落在镜像文件系统里，只有派生自本阶段的构建阶段用得到；
# 最终阶段不从这里派生，所以镜像里不含 pnpm 与 corepack 的任何文件。
RUN corepack enable
# 依赖装进容器时不该触发 git hooks 准备。
ENV HUSKY=0

FROM base AS builder

WORKDIR /app

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

# 生产依赖单独一趟，装在 $BUILDPLATFORM 上（继承自 base）。
# --config.node-linker=hoisted 只作用于这一条 install：isolated 布局的顶层四条是指向
# node_modules/.pnpm 的绝对路径软链、文件又与全局 store 共享 inode，整棵 node_modules 跨
# stage COPY 出去之后是死链还是双份实体，取决于 BuildKit 怎么处理链接与硬链——而这一趟的
# 产物是要被 COPY 的，所以让它以纯真实目录的形式落地，不赌那个行为。
# pnpm 10+ 已不读 .npmrc 里的这项设置（实测写了不生效），nodeLinker 写进 pnpm-workspace.yaml
# 又会连带改掉开发者本机 `pnpm install` 的布局，因此只能用命令行作用域传进来。
FROM base AS prod-deps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/agent/package.json packages/agent/package.json
COPY packages/config-editor/package.json packages/config-editor/package.json
RUN pnpm install --frozen-lockfile --prod --ignore-scripts --config.node-linker=hoisted \
    && rm -rf /root/.cache /root/.local/share/pnpm /root/.pnpm-store

# 目标架构阶段：只往下 COPY，不跑任何构建期代码，所以 QEMU 全程碰不到 Node。
# 也不从 base 派生——corepack/pnpm 那层不进镜像。
FROM node:22-alpine
ENV NODE_ENV=production \
    PANEL_HOST=0.0.0.0 \
    PANEL_PORT=80 \
    DATA_DIR=/app/data \
    CORE_STORAGE_DIR=/app/kernel
WORKDIR /app

# dist-server/server.js 是 esbuild 的 ESM 产物（顶层 import）。/app/package.json 的
# "type": "module" 就是 Node 判模块类型的依据；22 的语法自动探测也能兜住，但不必去赌它。
# 除此之外运行时不读任何清单：版本号是打进 bundle 的常量，依赖全在 node_modules 里。
COPY package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server

EXPOSE 80
VOLUME ["/app/data", "/app/kernel"]
# 静态资源永远由同一个进程发，200/401 都算活着；只有连不上或 5xx 才判失败。
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PANEL_PORT||80)+'/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist-server/server.js"]
