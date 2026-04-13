<template>
  <div :class="bemm()">
    <section :class="bemm('group')">
      <div :class="bemm('group-header')">
        <strong>Grouped popover</strong>
        <span>Nested locales with flags</span>
      </div>

      <LanguageSwitch
        v-model="groupedLocale"
        :options="groupedOptions"
        display-mode="label-code"
        title="Documentation language"
        trigger-label="Header"
      />
    </section>

    <section :class="bemm('group')">
      <div :class="bemm('group-header')">
        <strong>Context panel</strong>
        <span>Compact single-level list without flags</span>
      </div>

      <LanguageSwitch
        v-model="flatLocale"
        :options="flatOptions"
        :show-flags="false"
        surface="context-panel"
        title="Menu language"
        trigger-label="Context"
      />
    </section>

    <section :class="bemm('group')">
      <div :class="bemm('group-header')">
        <strong>Inline panel</strong>
        <span>Same option list ready to drop inside popup content</span>
      </div>

      <LanguageSwitch
        v-model="popupLocale"
        :options="groupedOptions"
        display-mode="label"
        surface="inline"
        title="Popup content"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import LanguageSwitch from './LanguageSwitch.vue'
import type { LanguageSwitchOption } from './LanguageSwitch.model'

const bemm = useBemm('language-switch-example')

const groupedLocale = ref('en-US')
const flatLocale = ref('nl')
const popupLocale = ref('en-GB')

const groupedOptions: LanguageSwitchOption[] = [
  {
    label: 'English',
    description: 'Base language with locale-specific variants.',
    children: [
      {
        value: 'en',
        label: 'English',
        code: 'EN',
        regionCode: 'GB',
        description: 'Base shared copy and fallback strings.',
      },
      {
        value: 'en-GB',
        label: 'English (United Kingdom)',
        regionCode: 'GB',
        description: 'Spelling and date formatting for the UK.',
      },
      {
        value: 'en-US',
        label: 'English (United States)',
        regionCode: 'US',
        description: 'US terminology and regional defaults.',
      },
      {
        value: 'en-AU',
        label: 'English (Australia)',
        regionCode: 'AU',
        description: 'Australian locale variation.',
      },
    ],
  },
  {
    value: 'nl',
    label: 'Nederlands',
    regionCode: 'NL',
    description: 'Single-level locale option with its own flag.',
  },
  {
    value: 'fr',
    label: 'Francais',
    regionCode: 'FR',
    description: 'Single-level locale option without nesting.',
  },
]

const flatOptions: LanguageSwitchOption[] = [
  {
    value: 'en',
    label: 'English',
    description: 'Default app language',
  },
  {
    value: 'nl',
    label: 'Nederlands',
    description: 'Dutch translation set',
  },
  {
    value: 'fr',
    label: 'Francais',
    description: 'French translation set',
  },
]
</script>

<style lang="scss">
.language-switch-example {
  display: grid;
  gap: 1rem;

  &__group {
    display: grid;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 1rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
  }

  &__group-header {
    display: grid;
    gap: 0.15rem;

    span {
      color: color-mix(in srgb, var(--color-foreground), transparent 34%);
      font-size: 0.9rem;
    }
  }
}
</style>
