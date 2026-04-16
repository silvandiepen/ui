# InputBirthday

Three-column date picker for day, month, and year with filtered dropdown options.

## Usage

```vue
<template>
  <InputBirthday
    v-model="birthday"
    label="Date of birth"
    locale="en-US"
  />
</template>

<script setup>
import { ref } from 'vue'
import { InputBirthday } from '@sil/ui'

const birthday = ref('')
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Date value in `YYYY-MM-DD` format |
| `label` | `string` | `''` | Label text |
| `locale` | `string` | `'en-US'` | Locale for localized month names |
| `instructions` | `string` | `''` | Helper text below the label |
| `error` | `string[]` | `[]` | Error messages to display |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when date changes (YYYY-MM-DD) |
