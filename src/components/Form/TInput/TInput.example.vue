<template>
  <div :class="bemm()">
    <TInput
      v-model="name"
      label="Project name"
      placeholder="Shared UI migration"
      description="This example uses the legacy TInput surface."
    />

    <TInput
      v-model="budget"
      label="Budget"
      type="number"
      :min="0"
      :step="50"
      prefix-icon="coins"
    />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { ref } from 'vue'

import TInput from './TInput.vue'

const bemm = useBemm('t-input-example')

const name = ref('UI docs')
const budget = ref<number | string>(250)
</script>

<style lang="scss">
.t-input-example {
  display: grid;
  gap: var(--space);
}
</style>
