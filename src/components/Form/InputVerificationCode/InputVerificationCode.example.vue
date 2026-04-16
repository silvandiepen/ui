<template>
  <div :class="bemm()">
      <InputVerificationCode v-model="code" label="Enter code" />
      <p :class="bemm('value')">Code: {{ code || 'empty' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputVerificationCode from './InputVerificationCode.vue'

const bemm = useBemm('t-input-verification-example')
const code = ref('')
</script>

<style lang="scss">
.t-input-verification-example {
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
