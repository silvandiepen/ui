<template>
  <div :class="bemm()">
      <InputSelectColor v-model="color" :options="colors" label="Pick a color" />
      <p :class="bemm('value')">Selected: {{ color }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputSelectColor from './InputSelectColor.vue'

const bemm = useBemm('t-input-select-color-example')
const color = ref('')
const colors = [
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Red', value: 'red' },
]
</script>

<style lang="scss">
.t-input-select-color-example {
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
