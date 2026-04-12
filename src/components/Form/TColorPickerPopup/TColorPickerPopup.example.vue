<template>
  <div :class="bemm()">
    <Popup />

    <TColorPickerPopup
      v-model="selectedColor"
      placeholder="Choose a highlight"
    />

    <p :class="bemm('selection')">
      Selected token:
      <strong>{{ selectedColor }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { useBemm } from 'bemm'

import Popup from '../../Feedback/Popup/Popup.vue'
import { popupService } from '../../Feedback/Popup/Popup.service'
import { Colors } from '../../../types'
import TColorPickerPopup from './TColorPickerPopup.vue'

const bemm = useBemm('t-color-picker-popup-example')

const selectedColor = ref<Colors>(Colors.PRIMARY)

provide('popupService', popupService)
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
