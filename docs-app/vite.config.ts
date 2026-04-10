import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import { getUIAliases, ui } from '../src/vite'

export default defineConfig({
  root: __dirname,
  plugins: [
    vue(),
    ui(),
  ],
  resolve: {
    alias: {
      '@sil/ui': resolve(__dirname, '../src/index.ts'),
      '@ui-docs': resolve(__dirname, './src'),
      ...getUIAliases(),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 4173,
  },
})
