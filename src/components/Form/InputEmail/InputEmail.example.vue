<template>
  <div :class="bemm()">
      <InputEmail
        v-model="email"
        label="Team email"
        placeholder="team@example.com"
        instructions="Validation runs after interaction."
        required
      />

      <p :class="bemm('value')">{{ email }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputEmail from './InputEmail.vue'

const bemm = useBemm('input-email-example')

const email = ref('design.system@example.com')
</script>

<style lang="scss">
.input-email-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
