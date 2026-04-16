# InputColor

Color picker with a native color input, text display, and optional preset color swatches.

## Usage

```vue
<template>
  <InputColor v-model="color" label="Brand color" />
</template>

<script setup>
import { ref } from 'vue'
import { InputColor } from '@sil/ui'

const color = ref('#2563eb')
</script>
```

## Notes

- Falls back to a text input for hex values.
- Supports preset swatches via the `swatches` prop.
