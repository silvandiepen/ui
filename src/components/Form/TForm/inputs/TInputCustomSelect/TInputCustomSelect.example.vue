<template>
  <div :class="bemm()">
    <TInputCustomSelect
      v-model="value"
      label="Owner"
      placeholder="Assign a team"
      searchable
      :options="options"
    />

    <p :class="bemm('value')">Selected: {{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import TInputCustomSelect from './TInputCustomSelect.vue'

const bemm = useBemm('t-input-custom-select-example')

const value = ref('design')

const options = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Operations', value: 'ops', color: 'var(--color-warning)' },
]
</script>

<style lang="scss">
.t-input-custom-select-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
