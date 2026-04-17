<template>
  <div :class="bemm()">
    <Toast />

    <Button @click="showSuccess">Success</Button>
    <Button @click="showError">Error</Button>
    <Button @click="showWarning">Warning</Button>
    <Button @click="showInfo">Info</Button>
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
  toastService.show({ title: 'Release ready', message: 'The new package version is ready to publish.', type: ToastType.SUCCESS })
}
function showError() {
  toastService.show({ title: 'Build failed', message: 'The pipeline could not complete. Check the logs.', type: ToastType.ERROR })
}
function showWarning() {
  toastService.show({ title: 'Low disk space', message: 'You are running low on available storage.', type: ToastType.WARNING })
}
function showInfo() {
  toastService.show({ title: 'Update available', message: 'A new version of the application is available.', type: ToastType.INFO })
}
</script>

<style lang="scss">
.toast-example {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);
}
</style>
