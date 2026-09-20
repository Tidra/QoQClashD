# QoQClashD 部署指南

## 1. 方案概览

一个 QoQClashD 容器就是全部运行时：

- Vue/Vite 前端静态资源；
- 同一个 Node 进程挂载的 `/api/control`（agent）与 `/api/mihomo`（内核 API 同源代理）；
- 由面板自行下载、启动、重启的 Mihomo Core；
- 持久化的 `data/` 和 `kernel/` 目录，`config/`、`profiles/` 都在 `data/` 内部。

浏览器只连接一个 origin，页面、控制接口和内核代理请求全部同源，因此不需要反向代理补齐路径。

运行时镜像直接复用构建阶段的整棵 `node_modules`（pnpm 的相对软链随目录一起复制后仍然有效，`sql.js` 的 wasm 也靠它定位），代价是体积偏大；`dist-server/server.js` 只把 `yaml`、`sql.js`、`tree-kill`、`ws` 留成运行时依赖，后续可按这四个包做精简层。

## 2. 部署方式

### 2.1 Docker Compose（推荐）

```bash
docker compose up -d --build
```

compose 里只有一个 `qoqclashd` 服务：`8080:80` 是面板入口，`7890:7890` 是内核主入口，`data/` 与 `kernel/` 走命名卷。

### 2.2 直接 docker build / run

```bash
docker build -t qoqclashd:local .
docker run -d --name qoqclashd \
  -p 8080:80 \
  -p 7890:7890 \
  -v qoqclashd-data:/app/data \
  -v qoqclashd-kernel:/app/kernel \
  qoqclashd:local
```

### 2.3 使用 GHCR 镜像

`.github/workflows/qoqclashd-docker.yml` 会发布多架构镜像：

```bash
docker run -d --name qoqclashd \
  -p 8080:80 -p 7890:7890 \
  -v qoqclashd-data:/app/data \
  -v qoqclashd-kernel:/app/kernel \
  ghcr.io/<owner>/qoqclashd:latest
```

### 2.4 裸机运行

```bash
pnpm install
pnpm build && pnpm build:server
PANEL_HOST=0.0.0.0 PANEL_PORT=8080 pnpm start
```

## 3. 首次启动

1. 打开 `http://localhost:8080`，面板自动进入 `#/setup`；
2. 设置的密码同时是内核 Clash API 的 secret —— 两端共用一个值；密码只留在后端，浏览器只拿一张 7 天有效期的签名会话 cookie，重启后端不用重登；
3. 若内核还没下载过，面板会直接落在设置页的内核管理卡片，在那里选择镜像并下载安装；
4. 配好节点/订阅后点「应用配置」，面板合成 `data/config/active.yaml` 并让内核加载。

`data/` 目录不存在时后端会自动建库并写入默认值（API 端口 9090、主入口 mixed-port 7890、默认「全部节点」select 分组、局域网/国内直连 + 其余走默认组的规则）。

## 4. 环境变量

均可省略，下表是实际默认值：

| 变量                        | 默认值                      | 用途                                             |
| --------------------------- | --------------------------- | ------------------------------------------------ |
| `PANEL_HOST` / `PANEL_PORT` | `127.0.0.1` / `5173`        | 统一 server 监听地址（容器内 `0.0.0.0:80`）      |
| `QOQCLASHD_HOME`            | 当前工作目录                | 运行时根目录                                     |
| `DATA_DIR`                  | `<root>/data`               | SQLite 与配置目录                                |
| `CORE_STORAGE_DIR`          | `<root>/kernel`             | 内核二进制与 GEO 库                              |
| `API_HOST`                  | `http://127.0.0.1:9090`     | 内核 API 初始地址                                |
| `API_SECRET`                | 空                          | 内核 API 与面板密码的初始值                      |
| `CONTROL_TOKEN`             | 取 `API_SECRET`             | `/api/control` 的静态 Bearer，同时是初始密码种子 |
| `MIHOMO_BINARY`             | `<CORE_STORAGE_DIR>/mihomo` | 指定已有内核二进制                               |

内核 API 端口和共用密码在设置页改，落进 SQLite；环境变量只是冷启动初始值。密码属于敏感数据，不建议写进 compose 文件或环境变量，让它留在持久卷里更安全。

## 5. 持久化内容

- `data/qoqclashd.sqlite`：面板业务数据库，节点、订阅、规则、面板密码的权威来源；
- `data/config/active.yaml`：按 SQLite 配置合成、下发给内核的产物；
- `data/profiles/`：订阅原文与 profile 输入；
- `kernel/`：Mihomo 二进制与 GEO 库。

节点、规则和其他结构化配置不以 `active.yaml` 作为编辑权威。备份只需拷走 `data/`；恢复时把整个目录放回去即可（内核二进制不用备份，面板会重新下载）。

## 6. CI/CD 镜像发布

`.github/workflows/qoqclashd-docker.yml` 在 `master` 分支推送、打出 `v*` 标签、或手动触发时执行：构建 `linux/amd64` 与 `linux/arm64` 镜像，登录 GHCR 并推送。`master` 推送只更新 `latest`；打 `v0.1` 这类标签时额外推送同名版本标签。

工作流只用仓库自带的 `GITHUB_TOKEN` 推到 GHCR，不需要额外 secrets。首次推代码后到仓库的 Packages 里把镜像设为公开（或保持私有并在拉取端配置 token）。

## 7. 端口说明

| 服务              | 端口            | 暴露范围 | 用途                                  |
| ----------------- | --------------- | -------- | ------------------------------------- |
| QoQClashD server  | 80（宿主 8080） | 对外     | 面板 + `/api/control` + `/api/mihomo` |
| Mihomo mixed-port | 7890            | 按需     | 代理主入口，局域网设备一起用就放开    |
| Mihomo Clash API  | 9090            | 容器内部 | 面板经同源代理访问，不必对外          |

容器里 `7890:7890` 要真能被宿主访问，得在分流中心的「主入口」里打开 allow-lan——内核默认只绑 `127.0.0.1`，容器内的 loopback 对宿主不可达。Clash API 由 agent 强制改写为容器内可达地址，不需要也不应该对外发布。

## 8. 常见问题

### 8.1 面板报「连不上」或自动跳到设置页

内核没在运行。设置页第一屏就是内核管理卡片，启动即可；面板不会用弹窗拦你。

### 8.2 改了 API 端口或密码后不生效

两者都写进 `active.yaml` 的托管头，需要重启内核。设置页保存时会自动重启；手动改过 KV 就要自己点一次重启。

### 8.3 启动即退出并提示已有进程在使用数据目录

sql.js 整文件回写，两个后端共享同一 `dataDir` 会互相覆盖数据，所以启动时会抢 `data/server.lock`。停掉另一个实例即可；确认实例已死时删掉锁文件也行。

### 8.4 端口冲突

改 `docker-compose.yml` 的映射端口。Clash API 端口只在容器内用，通常不需要动。

## 9. 结论

单容器 + 两个持久卷就是 QoQClashD 的完整部署形态：面板托管内核生命周期，业务配置以 SQLite 为权威，页面与控制接口同源，升级只需换镜像。
