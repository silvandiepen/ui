# InputPassword

Password input with visibility toggle, strength indicator, and optional confirmation mode.

## Usage

```vue
<template>
  <InputPassword v-model="password" label="Password" />
</template>

<script setup>
import { ref } from 'vue'
import { InputPassword } from '@sil/ui'

const password = ref('')
</script>
```

## Notes

- Includes a show/hide toggle button.
- Supports password strength feedback.
