# LanguageSwitch

`LanguageSwitch` is a shared locale picker for docs and product shells.

It supports:

- flat locale lists or grouped/nested locale trees
- a simple dropdown mode with language names only
- optional flags through explicit image URLs or derived region codes
- inline rendering for popup content
- anchored trigger rendering through `popover` or `context-panel` surfaces

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UILanguageSwitch } from '@sil/ui'

const locale = ref('en')

const options = [
  {
    label: 'English',
    children: [
      { value: 'en', label: 'English', regionCode: 'GB' },
      { value: 'en-GB', label: 'English (United Kingdom)' },
      { value: 'en-US', label: 'English (United States)' },
      { value: 'en-AU', label: 'English (Australia)' },
    ],
  },
  {
    value: 'nl',
    label: 'Nederlands',
    regionCode: 'NL',
  },
]
</script>

<template>
  <UILanguageSwitch
    v-model="locale"
    :options="options"
    title="UI language"
  />
</template>
```

## Notes

- By default the trigger shows the selected locale code such as `en` or `en-US`.
- Use `mode="simple"` for a compact dropdown with language names only.
- Use `surface="inline"` when the option list should live inside popup content.
- Use `surface="popover"` for compact header or toolbar switches.
- Use `surface="context-panel"` when the trigger should open through the shared context panel primitive.
