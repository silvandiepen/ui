<template>
  <div :class="bemm()">
    <Toast />

    <div :class="bemm('actions')">
      <Button @click="showInfoToast">Info toast</Button>
      <Button variant="secondary" @click="showSuccessToast">Success toast</Button>
      <Button variant="outline" @click="showWarningToast">Warning toast</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Button } from '../../Button'

import Toast from './Toast.vue'
import { toastService } from './Toast.service'

const bemm = useBemm('toast-example')

function showInfoToast() {
  toastService.info('Build finished successfully.', {
    title: 'Shared UI',
    position: 'top-right',
  })
}

function showSuccessToast() {
  toastService.success('Design tokens were published.', {
    title: 'Release',
    position: 'bottom-right',
  })
}

function showWarningToast() {
  toastService.warning('One component still needs follow-up work.', {
    title: 'Attention',
    position: 'top',
  })
}
</script>

<style lang="scss">
.toast-example {
  display: grid;
  gap: var(--space);

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-s);
  }
}
</style>
