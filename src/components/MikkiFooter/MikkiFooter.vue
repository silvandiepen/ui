<script setup lang="ts">
import { computed, h } from 'vue'
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch.vue'
import { popupService } from '../Feedback/Popup'
import type { LanguageSwitchOption } from '../LanguageSwitch/LanguageSwitch.model'
import type { MikkiFooterProps } from './MikkiFooter.model'

const props = withDefaults(defineProps<MikkiFooterProps>(), {
  note: '',
  links: () => [],
  locale: 'en',
  localeOptions: () => [],
  copyrightHolder: 'Hakobs',
  copyrightUrl: 'https://hakobs.com',
  showLocale: true,
})

const emit = defineEmits<{
  'locale-change': [locale: string]
}>()

const currentLocaleName = computed(() => {
  const match = props.localeOptions.find((l: LanguageSwitchOption) => l.value === props.locale)
  return match?.label ?? props.locale.toUpperCase()
})

function openLocalePopup() {
  popupService.showPopup({
    title: 'Language',
    component: undefined,
    slots: {
      default: () => [
        h(LanguageSwitch, {
          modelValue: props.locale,
          options: props.localeOptions,
          surface: 'inline',
          displayMode: 'label',
          filterable: props.localeOptions.length > 5,
          showFlags: true,
          showNativeNames: false,
          showSelectionIndicator: true,
          'onUpdate:modelValue': (val: string) => {},
          onSelect: (option: LanguageSwitchOption) => {
            if (option.value) {
              emit('locale-change', option.value)
              setTimeout(() => popupService.close(), 100)
            }
          },
        }),
      ],
    },
    actions: [
      { id: 'cancel', label: 'Cancel', action: () => popupService.close() },
    ],
    config: { position: 'center', canClose: true },
  })
}
</script>

<template>
  <span v-if="note" class="ikki-app-shell__footer-note">{{ note }}</span>
  <span v-if="note" class="ikki-app-shell__footer-sep">–</span>

  <template v-for="(link, i) in links" :key="i">
    <RouterLink
      v-if="link.to"
      class="ikki-app-shell__footer-link"
      :to="link.to"
    >
      {{ link.label }}
    </RouterLink>
    <a
      v-else-if="link.href"
      class="ikki-app-shell__footer-link"
      :href="link.href"
      target="_blank"
      rel="noopener"
    >
      {{ link.label }}
    </a>
    <span class="ikki-app-shell__footer-sep">–</span>
  </template>

  <span
    v-if="showLocale && localeOptions.length > 1"
    class="ikki-app-shell__footer-link ikki-app-shell__footer-locale"
    role="button"
    tabindex="0"
    @click="openLocalePopup"
    @keydown.enter="openLocalePopup"
  >{{ currentLocaleName }}</span>
  <span v-if="showLocale && localeOptions.length > 1" class="ikki-app-shell__footer-sep">–</span>

  <span class="ikki-app-shell__footer-copy">
    © {{ new Date().getFullYear() }}
    <a class="ikki-app-shell__footer-link" :href="copyrightUrl" target="_blank" rel="noopener">{{ copyrightHolder }}</a>
  </span>
</template>

<style lang="scss">
.ikki-app-shell__footer-locale {
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}
</style>
