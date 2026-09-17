/// <reference types="vite/client" />
interface Window {
  ksu?: object
}

declare const __ENV__: {
  CORE_STORAGE_DIR: string
  DATA_DIR: string
  PANEL_PORT: string
  API_HOST: string
  API_SECRET: string
}
