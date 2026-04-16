import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.test.ts',
        'src/**/*.stories.ts'
      ]
    })
  ],
  resolve: {
    alias: [
      { find: '@/components/ui', replacement: resolve(__dirname, './src/components') },
      { find: '@/common', replacement: resolve(__dirname, './src/common') },
      { find: '@/constants', replacement: resolve(__dirname, './src/constants') },
      { find: '@/mixins', replacement: resolve(__dirname, './src/mixins') },
      { find: '@components', replacement: resolve(__dirname, './src/components') },
      { find: '@composables', replacement: resolve(__dirname, './src/composables') },
      { find: '@utils', replacement: resolve(__dirname, './src/utils') },
      { find: '@stores', replacement: resolve(__dirname, './src/stores') },
      { find: '@types', replacement: resolve(__dirname, './src/types') },
      { find: '@', replacement: resolve(__dirname, './src') },
    ]
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SilUI',
      fileName: 'sil-ui'
    },
    rollupOptions: {
      external: ['vue', 'bemm', 'open-icon'],
      output: {
        globals: {
          vue: 'Vue',
          bemm: 'bemm',
          'open-icon': 'openIcon'
        },
        // Ensure CSS is extracted
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name
        }
      }
    },
    // Extract CSS to separate file
    cssCodeSplit: false
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  test: {
    globals: true,
    environmentMatchGlobs: [
      ['src/components/**/*.{test,spec}.ts', 'jsdom'],
      ['**/*.spec.ts', 'jsdom'],
      ['**/*.test.ts', 'node'],
    ],
  },
})
