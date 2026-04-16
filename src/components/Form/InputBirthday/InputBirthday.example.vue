<template>
  <Example>
<div :class="bemm()">
    <InputBirthday
      v-model="birthday"
      label="Date of birth"
      instructions="Enter your date of birth"
    />
    <p :class="bemm('value')">Value: {{ birthday || 'not set' }}</p>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputBirthday from './InputBirthday.vue'

const bemm = useBemm('t-input-birthday-example')
const birthday = ref('')
</script>

<style lang="scss">
.t-input-birthday-example {
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
