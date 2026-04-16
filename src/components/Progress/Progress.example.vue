<template>
<Progress
    label="Release progress"
    :value="68"
    :details="['14 components reviewed', '6 follow-up items left']"
  />
</template>

<script lang="ts" setup>
import { Progress } from './index'
</script>
