<template>
  <Example>
<div :class="bemm()">
    <InputImage v-model="imageUrl" label="Upload image" />
    <p :class="bemm('value')">URL: {{ imageUrl || 'none' }}</p>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputImage from './InputImage.vue'

const bemm = useBemm('t-input-image-example')
const imageUrl = ref('')
</script>

<style lang="scss">
.t-input-image-example {
  display: grid;
  gap: var(--space);
  max-width: 24em;

  &__value {
    margin: 0;
    font-size: 0.875em;
    color: var(--text-muted);
  }
}
</style>
