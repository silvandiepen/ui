import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

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
    // Only build type declarations via vite-plugin-dts.
    // Component source (.vue + .ts) is shipped as-is —
    // consuming projects compile it through Vite with theme SCSS vars injected by ui().
    outDir: 'dist',
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/vite/index.js'),
      formats: ['es'],
      fileName: () => 'vite/index.js',
    },
    rollupOptions: {
      external: ['node:url', 'node:fs', 'node:crypto', 'node:path'],
    },
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
    environment: 'node',
    exclude: [
      'src/components/**/!(FormConfig)*.{spec,test}.ts',
      'node_modules',
      'dist',
    ],
  },
})
