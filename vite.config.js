import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: { port: 3000 },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['icons/app-icon.svg', 'icons/app-icon-maskable.svg'],
      manifest: {
        name: 'SDG ValuEdge',
        short_name: 'ValuEdge',
        description: 'Property valuation portal for clients and banking partners.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f7f2e8',
        theme_color: '#123635',
        lang: 'en',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'icons/app-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/app-icon-maskable.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
