<template>
  <div :class="bemm()">
    <section :class="bemm('group')">
      <div :class="bemm('group-header')">
        <strong>Default switcher</strong>
        <span>Shows locale codes and reveals variants after the base locale is selected</span>
      </div>

      <LanguageSwitch
        v-model="groupedLocale"
        :options="groupedOptions"
        title="Documentation language"
      />
    </section>

    <section :class="bemm('group')">
      <div :class="bemm('group-header')">
        <strong>Simple mode</strong>
        <span>Uses DropdownMenu and lists language names only</span>
      </div>

      <LanguageSwitch
        v-model="flatLocale"
        :options="flatOptions"
        mode="simple"
        title="Menu language"
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
    children: [
      {
        value: 'en',
        label: 'English',
        regionCode: 'GB',
      },
      {
        value: 'en-GB',
        label: 'English (United Kingdom)',
        regionCode: 'GB',
      },
      {
        value: 'en-US',
        label: 'English (United States)',
        regionCode: 'US',
      },
      {
        value: 'en-AU',
        label: 'English (Australia)',
        regionCode: 'AU',
      },
    ],
  },
  {
    value: 'nl',
    label: 'Nederlands',
    regionCode: 'NL',
  },
  {
    value: 'fr',
    label: 'Francais',
    regionCode: 'FR',
  },
]

const flatOptions: LanguageSwitchOption[] = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'nl',
    label: 'Nederlands',
  },
  {
    value: 'fr',
    label: 'Francais',
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
