import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Selects which fonts get bundled. One of:
//   all (default) | cdn | firasans | misans | pingfang | sarasa | none
// See src/assets/load-fonts.ts for what each value loads.
const font = process.env.FONT || 'all'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __FONT__: JSON.stringify(font),
  },
  base: './',
  server: {
    proxy: {
      '/api/control': {
        target: 'http://127.0.0.1:5174',
        changeOrigin: true,
        // 浏览器断开时 http-proxy 不会撤上游，面板刷一下页，agent 那趟长下载照样跑到底
        // —— 而 agent 判「面板已断开」靠的正是上游 socket 关闭。生产是同进程直挂，
        // 没这层代理，所以只有开发模式下需要补这一刀。
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, _req, res) => {
            res.once('close', () => {
              if (!res.writableEnded) proxyReq.destroy()
            })
          })
        },
      },
      '/api/mihomo': {
        target: 'http://127.0.0.1:5174',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-dark.svg'],
      workbox: {
        // The globe is lazy-loaded, but its local textures and bundled attribution must
        // remain available after the first PWA install/update for offline cache reuse.
        // 字体不在这份名单里：默认构建会切出 281 个 woff2 子集共 6.3MB，预缓存等于
        // 装机时全量拉一遍，而浏览器其实只会用到命中的那几个 unicode-range。
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,md}'],
        // The main chunk sits at ~1.75 MiB — under Workbox's 2 MiB default, but not
        // by enough to rely on. Keep the ceiling raised so it can't silently fall out
        // of the precache (and stop working offline) the next time it grows a little.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            // 首次用到才下载，之后离线可复用。
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: 'QoQClashD',
        short_name: 'QoQClashD',
        description: 'Mihomo 代理控制面板',
        theme_color: '#000000',
        icons: [
          {
            src: './pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: './pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: './pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: './pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
