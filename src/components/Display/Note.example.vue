<template>
  <Example
    :component="Note"
    name="Note"
    slot-content="This is a note message."
    :prop-options="{
      type: [null, 'info', 'success', 'warning', 'error', 'danger'],
    }"
  />
</template>

<script setup lang="ts">
import Note from './Note.vue'
</script>
