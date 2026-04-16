<template>
  <div :class="bemm()">
    <HeaderSearch
      v-model="query"
      clear-label="Clear docs query"
      open-label="Search docs"
      placeholder="Search components, guides, and tokens"
    >
      <template #panel>
        <div :class="bemm('status')">
          {{ statusText }}
        </div>

        <template v-if="query.trim().length > 0 && filteredItems.length > 0">
          <div
            v-for="item in filteredItems"
            :key="item"
            :class="bemm('result')"
          >
            {{ item }}
          </div>
        </template>

        <div v-else :class="bemm('empty')">
          {{ emptyText }}
        </div>
      </template>
    </HeaderSearch>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useBemm } from 'bemm'

import { HeaderSearch } from './index'

const bemm = useBemm('header-search-example')
const query = ref('')
const items = [
  'PlatformHeader',
  'LanguageSwitch',
  'ThemeToggle',
  'useSearch',
  'Theme Builder',
]

const filteredItems = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return []
  }

  return items.filter((item) => item.toLowerCase().includes(normalizedQuery)).slice(0, 4)
})

const statusText = computed(() => (
  query.value.trim().length > 0
    ? `${filteredItems.value.length} result${filteredItems.value.length === 1 ? '' : 's'}`
    : 'Type to search the example data'
))

const emptyText = computed(() => (
  query.value.trim().length > 0
    ? 'No matching example results'
    : 'Type to search the example data'
))
</script>

<style lang="scss">
.header-search-example {
  display: grid;
  gap: 0.6rem;
  min-height: 14rem;
  align-content: start;

  &__status,
  &__empty {
    padding: 0.5rem 0.65rem;
    color: color-mix(in srgb, var(--color-foreground), transparent 35%);
    font-size: 0.85rem;
  }

  &__result {
    padding: 0.75rem 0.8rem;
    border-radius: 0.85rem;
    background: color-mix(in srgb, var(--color-primary), transparent 94%);
  }
}
</style>
