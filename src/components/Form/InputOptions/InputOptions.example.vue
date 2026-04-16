<template>
  <div :class="bemm()">
    <h4>Checkboxes (multiple)</h4>
    <InputOptions v-model="checkboxSelected" type="checkbox" :options="options" />

    <h4>Toggles (multiple)</h4>
    <InputOptions v-model="toggleSelected" type="toggle" :options="options" />

    <h4>Radio (single)</h4>
    <InputOptions v-model="radioSelected" type="radio" :options="options" />

    <h4>Checkboxes (single select)</h4>
    <InputOptions v-model="singleSelected" type="checkbox" :multiple="false" :options="options" />

    <h4>Horizontal checkboxes</h4>
    <InputOptions v-model="horizontalSelected" type="checkbox" direction="horizontal" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputOptions from './InputOptions.vue'

const bemm = useBemm('t-input-options-example')

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
]

const checkboxSelected = ref<(string | number)[]>([])
const toggleSelected = ref<(string | number)[]>([])
const radioSelected = ref<(string | number)[]>([])
const singleSelected = ref<(string | number)[]>([])
const horizontalSelected = ref<(string | number)[]>([])
</script>

<style lang="scss">
.t-input-options-example {
  display: grid;
  gap: var(--space);
  max-width: 24em;

  h4 {
    margin-bottom: 0;
  }
}
</style>
