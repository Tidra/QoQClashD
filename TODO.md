# QoQClashD 项目 TODO

## 已完成

- [x] 项目定位与目标确认：QoQClash 控制面板（英文名：QoQClashD）
- [x] 采用 Mihomo / Clash Premium 作为后端内核，前端基于 zashboard 衍生结构进行二次开发
- [x] 后端认证验证完成：使用正确 Bearer secret 可正常访问 Mihomo API
- [x] 真实 Mihomo 数据已接通：/version /proxies /rules /connections 均可返回有效数据
- [x] 侧边栏入口修复：概览、节点、连接、日志、分流中心、设置已恢复显示
- [x] 概览页已实现并可渲染：后端状态、内核版本、代理组数量、规则数、连接数
- [x] 节点页已接通真实代理组数据：可看到真实节点列表与代理组卡片
- [x] 页面无需继续停留在空白壳状态：当前已能显示真实 Mihomo 运行数据
- [x] 前端编译验证通过：`pnpm build` 已成功执行完成
- [x] 完成 Docker 持久化部署：QoQClashD 容器架构，配置与数据可独立持久化
- [x] 完成 docker-compose 示例与本地编译部署说明
- [x] 完成总览页更多功能：实时流量、活动连接、出口 IP、Geo 数据状态等
- [x] 完成日志页：实时日志、级别筛选、导出
- [x] 完成连接页：实时连接列表、筛选、断开连接
- [x] 完成配置页：Mihomo API、Secret、面板设置、核心管理、YAML 配置编辑
- [x] 完成配置页运行时目录展示：程序根目录、核心目录、配置目录、profiles 目录、active config 路径
- [x] 编写项目文档：架构说明、开发指南、部署指南、使用手册
- [x] 完成 GitHub Actions / 镜像自动构建与发布流程
- [x] 完成和核心脱离，用户设置密码，能直接登录 QoQClashD，即使还没有核心，用户可进入界面后点击下载核心并按用户配置允许
- [x] 配置页可配置 Mihomo 存储位置，改目录没有核心时，用户点击下载自动核心到目录中，点击启动核心则按照默认用户的配置yaml启动核心
- [x] 配置使用环境变量作为默认选项：CORE_STORAGE_DIR、DATA_DIR、PANEL_PORT、API_HOST、API_SECRET 五变量注入，核心与面板共用同一密钥，存储默认指向程序目录
- [x] 登录态持久化：面板密码存储于 localStorage，启动时若 API_SECRET 非空则作为默认面板密码，刷新后不再需要重复输入
- [x] 多订阅源配置管理：支持新增、编辑、删除、启用/禁用多个订阅链接，状态持久化于 localStorage
- [x] 订阅更新机制：手动单个更新、批量更新全部，更新状态（pending/ok/error）展示，base64 编码内容自动解码
- [x] 节点池管理：nodePool 存储支持多池合并、按池去重开关、手动插入/编辑/删除节点，可生成 selector 组
- [x] 节点分组功能：defaultGroups 存储支持默认区域分组（HK/JP/US）与自定义分组覆盖
- [x] 节点延迟测试：useLatency 组合式 API 提供单个/批量/分组延迟测试，按延迟排序，基于 Clash delay 端点
- [x] 默认代理组配置：HK/JP/US 三组默认，支持用户自定义覆盖

## 待办

- [x] 实现存储功能，使用 SQLite 数据库，把用户的所有配置、节点信息都存储在数据库中，且优先使用数据库中的配置，存储在 data 目录中（agent 启动后生效）
- [x] 完成节点编辑与删除的 UI：单个/批量节点管理界面（NodePoolPage.vue 已实现完整 CRUD）
- [x] 完成节点延迟测试与筛选/搜索的 UI 层集成（NodePoolPage 每节点测试按钮 + useLatency）
- [x] 完成分流中心：入站管理（InboundPanel）、规则管理（已有）、TUN 配置（BackendSettings + InboundPanel）
- [x] 实现双模式配置输入：表单模式 + YAML 模式双向同步（UpdateConfigModal）
- [x] 登录界面只保留输入密码和登录按钮就行了
- [x] 订阅和节点池合并到节点页，在节点页控制栏改为节点、节点组、订阅三个导航栏
- [x] 去除 localStorage，业务配置通过现有 agent 的 SQLite 后端存储，初始化时自动创建 data/qoqclashd.sqlite 和默认节点分组数据（生产同源部署）
- [x] 分流中心和节点页采用卡片化容器，支持快捷填写和表单/YAML 双模式编辑
- [x] 配置页补全核心配置、登录配置、应用端口、运行目录与后端核心下载/启动能力
- [x] 概览页“下载内核”按钮调用 agent 控制接口，将核心下载到 CORE_STORAGE_DIR；下载中防重复点击并在完成后刷新页面
- [x] 修复未检测到核心卡片的警告文字颜色，确保浅色主题下保持可读
- [x] 开发入口同时启动 Vite 与 unified server，并代理 `/api/control`、`/api/mihomo`，避免开发页面点击下载内核时出现 404
- [x] 节点页移除重复导航栏，节点组和订阅沿用统一节点页布局；“节点池”统一更名为“节点组”，并保留节点组/订阅新增按钮
- [x] 抽出统一节点页头部，节点组/订阅使用与节点一致的 sticky 控制栏；节点组头部补充新增节点入口
- [x] 修复节点组/订阅嵌套产生的重复头部和额外外层间距，确保每个节点子页面只渲染一个控制头部
- [x] 修复节点组 SQLite/agent storage 异步加载后节点列表仍停留为空的问题；移除节点页无用模式下拉框，将新增节点放回节点组内容区
- [x] 节点页改为展示共享节点数据并提供新增节点入口；节点组和节点页使用同一份 agent storage 数据，刷新后保持登录状态
- [x] 统一节点、节点组、订阅控制栏：左侧搜索、右侧图标操作、边框内容区；节点支持卡片/表格显示模式、节点设置和完整表头
- [x] 参照连接页统一节点导航的分段控件、卡片/表格内容容器、节点组与订阅的响应式卡片及表格模式

## 当前状态说明

目前前端界面已经完成“绑定核心登录 + agent SQLite 持久化接口 + 多订阅源管理 + 节点池/分组/延迟 + 分流中心双模式配置”。SQLite、核心下载和运行时配置接口要求 agent 与面板同源运行；仅启动 Vite 静态开发服务器时，控制接口不可用。

## 架构重构进度

- [x] 纳入 `packages/agent`、`packages/config-editor` workspace，并补齐 pnpm catalog
- [x] 增加统一 Node server 入口：前端静态资源、`/api/control/*` 和 Mihomo 生命周期
- [x] agent 支持由宿主显式传入 `runtimeRoot`、`dataDir` 等运行时配置
- [x] 增加同源 `/api/mihomo/*` REST 代理，浏览器不再直接暴露 Mihomo API 地址和 secret
- [x] 将前端从多后端 `backendList/activeBackend` 迁移为单 Mihomo 实例（store 已限制为单实例，旧管理 UI 保留为单配置兼容界面）
- [x] 删除浏览器端 sql.js 业务数据库，统一使用 agent SQLite
- [~] 统一 control client、类型契约、WebSocket/SSE 和错误处理（类型路径已修复，剩余旧 Vue 类型错误待单独整理）
- [x] 将 Docker Compose 和旧静态入口迁移到单入口 server
- [x] 将 config/profiles 收拢到 data，SQLite 作为结构化节点、规则和订阅配置的权威来源

当前推荐启动完整链路：

```bash
pnpm build
pnpm build:server
pnpm start
```

开发阶段仍可使用 `pnpm dev` 查看前端，但只有统一 server 才会同时提供 `/api/control` 和 `/api/mihomo`。
