<template>
  <div :class="bemm()">
    <InputCheckbox
      v-model="checked"
      label="Enable release notes"
      color="success"
    />

    <p :class="bemm('value')">Checked: {{ checked ? 'yes' : 'no' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputCheckbox from './InputCheckbox.vue'

const bemm = useBemm('t-input-checkbox-example')

const checked = ref(true)
</script>

<style lang="scss">
.t-input-checkbox-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
