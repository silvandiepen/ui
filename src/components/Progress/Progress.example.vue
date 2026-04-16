<template>
  <Example>
<Progress
    label="Release progress"
    :value="68"
    :details="['14 components reviewed', '6 follow-up items left']"
  />
  </Example>
</template>

<script lang="ts" setup>
import { Progress } from './index'
</script>
