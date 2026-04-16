<template>
  <Example>
<div :class="bemm()">
    <InputSelectIcon v-model="icon" :options="icons" label="Select an icon" />
    <p :class="bemm('value')">Selected: {{ icon }}</p>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputSelectIcon from './InputSelectIcon.vue'

const bemm = useBemm('t-input-select-icon-example')
const icon = ref('')
const icons = [
  { label: 'Home', value: 'home' },
  { label: 'Settings', value: 'settings' },
  { label: 'User', value: 'user' },
]
</script>

<style lang="scss">
.t-input-select-icon-example {
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
