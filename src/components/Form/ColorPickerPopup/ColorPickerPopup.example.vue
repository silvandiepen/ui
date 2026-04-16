<template>
  <Example>
  <div :class="bemm()">
    <ColorPickerPopup
      v-model="selectedColor"
      placeholder="Choose a highlight"
    />

    <p :class="bemm('selection')">
      Selected token:
      <strong>{{ selectedColor }}</strong>
    </p>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import { Colors } from '../../../types'
import ColorPickerPopup from './ColorPickerPopup.vue'

const bemm = useBemm('t-color-picker-popup-example')

const selectedColor = ref<Colors>(Colors.PRIMARY)
</script>

<style lang="scss">
.t-color-picker-popup-example {
  display: grid;
  gap: var(--space);

  &__selection {
    margin: 0;
  }
}
</style>
