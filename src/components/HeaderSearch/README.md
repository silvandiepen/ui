# HeaderSearch

`HeaderSearch` is an expandable header search shell for app bars, docs headers, and toolbars.

It starts as an icon button, expands into a focused search input, and can render an optional result panel through the `panel` slot.

## Usage

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { UIHeaderSearch } from '@sil/ui'

const query = ref('')

const items = [
  'PlatformHeader',
  'ThemeToggle',
  'useSearch',
]

const results = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return []
  }

  return items.filter((item) => item.toLowerCase().includes(normalizedQuery))
})
</script>

<template>
  <UIHeaderSearch
    v-model="query"
    open-label="Search docs"
    placeholder="Search docs"
  >
    <template #panel>
      <div v-if="results.length === 0">No results</div>
      <div v-for="result in results" :key="result">{{ result }}</div>
    </template>
  </UIHeaderSearch>
</template>
```

## Notes

- Use the `panel` slot when you need inline results, quick navigation, or status copy below the expanded input.
- The panel stays closed until the query has content. Set `showPanelOnEmptyQuery` when you want an always-open command-palette style panel.
- The component clears the query on close by default. Set `clearOnClose` to `false` if the shell should preserve the current value.
- `openLabel` is used for the collapsed trigger, while `placeholder` controls the expanded input copy.
