<template>
  <div :class="bemm()">
      <Popup />

      <ImageInput
        v-model="image"
        label="Thumbnail"
        description="Clicking the control opens the media selector when a popup service is available."
      />

      <p :class="bemm('value')">{{ image?.alt || 'No image selected' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import Popup from '../../Feedback/Popup/Popup.vue'
import ImageInput from './ImageInput.vue'

const bemm = useBemm('t-image-input-example')

const image = ref({
  alt: 'Shared UI preview card',
  url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22240%22 viewBox=%220 0 320 240%22%3E%3Crect width=%22320%22 height=%22240%22 rx=%2224%22 fill=%22%2355c267%22/%3E%3Ccircle cx=%2280%22 cy=%2284%22 r=%2232%22 fill=%22%23ffffff%22 fill-opacity=%220.3%22/%3E%3Cpath d=%22M36 190l56-62 46 40 46-54 100 76H36z%22 fill=%22%23ffffff%22 fill-opacity=%220.7%22/%3E%3C/svg%3E',
})
</script>

<style lang="scss">
.t-image-input-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
