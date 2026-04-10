import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vue', 'bemm', 'open-icon'],
  esbuildOptions(options) {
    options.alias = {
      '@': './src',
      '@components': './src/components',
      '@composables': './src/composables',
      '@utils': './src/utils',
      '@stores': './src/stores',
      '@types': './src/types'
    }
  }
})