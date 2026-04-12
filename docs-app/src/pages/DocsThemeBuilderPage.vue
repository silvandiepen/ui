<template>
  <Container :class="bemm()">
    <section :class="bemm('hero')">
      <div :class="bemm('hero-copy')">
        <StatusBadge label="Builder" tone="success" />
        <h1 :class="bemm('title')">Theme builder</h1>
        <p :class="bemm('summary')">
          Edit the live docs theme, try font stacks, and copy the generated `defineTheme(...)`
          config straight into your Vite setup.
        </p>
      </div>

      <Card :class="bemm('preset-card')">
        <label :class="bemm('label')">
          <span>Preset</span>
          <select :value="themeState.presetId" @change="handlePresetChange">
            <option
              v-for="(preset, presetId) in docsThemePresets"
              :key="presetId"
              :value="presetId"
            >
              {{ preset.label }}
            </option>
          </select>
        </label>

        <div :class="bemm('preset-actions')">
          <Button variant="secondary" @click="applyFontPreset('system')">
            System fonts
          </Button>
          <Button variant="secondary" @click="resetTheme">
            Reset
          </Button>
        </div>
      </Card>
    </section>

    <section :class="bemm('grid')">
      <Card :class="bemm('panel')">
        <header :class="bemm('panel-header')">
          <h2>Colors</h2>
          <p>These values are applied to the docs app immediately.</p>
        </header>

        <div :class="bemm('color-grid')">
          <label
            v-for="token in colorKeys"
            :key="token"
            :class="bemm('field')"
          >
            <span>{{ token }}</span>
            <div :class="bemm('color-input')">
              <input
                :value="themeState.colors[token]"
                type="color"
                @input="updateColor(token, ($event.target as HTMLInputElement).value)"
              />
              <input
                :value="themeState.colors[token]"
                type="text"
                @input="updateColor(token, ($event.target as HTMLInputElement).value)"
              />
            </div>
          </label>
        </div>
      </Card>

      <Card :class="bemm('panel')">
        <header :class="bemm('panel-header')">
          <h2>Fonts</h2>
          <p>Custom families are opt-in only. Load any external fonts yourself in your app.</p>
        </header>

        <label :class="bemm('field')">
          <span>Preset stack</span>
          <select @change="handleFontPresetChange">
            <option value="">Choose a font preset</option>
            <option v-for="presetName in fontPresetNames" :key="presetName" :value="presetName">
              {{ presetName }}
            </option>
          </select>
        </label>

        <label :class="bemm('field')">
          <span>Body</span>
          <textarea
            rows="3"
            :value="themeState.fonts.body"
            @input="updateFont('body', ($event.target as HTMLTextAreaElement).value)"
          />
        </label>

        <label :class="bemm('field')">
          <span>Heading</span>
          <textarea
            rows="3"
            :value="themeState.fonts.heading"
            @input="updateFont('heading', ($event.target as HTMLTextAreaElement).value)"
          />
        </label>

        <label :class="bemm('field')">
          <span>Mono</span>
          <textarea
            rows="2"
            :value="themeState.fonts.mono"
            @input="updateFont('mono', ($event.target as HTMLTextAreaElement).value)"
          />
        </label>
      </Card>
    </section>

    <Card :class="bemm('panel')">
      <header :class="bemm('panel-header')">
        <h2>Generated config</h2>
        <p>Paste this into `ui({ theme: defineTheme(...) })`.</p>
      </header>

      <pre><code>{{ themeSnippet }}</code></pre>
    </Card>
  </Container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'

import { Button } from '@ui-lib/components/Button'
import { Card } from '@ui-lib/components/Card'
import { Container } from '@ui-lib/components/Container'
import StatusBadge from '@ui-lib/components/StatusBadge/StatusBadge.vue'

import { useDocsTheme } from '@ui-docs/lib/docsTheme'

const bemm = useBemm('docs-theme-builder-page')

const {
  colorKeys,
  docsThemePresets,
  fontPresets,
  resetTheme,
  setPreset,
  themeState,
  updateColor,
  updateFont,
} = useDocsTheme()

const fontPresetNames = computed(() => Object.keys(fontPresets))

const themeSnippet = computed(() => `defineTheme({
  colors: ${JSON.stringify(themeState.value.colors, null, 2)},
  fonts: ${JSON.stringify(themeState.value.fonts, null, 2)},
})`)

function handlePresetChange(event: Event) {
  const presetId = (event.target as HTMLSelectElement).value as keyof typeof docsThemePresets
  setPreset(presetId)
}

function handleFontPresetChange(event: Event) {
  const presetName = (event.target as HTMLSelectElement).value

  if (!presetName || !fontPresets[presetName]) {
    return
  }

  const preset = fontPresets[presetName]
  updateFont('body', preset.body)
  updateFont('heading', preset.heading)
  updateFont('mono', preset.mono)
}

function applyFontPreset(presetName: keyof typeof fontPresets) {
  const preset = fontPresets[presetName]
  updateFont('body', preset.body)
  updateFont('heading', preset.heading)
  updateFont('mono', preset.mono)
}
</script>

<style lang="scss">
.docs-theme-builder-page {
  display: grid;
  gap: 1rem;
  padding: 2rem;

  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(18rem, 0.8fr);
    gap: 1rem;
  }

  &__hero-copy,
  &__preset-card,
  &__panel {
    display: grid;
    gap: 0.85rem;
  }

  &__title {
    margin: 0;
    font-size: clamp(2rem, 4.2vw, 3.25rem);
    line-height: 0.96;
  }

  &__summary,
  &__panel-header p {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
    line-height: 1.6;
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 1fr);
    gap: 1rem;
  }

  &__panel-header {
    display: grid;
    gap: 0.25rem;

    h2 {
      margin: 0;
    }
  }

  &__color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 0.85rem;
  }

  &__field {
    display: grid;
    gap: 0.4rem;

    span {
      font-size: var(--font-size-s);
      color: color-mix(in srgb, var(--color-foreground), transparent 32%);
    }
  }

  &__color-input {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr);
    gap: 0.5rem;
  }

  &__preset-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.7rem 0.85rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 84%);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
    color: var(--color-foreground);
    font: inherit;
    box-sizing: border-box;
  }

  input[type='color'] {
    padding: 0.2rem;
    min-height: 2.8rem;
  }

  textarea {
    resize: vertical;
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

  @media (max-width: 960px) {
    &__hero,
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
