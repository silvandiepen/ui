import { mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { build } from 'vite'
import { afterEach, describe, expect, it } from 'vitest'

import { ui } from './index'

const fixtureRoots: string[] = []
const require = createRequire(import.meta.url)
const vueRuntimePath = require.resolve('vue/dist/vue.runtime.esm-bundler.js')

describe('ui vite plugin integration', () => {
  afterEach(async () => {
    await Promise.all(fixtureRoots.splice(0).map((root) => rm(root, { force: true, recursive: true })))
  })

  it('injects themed shared styles into a Vue/Vite build', async () => {
    const root = await createVueFixture()
    const outDir = join(root, 'dist')

    await build({
      build: {
        cssCodeSplit: false,
        emptyOutDir: true,
        outDir,
        rollupOptions: {
          output: {
            assetFileNames: 'assets/[name][extname]',
            entryFileNames: 'assets/[name].js',
          },
        },
      },
      configFile: false,
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
          },
        },
      },
      logLevel: 'silent',
      plugins: [
        vue(),
        ui({
          theme: {
            colors: {
              dark: '#090b11',
              light: '#fbfaf7',
              primary: '#123456',
              secondary: '#abcdef',
            },
            fonts: {
              body: '"Fixture Sans", system-ui, sans-serif',
              heading: '"Fixture Display", system-ui, sans-serif',
            },
            variables: {
              'border-radius': '0.875rem',
            },
          },
        }),
      ],
      resolve: {
        alias: {
          vue: vueRuntimePath,
        },
      },
      root,
    })

    const html = await readFile(join(outDir, 'index.html'), 'utf8')
    const css = await readCssAsset(outDir)

    expect(html).toContain('assets/index.js')
    expect(css).toMatch(/--font-family:\s*"Fixture Sans", system-ui, sans-serif/)
    expect(css).toMatch(/--font-family-heading:\s*"Fixture Display", system-ui, sans-serif/)
    expect(css).toMatch(/--color-primary:\s*#123456/)
    expect(css).toContain('--color-primary-contrast:')
    expect(css).toMatch(/--border-radius:\s*0?\.875rem/)
    expect(css).toContain('.button')
  })

  it('can emit only the theme variables when shared styles are disabled', async () => {
    const root = await createVueFixture()
    const outDir = join(root, 'dist')

    await build({
      build: {
        cssCodeSplit: false,
        emptyOutDir: true,
        outDir,
        rollupOptions: {
          output: {
            assetFileNames: 'assets/[name][extname]',
            entryFileNames: 'assets/[name].js',
          },
        },
      },
      configFile: false,
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
          },
        },
      },
      logLevel: 'silent',
      plugins: [
        vue(),
        ui({
          injectSharedStyles: false,
          theme: {
            colors: {
              primary: '#654321',
            },
          },
        }),
      ],
      resolve: {
        alias: {
          vue: vueRuntimePath,
        },
      },
      root,
    })

    const css = await readCssAsset(outDir)

    expect(css).toMatch(/--color-primary:\s*#654321/)
    expect(css).not.toContain('.button')
  })
})

async function createVueFixture() {
  const root = await mkdtemp(join(await realpath(tmpdir()), 'sil-ui-vite-plugin-'))
  fixtureRoots.push(root)

  await writeFile(
    join(root, 'index.html'),
    [
      '<!doctype html>',
      '<html>',
      '  <head><title>sil-ui vite fixture</title></head>',
      '  <body>',
      '    <div id="app"></div>',
      '    <script type="module" src="/src/main.ts"></script>',
      '  </body>',
      '</html>',
    ].join('\n'),
  )

  await writeFixtureSource(root)

  return root
}

async function readCssAsset(outDir: string) {
  const assets = await readdir(join(outDir, 'assets'))
  const cssAsset = assets.find((asset) => asset.endsWith('.css'))

  if (!cssAsset) {
    const html = await readFile(join(outDir, 'index.html'), 'utf8')
    throw new Error(`Expected Vite build to emit a CSS asset in ${join(outDir, 'assets')}. Assets: ${assets.join(', ')}. HTML: ${html}`)
  }

  return readFile(join(outDir, 'assets', cssAsset), 'utf8')
}

async function writeFixtureSource(root: string) {
  const sourceRoot = join(root, 'src')
  await mkdir(sourceRoot)

  await writeFile(
    join(sourceRoot, 'main.ts'),
    [
      "import { createApp } from 'vue'",
      "import App from './App.vue'",
      '',
      "createApp(App).mount('#app')",
    ].join('\n'),
  )

  await writeFile(
    join(sourceRoot, 'App.vue'),
    [
      '<template>',
      '  <button class="button">Themed action</button>',
      '</template>',
    ].join('\n'),
  )
}
