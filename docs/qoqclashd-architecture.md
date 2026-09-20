# QoQClashD 架构与运行说明

> 本文以当前仓库实现为准，说明 QoQClashD 的目录结构、组件职责、数据流、接口交互、运行方式和部署边界。

## 1. 项目定位

QoQClashD 是一个面向 Mihomo 的 Web 控制面板。它的界面继承自 zashboard 的 Vue 3 卡片式布局、图表和响应式交互，并在此基础上补齐：

- 订阅源、节点池、节点组和延迟测试；
- 分流中心、入站和 TUN 配置；
- 表单配置与 YAML 配置双向编辑；
- agent 控制服务；
- SQLite 持久化；
- Mihomo 核心下载、启动、停止、升级和运行时目录管理。

当前实现不是“只连接一个外部 Mihomo API 的静态页面”。完整功能由以下四部分共同组成：

```text
浏览器
  │ Vue Router / stores / assembly / API client
  ▼
QoQClashD 前端（Vite 构建的静态资源）
  │ 同源 /api/control/*（业务持久化和核心生命周期）
  │ 同源 /api/mihomo/*（服务端转发 Mihomo REST API）
  │ Mihomo REST/WebSocket API（代理、连接、日志、流量）
  ▼
agent 控制服务 ───────► Mihomo Core
  │                       │
  └── data/
      ├── qoqclashd.sqlite
      ├── config/active.yaml
      └── profiles/（订阅和 profile 输入）
```

## 2. 组件和职责

### 2.1 浏览器前端

根目录 `src/` 是主要的 Vue 3 应用：

- 页面负责组合视图和用户操作；
- `store` 保存跨页面状态；
- `api` 封装 Mihomo 请求；
- `assembly` 将多个 API 和状态组合成页面所需的数据；
- `composables/useControlApi.ts` 是控制接口的客户端；
- Vite 构建时只注入 `__FONT__`（字体方案）；其余配置一律留在服务端，前端不接触密钥。

前端使用 hash 路由，因此静态服务器只需要回退到 `index.html`，不会依赖服务端路由改写。

### 2.2 agent 控制服务

`packages/agent` 是控制后端库，不是一个单独执行 `listen()` 的命令行服务。宿主程序需要创建 agent 并把 h3 路由挂载到 HTTP 服务上。该服务负责：

- `/api/control/*` 控制接口；
- SQLite KV 持久化；
- 运行时根目录和配置目录解析；
- Mihomo 核心下载、校验、启动、停止、重启、回滚和恢复；
- profiles、active config 和配置 patch；
- 面板登录会话（签名 cookie）、系统代理、TUN、Geo 资源；
- SSE 日志和核心状态事件。

开发环境的 `pnpm dev` 会同时启动 Vite（5173）和统一 Node server（5174），Vite 会将 `/api/control/*`、`/api/mihomo/*` 代理到 Node server，因此 SQLite、核心下载和运行时配置在开发页面中也可用。

### 2.3 Mihomo Core

Mihomo 负责真正的代理运行时：

- REST API：版本、配置、代理组、规则、连接、日志、流量、延迟和 Geo；
- WebSocket/SSE：实时流量、日志和状态；
- 代理端口、DNS、规则、TUN 和入站；
- `active.yaml` 对应的运行配置。

前端只访问同源的 `/api/mihomo/*`，Mihomo 的地址与 secret 由统一 server 在转发时注入，浏览器既不持有也不传输它们。核心可以由外部进程提供，也可以由 agent 下载并管理。

### 2.4 SQLite 存储

agent 使用 `sql.js` 创建或打开 `<dataDir>/qoqclashd.sqlite`。当前存储模型是：

```sql
CREATE TABLE kv (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

业务对象以 JSON 字符串存储，写入后同步落盘。默认种子包括 `nodePools`、`defaultGroups`、`config/rules` 以及宿主注入的默认值。节点、规则、订阅和面板配置等结构化数据以 SQLite 为权威来源；`data/config/active.yaml` 是根据这些数据按需合成、供 Mihomo 读取的运行产物，不是编辑权威。浏览器 sessionStorage 仍只用于临时会话类数据；业务配置不再以浏览器 localStorage 为最终来源。

## 3. 目录和文件清单

以下按目录列出当前工程的文件职责。`node_modules`、构建产物、缓存和 `.git` 不属于源码清单。

### 3.1 根目录工程文件

| 路径                                                                                       | 作用                                                                              |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| [`package.json`](../package.json)                                                          | 根项目脚本、依赖和 pnpm 版本；包含 `dev`、`build`、`type-check`、测试和格式化命令 |
| [`pnpm-workspace.yaml`](../pnpm-workspace.yaml)                                            | pnpm workspace 与依赖安装策略                                                     |
| [`pnpm-lock.yaml`](../pnpm-lock.yaml)                                                      | 锁定依赖版本                                                                      |
| [`vite.config.ts`](../vite.config.ts)                                                      | Vue/Vite/PWA 配置、`@` 别名、`__FONT__` 注入、开发代理和相对 base                 |
| [`tsconfig.json`](../tsconfig.json)、[`tsconfig.app.json`](../tsconfig.app.json)           | TypeScript 编译边界                                                               |
| [`eslint.config.js`](../eslint.config.js)、[`.prettierrc`](../.prettierrc)                 | lint 和格式化规则                                                                 |
| [`postcss.config.js`](../postcss.config.js)、[`tailwind.config.js`](../tailwind.config.js) | CSS、Tailwind 和 daisyUI 配置                                                     |
| [`index.html`](../index.html)                                                              | 浏览器入口和 `#app` 挂载点                                                        |
| [`public/`](../public/)                                                                    | 不经 Vite 处理的图标、字体和静态资源                                              |
| [`test/`](../test/)                                                                        | mock server、基准和验证脚本                                                       |
| [`.github/workflows/`](../.github/workflows/)                                              | CI、Docker 构建和镜像发布                                                         |

### 3.2 前端启动和路由

| 路径                                            | 作用                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| [`src/main.ts`](../src/main.ts)                 | 加载 API、dayjs、主题和字体，创建 Vue 应用并挂载 router/i18n |
| [`src/App.vue`](../src/App.vue)                 | 全局布局、主题、触摸行为、后端切换、自动同步和全局弹窗       |
| [`src/router/index.ts`](../src/router/index.ts) | hash 路由、页面标题和登录守卫                                |
| [`src/constant/`](../src/constant/)             | 路由名、枚举、图标和应用常量                                 |
| [`src/i18n/`](../src/i18n/)                     | zh、en、zh-tw、ru 翻译                                       |
| [`src/assets/`](../src/assets/)                 | 全局 CSS、字体和资源加载                                     |

主要路由如下：

| 路由              | 页面                                                          | 作用                                       |
| ----------------- | ------------------------------------------------------------- | ------------------------------------------ |
| `#/overview`      | [`OverviewPage.vue`](../src/views/OverviewPage.vue)           | 运行状态、流量、连接、版本、Geo 和核心管理 |
| `#/proxies`       | [`ProxiesPage.vue`](../src/views/ProxiesPage.vue)             | 节点、节点组、订阅三个导航视图             |
| `#/node-pools`    | [`NodePoolPage.vue`](../src/views/NodePoolPage.vue)           | 节点池 CRUD、合并和延迟测试                |
| `#/subscriptions` | [`SubscriptionsPage.vue`](../src/views/SubscriptionsPage.vue) | 订阅源管理、更新和解码                     |
| `#/connections`   | [`ConnectionsPage.vue`](../src/views/ConnectionsPage.vue)     | 活跃连接筛选和断开                         |
| `#/logs`          | [`LogsPage.vue`](../src/views/LogsPage.vue)                   | 实时日志、级别过滤和导出                   |
| `#/rules`         | [`RulesPage.vue`](../src/views/RulesPage.vue)                 | 规则、入站和分流配置                       |
| `#/settings`      | [`SettingsPage.vue`](../src/views/SettingsPage.vue)           | 后端、面板、核心、目录和 YAML 设置         |
| `#/setup`         | [`SetupPage.vue`](../src/views/SetupPage.vue)                 | 首次设置面板密码                           |

节点池和订阅路由仍保留以兼容旧链接，但侧边栏由 [`src/helper/index.ts`](../src/helper/index.ts) 过滤，节点页控制栏由 [`ProxiesCtrl.tsx`](../src/components/controls/ProxiesCtrl.tsx) 提供三个导航入口；共享选中状态位于 [`nodeNavigation.ts`](../src/store/nodeNavigation.ts)。

### 3.3 前端数据层

| 路径                                      | 作用                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| [`src/config/`](../src/config/)           | 设置项（setting key）定义与默认值                                                  |
| [`src/api/`](../src/api/)                 | Mihomo HTTP、延迟、GeoIP、配置、连接和日志请求                                     |
| [`src/assembly/`](../src/assembly/)       | 将 API、WebSocket、轮询和 store 组装成页面数据                                     |
| [`src/store/`](../src/store/)             | config、settings、nodePool、subscriptions、defaultGroups、connections、logs 等状态 |
| [`src/composables/`](../src/composables/) | 控制 API、键盘、主题、延迟、弹窗、配置编辑等可复用逻辑                             |
| [`src/helper/`](../src/helper/)           | 路由渲染、存储、鉴权、通知、主题、配置导入和工具函数                               |
| [`src/types/`](../src/types/)             | Mihomo、面板、节点、订阅和配置编辑类型                                             |

关键文件：

- [`src/helper/storage.ts`](../src/helper/storage.ts)：业务 KV 通过 agent 的 `/api/control/storage/kv` 读写；
- [`src/helper/panelSession.ts`](../src/helper/panelSession.ts)：面板登录、登出、改密与会话状态；
- [`src/composables/useControlApi.ts`](../src/composables/useControlApi.ts)：控制 API 的规范实现；
- [`src/types/control.ts`](../src/types/control.ts)：控制 API 响应类型（agent 类型的镜像）。

### 3.4 页面、组件和配置编辑

| 路径                                                                                                                | 作用                                                 |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [`src/views/`](../src/views/)                                                                                       | 概览、节点、订阅、连接、日志、规则、设置、登录等页面 |
| [`src/components/common/`](../src/components/common/)                                                               | 通知、错误、确认框等全局组件                         |
| [`src/components/controls/`](../src/components/controls/)                                                           | 页面控制栏、过滤、排序、节点导航                     |
| [`src/components/proxies/`](../src/components/proxies/)                                                             | 代理组、节点卡片和节点操作                           |
| [`src/components/settings/`](../src/components/settings/)                                                           | 后端、核心、面板、TUN、入站和设置表单                |
| [`src/components/settings/backend/UpdateConfigModal.vue`](../src/components/settings/backend/UpdateConfigModal.vue) | 表单配置与 YAML 配置的双模式编辑入口                 |
| [`packages/config-editor/`](../packages/config-editor/)                                                             | ConfigPatchV1、配置 schema 和 profile 编辑能力       |

配置编辑的统一流程是：表单字段操作共享配置对象；YAML 模式解析为对象；提交前校验并调用控制 API 或 Mihomo `/configs`；成功后刷新运行时状态和页面 store。

### 3.5 agent 后端

| 路径                                                                              | 作用                                          |
| --------------------------------------------------------------------------------- | --------------------------------------------- |
| [`packages/agent/src/index.ts`](../packages/agent/src/index.ts)                   | 创建 agent、导出控制路由和宿主集成入口        |
| [`packages/agent/src/http.ts`](../packages/agent/src/http.ts)                     | h3 控制路由、鉴权、错误和响应封装             |
| [`packages/agent/src/storage.ts`](../packages/agent/src/storage.ts)               | sql.js SQLite 初始化、KV 读写、默认数据和落盘 |
| [`packages/agent/src/supervisor.ts`](../packages/agent/src/supervisor.ts)         | Mihomo 子进程生命周期、状态和日志             |
| [`packages/agent/src/kernel/`](../packages/agent/src/kernel/)                     | 核心版本、平台资产、下载、校验、安装和回滚    |
| [`packages/agent/src/profiles.ts`](../packages/agent/src/profiles.ts)             | profile 列表、激活、导入和删除                |
| [`packages/agent/src/profile-editor.ts`](../packages/agent/src/profile-editor.ts) | 配置 patch 和 profile 编辑                    |
| [`packages/agent/src/refresh-apply.ts`](../packages/agent/src/refresh-apply.ts)   | 配置刷新、写入和应用到核心                    |
| [`packages/agent/src/scheduler.ts`](../packages/agent/src/scheduler.ts)           | 订阅或后台任务调度                            |
| [`packages/agent/src/script.ts`](../packages/agent/src/script.ts)                 | 脚本和外部操作适配                            |
| [`packages/agent/src/merge.ts`](../packages/agent/src/merge.ts)                   | 节点池和配置合并                              |
| [`packages/agent/src/tun.ts`](../packages/agent/src/tun.ts)                       | TUN 相关操作                                  |
| [`packages/agent/src/session.ts`](../packages/agent/src/session.ts)               | 面板密码校验与签名 cookie 会话                |
| [`packages/agent/src/types.ts`](../packages/agent/src/types.ts)                   | agent 公共类型                                |
| [`packages/agent/MANUAL.md`](../packages/agent/MANUAL.md)                         | agent 的宿主集成和接口手册                    |

控制 API 按能力分为：info/runtime、storage、auth（会话）、kernel、profiles、config、runtime-config、Geo、system-proxy、TUN 和 SSE logs。具体路由实现以 [`packages/agent/src/http.ts`](../packages/agent/src/http.ts) 为唯一准源，前端调用以 [`src/composables/useControlApi.ts`](../src/composables/useControlApi.ts) 为准。

### 3.6 运行和部署文件

| 路径                                            | 作用和注意事项                                                                                                                           |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [`Dockerfile`](../Dockerfile)                   | 单入口镜像：同一次构建产出 `dist/` 静态资源和 `dist-server/server.js`，容器内由同一个 Node 进程提供页面、`/api/control` 与 `/api/mihomo` |
| [`docker-compose.yml`](../docker-compose.yml)   | 单服务编排，`data/` 与 `kernel/` 挂持久卷；内核由面板在容器内自行下载和管理                                                              |
| [`.dockerignore`](../.dockerignore)             | 把 `data/`、`kernel/`、日志和设计稿挡在构建上下文之外                                                                                    |
| [`.env.example`](../.env.example)               | 环境变量模板                                                                                                                             |
| [`server/index.ts`](../server/index.ts)         | agent 宿主：静态资源 + 控制路由 + Mihomo 同源代理 + 数据目录锁                                                                           |
| [`scripts/dev-all.mjs`](../scripts/dev-all.mjs) | 本地开发：同时拉起 Vite（5173，占用时自动顺延）和 agent 宿主（5174）                                                                     |

## 4. 环境变量和目录布局

环境变量全部由 `server/config.ts` 在运行时读取，不注入前端构建产物：

| 变量                        | 默认值                      | 用途                                                                   |
| --------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `QOQCLASHD_HOME`            | 当前工作目录                | agent 持久化运行时根目录                                               |
| `METACUBEXD_HOME`           | 当前工作目录                | 兼容旧环境的运行时根目录                                               |
| `DATA_DIR`                  | `<root>/data`               | agent SQLite 和业务数据目录，`config/`、`profiles/` 都在它下面         |
| `CORE_STORAGE_DIR`          | `<root>/kernel`             | 核心二进制与 GEO 库目录                                                |
| `PANEL_HOST` / `PANEL_PORT` | `127.0.0.1` / `5173`        | 统一 server 的监听地址；容器内改成 `0.0.0.0:80`                        |
| `API_HOST`                  | `http://127.0.0.1:9090`     | Mihomo API 初始地址；运行后以 KV 中的内核 API 端口为准                 |
| `API_SECRET`                | 空                          | Mihomo 与面板共享密钥的初始值；设置页改过的密码存在 KV 里，优先级更高  |
| `MIHOMO_BINARY`             | `<CORE_STORAGE_DIR>/mihomo` | 直接指定核心二进制                                                     |
| `CONTROL_TOKEN`             | 取 `API_SECRET`             | `/api/control` 的静态 Bearer（供非浏览器客户端用），同时是初始密码种子 |

内核 API 端口和共用密码都有 UI 入口（设置页「内核 API」一行），保存在 `data/qoqclashd.sqlite`，环境变量只是冷启动初始值——改端口/密码需要重启内核才会写进 `active.yaml` 的托管头。

agent 的运行时根目录解析优先级为 `QOQCLASHD_HOME`、`METACUBEXD_HOME`、`process.cwd()`。典型布局：

```text
<runtime-root>/
├─ kernel/                 # Mihomo 核心与 GEO 库
└─ data/
   ├─ qoqclashd.sqlite     # agent 业务 KV（面板密码、订阅、节点、规则）
   ├─ config/active.yaml   # 当前激活配置
   └─ profiles/            # 订阅与 profile 输入
```

生产环境把 `data/` 和 `kernel/` 挂成持久卷即可，`data/config/` 与 `data/profiles/` 属于 data 卷，不单独挂载。`data/` 和 `kernel/` 都已在 `.gitignore` / `.dockerignore` 中排除——SQLite 里存着面板密码和订阅地址，不能进版本库或镜像。

## 5. 认证和请求流程

### 5.1 面板登录

密码只存在 agent 侧（KV `setup/panel-password`），浏览器既不保存密码也不保存 token：

1. 路由守卫请求 [`/api/control/auth/status`](../packages/agent/src/http.ts)，由会话 cookie 是否有效决定 `authenticated`；未认证只能进 `#/setup`，通过后再等 `whenStorageReady()` 水合完成。
2. `#/setup` 提交到 `POST /auth/login`。首次运行（还没有密码）时输入即创建密码，同时下发成内核的 Clash API secret；两端共用一个值。
3. 校验通过后 agent 用面板密码作 HMAC-SHA256 密钥签发 `qoqclashd_session` cookie，TTL 7 天。会话是无状态的，后端重启不需要重登。
4. 若返回 `requiresRestart`（首次建密码或改密时内核正在跑），前端先重启内核，让新 secret 写进 `active.yaml` 的托管头，否则同源代理会拿新密码去打旧 secret。
5. 设置页改密码走 `PUT /auth/password`：旧密码对不对由服务端判定，改完密钥即换，之前签发的 cookie 全部作废，因此响应里会给浏览器补发一张新的。
6. 业务失败一律回 `200 + { ok:false, error }`；只有真正的 HTTP/网络失败才抛。任一控制请求收到 401 时前端计数并跳回 `#/setup`。

### 5.2 业务存储

1. store 通过 storage helper 读取业务 key。
2. helper 调用同源 `/api/control/storage/kv`，浏览器不带任何凭据，鉴权靠登录时种下的会话 cookie。
3. agent 从 SQLite 读取 JSON 字符串并返回。
4. 写入时 agent 更新 KV 表并立即保存数据库文件。
5. agent 不可用时，Vite fallback 可能返回 `index.html`，前端会得到 JSON 解析错误；这表示宿主集成缺失，不应被当作“空数据库”。

### 5.3 Mihomo 请求

代理、连接、规则、日志和流量仍通过 Mihomo API client 访问 `API_HOST`。控制 API 和 Mihomo API 是两套边界：

- `/api/control/*`：面板业务持久化、核心生命周期和本地运行时；
- `/api/mihomo/*`：由统一 server 转发到 `API_HOST`，浏览器不直接访问 Mihomo 地址和 secret；
- `API_HOST`：Mihomo 实时代理运行数据。

## 6. 关键交互流程

### 6.1 首屏

```text
浏览器加载 index.html
  → main.ts 初始化主题、路由、国际化
  → router.beforeEach 请求 /auth/status，未认证则跳 #/setup，通过后等待 KV 水合
  → authStatus.authenticated 变 true 时 App.vue 建立内核会话（assembly/session）
  → 请求 Mihomo /version、/configs、/proxies 等
  → 概览页渲染实时状态
```

### 6.2 下载并启动核心

```text
用户点击“下载并启动核心”
  → OverviewPage/BackendSettings
  → useControlApi().ensureKernel()
  → agent 检查本地核心
  → 缺失时下载、校验并安装
  → supervisor 按 active.yaml 启动 Mihomo
  → 返回运行状态
  → 前端刷新 runtime info、version 和连接状态
```

浏览器不会直接打开 GitHub 下载地址，也不会调用浏览器目录选择器完成核心安装；核心下载必须由后端执行。

### 6.3 节点、节点组和订阅

节点页使用共享 `nodeNavigation` 状态在三个视图间切换：

1. 节点：展示 Mihomo 代理和节点操作；
2. 节点组：编辑默认组和自定义覆盖；
3. 订阅：管理多个 URL、启用状态、更新状态和解码内容。

节点池数据首先由 agent SQLite 读取；订阅更新后经过解码、解析、去重和分组，再写回业务 KV。Mihomo 运行时代理组仍以 Mihomo `/proxies` 为实时来源。

### 6.4 配置和 YAML

配置页、规则页和入站卡片共用 `UpdateConfigModal`：

```text
卡片表单
  ↕ 共享配置对象
YAML 编辑器
  → 解析/校验
  → agent profile/config API 或 Mihomo /configs
  → active.yaml / 运行时配置
  → 重载核心并刷新页面
```

配置失败必须显示错误；不能静默回退为成功。修改前建议导出或创建 profile，以便使用 agent 的回滚能力。

### 6.5 日志和实时状态

- 日志页使用 Mihomo 日志接口和 agent SSE 日志能力；
- 流量和连接页使用 Mihomo 的实时接口；
- 核心生命周期状态由 agent supervisor 维护；
- 停止内核时 `assembly/session` 会拆掉三条常驻流并复位能力表，避免流对着已退出的内核反复重连。

## 7. 运行方式

### 7.1 前端与控制服务开发

```bash
pnpm install
pnpm dev
```

打开 `http://127.0.0.1:5173/#/overview`。该命令会同时启动 Vite 和 agent 宿主服务；Vite 开发代理将控制请求转发到 `127.0.0.1:5174`。

如只需要启动控制服务，可运行：

```bash
pnpm dev:server
```

### 7.2 类型检查和构建

```bash
pnpm type-check
pnpm build
pnpm preview
```

`build` 输出静态资源到 `dist/`，`build:server` 用 esbuild 把 agent 宿主打成 `dist-server/server.js`：

```bash
pnpm build
pnpm build:server
pnpm start
```

`server.js` 同时提供 `dist/` 静态资源、`/api/control` 与 `/api/mihomo`，并在启动时抢占 `data/server.lock` 禁止双开（sql.js 整文件回写，多进程共享同一数据目录会互相覆盖）。

### 7.3 Docker 部署

```bash
docker build -t qoqclashd:local .
docker run -d --name qoqclashd -p 8080:80 -v qoqclashd-data:/app/data qoqclashd:local
```

打开 `http://127.0.0.1:8080/#/setup` 设置密码即可。首次点「应用配置」时面板会下载 mihomo 到 `/app/kernel`，同源部署是当前业务 SQLite 和核心管理功能的推荐方式。

### 7.4 Docker Compose

```bash
docker compose up -d --build
```

compose 只有一个 `qoqclashd` 服务：页面端口 `8080→80`，内核主入口 `7890` 一并放开供其他设备使用，Clash API 端口只留在容器内部。需要 TUN 时按 compose 里的注释补 `cap_add`。

## 8. 验证清单

启动后建议按以下顺序验证：

1. `#/setup` 可以设置密码并刷新后保持登录；
2. 概览能显示 Mihomo version 和核心状态；
3. 设置页能看到 runtime root、kernel、data 内部的 config、profiles 和 active config；
4. 点击核心操作时网络请求进入 `/api/control/*`，而不是浏览器下载；
5. 节点页只有“节点 / 节点组 / 订阅”三个控制栏入口；
6. 新增节点或订阅后重启 agent，数据仍来自 `data/qoqclashd.sqlite`；
7. 规则和入站卡片均能打开表单/YAML 编辑器；
8. 日志、连接、流量和代理组数据来自 Mihomo 实时 API；REST 请求应显示为同源 `/api/mihomo/*`；
9. `pnpm type-check` 和 `pnpm build` 均通过。

## 9. 已知边界和维护规则

- agent 是库和路由集合，不负责自行监听端口；[`server/index.ts`](../server/index.ts) 是仓库内唯一的宿主；
- 不要把密钥、后端地址等运行时配置注入前端构建产物；环境变量只由 `server/config.ts` 读取，Vite 只注入 `__FONT__`；
- 不要把业务配置重新写回 localStorage；应使用 `/api/control/storage/kv`；
- 不要在前端实现核心二进制下载 fallback；
- 内核不在跑时一律跳设置页，不要再加一层「请启动内核」弹窗；
- `data/`、`kernel/` 及其中任何文件不得入库或进镜像构建上下文（密码和订阅地址都在里面）；
- 修改控制 API 时同时更新 [`packages/agent`](../packages/agent/)、[`src/types/control.ts`](../src/types/control.ts)、[`src/composables/useControlApi.ts`](../src/composables/useControlApi.ts) 和调用方；
- 修改配置字段时同步检查 config-editor、profile editor、YAML 模式和运行时 apply 流程。

## 10. 结论

QoQClashD 的部署模型是「单个 Node 进程 + 同源 agent 控制服务 + 面板自管 Mihomo Core + SQLite 持久化」：页面、`/api/control`、`/api/mihomo` 共享一个 origin，内核二进制由面板按需下载，节点、订阅、配置、核心管理和数据库构成完整闭环。
