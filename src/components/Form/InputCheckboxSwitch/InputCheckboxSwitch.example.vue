<template>
  <Example>
<div :class="bemm()">
    <InputCheckboxSwitch v-model="enabled" label="Enable notifications" />
    <p :class="bemm('value')">Enabled: {{ enabled }}</p>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputCheckboxSwitch from './InputCheckboxSwitch.vue'

const bemm = useBemm('t-input-checkbox-switch-example')
const enabled = ref(false)
</script>

<style lang="scss">
.t-input-checkbox-switch-example {
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
