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
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components/ui': resolve(__dirname, './src/components'),
      '@/common': resolve(__dirname, './src/common'),
      '@/constants': resolve(__dirname, './src/constants'),
      '@/mixins': resolve(__dirname, './src/mixins'),
      '@components': resolve(__dirname, './src/components'),
      '@composables': resolve(__dirname, './src/composables'),
      '@utils': resolve(__dirname, './src/utils'),
      '@stores': resolve(__dirname, './src/stores'),
      '@types': resolve(__dirname, './src/types')
    }
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
    environment: 'jsdom',
    globals: true,
  },
})
