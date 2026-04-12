<template>
  <Container :class="bemm()">
    <section :class="bemm('hero')">
      <div :class="bemm('hero-copy')">
        <StatusBadge label="Guide" tone="accent" />
        <h1 :class="bemm('title')">Use `@sil/ui` in a Vite project</h1>
        <p :class="bemm('summary')">
          The shared Vite plugin injects the UI theme layer and shared global styles.
          Add the plugin, wire the aliases, then define colors and fonts through one theme config.
        </p>
      </div>
      <Card :class="bemm('callout')">
        <strong>What this gives you</strong>
        <p>
          Shared CSS variables, generated contrast tokens, consistent font globals,
          and the same component aliases the docs app uses internally.
        </p>
      </Card>
    </section>

    <section :class="bemm('grid')">
      <Card :class="bemm('panel')">
        <h2>1. Install</h2>
        <pre><code>npm install @sil/ui</code></pre>
      </Card>

      <Card :class="bemm('panel')">
        <h2>2. Add the Vite plugin</h2>
        <pre><code>{{ viteConfigSnippet }}</code></pre>
      </Card>

      <Card :class="bemm('panel')">
        <h2>3. Import components</h2>
        <pre><code>{{ componentSnippet }}</code></pre>
      </Card>

      <Card :class="bemm('panel')">
        <h2>Theme config shape</h2>
        <pre><code>{{ themeShapeSnippet }}</code></pre>
      </Card>
    </section>

    <section :class="bemm('tokens')">
      <Card :class="bemm('panel')">
        <h2>Color tokens</h2>
        <p>
          Define only the tokens you want to override. The theme builder fills in the rest from the shared defaults.
        </p>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Default</th>
              <th>Generated helpers</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="token in colorRows" :key="token.name">
              <td><code>{{ token.name }}</code></td>
              <td><code>{{ token.value }}</code></td>
              <td><code>--color-{{ token.name }}-text</code>, <code>-contrast</code>, <code>-light</code>, <code>-dark</code></td>
            </tr>
          </tbody>
        </table>
      </Card>

      <Card :class="bemm('panel')">
        <h2>Font tokens</h2>
        <p>
          No fonts are loaded by default. The library ships with system stacks only.
          If you want custom families, load them in your app and set them through the theme config.
        </p>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Generated CSS variable</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="font in fontRows" :key="font.key">
              <td><code>{{ font.key }}</code></td>
              <td><code>{{ font.variable }}</code></td>
              <td>{{ font.value }}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
  </Container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'

import { Card } from '@ui-lib/components/Card'
import { Container } from '@ui-lib/components/Container'
import StatusBadge from '@ui-lib/components/StatusBadge/StatusBadge.vue'
import { DEFAULT_THEME_COLORS, DEFAULT_THEME_FONTS } from '@ui-lib/vite/theme'

const bemm = useBemm('docs-getting-started-page')

const colorRows = computed(() =>
  Object.entries(DEFAULT_THEME_COLORS).map(([name, value]) => ({ name, value }))
)

const fontRows = computed(() => [
  {
    key: 'fonts.body',
    variable: '--font-family / --font-family-body',
    value: DEFAULT_THEME_FONTS.body,
  },
  {
    key: 'fonts.heading',
    variable: '--font-family-heading',
    value: DEFAULT_THEME_FONTS.heading,
  },
  {
    key: 'fonts.mono',
    variable: '--font-family-mono / --font-family-monospace',
    value: DEFAULT_THEME_FONTS.mono,
  },
])

const viteConfigSnippet = `import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { defineTheme, getUIAliases, ui } from '@sil/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      theme: defineTheme({
        colors: {
          primary: '#4fb36e',
          secondary: '#0ea5a4',
          tertiary: '#2563eb',
        },
        fonts: {
          body: '"Inter", system-ui, sans-serif',
          heading: '"Manrope", system-ui, sans-serif',
        },
      }),
    }),
  ],
  resolve: {
    alias: {
      ...getUIAliases(),
    },
  },
})`

const componentSnippet = `import { createApp } from 'vue'
import App from './App.vue'
import { UIButton, UICard, UIToast } from '@sil/ui'

createApp(App).mount('#app')`

const themeShapeSnippet = `defineTheme({
  colors: {
    primary: '#4fb36e',
    secondary: '#0ea5a4',
    dark: '#101826',
    light: '#f8fafc',
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: '"Manrope", system-ui, sans-serif',
    mono: '"SF Mono", Consolas, monospace',
  },
  variables: {
    'border-radius': '0.5rem',
    space: '1rem',
  },
})`
</script>

<style lang="scss">
.docs-getting-started-page {
  display: grid;
  gap: 1.5rem;
  padding: 2rem;

  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(18rem, 0.9fr);
    gap: 1rem;
  }

  &__hero-copy,
  &__callout,
  &__panel {
    display: grid;
    gap: 0.75rem;
  }

  &__title {
    margin: 0;
    font-size: clamp(2.1rem, 4.8vw, 3.5rem);
    line-height: 0.95;
  }

  &__summary,
  &__callout p,
  &__panel p {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
    line-height: 1.6;
  }

  &__grid,
  &__tokens {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(21rem, 1fr));
    gap: 1rem;
  }

  pre {
    margin: 0;
    overflow: auto;
    padding: 1rem;
    border-radius: var(--border-radius-l);
    background: color-mix(in srgb, var(--color-foreground), transparent 96%);
  }

  code {
    font-family: var(--font-family-mono);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.75rem;
    border-top: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    text-align: left;
    vertical-align: top;
  }

  thead th {
    border-top: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    font-size: var(--font-size-s);
    letter-spacing: 0.04em;
  }

  @media (max-width: 960px) {
    &__hero {
      grid-template-columns: 1fr;
    }
  }
}
</style>
