<template>
  <div :class="bemm()">
      <InputSelect
        v-model="value"
        label="Environment"
        :options="options"
        allowNull
        filterable
        null-label="Choose one"
      />

      <p :class="bemm('value')">Selected: {{ value || 'none' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputSelect from './InputSelect.vue'

const bemm = useBemm('t-input-select-example')

const value = ref<string | null>('staging')

const options = [
  { label: 'Development', value: 'development' },
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'production' },
]
</script>

<style lang="scss">
.t-input-select-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
