<template>
  <div :class="bemm()">
    <Feedback />

    <Button @click="showToast">
      Trigger feedback
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Button } from '../Button'
import Feedback from './Feedback.vue'
import { ToastType } from './Toast/Toast.model'
import { toastService } from './Toast/Toast.service'

const bemm = useBemm('feedback-example')

function showToast() {
  toastService.show({
    message: 'The shared feedback shell is mounted and ready.',
    title: 'Feedback active',
    type: ToastType.SUCCESS,
  })
}
</script>

<style lang="scss">
.feedback-example {
  display: flex;
}
</style>
