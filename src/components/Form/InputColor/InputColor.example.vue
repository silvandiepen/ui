<template>
  <div :class="bemm()">
      <InputColor v-model="color" label="Pick a color" />
      <p :class="bemm('value')">Selected: {{ color }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputColor from './InputColor.vue'

const bemm = useBemm('t-input-color-example')
const color = ref('#2563eb')
</script>

<style lang="scss">
.t-input-color-example {
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
