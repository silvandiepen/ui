<template>
  <div :class="bemm()">
    <TColorPicker
      v-model="selectedColor"
      label="Accent color"
      description="Pick one of the shared theme colors."
    />

    <div :class="bemm('selection')">
      Current selection:
      <strong>{{ selectedColor }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { ref } from 'vue'

import TColorPicker from './TColorPicker.vue'

const bemm = useBemm('t-color-picker-example')

const selectedColor = ref('primary')
</script>

<style lang="scss">
.t-color-picker-example {
  display: grid;
  gap: var(--space);

  &__selection {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
