# InputCalendar

Date input with a popup calendar picker built on top of the DatePicker component.

## Usage

```vue
<template>
  <InputCalendar v-model="date" label="Select a date" />
</template>

<script setup>
import { ref } from 'vue'
import { InputCalendar } from '@sil/ui'

const date = ref('')
</script>
```

## Notes

- Uses the shared DatePicker component in a popup overlay.
- Prefer `InputDate` for native browser date picking without a custom calendar.
