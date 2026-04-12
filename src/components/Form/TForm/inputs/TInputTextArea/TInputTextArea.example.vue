<template>
  <div :class="bemm()">
    <TInputTextArea
      v-model="value"
      label="Release notes"
      description="Longer freeform text with autosize support."
      show-count
      :maxlength="180"
    />

    <p :class="bemm('value')">{{ value.length }} characters</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import TInputTextArea from './TInputTextArea.vue'

const bemm = useBemm('t-input-text-area-example')

const value = ref('Tabs, toast, and docs cleanup are ready for review.')
</script>

<style lang="scss">
.t-input-text-area-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
