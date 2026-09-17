# QoQClashD 部署指南

## 1. 方案概览

当前完整部署由四部分组成：

- Vue/Vite 前端静态资源；
- 提供 `/api/control` 的 agent 宿主；
- Mihomo Core；
- 持久化的 `data/` 和 `kernel/` 目录。`config/`、`profiles/` 都位于 `data/` 内部。

推荐使用统一 Node server 镜像，让前端、agent 控制 API 和 Mihomo 代理保持同源。旧 Caddy 静态文件服务不再作为完整部署入口。

## 2. Docker Compose 部署

### 2.0 推荐：单入口 server 镜像

单入口镜像同时提供前端、`/api/control`、`/api/mihomo` 和 agent 管理的 Mihomo 生命周期：

```bash
docker build -f Dockerfile.server -t qoqclashd:server .
docker run -d --name qoqclashd \
  -p 8080:80 \
  -e API_SECRET=change-me \
  -e QOQCLASHD_HOME=/app \
  -v qoqclashd-data:/app/data \
  -v qoqclashd-kernel:/app/kernel \
  qoqclashd:server
```

访问 `http://localhost:8080`。该模式下浏览器只连接一个 origin，业务 SQLite 位于 `/app/data/qoqclashd.sqlite`。

镜像文件见 [`Dockerfile.server`](../Dockerfile.server)。它是当前推荐入口；根目录 `Dockerfile` 和旧 compose 配置主要用于迁移期兼容。

本仓库中已提供示例配置文件：

- `docker-compose.yml`

### 2.1 直接使用 GHCR 镜像

```bash
docker compose up -d
```

默认示例是历史的面板与 Mihomo 分离配置。使用前应确保有 agent 宿主挂载 `/api/control`，并把面板的 `API_HOST` 指向 Mihomo API。

### 2.2 本地构建镜像

若需要在本地编译前端，可使用：

```bash
docker build -f Dockerfile.server -t qoqclashd:local .
```

然后把 `docker-compose.yml` 里的 `qoqclashd` 服务切换到本地构建方式即可。

## 3. 必备环境变量

可通过 Docker 环境变量传递：

- `CORE_STORAGE_DIR`
- `DATA_DIR`
- `PANEL_PORT`
- `API_HOST`
- `API_SECRET`

示例：

```yaml
environment:
  API_HOST: http://mihomo-core:9090
  API_SECRET: ${QOQCLASHD_API_SECRET:-}
  DATA_DIR: /var/lib/qoqclashd/data
  CORE_STORAGE_DIR: /var/lib/qoqclashd/kernel
```

## 4. 持久化配置

建议挂载的目录：

- `./mihomo-data:/etc/mihomo`

这样可以持久化：

- `/app/data/qoqclashd.sqlite`：面板业务数据库，也是节点、规则、订阅等结构化配置的权威来源；
- `/app/data/config/active.yaml`：根据 SQLite 配置和运行时状态按需合成的 Mihomo 配置产物；
- `/app/data/profiles/`：订阅原文、profile 输入和必要的文件型缓存；
- `/app/kernel/`：Mihomo 核心二进制及核心相关文件。

节点、规则和其他结构化配置不以 `active.yaml` 作为编辑权威。面板保存到 SQLite 后，在启动、应用配置或刷新订阅时重新合成 `active.yaml`，再交给 Mihomo 加载。

## 5. CI/CD 镜像发布

本项目中已增加 GitHub Actions 示例文件：

- `.github/workflows/qoqclashd-docker.yml`

它会在 `main` 分支推送后自动执行：

- 构建 Docker 镜像
- 登录 GHCR
- 推送 `latest` 和版本号标签

## 6. 端口说明

| 服务 | 端口 | 用途 |
| --- | --- | --- |
| Mihomo Core | 7890 | 代理端口 |
| Mihomo Core | 9090 | API 端口 |
| QoQClashD server | 8080 | 面板、agent control API 和单入口服务 |
| Mihomo Core | 9090 | 仅在 external-core 模式下由面板/agent 访问 |

## 7. 访问方式

访问地址：

```text
http://localhost:8080
```

## 8. 常见问题

### 8.1 API 连不通

确认：

- `mihomo-core` 容器是否正常启动
- 9090 端口是否暴露
- `API_HOST` 是否指向正确地址

### 8.2 版本升级

可以更新 Mihomo 镜像，也可以使用 agent 的核心版本和下载接口。两种方式不要同时管理同一个运行时目录。

### 8.3 端口冲突

如果 8080 或 9090 已被占用，请调整 `docker-compose.yml` 中的映射端口。

## 9. 结论

本部署方案兼顾了稳定性、可维护性和分离式架构，并且能直接复用 zashboard 的优秀 UI 风格与交互体验。
