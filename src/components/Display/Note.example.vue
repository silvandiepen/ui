<template>
  <div :class="bemm()">
    <Note type="info">This surface inherits the shared neutral note styling.</Note>
    <Note type="success">Release checks passed and the package is ready.</Note>
    <Note type="warning">One environment is still awaiting approval.</Note>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Note from './Note.vue'

const bemm = useBemm('display-note-example')
</script>

<style lang="scss">
.display-note-example {
  display: grid;
  gap: var(--space);
}
</style>
