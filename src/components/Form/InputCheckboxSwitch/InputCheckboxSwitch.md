# InputCheckboxSwitch

A hybrid checkbox that renders as a pill-shaped toggle switch. Combines checkbox semantics with a sliding switch visual.

## Usage

```vue
<template>
  <InputCheckboxSwitch v-model="enabled" label="Enable feature" />
</template>

<script setup>
import { ref } from 'vue'
import { InputCheckboxSwitch } from '@sil/ui'

const enabled = ref(false)
</script>
```

## Notes

- Visually similar to `InputToggle` but uses checkbox semantics internally.
- Use `InputToggle` for proper toggle switches with options support.
