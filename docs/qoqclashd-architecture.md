# QoQClashD 架构与运行说明

> 本文以当前仓库实现为准，说明 QoQClashD 的目录结构、组件职责、数据流、接口交互、运行方式和部署边界。  
> 项目名称沿用上游 zashboard 的 package 名称 `zashboard`，产品名称为 QoQClashD。

## 1. 项目定位

QoQClashD 是一个面向 Mihomo 的 Web 控制面板。它保留 zashboard 的 Vue 3 卡片式界面、多后端切换、图表、表格和响应式交互，同时增加：

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
- `packages/ui` 提供共享的控制服务 composable 和部分 UI 能力；
- Vite 在构建时把不带 `VITE_` 前缀的环境变量写入 `__ENV__`。

前端使用 hash 路由，因此静态服务器只需要回退到 `index.html`，不会依赖服务端路由改写。

### 2.2 agent 控制服务

`packages/agent` 是控制后端库，不是一个单独执行 `listen()` 的命令行服务。宿主程序需要创建 agent 并把 h3 路由挂载到 HTTP 服务上。该服务负责：

- `/api/control/*` 控制接口；
- SQLite KV 持久化；
- 运行时根目录和配置目录解析；
- Mihomo 核心下载、校验、启动、停止、重启、回滚和恢复；
- profiles、active config 和配置 patch；
- WebDAV 备份恢复、系统代理、TUN、Geo 资源；
- SSE 日志和核心状态事件。

开发环境的 `pnpm dev` 会同时启动 Vite（5173）和统一 Node server（5174），Vite 会将 `/api/control/*`、`/api/mihomo/*` 代理到 Node server，因此 SQLite、核心下载和运行时配置在开发页面中也可用。

### 2.3 Mihomo Core

Mihomo 负责真正的代理运行时：

- REST API：版本、配置、代理组、规则、连接、日志、流量、延迟和 Geo；
- WebSocket/SSE：实时流量、日志和状态；
- 代理端口、DNS、规则、TUN 和入站；
- `active.yaml` 对应的运行配置。

前端通过当前后端配置中的 host、port、protocol 和 secret 访问 Mihomo。核心可以由外部进程提供，也可以由 agent 下载并管理。

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

| 路径 | 作用 |
| --- | --- |
| [`package.json`](../package.json) | 根项目脚本、依赖和 pnpm 版本；包含 `dev`、`build`、`type-check`、测试和格式化命令 |
| [`pnpm-workspace.yaml`](../pnpm-workspace.yaml) | pnpm workspace 与依赖安装策略 |
| [`pnpm-lock.yaml`](../pnpm-lock.yaml) | 锁定依赖版本 |
| [`vite.config.ts`](../vite.config.ts) | Vue/Vite/PWA 配置、`@` 别名、`__ENV__` 注入和相对 base |
| [`tsconfig.json`](../tsconfig.json)、[`tsconfig.app.json`](../tsconfig.app.json) | TypeScript 编译边界 |
| [`eslint.config.ts`](../eslint.config.ts)、[`.prettierrc`](../.prettierrc) | lint 和格式化规则 |
| [`postcss.config.js`](../postcss.config.js)、[`tailwind.config.js`](../tailwind.config.js) | CSS、Tailwind 和 daisyUI 配置 |
| [`index.html`](../index.html) | 浏览器入口和 `#app` 挂载点 |
| [`public/`](../public/) | 不经 Vite 处理的图标、字体和静态资源 |
| [`test/`](../test/) | mock server、基准和验证脚本 |
| [`.github/workflows/`](../.github/workflows/) | CI、Docker 构建和镜像发布 |

### 3.2 前端启动和路由

| 路径 | 作用 |
| --- | --- |
| [`src/main.ts`](../src/main.ts) | 加载 API、dayjs、主题和字体，创建 Vue 应用并挂载 router/i18n |
| [`src/App.vue`](../src/App.vue) | 全局布局、主题、触摸行为、后端切换、自动同步和全局弹窗 |
| [`src/router/index.ts`](../src/router/index.ts) | hash 路由、页面标题和登录守卫 |
| [`src/constant/`](../src/constant/) | 路由名、枚举、图标和应用常量 |
| [`src/i18n/`](../src/i18n/) | zh、en、zh-tw、ru 翻译 |
| [`src/assets/`](../src/assets/) | 全局 CSS、字体和资源加载 |

主要路由如下：

| 路由 | 页面 | 作用 |
| --- | --- | --- |
| `#/overview` | [`OverviewPage.vue`](../src/views/OverviewPage.vue) | 运行状态、流量、连接、版本、Geo 和核心管理 |
| `#/proxies` | [`ProxiesPage.vue`](../src/views/ProxiesPage.vue) | 节点、节点组、订阅三个导航视图 |
| `#/node-pools` | [`NodePoolPage.vue`](../src/views/NodePoolPage.vue) | 节点池 CRUD、合并和延迟测试 |
| `#/subscriptions` | [`SubscriptionsPage.vue`](../src/views/SubscriptionsPage.vue) | 订阅源管理、更新和解码 |
| `#/connections` | [`ConnectionsPage.vue`](../src/views/ConnectionsPage.vue) | 活跃连接筛选和断开 |
| `#/logs` | [`LogsPage.vue`](../src/views/LogsPage.vue) | 实时日志、级别过滤和导出 |
| `#/rules` | [`RulesPage.vue`](../src/views/RulesPage.vue) | 规则、入站和分流配置 |
| `#/settings` | [`SettingsPage.vue`](../src/views/SettingsPage.vue) | 后端、面板、核心、目录和 YAML 设置 |
| `#/setup` | [`SetupPage.vue`](../src/views/SetupPage.vue) | 首次设置面板密码 |

节点池和订阅路由仍保留以兼容旧链接，但侧边栏由 [`src/helper/index.ts`](../src/helper/index.ts) 过滤，节点页控制栏由 [`ProxiesCtrl.tsx`](../src/components/controls/ProxiesCtrl.tsx) 提供三个导航入口；共享选中状态位于 [`nodeNavigation.ts`](../src/store/nodeNavigation.ts)。

### 3.3 前端数据层

| 路径 | 作用 |
| --- | --- |
| [`src/config/`](../src/config/) | 环境变量、默认配置和应用级设置 |
| [`src/api/`](../src/api/) | Mihomo HTTP、延迟、GeoIP、配置、连接和日志请求 |
| [`src/assembly/`](../src/assembly/) | 将 API、WebSocket、轮询和 store 组装成页面数据 |
| [`src/store/`](../src/store/) | backend、config、setup、settings、nodePool、subscriptions、defaultGroups、connections、logs 等状态 |
| [`src/composables/`](../src/composables/) | 控制 API、键盘、主题、延迟、弹窗、配置编辑等可复用逻辑 |
| [`src/helper/`](../src/helper/) | 路由渲染、存储、鉴权、通知、主题、配置导入和工具函数 |
| [`src/types/`](../src/types/) | Mihomo、面板、节点、订阅和配置编辑类型 |

关键文件：

- [`src/config/env.ts`](../src/config/env.ts)：读取 `__ENV__`，不使用 `VITE_` 前缀；
- [`src/helper/storage.ts`](../src/helper/storage.ts)：业务 KV 通过 agent 的 `/api/control/storage/kv` 读写；
- [`src/helper/panelAuth.ts`](../src/helper/panelAuth.ts)：面板密码和登录态；
- [`src/composables/useControlApi.ts`](../src/composables/useControlApi.ts)：重新导出共享控制服务客户端；
- [`packages/ui/composables/useControlApi.ts`](../packages/ui/composables/useControlApi.ts)：控制 API 的规范实现。

### 3.4 页面、组件和配置编辑

| 路径 | 作用 |
| --- | --- |
| [`src/views/`](../src/views/) | 概览、节点、订阅、连接、日志、规则、设置、登录等页面 |
| [`src/components/common/`](../src/components/common/) | 通知、错误、确认框、后端切换等全局组件 |
| [`src/components/controls/`](../src/components/controls/) | 页面控制栏、过滤、排序、节点导航 |
| [`src/components/proxies/`](../src/components/proxies/) | 代理组、节点卡片和节点操作 |
| [`src/components/settings/`](../src/components/settings/) | 后端、核心、面板、TUN、入站和设置表单 |
| [`src/components/settings/backend/UpdateConfigModal.vue`](../src/components/settings/backend/UpdateConfigModal.vue) | 表单配置与 YAML 配置的双模式编辑入口 |
| [`packages/config-editor/`](../packages/config-editor/) | ConfigPatchV1、配置 schema 和 profile 编辑能力 |

配置编辑的统一流程是：表单字段操作共享配置对象；YAML 模式解析为对象；提交前校验并调用控制 API 或 Mihomo `/configs`；成功后刷新运行时状态和页面 store。

### 3.5 agent 后端

| 路径 | 作用 |
| --- | --- |
| [`packages/agent/src/index.ts`](../packages/agent/src/index.ts) | 创建 agent、导出控制路由和宿主集成入口 |
| [`packages/agent/src/http.ts`](../packages/agent/src/http.ts) | h3 控制路由、鉴权、错误和响应封装 |
| [`packages/agent/src/storage.ts`](../packages/agent/src/storage.ts) | sql.js SQLite 初始化、KV 读写、默认数据和落盘 |
| [`packages/agent/src/supervisor.ts`](../packages/agent/src/supervisor.ts) | Mihomo 子进程生命周期、状态和日志 |
| [`packages/agent/src/kernel/`](../packages/agent/src/kernel/) | 核心版本、平台资产、下载、校验、安装和回滚 |
| [`packages/agent/src/profiles.ts`](../packages/agent/src/profiles.ts) | profile 列表、激活、导入和删除 |
| [`packages/agent/src/profile-editor.ts`](../packages/agent/src/profile-editor.ts) | 配置 patch 和 profile 编辑 |
| [`packages/agent/src/refresh-apply.ts`](../packages/agent/src/refresh-apply.ts) | 配置刷新、写入和应用到核心 |
| [`packages/agent/src/scheduler.ts`](../packages/agent/src/scheduler.ts) | 订阅或后台任务调度 |
| [`packages/agent/src/script.ts`](../packages/agent/src/script.ts) | 脚本和外部操作适配 |
| [`packages/agent/src/merge.ts`](../packages/agent/src/merge.ts) | 节点池和配置合并 |
| [`packages/agent/src/tun.ts`](../packages/agent/src/tun.ts) | TUN 相关操作 |
| [`packages/agent/src/webdav.ts`](../packages/agent/src/webdav.ts) | WebDAV 备份与恢复 |
| [`packages/agent/src/types.ts`](../packages/agent/src/types.ts) | agent 公共类型 |
| [`packages/agent/MANUAL.md`](../packages/agent/MANUAL.md) | agent 的宿主集成和接口手册 |

控制 API 按能力分为：info/runtime、storage、kernel、profiles、config、runtime-config、Geo、backup/restore、system-proxy、TUN 和 SSE logs。具体路由实现以 [`packages/agent/src/http.ts`](../packages/agent/src/http.ts) 为唯一准源，前端调用以 [`packages/ui/composables/useControlApi.ts`](../packages/ui/composables/useControlApi.ts) 为准。

### 3.6 运行和部署文件

| 路径 | 作用和注意事项 |
| --- | --- |
| [`Dockerfile`](../Dockerfile) | 当前根项目构建 Vite 静态资源并用 Caddy 提供服务；构建参数是不带 `VITE_` 前缀的变量 |
| [`Dockerfile.server`](../Dockerfile.server) | 当前推荐的单入口镜像，同时提供前端静态资源和 `/api/control` agent 服务 |
| [`Dockerfile.qoqclashd`](../Dockerfile.qoqclashd) | 兼容构建文件，使用当前不带 `VITE_` 前缀的环境变量；它仍只交付静态前端 |
| [`docker-compose.yml`](../docker-compose.yml) | 历史的 Mihomo 独立容器 + 面板容器示例；可用于外部核心连接，但仍需补充 agent 宿主才能提供完整控制能力 |
| [`Caddyfile`](../Caddyfile) | 静态文件服务和 SPA fallback；它本身不提供 `/api/control` |
| [`packages/ui/Dockerfile`](../packages/ui/Dockerfile) | 独立 Nuxt UI 构建镜像，适用于共享 UI 包，不等同于根目录 QoQClashD agent 宿主 |
| [`packages/ui/docker-entrypoint.sh`](../packages/ui/docker-entrypoint.sh) | 注入 Nuxt 的默认后端 URL 和 GitHub token 后启动 Nitro |
| [`.env.example`](../.env.example) | 当前环境变量模板 |

## 4. 环境变量和目录布局

当前项目约定环境变量不使用 `VITE_` 前缀：

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `CORE_STORAGE_DIR` | `./core` | 核心二进制及核心存储目录 |
| `DATA_DIR` | `./data` | agent SQLite 和业务数据目录 |
| `PANEL_PORT` | `80` | 面板端口，具体由宿主服务器使用 |
| `API_HOST` | `http://127.0.0.1:9090` | Mihomo API 地址 |
| `API_SECRET` | 空 | Mihomo 和面板共享密钥；非空时可作为默认面板密码 |
| `QOQCLASHD_HOME` | 当前工作目录 | agent 持久化运行时根目录 |
| `METACUBEXD_HOME` | 当前工作目录 | 兼容旧环境的运行时根目录 |

agent 的运行时根目录解析优先级为 `QOQCLASHD_HOME`、`METACUBEXD_HOME`、`process.cwd()`。典型布局：

```text
<runtime-root>/
├─ kernel/                 # Mihomo 核心
├─ config/
│  └─ active.yaml          # 当前激活配置
├─ profiles/               # 配置 profiles
└─ data/
   └─ qoqclashd.sqlite     # agent 业务 KV
```

生产环境应将 `data/` 和 `kernel/` 挂载为持久卷。`data/config/` 和 `data/profiles/` 属于 data 卷，不单独挂载。

## 5. 认证和请求流程

### 5.1 面板登录

1. 路由守卫读取 [`isPanelAuthenticated()`](../src/helper/panelAuth.ts)。
2. 未认证用户只能进入 `#/setup`。
3. 用户设置密码后，面板保存 `setup/panel-password` 和 `setup/panel-auth`。
4. 若 `API_SECRET` 非空且没有已保存密码，则它可作为默认面板密码。
5. 登录后进入概览，不再显示“保持并登录”这类混合语义按钮。

### 5.2 业务存储

1. store 通过 storage helper 读取业务 key。
2. helper 调用同源 `/api/control/storage/kv`，并携带 `Authorization: Bearer <control token>`。
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
  → App.vue 恢复后端和登录态
  → router.beforeEach 检查面板密码
  → assembly/session 绑定 activeBackend
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
- 前端切换 activeBackend 时，`assembly/session` 会重新建立对应的请求和常驻流。

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

`build` 输出到 `dist/`。当前 Caddy 配置只负责 `dist` 静态文件和 SPA fallback，不会自动启动 agent。

### 7.3 完整单体部署

完整部署使用 [`Dockerfile.server`](../Dockerfile.server) 或等价的 Node 宿主：

1. 创建 agent；
2. 挂载 agent 控制路由到 `/api/control`；
3. 提供 `dist/` 静态文件；
4. 将 `API_HOST`、`API_SECRET`、`DATA_DIR` 和运行时根目录传入宿主；
5. 使用同一个 origin 对外提供页面和控制 API。

同源部署是当前业务 SQLite 和核心管理功能的推荐方式。

### 7.4 旧版分离 Docker Compose

仓库中的 [`docker-compose.yml`](../docker-compose.yml) 仍保留 Mihomo 容器和静态面板容器的历史示例：

```bash
docker compose up -d
```

它可以用于只验证 Mihomo API 面板，但不能自动提供 agent SQLite、核心下载和运行时控制。当前变量使用 `API_HOST`、`API_SECRET`，但仍需补充 agent 宿主或反向代理。不要把该 compose 文件当作当前完整架构的唯一启动方案。

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

- agent 是库和路由集合，不负责自行监听端口；宿主集成是部署者责任；
- `Caddyfile` 不提供 `/api/control`，必须由同源宿主、反向代理或专用服务器补齐；
- 不要重新引入 `VITE_` 前缀，否则 `src/config/env.ts` 无法读取当前约定；
- 不要把业务配置重新写回 localStorage；应使用 `/api/control/storage/kv`；
- 不要在前端实现核心二进制下载 fallback；
- 修改控制 API 时同时更新 [`packages/agent`](../packages/agent/)、[`packages/ui/composables/useControlApi.ts`](../packages/ui/composables/useControlApi.ts) 和根应用调用方；
- 修改配置字段时同步检查 config-editor、profile editor、YAML 模式和运行时 apply 流程。

## 10. 结论

QoQClashD 的正确部署模型是“Vue/Vite 面板 + 同源 agent 控制服务 + Mihomo Core + SQLite 持久化”。静态 Vite/Caddy 页面只是前端交付层；只有 agent 和 Mihomo 同时接入，节点、订阅、配置、核心管理和数据库功能才构成完整闭环。
