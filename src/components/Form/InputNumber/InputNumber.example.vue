<template>
  <div :class="bemm()">
      <InputNumber
        v-model="quantity"
        label="Seats"
        :min="1"
        :max="25"
        :step="1"
      />

      <p :class="bemm('value')">Seats selected: {{ quantity }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputNumber from './InputNumber.vue'

const bemm = useBemm('t-input-number-example')

const quantity = ref(5)
</script>

<style lang="scss">
.t-input-number-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
