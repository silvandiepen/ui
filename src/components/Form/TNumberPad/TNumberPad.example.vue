<template>
  <div :class="bemm()">
    <div :class="bemm('display')">{{ code || 'Tap the keypad' }}</div>

    <TNumberPad
      :disable-clear="code.length === 0"
      :disable-submit="code.length < 4"
      @number="appendDigit"
      @clear="removeDigit"
      @submit="submitCode"
    />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { ref } from 'vue'

import TNumberPad from './TNumberPad.vue'

const bemm = useBemm('t-number-pad-example')

const code = ref('')

function appendDigit(value: string) {
  if (code.value.length >= 6) {
    return
  }

  code.value += value
}

function removeDigit() {
  code.value = code.value.slice(0, -1)
}

function submitCode() {
  code.value = `Sent: ${code.value}`
}
</script>

<style lang="scss">
.t-number-pad-example {
  display: grid;
  gap: var(--space);
  justify-items: start;

  &__display {
    min-height: 2rem;
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.08em;
  }
}
</style>
