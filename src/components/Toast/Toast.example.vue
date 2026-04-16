<template>
  <div :class="bemm()">
      <Toast />

      <Button @click="showSuccess">
        Show success toast
      </Button>
    </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Button } from '../Button'
import Toast from './Toast.vue'
import { toastService } from './Toast.service'
import { ToastType } from './Toast.model'

const bemm = useBemm('toast-example')

function showSuccess() {
  toastService.show({
    message: 'The new package version is ready to publish.',
    title: 'Release ready',
    type: ToastType.SUCCESS,
  })
}
</script>

<style lang="scss">
.toast-example {
  display: flex;
}
</style>
