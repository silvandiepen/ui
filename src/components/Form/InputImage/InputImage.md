# InputImage

Image upload input with drag-and-drop support, file type validation, and image preview.

## Usage

```vue
<template>
  <InputImage v-model="imageUrl" label="Profile picture" />
</template>

<script setup>
import { ref } from 'vue'
import { InputImage } from '@sil/ui'

const imageUrl = ref('')
</script>
```

## Notes

- Supports drag-and-drop file selection.
- Validates file type and size before accepting.
