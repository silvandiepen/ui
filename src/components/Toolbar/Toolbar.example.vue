<template>
  <div :class="bemm()">
    <Toolbar />

    <Button @click="showToolbar">
      Show toolbar
    </Button>
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent } from 'vue'
import { useBemm } from 'bemm'

import { Button } from '../Button'
import Toolbar from './Toolbar.vue'
import { toolbarService } from './Toolbar.service'

const bemm = useBemm('toolbar-example')

const ToolbarPreview = defineComponent({
  props: {
    title: { required: true, type: String },
  },
  emits: ['close'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'toolbar-example__panel' }, [
        h('strong', props.title),
        h(Button, { size: 'small', variant: 'ghost', onClick: () => emit('close') }, () => 'Dismiss'),
      ])
  },
})

function showToolbar() {
  toolbarService.show({
    component: ToolbarPreview,
    id: 'docs-toolbar-preview',
    props: {
      onClose: () => toolbarService.hide('docs-toolbar-preview'),
      title: '3 items selected',
    },
  })
}
</script>

<style lang="scss">
.toolbar-example {
  display: flex;

  &__panel {
    display: inline-flex;
    align-items: center;
    gap: var(--space);
  }
}
</style>
