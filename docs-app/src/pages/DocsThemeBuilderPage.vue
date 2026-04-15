<template>
  <div :class="bemm()">
    <section :class="bemm('hero')">
      <div :class="bemm('hero-copy')">
        <StatusBadge :label="t('docs.common.status.builder')" :tone="Status.SUCCESS" />
        <h1 :class="bemm('title')">{{ t('docs.themeBuilder.title') }}</h1>
        <p :class="bemm('summary')">{{ t('docs.themeBuilder.summary') }}</p>
      </div>

      <Card :class="bemm('preset-card')">
        <label :class="bemm('label')">
          <span>{{ t('docs.themeBuilder.preset') }}</span>
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
            {{ t('docs.common.actions.systemFonts') }}
          </Button>
          <Button variant="secondary" @click="resetTheme">
            {{ t('docs.common.actions.reset') }}
          </Button>
        </div>
      </Card>
    </section>

    <section :class="bemm('grid')">
      <Card :class="bemm('panel')">
        <header :class="bemm('panel-header')">
          <h2>{{ t('docs.themeBuilder.colors') }}</h2>
          <p>{{ t('docs.themeBuilder.colorsBody') }}</p>
        </header>

        <div :class="bemm('color-grid')">
          <ThemeColorField
            v-for="token in colorKeys"
            :key="token"
            :model-value="themeState.colors[token]"
            :label="token"
            @update:model-value="updateColor(token, $event)"
          />
        </div>
      </Card>

      <Card :class="bemm('panel')">
        <header :class="bemm('panel-header')">
          <h2>{{ t('docs.themeBuilder.fonts') }}</h2>
          <p>{{ t('docs.themeBuilder.fontsBody') }}</p>
        </header>

        <label :class="bemm('field')">
          <span>{{ t('docs.themeBuilder.presetStack') }}</span>
          <select @change="handleFontPresetChange">
            <option value="">{{ t('docs.common.actions.chooseFontPreset') }}</option>
            <option v-for="presetName in fontPresetNames" :key="presetName" :value="presetName">
              {{ presetName }}
            </option>
          </select>
        </label>

        <label :class="bemm('field')">
          <span>{{ t('docs.themeBuilder.body') }}</span>
          <textarea
            rows="3"
            :value="themeState.fonts.body"
            @input="updateFont('body', ($event.target as HTMLTextAreaElement).value)"
          />
        </label>

        <label :class="bemm('field')">
          <span>{{ t('docs.themeBuilder.heading') }}</span>
          <textarea
            rows="3"
            :value="themeState.fonts.heading"
            @input="updateFont('heading', ($event.target as HTMLTextAreaElement).value)"
          />
        </label>

        <label :class="bemm('field')">
          <span>{{ t('docs.themeBuilder.mono') }}</span>
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
        <div :class="bemm('panel-header-text')">
          <h2>{{ t('docs.themeBuilder.generatedConfig') }}</h2>
          <p>{{ t('docs.themeBuilder.configBody') }}</p>
        </div>
        <Button variant="ghost" size="small" @click="copyConfig">
          {{ copied ? 'Copied!' : 'Copy' }}
        </Button>
      </header>

      <div v-html="renderedThemeSnippet" />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import { Button } from '@ui-lib/components/Button'
import { Card } from '@ui-lib/components/Card'
import StatusBadge from '@ui-lib/components/StatusBadge/StatusBadge.vue'
import { Status } from '@ui-lib/types'
import ThemeColorField from '@ui-docs/components/ThemeColorField.vue'

import { renderCodeBlock } from '@ui-docs/lib/codeBlock'
import { useDocsTheme } from '@ui-docs/lib/docsTheme'

const bemm = useBemm('docs-theme-builder-page')
const { t } = useI18n()

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

const renderedThemeSnippet = computed(() => renderCodeBlock(themeSnippet.value, 'typescript'))

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

const copied = ref(false)

async function copyConfig() {
  await navigator.clipboard.writeText(themeSnippet.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
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
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;

    h2 {
      margin: 0;
    }
  }

  &__panel-header-text {
    display: grid;
    gap: 0.25rem;
  }

  &__color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
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

  &__preset-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

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

  textarea {
    resize: vertical;
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
