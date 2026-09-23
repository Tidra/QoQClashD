# QoQClashD

v0.2 · 面向 Mihomo 的本地代理控制面板。面板自己托管内核：下载、启动、停止、重启、升级都在界面里完成，订阅、节点、代理组和分流规则以 SQLite 为权威来源，一键合成为 `active.yaml` 下发给内核。

前端、控制接口和内核 API 由同一个 Node 进程同源提供，单容器即可跑完整套功能。

## 功能

- **内核托管**：从可配置的 GitHub 镜像下载 mihomo，启动/停止/重启/回滚，实时状态与日志；内核 API 端口与共用密码在设置页直接改，保存后自动重启生效。
- **冷启动零配置**：`data/` 不存在时自动建库并写入默认值——API 端口 9090、主入口 mixed-port 7890、默认「全部节点」select 分组、局域网直连 + 国内直连 + 其余走默认组。首次设置的面板密码同时下发成内核 secret。
- **节点与订阅**：订阅源拉取（走后端代理，绕开 CORS）、解码去重、节点池与代理组编辑、批量多选删除、并发延迟测速、测速结果跨视图共享。
- **分流中心**：主规则/子规则同构列表、规则集合（rule-providers）、入口（listeners）与 allow-lan，表单与 YAML 双向编辑，下发前内核 `-t` 配置校验。
- **可视化**：概览卡片（流量/延迟/连接历史/规则命中/拓扑）、连接页、日志页、代理组切换。
- **运维**：面板登录（签名 cookie 会话，7 天免重登）、导出/导入整个数据库（密码除外）、GeoIP/GeoSite 更新、系统代理开关、TUN 状态、PWA 离线、中英繁俄四语言。

## 技术栈

Vue 3 + Vite + TypeScript · daisyUI 5 + Tailwind CSS 4 · vue-i18n · TanStack Vue Table · ECharts · Node + h3 · sql.js（SQLite）· pnpm workspace。

## 目录结构

```text
src/                      面板（Vue 3 SPA）
  views/ components/      页面与组件（节点、订阅、分流、连接、日志、设置…）
  store/ assembly/        跨页状态；把 API 组合成页面所需数据
  api/ composables/       Mihomo REST 封装；/api/control 客户端
  helper/                 KV 存储、面板会话、通知等
server/                   agent 宿主：静态资源 + /api/control + /api/mihomo 代理 + 数据目录锁
packages/agent/           控制服务库：supervisor、profiles、storage、session、geo、tun
packages/config-editor/   配置对象 ↔ YAML 的双向编辑内核
scripts/                  本地开发（同时拉起 Vite 与 agent 宿主）
```

## 快速开始

需要 Node.js 22+ 与 pnpm 11+。

```bash
pnpm install
pnpm dev
```

打开 `http://127.0.0.1:5173`。首次进入 `#/setup` 设置面板密码（同时是内核 API 的 secret）；若内核尚未下载，面板会直接落在设置页的内核管理卡片，在那里选镜像下载即可。

## 构建与运行

```bash
pnpm build          # 前端 → dist/
pnpm build:server   # agent 宿主 → dist-server/server.js
pnpm start          # 单进程提供页面 + /api/control + /api/mihomo
```

校验与测试：

```bash
pnpm type-check                          # vue-tsc 全量构建检查
pnpm lint                                # eslint（pre-commit 由 lint-staged 触发）
pnpm --filter @metacubexd/agent test     # agent 单元测试（vitest）
```

## Docker

```bash
docker compose up -d --build
```

或手工构建：

```bash
docker build -t qoqclashd:local .
docker run -d --name qoqclashd -p 8080:80 -p 7890:7890 \
  -v qoqclashd-data:/app/data -v qoqclashd-kernel:/app/kernel \
  qoqclashd:local
```

访问 `http://localhost:8080`。`data/` 与 `kernel/` 挂持久卷即可升级与备份；内核二进制不需要预先塞进镜像，面板会在容器内按需下载。

`-p 7890:7890` 只是把端口放出来：`allow-lan` 默认为 `false`，内核只绑容器内的 `127.0.0.1`，局域网设备连过来仍是 connection refused。要让其他设备用上代理，还得在「分流中心 - 主入口」里打开「允许区域网络」。

`.github/workflows/qoqclashd-docker.yml` 在 `master` 推送、打 `v*` 标签或手动触发时，构建 `linux/amd64` 与 `linux/arm64` 镜像并发布到 GHCR（使用仓库自带的 `GITHUB_TOKEN`，无需额外 secrets）。

## 配置与数据

| 路径                      | 内容                                                                 |
| ------------------------- | -------------------------------------------------------------------- |
| `data/qoqclashd.sqlite`   | 面板密码、订阅、节点池、代理组、规则、入口——所有可编辑配置的权威来源 |
| `data/config/active.yaml` | 由面板按 SQLite 合成、下发给内核的产物，不是编辑入口                 |
| `data/profiles/`          | 订阅原文与 profile 输入                                              |
| `kernel/`                 | mihomo 二进制与 GEO 库                                               |

运行时环境变量只有六个，且都有默认值，通常不需要设置：`PANEL_HOST` / `PANEL_PORT` / `QOQCLASHD_HOME` / `DATA_DIR` / `CORE_STORAGE_DIR` / `MIHOMO_BINARY`。完整模板见 [.env.example](.env.example)。内核 API 端口与面板密码不属于环境变量——前者在设置页改，后者在首屏创建，两者都存在 SQLite 里。

## 安全说明

- **面板密码就是内核 Clash API 的 secret**，两端共用一个值，只存在 `data/qoqclashd.sqlite` 里，没有任何环境变量可以预置它。浏览器只拿一张签名会话 cookie，登录态不依赖任何前端存储；`/api/control` 也只认这张 cookie。
- `data/`、`kernel/`、`.env` 以及任何日志/设计稿都写在 `.gitignore` 与 `.dockerignore` 中——SQLite 内含
  密码和订阅地址，不要提交，也不要带进镜像构建上下文。构建期注入前端的只有 `FONT` 一个变量。
- 裸机默认只监听 `127.0.0.1`。把面板暴露到公网时请自行加反代与 TLS；Clash API 端口（默认 9090）应保持仅容器/主机内部可达。
- 若同时跑两个后端实例，第二个会在启动时因抢不到 `data/server.lock` 直接退出——sql.js 整文件回写，双开会互相覆盖数据。
- 内核二进制有指纹账本（`kernel/kernel-sha256.json`）：首次下载记录可执行文件的 SHA-256，之后同一版本再下载必须一致，对不上就拒绝落盘。mihomo 官方 release 不提供校验文件，所以这防的是镜像站事后偷换，防不住首次下载——首次装完建议自行核对后端日志里打印的摘要。

界面与交互沿用 zashboard 的设计与代码基础，本项目在其上补齐内核托管、业务持久化与分流配置能力。

## 许可

MIT，见 [LICENSE](LICENSE)。
