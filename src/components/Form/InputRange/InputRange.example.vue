<template>
  <div :class="bemm()">
      <InputRange v-model="value" label="Volume" :min="0" :max="100" />
      <p :class="bemm('value')">Value: {{ value }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputRange from './InputRange.vue'

const bemm = useBemm('t-input-range-example')
const value = ref(50)
</script>

<style lang="scss">
.t-input-range-example {
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
