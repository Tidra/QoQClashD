# QoQClashD 开发指南

## 1. 基础定位

当前仓库本质上是 zashboard 前端代码，适合作为 QoQClashD 的基础实现。开发 QoQClashD 时，推荐遵循这样的工作方式：

- 先理解 zashboard 的路由、状态管理和 UI 组件。
- 再在对应页面中扩展 Mihomo 相关能力。
- 最终通过 Docker 配置与 Compose 进行部署验证。

## 2. 适合的开发入口

常见入口文件包括：

- `src/router/`：页面路由和导航结构
- `src/components/`：卡片、表格、弹窗和控件
- `src/store/`：系统状态与跨页面数据
- `src/api/`：与 Clash / Mihomo API 的请求封装
- `src/views/`：具体页面内容

如果要做 QoQClashD 专属模块，推荐按以下方式组织：

- `src/pages/qoqclashd/`：新模块页面
- `src/components/qoqclashd/`：订阅、节点分组、规则卡片等组件
- `src/api/mihomo/`：接口封装（版本、配置、日志、连接、代理组）

## 3. 双模式配置设计建议

对于涉及 Mihomo 配置的卡片，建议统一使用 “表单模式 + YAML 模式” 两段式编辑器：

### 表单模式

适合普通用户：

- 文字输入框
- 下拉菜单
- 开关
- 数字/端口字段
- 常用对象字段分组

### YAML 模式

适合高级用户：

- 直接编辑配置片段
- 复制和粘贴已有配置
- 更灵活地处理复杂字段

### 双向同步

实现时建议建立统一的数据模型：

- 表单字段负责转换成对象结构
- YAML 编辑器负责解析/序列化对象
- 用户在任意一侧修改后，立即更新共享状态
- 提交前执行校验，确保 YAML 能被正确转换为对象

## 4. 订阅与节点管理的建议结构

### 订阅

每个订阅建议具备：

- `id`
- `name`
- `url`
- `enabled`
- `autoUpdate`
- `intervalHours`
- `lastUpdatedAt`
- `remark`

### 节点池

建议维护一个合并后的目录：

- `allNodes`
- `manualNodes`
- `subscribedNodes`
- `nodeGroups`

去重逻辑应基于 Mihomo 兼容的唯一键，例如：

- `name`
- `server`
- `port`

## 5. 分流中心模块设计

建议按模块分组：

- listeners
- rules
- sub-rules
- rule-providers
- tun settings

每个模块均可使用卡片 UI 包裹，并支持：

- 展开/收起
- 编辑
- 删除
- 批量操作
- 顺序调整

## 6. 默认规则集建议

首次启动时，可以自动生成一批默认规则：

- 广告过滤规则集
- 局域网 IP 直连
- 国内 IP 直连
- 默认节点选择组兜底

在 UI 中保留“启用/禁用”和“调整顺序”的能力，确保规则管理不会沦为只读状态。

## 7. 真实 API 设计建议

与 Mihomo 交互时优先遵循以下能力：

- `GET /version`
- `GET /proxies`
- `GET /configs`
- `PUT /configs`
- `GET /connections`
- `GET /logs`
- `GET /traffic`

如果要做延迟测试、切换代理节点、重启内核等能力，则需结合 Mihomo 支持的接口进行实现。

## 8. 最佳实践

- 先让 UI 在 zashboard 的风格上保持稳定，再做功能层扩展。
- 所有与 Mihomo 配置有关的逻辑统一走 `api` 层，不直接写进页面组件。
- 为所有复杂配置增加表单和 YAML 两种编辑入口。
- 保持配置对象结构清晰，便于 YAML 转表单与表单转 YAML。

## 9. 下一步建议

推荐下一步开发顺序：

1. 完成 Mihomo API 基础封装
2. 实现订阅管理卡片和列表
3. 实现默认节点分组和节点池合并
4. 实现规则页面与 listeners 管理
5. 完成日志与连接面板
6. 接入 Docker Compose 和 GHCR 发布流程

## 10. 结论

QoQClashD 的实现重点并非从零重做一套前端，而是“在 zashboard 的优质 UI 基础上，将其变为适用于 Mihomo 代理控制的配置管理平台”。这能最小化开发成本，并最大化 UI 一致性和生产可用性。
