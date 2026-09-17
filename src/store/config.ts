import { CORE_STORAGE_DIR, DATA_DIR, PANEL_PORT } from '@/config/env'
import { useStorage } from '@/helper/storage'

// 集中管理用户可调的"服务端位置"配置。
// 默认值来自构建时注入的环境变量（__ENV__），用户改过后会持久化到 localStorage，
// 覆盖默认值。核心与面板共用同一密钥（见 helper/panelAuth.ts）。

export const coreStorageDir = useStorage<string>('config/core-storage-dir', CORE_STORAGE_DIR)
export const dataDir = useStorage<string>('config/data-dir', DATA_DIR)

// 面板端口由构建/部署决定，运行时只读展示（Caddy 监听端口）。
export const panelPort = PANEL_PORT
