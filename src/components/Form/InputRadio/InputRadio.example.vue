<template>
  <Example>
<div :class="bemm()">
    <InputRadio
      v-for="option in options"
      :key="option.value"
      v-model="value"
      name="release-channel"
      :label="option.label"
      :value="option.value"
      :description="option.description"
    />

    <p :class="bemm('value')">Channel: {{ value }}</p>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputRadio from './InputRadio.vue'

const bemm = useBemm('t-input-radio-example')

const value = ref('beta')

const options = [
  { label: 'Alpha', value: 'alpha', description: 'Internal testing only.' },
  { label: 'Beta', value: 'beta', description: 'Shared preview for selected users.' },
  { label: 'Stable', value: 'stable', description: 'Production-ready release.' },
]
</script>

<style lang="scss">
.t-input-radio-example {
  display: grid;
  gap: 0.75rem;

  &__value {
    margin: 0.5rem 0 0;
  }
}
</style>
