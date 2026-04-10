<template>
  <Button
    v-if="!customTrigger"
    :variant="variant"
    :size="size"
    @click="openLanguageModal"
    :class="bemm('trigger')"
  >
    <template v-if="showGlobe">
      <Icon name="globe" :class="bemm('icon')" />
    </template>
    <template v-if="!hideFlag">
      <img
        v-if="currentLanguageFlagUrl"
        :src="currentLanguageFlagUrl"
        :alt="`${currentLanguageData?.name || 'Language'} flag`"
        :class="bemm('flag')"
        @error="onFlagError"
      />
      <span v-else :class="bemm('flag-emoji')">{{ currentLanguageData?.flag || '🌐' }}</span>
    </template>
    <span :class="bemm('code')">{{ displayFormat === 'code' ? (baseLanguageCode || 'EN').toUpperCase() : (currentLanguageData?.name || 'English') }}</span>
    <!-- Debug: {{ currentLanguage }} / {{ baseLanguageCode }} -->
  </Button>
  <button
    v-else
    @click="openLanguageModal"
    :class="customTriggerClass"
    :aria-label="ariaLabel"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useBemm } from 'bemm'
import { SUPPORTED_LANGUAGES, getLanguageByCode, getFlagUrl } from '@lezu/core'
import { Button, ButtonVariant, ButtonSize } from '../Button'
import Icon from '../Icon/Icon.vue'
import LanguageSwitcherModal from './LanguageSwitcherModal.vue'
import type { PopupService } from '../Feedback/Popup/Popup.service'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  modelValue?: string
  customTrigger?: boolean
  customTriggerClass?: string
  ariaLabel?: string
  showGlobe?: boolean
  hideFlag?: boolean
  displayFormat?: 'code' | 'name'
}

const props = withDefaults(defineProps<Props>(), {
  variant: ButtonVariant.GHOST,
  size: ButtonSize.SMALL,
  customTrigger: false,
  showGlobe: false,
  hideFlag: false,
  displayFormat: 'code'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { bemm } = useBemm('language-switcher')
const popupService = inject<PopupService>('popupService')!
const flagError = ref(false)

const currentLanguage = computed(() => props.modelValue || 'en')

// Extract base language code from locale codes (e.g., "en-US" -> "en")
const baseLanguageCode = computed(() => {
  const code = currentLanguage.value
  if (!code) return 'en'

  // If it's a pseudo language (e.g., "en-pirate"), extract the base language
  if (code.includes('-')) {
    return code.split('-')[0]
  }

  return code
})

const currentLanguageData = computed(() =>
  getLanguageByCode(baseLanguageCode.value) || SUPPORTED_LANGUAGES[0]
)

const currentLanguageFlagUrl = computed(() => {
  if (flagError.value) return null

  // Use the same logic as the modal for locale-specific flags
  return getLocaleFlagUrl(currentLanguage.value) || getFlagUrl(baseLanguageCode.value)
})

// Helper function to get SVG flag URL for locale codes (same as in modal)
const getLocaleFlagUrl = (localeCode: string): string | null => {
  // First try the base getFlagUrl function for the full locale code
  const baseFlag = getFlagUrl(localeCode)
  if (baseFlag) return baseFlag

  // If no base flag, try extracting the region code for locale-specific flags
  const [, regionCode] = localeCode.split('-')
  if (!regionCode) return null

  // For region codes, directly construct the URL instead of using getFlagUrl
  // This avoids conflicts like 'cy' being mapped to Welsh instead of Cyprus
  const regionCodeLower = regionCode.toLowerCase()

  // Directly construct URL for region codes from flag-icons library
  const regionFlagUrl = `https://unpkg.com/flag-icons@7.5.0/flags/4x3/${regionCodeLower}.svg`
  return regionFlagUrl
}

const openLanguageModal = () => {
  popupService.showPopup({
    component: LanguageSwitcherModal,
    props: {
      modelValue: currentLanguage.value,
      'onUpdate:modelValue': (value: string) => {
        emit('update:modelValue', value)
      }
    },
    config: {
      width: 'auto',
      position: 'center'
    }
  })
}

// Reset flag error when language changes
watch(currentLanguage, () => {
  flagError.value = false
})

const onFlagError = () => {
  flagError.value = true
}
</script>

<style lang="scss">
.language-switcher {
  border: 1px solid red;

  &__trigger {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  &__flag {
    width: 1.5em;
    height: 1.125em; // 4:3 aspect ratio
    border-radius: 2px;
    object-fit: cover;
  }

  &__flag-emoji {
    font-size: 1.2em;
  }

  &__code {
    text-transform: uppercase;
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-semibold);
  }
}
</style>
