<template>
  <Example>
<div :class="bemm()">
    <InputCascader
      v-model="selection"
      label="Destination"
      :options="options"
    />

    <p :class="bemm('value')">Path: {{ selection.join(' / ') || 'none' }}</p>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputCascader from './InputCascader.vue'

const bemm = useBemm('input-cascader-example')
const selection = ref<string[]>(['europe', 'malta', 'valletta'])

const options = [
  {
    label: 'Europe',
    value: 'europe',
    children: [
      {
        label: 'Malta',
        value: 'malta',
        children: [
          { label: 'Valletta', value: 'valletta' },
          { label: 'Sliema', value: 'sliema' },
        ],
      },
      {
        label: 'Portugal',
        value: 'portugal',
        children: [
          { label: 'Lisbon', value: 'lisbon' },
          { label: 'Porto', value: 'porto' },
        ],
      },
    ],
  },
  {
    label: 'North America',
    value: 'north-america',
    children: [
      {
        label: 'United States',
        value: 'united-states',
        children: [
          { label: 'San Francisco', value: 'san-francisco' },
          { label: 'New York', value: 'new-york' },
        ],
      },
    ],
  },
]
</script>

<style lang="scss">
.input-cascader-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
