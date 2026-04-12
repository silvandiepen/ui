<template>
  <div :class="bemm()">
    <TInputSwitch
      v-model="value"
      label="View mode"
      :options="options"
    />

    <p :class="bemm('value')">Active mode: {{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import TInputSwitch from './TInputSwitch.vue'

const bemm = useBemm('t-input-switch-example')

const value = ref('grid')

const options = [
  { label: 'Grid', value: 'grid' },
  { label: 'List', value: 'list' },
  { label: 'Compact', value: 'compact' },
]
</script>

<style lang="scss">
.t-input-switch-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
