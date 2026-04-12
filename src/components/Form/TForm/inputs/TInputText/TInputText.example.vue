<template>
  <div :class="bemm()">
    <TInputText
      v-model="value"
      label="Release title"
      placeholder="April shared UI release"
      description="Text input inside the shared TForm input family."
      reset
    />

    <p :class="bemm('value')">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import TInputText from './TInputText.vue'

const bemm = useBemm('t-input-text-example')

const value = ref('UI docs refresh')
</script>

<style lang="scss">
.t-input-text-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
