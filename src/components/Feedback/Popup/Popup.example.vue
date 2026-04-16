<template>
<div :class="bemm()">
      <Popup />

      <PopupWrapper
        id="docs-popup-example"
        title="Share UI release"
        :config="{
          description: 'Service-driven popup content can be composed with trigger, content, and footer slots.',
          config: {
            width: '30rem',
          },
        }"
      >
        <template #trigger>
          <Button>Open popup</Button>
<template #content>
          <div :class="bemm('content')">
            <p>
              Popups can render arbitrary components or slot content while staying controlled by the shared popup service.
            </p>
          </div>
        

        <template #footer>
          <Button variant="ghost" @click="popupService.close('docs-popup-example')">
            Close
          </Button>
        
      </PopupWrapper>
    </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Button } from '../../Button'
import Popup from './Popup.vue'
import PopupWrapper from './PopupWrapper.vue'
import { popupService } from './Popup.service'

const bemm = useBemm('popup-example')
</script>

<style lang="scss">
.popup-example {
  display: grid;
  gap: var(--space);

  &__content {
    display: grid;
    gap: 0.75rem;
    max-width: 26rem;
  }
}
</style>
