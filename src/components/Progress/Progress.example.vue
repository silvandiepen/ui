<template>
  <Progress
    label="Migration progress"
    :value="68"
    :details="['14 components reviewed', '6 still transitional']"
  />
</template>

<script lang="ts" setup>
import { Progress } from './index'
</script>
