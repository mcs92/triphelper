import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/triphelper/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'triphelper — WMATA Bus & Metro Arrivals',
        short_name: 'triphelper',
        description: 'Real-time WMATA bus and Metro arrival predictions for Washington DC transit.',
        theme_color: '#22C55E',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.wmata\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wmata-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60,
              },
              networkTimeoutSeconds: 3,
            },
          },
          {
            urlPattern: /^https:\/\/gbfs\.lyft\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'gbfs-api',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 5 * 60,
              },
              networkTimeoutSeconds: 3,
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
