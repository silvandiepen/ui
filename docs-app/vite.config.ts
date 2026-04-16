import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import { getUIAliases, ui } from '../src/vite'
import { generateAiDocs } from './src/vite/generateAiDocs'

export default defineConfig({
  root: __dirname,
  plugins: [
    vue(),
    ui(),
    generateAiDocs(),
  ],
  resolve: {
    alias: {
      '@sil/ui': resolve(__dirname, '../src/index.ts'),
      '@ui-lib': resolve(__dirname, '../src'),
      '@ui-docs': resolve(__dirname, './src'),
      ...getUIAliases(),
    },
  },
  optimizeDeps: {
    exclude: ['fsevents'],
  },
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/open-icon')) {
            return 'open-icon'
          }

          if (id.includes('node_modules')) {
            return 'vendor'
          }

          if (id.includes('/src/components/')) {
            return 'ui-components'
          }

          return undefined
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: 4173,
  },
})
