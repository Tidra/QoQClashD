# QoQClashD

QoQClashD 是一个基于 zashboard 前端样式与交互设计的 Mihomo / Clash 控制面板，目标是把 Mihomo Core 与前端控制面板分离部署，提供面向订阅、节点、规则、日志和连接管理的 Docker 化运维界面。

本仓库保留 zashboard 的卡片式 UI、仪表盘和多后端管理能力，并在此之上扩展 QoQClashD 的项目化场景：订阅管理、分流中心、默认节点组、配置编辑和 Docker Compose 部署。

## 项目定位

- 前端基础：zashboard
- 内核：Mihomo / Clash Premium
- 运行方式：Docker 分离部署
- 核心目标：控制面板与代理内核分离，便于管理和扩展

## 架构概览

- 前端：Vue 3 + Vite，提供概览、节点、订阅、连接、日志、规则和设置页面。
- agent：挂载 `/api/control`，负责 SQLite、运行时目录、配置和 Mihomo 核心生命周期。
- Mihomo Core：提供代理、规则、连接、日志、流量和配置 API。
- 推荐方式：前端、agent 使用同源地址提供服务；Mihomo 可以由 agent 管理，也可以连接外部核心。

完整的目录、数据流、接口边界和运行方式见
[QoQClashD 架构与运行说明](docs/qoqclashd-architecture.md)。

## 核心功能规划

1. 总览仪表盘：流量、连接、版本、Geo 数据与地图可视化。
2. 节点管理：订阅源、节点池、分组、延迟测试和筛选。
3. 分流中心：listeners、rules、sub-rule、rule providers 和 TUN 配置。
4. 日志：实时日志、级别切换和过滤。
5. 连接：活跃连接、IP/端口/域名筛选和中断连接能力。
6. 配置：后端 API 配置、核心管理、安全设置和 YAML 配置编辑。

## Docker 部署

> 根目录 Docker 配置现在使用统一 Node server，同时提供前端、`/api/control`、`/api/mihomo`、SQLite 和核心生命周期管理。旧 Caddy 文件仅保留兼容用途，不再是推荐入口。

### 推荐：单入口 server

```bash
docker build -f Dockerfile.server -t qoqclashd:server .
docker run -d --name qoqclashd -p 8080:80 \
  -e API_SECRET=your_secret \
  -v qoqclashd-data:/app/data \
  -v qoqclashd-kernel:/app/kernel \
  qoqclashd:server
```

该镜像由一个 Node server 同时提供前端、`/api/control` 和 agent 控制能力。

### 直接运行统一面板镜像

```bash
docker build -f Dockerfile -t qoqclashd:local .
docker run -d --name qoqclashd -p 8080:80 \
  -e API_HOST=http://host.docker.internal:9090 \
  -e API_SECRET=your_secret \
  -v qoqclashd-data:/app/data \
  -v qoqclashd-kernel:/app/kernel \
  qoqclashd:local
```

### 使用 Compose

```bash
docker compose up -d
```

示例文件见：

- [docker-compose.yml](docker-compose.yml)
- [Dockerfile.qoqclashd](Dockerfile.qoqclashd)

## 生产与本地构建说明

- 生产镜像：推荐使用 GHCR 发布镜像，见 [.github/workflows/qoqclashd-docker.yml](.github/workflows/qoqclashd-docker.yml)
- 本地构建：使用根目录 `Dockerfile`、`Dockerfile.server` 或兼容文件 `Dockerfile.qoqclashd`，三者均进入统一 Node server
- 当前运行时环境变量不使用 `VITE_` 前缀：
  - `CORE_STORAGE_DIR`
  - `DATA_DIR`
  - `PANEL_PORT`
  - `API_HOST`
  - `API_SECRET`

## 文档

- [QoQClashD 架构说明](docs/qoqclashd-architecture.md)
- [QoQClashD 开发指南](docs/qoqclashd-development.md)
- [QoQClashD 部署指南](docs/qoqclashd-deployment.md)

## 环境变量示例

复制示例文件：

```bash
cp .env.example .env
```

示例内容：

```env
CORE_STORAGE_DIR=./core
DATA_DIR=./data
PANEL_PORT=80
API_HOST=http://mihomo-core:9090
API_SECRET=
```

## 说明

本项目在设计上遵循 zashboard 的整体视觉和交互语言，但目标是演化成一个更偏新手友好、适合 Mihomo 管理的 QoQClashD 控制面板。镜像层与 Mihomo Core 分离，是推荐的生产部署方式，也能降低在容器环境中直接操作内核二进制的风险。
