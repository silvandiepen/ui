<template>
  <div :class="bemm()">
    <PinInput
      v-model="code"
      :length="6"
      :show-value="true"
      mask
      auto-submit
      @complete="handleComplete"
    />

    <p :class="bemm('status')">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { computed, ref } from 'vue'

import PinInput from './PinInput.vue'

const bemm = useBemm('t-pin-input-example')

const code = ref('12')
const completedCode = ref('')

const status = computed(() => {
  if (completedCode.value) {
    return `Completed code: ${completedCode.value}`
  }

  return `Current value: ${code.value || 'empty'}`
})

function handleComplete(value: string) {
  completedCode.value = value
}
</script>

<style lang="scss">
.t-pin-input-example {
  display: grid;
  gap: var(--space);
  justify-items: start;

  &__status {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
  }
}
</style>
