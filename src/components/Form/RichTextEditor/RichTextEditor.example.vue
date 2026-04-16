<template>
  <div :class="bemm()">
      <RichTextEditor
        v-model="content"
        label="Announcement"
        placeholder="Write a short update for the team"
        height="14rem"
      />

      <p :class="bemm('value')">Content length: {{ content.length }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import RichTextEditor from './RichTextEditor.vue'

const bemm = useBemm('t-rich-text-editor-example')

const content = ref('<p>UI docs now include a theme builder and broader live coverage.</p>')
</script>

<style lang="scss">
.t-rich-text-editor-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
