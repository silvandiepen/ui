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

    <section :class="bemm('colors-grid')">
      <Card :class="bemm('panel')">
        <header :class="bemm('panel-header')">
          <div :class="bemm('panel-header-text')">
            <h2>Palette</h2>
            <p>Named colors that your theme tokens pick from.</p>
          </div>
          <Button variant="ghost" size="small" @click="resetPalette">
            Reset
          </Button>
        </header>

        <PaletteBuilder
          :palette="palette"
          @add="addPaletteColor"
          @remove="removePaletteColor"
          @update="updatePaletteColor"
        />
      </Card>

      <Card :class="bemm('panel')">
        <header :class="bemm('panel-header')">
          <div :class="bemm('panel-header-text')">
            <h2>{{ t('docs.themeBuilder.colors') }}</h2>
            <p>Map semantic tokens to palette colors.</p>
          </div>
        </header>

        <div :class="bemm('color-grid')">
          <label
            v-for="token in colorKeys"
            :key="token"
            :class="bemm('color-field')"
          >
            <span :class="bemm('color-field-label')">{{ token }}</span>
            <ColorPickerPopup
              :model-value="themeState.colors[token]"
              :colors="paletteColorNames"
              @update:model-value="updateColor(token, $event)"
            />
          </label>
        </div>
      </Card>
    </section>

    <Card :class="bemm('panel')">
      <header :class="bemm('panel-header')">
        <div :class="bemm('panel-header-text')">
          <h2>{{ t('docs.themeBuilder.fonts') }}</h2>
          <p>{{ t('docs.themeBuilder.fontsBody') }}</p>
        </div>
      </header>

      <div :class="bemm('fonts-grid')">
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
            rows="2"
            :value="themeState.fonts.body"
            @input="updateFont('body', ($event.target as HTMLTextAreaElement).value)"
          />
        </label>

        <label :class="bemm('field')">
          <span>{{ t('docs.themeBuilder.heading') }}</span>
          <textarea
            rows="2"
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
      </div>
    </Card>

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
import { ColorPickerPopup } from '@ui-lib/components/Form/ColorPickerPopup'
import StatusBadge from '@ui-lib/components/StatusBadge/StatusBadge.vue'
import { Status } from '@ui-lib/types'
import PaletteBuilder from '@ui-docs/components/PaletteBuilder.vue'

import { renderCodeBlock } from '@ui-docs/lib/codeBlock'
import { useDocsTheme } from '@ui-docs/lib/docsTheme'

const bemm = useBemm('docs-theme-builder-page', { includeBaseClass: true })
const { t } = useI18n()

const {
  colorKeys,
  docsThemePresets,
  fontPresets,
  palette,
  addPaletteColor,
  removePaletteColor,
  resetPalette,
  resetTheme,
  setPreset,
  themeState,
  updateColor,
  updateFont,
  updatePaletteColor,
} = useDocsTheme()

const fontPresetNames = computed(() => Object.keys(fontPresets))
const paletteColorNames = computed(() => palette.value.map((entry) => entry.name))

const themeSnippet = computed(() => {
  const palettePart = palette.value.length
    ? `  palette: ${JSON.stringify(palette.value.map(c => ({ name: c.name, hex: c.hex })), null, 4).replace(/\n/g, '\n  ')},`
    : ''
  const colorsPart = `  colors: ${JSON.stringify(themeState.value.colors, null, 4).replace(/\n/g, '\n  ')},`
  const fontsPart = `  fonts: ${JSON.stringify(themeState.value.fonts, null, 4).replace(/\n/g, '\n  ')},`
  const parts = [palettePart, colorsPart, fontsPart].filter(Boolean)

  return `import { defineTheme } from '@sil/ui/vite'\n\nexport default defineTheme({\n${parts.join('\n')}\n})`
})

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
  gap: var(--space);
  padding: var(--spacing);

  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(18rem, 0.8fr);
    gap: var(--space);
  }

  &__hero-copy,
  &__preset-card,
  &__panel {
    display: grid;
    gap: var(--space-s);
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

  &__colors-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space);
  }

  &__fonts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: var(--space);
  }

  &__panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space);

    h2 {
      margin: 0;
    }
  }

  &__panel-header-text {
    display: grid;
    gap: var(--space-xs);
  }

  &__color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: var(--space-s);
  }

  &__color-field {
    display: grid;
    gap: var(--space-xs);
  }

  &__color-field-label {
    font-size: var(--font-size-s);
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    text-transform: capitalize;
  }

  &__field {
    display: grid;
    gap: var(--space-xs);

    span {
      font-size: var(--font-size-s);
      color: color-mix(in srgb, var(--color-foreground), transparent 32%);
    }
  }

  &__preset-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-s);
  }

  select,
  textarea {
    width: 100%;
    padding: var(--space-s) var(--space);
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
    &__colors-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
