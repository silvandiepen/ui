<template>
  <div :class="bemm()">
    <InputSwitchOptions
      v-model="value"
      label="Project status"
      :options="options"
    />

    <p :class="bemm('value')">Selected status: {{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputSwitchOptions from './InputSwitchOptions.vue'

const bemm = useBemm('input-switch-options-example')

const value = ref('planned')

const options = [
  { label: 'Planned', value: 'planned' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Done', value: 'done' },
]
</script>

<style lang="scss">
.input-switch-options-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
