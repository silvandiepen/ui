# InputVerificationCode

Multi-digit verification code input with individual character fields, paste support, and auto-advance.

## Usage

```vue
<template>
  <InputVerificationCode v-model="code" label="Verification code" />
</template>

<script setup>
import { ref } from 'vue'
import { InputVerificationCode } from '@sil/ui'

const code = ref('')
</script>
```

## Notes

- Auto-advances focus to the next digit.
- Supports paste to fill all digits at once.
