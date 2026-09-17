// 应用环境变量集中管理。
//
// 构建时 Vite define 将 Docker/运行环境注入的变量（不带 VITE_ 前缀）打包进
// `__ENV__`。本模块在运行时读取 `__ENV__`，并暴露带默认值的解析结果，
// 供 store / api / 各 view 层使用。
//
// 约定：
// - 存储位置默认为**相对程序目录**（`./core`、`./data`）。
// - `API_SECRET` 是核心与面板**共用**的认证密钥；为空时面板首次进入需手动设置密码。

interface EnvConfig {
  /** 核心二进制存储位置（相对程序目录） */
  CORE_STORAGE_DIR: string
  /** 数据存储位置：配置、订阅、节点等（相对程序目录） */
  DATA_DIR: string
  /** 面板服务端口（Dockerfile 中 Caddy 监听端口） */
  PANEL_PORT: string
  /** Mihomo 核心 API 地址 */
  API_HOST: string
  /** 核心与面板共用的认证密钥（Bearer Token），空字符串表示未设置 */
  API_SECRET: string
}

declare const __ENV__: EnvConfig

const hasEnv = typeof __ENV__ !== 'undefined'

const env: EnvConfig = hasEnv
  ? __ENV__
  : {
      CORE_STORAGE_DIR: './core',
      DATA_DIR: './data',
      PANEL_PORT: '80',
      API_HOST: 'http://127.0.0.1:9090',
      API_SECRET: '',
    }

export const CORE_STORAGE_DIR = env.CORE_STORAGE_DIR
export const DATA_DIR = env.DATA_DIR
export const PANEL_PORT = env.PANEL_PORT
export const API_HOST = env.API_HOST
export const API_SECRET = env.API_SECRET

export default env
