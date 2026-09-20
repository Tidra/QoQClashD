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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp,jpg,md}'],
        // The main chunk sits at ~1.75 MiB — under Workbox's 2 MiB default, but not
        // by enough to rely on. Keep the ceiling raised so it can't silently fall out
        // of the precache (and stop working offline) the next time it grows a little.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
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
