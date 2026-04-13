# LanguageSwitch

`LanguageSwitch` is a shared locale picker for docs and product shells.

It supports:

- flat locale lists or grouped/nested locale trees
- optional flags through emoji, explicit image URLs, or derived region codes
- inline rendering for popup content
- anchored trigger rendering through `popover` or `context-panel` surfaces

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UILanguageSwitch } from '@sil/ui'

const locale = ref('en-US')

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
    trigger-label="Language"
  />
</template>
```

## Notes

- Use `surface="inline"` when the option list should live inside popup content.
- Use `surface="popover"` for compact header or toolbar switches.
- Use `surface="context-panel"` when the trigger should open through the shared context panel primitive.
