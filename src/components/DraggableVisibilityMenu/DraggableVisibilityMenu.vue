<template>
  <div :class="bemm()">
    <Draggable v-model="localItems" item-key="key" :item-class="(item) => !(item as DraggableVisibilityMenuItem).visible ? 'draggable__item--hidden' : undefined" @update:model-value="onReorder">
      <template #item="{ item }">
        <span :class="bemm('label')">{{ (item as DraggableVisibilityMenuItem).label }}</span>
        <button
          type="button"
          :class="[bemm('toggle'), (item as DraggableVisibilityMenuItem).visible && bemm('toggle', 'visible')]"
          :title="(item as DraggableVisibilityMenuItem).visible ? 'Hide column' : 'Show column'"
          @click="toggleVisibility((item as DraggableVisibilityMenuItem).key)"
        >
          <Icon :name="(item as DraggableVisibilityMenuItem).visible ? 'visible' : 'invisible'" />
        </button>
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBemm } from 'bemm'
import { Icon } from '../Icon'
import { Draggable } from '../Draggable'
import type { DraggableVisibilityMenuItem } from './DraggableVisibilityMenu.model'

const props = withDefaults(defineProps<{
  items?: DraggableVisibilityMenuItem[]
}>(), {
  items: () => []
})

const emit = defineEmits<{
  'update:items': [items: DraggableVisibilityMenuItem[]]
}>()

const { bemm } = useBemm('draggable-visibility-menu')

const localItems = ref<DraggableVisibilityMenuItem[]>([])

watch(
  () => props.items,
  (items) => { localItems.value = [...items] },
  { immediate: true, deep: true }
)

function onReorder(items: unknown[]) {
  localItems.value = items as DraggableVisibilityMenuItem[]
  emit('update:items', [...localItems.value])
}

function toggleVisibility(key: string) {
  localItems.value = localItems.value.map((item) =>
    item.key === key ? { ...item, visible: !item.visible } : item
  )
  emit('update:items', [...localItems.value])
}
</script>

<style lang="scss">
.draggable-visibility-menu {
  border-radius: var(--border-radius);
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
  background: var(--color-background);
  overflow: hidden;

  .draggable__item {
    padding: var(--space-xs) var(--space-s);
    gap: var(--space-s);
    transition: background 120ms ease, opacity 120ms ease;

    &:not(:last-child) {
      border-bottom: 1px solid color-mix(in srgb, var(--color-foreground), transparent 92%);
    }

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 96%);
    }

    &--hidden {
      opacity: 0.5;
    }
  }

  .draggable__handle {
    padding: 0;
  }

  &__label {
    flex: 1;
    font-size: var(--font-size-s);
    color: var(--color-foreground);
    line-height: 1;
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    border-radius: var(--border-radius-s);
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 65%);
    cursor: pointer;
    flex-shrink: 0;
    transition: background 120ms ease, color 120ms ease;

    .icon {
      width: 1rem;
      height: 1rem;
    }

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 90%);
      color: var(--color-foreground);
    }

    &--visible {
      color: var(--color-primary);

      &:hover {
        background: color-mix(in srgb, var(--color-primary), transparent 88%);
        color: var(--color-primary);
      }
    }
  }
}
</style>
