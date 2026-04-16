<template>
<Textarea
    v-model="notes"
    :rows="5"
    placeholder="Write release notes for the shared UI package..."
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Textarea from './Textarea.vue'

const notes = ref('Document the breaking changes before publishing.')
</script>
