<template>
  <div :class="bemm()">
    <!-- Header with back button for locale selection -->
    <div :class="bemm('header')">
      <button
        v-if="selectedBaseLanguage"
        :class="bemm('back-button')"
        @click="goBackToLanguages"
      >
        <Icon name="arrow-left" />
        Back
      </button>
      <h3 :class="bemm('title')">
        {{ selectedBaseLanguage ? `Select ${selectedBaseLanguage.name} Locale` : 'Select Language' }}
      </h3>
    </div>

    <TInputSearch
      v-model="searchQuery"
      :placeholder="selectedBaseLanguage ? 'Search locales...' : 'Search languages...'"
      :autofocus="true"
      :block="true"
      :class="bemm('search')"
    />

    <!-- Special Language Toggle (only shown in locale view) -->
    <div v-if="selectedBaseLanguage" :class="bemm('toggle-section')">
      <label :class="bemm('toggle-label')">
        <input
          type="checkbox"
          v-model="showPseudoLanguages"
          :class="bemm('toggle-checkbox')"
        />
        <span :class="bemm('toggle-text')">Use special language variants</span>
      </label>
      <small :class="bemm('toggle-hint')">
        Enable fun variants like Pirate, Yoda, or Shakespeare for testing and entertainment
      </small>
    </div>

    <!-- Base Languages View -->
    <div v-if="!selectedBaseLanguage" :class="bemm('languages')">
      <button
        v-for="lang in filteredBaseLanguages"
        :key="lang.code"
        :class="bemm('language', ['', isCurrentLanguage(lang) ? 'active' : ''])"
        @click="handleLanguageClick(lang)"
      >
        <img
          v-if="getFlagUrl(lang.code)"
          :src="getFlagUrl(lang.code)!"
          :alt="`${lang.name} flag`"
          :class="bemm('flag')"
        />
        <span v-else :class="bemm('flag-emoji')">{{ lang.flag }}</span>
        <div :class="bemm('info')">
          <span :class="bemm('name')">{{ lang.name }}</span>
          <span :class="bemm('native')">{{ lang.native }}</span>
        </div>
        <div :class="bemm('indicators')">
          <Icon
            v-if="isCurrentLanguage(lang)"
            name="check"
            :class="bemm('check')"
          />
          <Icon
            v-if="lang.locales.length > 1"
            name="chevron-right"
            :class="bemm('chevron')"
          />
        </div>
      </button>

      <div v-if="filteredBaseLanguages.length === 0" :class="bemm('no-results')">
        No languages found
      </div>
    </div>

    <!-- Locales View -->
    <div v-else :class="bemm('languages')">
      <!-- Regular locales -->
      <button
        v-for="locale in regularLocales"
        :key="locale.code"
        :class="bemm('language', {
          '': true,
          'active': locale.code === modelValue
        })"
        @click="handleLocaleClick(locale)"
      >
        <img
          v-if="getLocaleFlagUrl(locale.code)"
          :src="getLocaleFlagUrl(locale.code)!"
          :alt="`${locale.name} flag`"
          :class="bemm('flag')"
        />
        <span v-else :class="bemm('flag-emoji')">{{ locale.flag || selectedBaseLanguage.flag }}</span>
        <div :class="bemm('info')">
          <span :class="bemm('name')">{{ locale.name }}</span>
          <span :class="bemm('code')">{{ locale.code.toUpperCase() }}</span>
        </div>
        <Icon
          v-if="locale.code === modelValue"
          name="check"
          :class="bemm('check')"
        />
      </button>

      <!-- Separator line for pseudo variants -->
      <div v-if="pseudoLocales.length > 0" :class="bemm('separator')">
        <span :class="bemm('separator-text')">Special Variants</span>
      </div>

      <!-- Pseudo variants -->
      <button
        v-for="locale in pseudoLocales"
        :key="locale.code"
        :class="bemm('language', {
          '': true,
          'active': locale.code === modelValue,
          'pseudo': true
        })"
        @click="handleLocaleClick(locale)"
      >
        <Icon
          v-if="locale.icon"
          :name="locale.icon"
          :class="bemm('pseudo-icon')"
        />
        <span v-else :class="bemm('flag-emoji')">{{ locale.flag || selectedBaseLanguage.flag }}</span>
        <div :class="bemm('info')">
          <span :class="bemm('name')">{{ locale.name }}</span>
          <span :class="bemm('code')">{{ locale.code.toUpperCase() }}</span>
        </div>
        <Icon
          v-if="locale.code === modelValue"
          name="check"
          :class="bemm('check')"
        />
      </button>

      <div v-if="filteredLocales.length === 0" :class="bemm('no-results')">
        No locales found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useBemm } from 'bemm'
import { SUPPORTED_LANGUAGES, getFlagUrl } from '@lezu/core'
import Icon from '../Icon/Icon.vue'
import { TInputSearch } from '../Form'
import type { PopupService } from '../Feedback/Popup/Popup.service'

interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'en'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { bemm } = useBemm('language-switcher-modal')
const popupService = inject<PopupService>('popupService')!
const searchQuery = ref('')

const selectedBaseLanguage = ref<typeof SUPPORTED_LANGUAGES[0] | null>(null)
const showPseudoLanguages = ref(false)

const filteredBaseLanguages = computed(() => {
  const query = searchQuery.value.toLowerCase()
  const languages = SUPPORTED_LANGUAGES
  
  if (!query) return languages

  return languages.filter(lang =>
    lang.name.toLowerCase().includes(query) ||
    lang.native.toLowerCase().includes(query) ||
    lang.code.toLowerCase().includes(query)
  )
})

const regularLocales = computed(() => {
  if (!selectedBaseLanguage.value) return []
  
  const query = searchQuery.value.toLowerCase()
  
  // Add regular locales (always shown)
  const locales = selectedBaseLanguage.value.locales
    .filter(localeCode => !isPseudoLocale(localeCode))
    .map(localeCode => {
      // For base language code (e.g., 'en'), use the language name
      if (localeCode === selectedBaseLanguage.value!.code) {
        return {
          code: localeCode,
          name: selectedBaseLanguage.value!.name,
          flag: selectedBaseLanguage.value!.flag,
          isPseudo: false
        }
      }
      
      // For locale codes (e.g., 'en-US'), generate locale name
      const [, regionCode] = localeCode.split('-')
      const regionName = getRegionName(regionCode)
      
      return {
        code: localeCode,
        name: regionName ? `${selectedBaseLanguage.value!.name} (${regionName})` : localeCode.toUpperCase(),
        flag: selectedBaseLanguage.value!.flag,
        isPseudo: false
      }
    })
  
  // Apply search filter
  if (!query) return locales
  
  return locales.filter(locale =>
    locale.name.toLowerCase().includes(query) ||
    locale.code.toLowerCase().includes(query)
  )
})

const pseudoLocales = computed(() => {
  if (!selectedBaseLanguage.value || !showPseudoLanguages.value) return []
  
  const query = searchQuery.value.toLowerCase()
  
  // Add pseudo variants that can be applied to any locale
  const pseudoVariants = getPseudoVariants()
  const locales = pseudoVariants.map(pseudoVariant => {
    return {
      code: `${selectedBaseLanguage.value!.code}-${pseudoVariant.code}`,
      name: `${selectedBaseLanguage.value!.name} (${pseudoVariant.name})`,
      flag: selectedBaseLanguage.value!.flag,
      icon: pseudoVariant.icon,
      isPseudo: true
    }
  })
  
  // Apply search filter
  if (!query) return locales
  
  return locales.filter(locale =>
    locale.name.toLowerCase().includes(query) ||
    locale.code.toLowerCase().includes(query)
  )
})

const filteredLocales = computed(() => {
  return [...regularLocales.value, ...pseudoLocales.value]
})

const handleLanguageClick = (language: typeof SUPPORTED_LANGUAGES[0]) => {
  // If language has only one locale, select it immediately
  if (language.locales.length === 1) {
    selectLanguage(language.locales[0])
  } else {
    // Show locale selection for this language
    selectedBaseLanguage.value = language
    searchQuery.value = '' // Reset search when switching views
  }
}

const selectLanguage = (code: string) => {
  emit('update:modelValue', code)

  popupService.close()
}

const goBackToLanguages = () => {
  selectedBaseLanguage.value = null
  searchQuery.value = '' // Reset search when going back
  showPseudoLanguages.value = false // Reset pseudo toggle
}

const handleLocaleClick = (locale: any) => {
  if (locale.isPseudo) {
    // For pseudo languages, close modal like regular locales
    selectLanguage(locale.code)
  } else {
    // For regular locales, close modal immediately
    selectLanguage(locale.code)
  }
}

const isCurrentLanguage = (language: typeof SUPPORTED_LANGUAGES[0]) => {
  // Check if current selection is this language or any of its locales
  return language.locales.includes(props.modelValue)
}

// Helper function to check if a locale code is a pseudo language
const isPseudoLocale = (localeCode: string): boolean => {
  const pseudoSuffixes = ['pirate', 'yoda', 'shakespeare', 'leet', 'robot', 'valley', 'elvish', 'caveman']
  return pseudoSuffixes.some(suffix => localeCode.includes(suffix))
}

// Get available pseudo variants that can be applied to any language
const getPseudoVariants = () => {
  return [
    { code: 'pirate', name: 'Pirate Speak', icon: 'skull', description: 'Arr matey! Speak like a pirate' },
    { code: 'yoda', name: 'Yoda Speak', icon: 'star', description: 'Wise you will sound, mmm' },
    { code: 'shakespeare', name: 'Shakespearean', icon: 'theater', description: 'Thou shall speak in iambic pentameter' },
    { code: 'leet', name: 'Leetspeak', icon: 'code', description: 'H4ck3r sp34k f0r 7h3 1337' },
    { code: 'robot', name: 'Robot', icon: 'cpu', description: 'BEEP.BOOP.PROCESSING.LANGUAGE' },
    { code: 'valley', name: 'Valley Girl', icon: 'heart', description: 'Like, totally awesome, for sure!' },
    { code: 'elvish', name: 'Elvish', icon: 'leaf', description: 'Speak like the elves of Middle-earth' },
    { code: 'caveman', name: 'Caveman', icon: 'mountain', description: 'Me speak simple. You understand.' }
  ]
}

// Helper function to get region names
const getRegionName = (regionCode?: string): string => {
  if (!regionCode) return ''
  
  const regionNames: Record<string, string> = {
    // English-speaking regions
    'US': 'United States',
    'GB': 'United Kingdom', 
    'CA': 'Canada',
    'AU': 'Australia',
    'NZ': 'New Zealand',
    'IE': 'Ireland',
    'ZA': 'South Africa',
    'IN': 'India',
    'SG': 'Singapore',
    'PH': 'Philippines',
    
    // Spanish-speaking regions
    'ES': 'Spain',
    'MX': 'Mexico',
    'AR': 'Argentina',
    'CO': 'Colombia',
    'CL': 'Chile',
    'PE': 'Peru',
    'VE': 'Venezuela',
    'EC': 'Ecuador',
    'GT': 'Guatemala',
    'CR': 'Costa Rica',
    'PA': 'Panama',
    'DO': 'Dominican Republic',
    'HN': 'Honduras',
    'NI': 'Nicaragua',
    'SV': 'El Salvador',
    'UY': 'Uruguay',
    'PY': 'Paraguay',
    'BO': 'Bolivia',
    
    // French-speaking regions
    'FR': 'France',
    'BE': 'Belgium',
    'CH': 'Switzerland',
    'LU': 'Luxembourg',
    'MC': 'Monaco',
    
    // Chinese regions
    'CN': 'China',
    'TW': 'Taiwan',
    'HK': 'Hong Kong',
    
    // Portuguese-speaking regions
    'BR': 'Brazil',
    'PT': 'Portugal',
    
    // Italian regions
    'IT': 'Italy',
    'SM': 'San Marino',
    'VA': 'Vatican',
    
    // German-speaking regions
    'DE': 'Germany',
    'AT': 'Austria',
    'LI': 'Liechtenstein',
    
    // Dutch territories and regions
    'NL': 'Netherlands',
    'SR': 'Suriname',
    'AW': 'Aruba',
    'CW': 'Curaçao',
    'SX': 'Sint Maarten',
    'BQ': 'Caribbean Netherlands',
    
    // Arabic regions
    'SA': 'Saudi Arabia',
    'AE': 'United Arab Emirates',
    'EG': 'Egypt',
    'JO': 'Jordan',
    'LB': 'Lebanon',
    'SY': 'Syria',
    'IQ': 'Iraq',
    'KW': 'Kuwait',
    'QA': 'Qatar',
    'BH': 'Bahrain',
    'OM': 'Oman',
    'YE': 'Yemen',
    'MA': 'Morocco',
    'TN': 'Tunisia',
    'DZ': 'Algeria',
    'LY': 'Libya',
    'SD': 'Sudan',
    
    // Russian regions
    'RU': 'Russia',
    'BY': 'Belarus',
    'KZ': 'Kazakhstan',
    'KG': 'Kyrgyzstan',
    
    // Other regions
    'JP': 'Japan',
    'KR': 'South Korea',
    'TR': 'Turkey',
    'GR': 'Greece',
    'CY': 'Cyprus',
    'NO': 'Norway',
    'SE': 'Sweden',
    'DK': 'Denmark',
    'FI': 'Finland',
    'IS': 'Iceland',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'SK': 'Slovakia',
    'HU': 'Hungary',
    'RO': 'Romania',
    'BG': 'Bulgaria',
    'HR': 'Croatia',
    'SI': 'Slovenia',
    'EE': 'Estonia',
    'LV': 'Latvia',
    'LT': 'Lithuania',
    'UA': 'Ukraine',
    'MK': 'North Macedonia',
    'AL': 'Albania',
    'ME': 'Montenegro',
    'RS': 'Serbia',
    'BA': 'Bosnia and Herzegovina',
    'XK': 'Kosovo'
  }
  
  return regionNames[regionCode.toUpperCase()] || regionCode.toUpperCase()
}

// Helper function to get SVG flag URL for locale codes
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

// No need for manual focus anymore, TInputSearch handles it with autofocus prop
</script>

<style lang="scss">
.language-switcher-modal {
  padding: var(--space-l);
  min-width: 300px;
  max-width: 900px;
  width: 90vw;

  @media (max-width: 767px) {
    max-width: 100%;
    width: 100%;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    max-width: 600px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: var(--space-m);
    margin-bottom: var(--space-l);
  }

  &__back-button {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-s) var(--space-m);
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-s);
    cursor: pointer;
    font-size: var(--font-size-s);
    color: var(--color-foreground);
    transition: all var(--transition-fast);

    &:hover {
      background: var(--color-background-secondary);
      border-color: var(--color-primary);
    }
  }

  &__title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    margin: 0;
    color: var(--color-foreground);
    flex: 1;
  }

  &__search {
    margin-bottom: var(--space-m);
  }

  &__toggle-section {
    padding: var(--space-m);
    background: var(--color-background-secondary);
    border-radius: var(--border-radius-s);
    margin-bottom: var(--space-m);
  }

  &__toggle-label {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    cursor: pointer;
    margin-bottom: var(--space-xs);
  }

  &__toggle-checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--color-primary);
  }

  &__toggle-text {
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-semibold);
    color: var(--color-foreground);
  }

  &__toggle-hint {
    font-size: var(--font-size-xs);
    color: var(--color-gray);
    margin: 0;
    line-height: 1.4;
  }

  &__languages {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-xs);
    max-height: 400px;
    overflow-y: auto;
    padding-right: var(--space-xs);

    // Large screens: 3 columns
    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    // Medium screens: 2 columns
    @media (min-width: 768px) and (max-width: 1023px) {
      grid-template-columns: repeat(2, 1fr);
    }

    // Small screens: 1 column
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
  }

  &__language {
    display: flex;
    align-items: center;
    gap: var(--space-m);
    padding: var(--space-m);
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-s);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    width: 100%;

    &:hover {
      background: color-mix(in srgb, var(--color-primary), transparent 95%);
      border-color: var(--color-primary);
    }

    &--active {
      background: color-mix(in srgb, var(--color-primary), transparent 90%);
      border-color: var(--color-primary);
    }

    &--pseudo {
      position: relative;
      
      &::before {
        content: '✨';
        position: absolute;
        top: var(--space-xs);
        right: var(--space-xs);
        font-size: 0.8em;
        opacity: 0.7;
      }
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      
      &:hover {
        background: transparent;
        border-color: var(--border-color);
        transform: none;
      }
    }
  }

  &__flag {
    width: 1.5em;
    height: 1.5em; // 4:3 aspect ratio
    border-radius: var(--border-radius-round);
    object-fit: cover;
  }

  &__flag-emoji {
    font-size: 2em;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  &__name {
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-semibold);
    color: var(--color-foreground);
  }

  &__native {
    font-size: var(--font-size-s);
    color: var(--color-gray);
  }

  &__indicators {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  &__check {
    color: var(--color-primary);
    font-size: 1.5em;
  }

  &__chevron {
    color: var(--color-gray);
    font-size: 1.2em;
  }

  &__code {
    font-size: var(--font-size-s);
    color: var(--color-gray);
    font-family: var(--font-family-mono, monospace);
    text-transform: uppercase;
  }

  &__separator {
    display: flex;
    align-items: center;
    margin: var(--space-m) 0;
    grid-column: 1 / -1;
    position: relative;
    width: 100%;

    &::before {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--color-gray-light);
      margin-right: var(--space-s);
    }

    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--color-gray-light);
      margin-left: var(--space-s);
    }
  }

  &__separator-text {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-gray);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    background: var(--color-background);
    padding: 0 var(--space-xs);
  }

  &__pseudo-icon {
    width: 1.5em;
    height: 1.5em;
    color: var(--color-primary);
    opacity: 0.8;
  }

  &__no-results {
    padding: var(--space-l);
    text-align: center;
    color: var(--color-gray);
  }
}

/* Custom scrollbar for language list */
.language-switcher-modal__languages {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-background);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-gray);
    border-radius: 3px;

    &:hover {
      background: var(--color-primary);
    }
  }
}
</style>
