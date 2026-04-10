<template>
  <div :class="bemm()">
    <div
      v-for="(item, index) in localItems"
      :key="item.key"
      :class="bemm('item')"
    >
      <button type="button" :class="bemm('move')" :disabled="index === 0" @click="moveItem(index, -1)">
        ↑
      </button>
      <button
        type="button"
        :class="bemm('move')"
        :disabled="index === localItems.length - 1"
        @click="moveItem(index, 1)"
      >
        ↓
      </button>
      <label :class="bemm('label')">
        <input type="checkbox" :checked="item.visible" @change="toggleVisibility(item.key)" />
        <span>{{ item.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBemm } from 'bemm'
import type { DraggableVisibilityMenuItem } from './DraggableVisibilityMenu.model'

const props = withDefaults(defineProps<{
  items?: DraggableVisibilityMenuItem[]
}>(), {
  items: () => []
})

const emit = defineEmits<{
  'update:items': [items: DraggableVisibilityMenuItem[]]
}>()

const bemm = useBemm('draggable-visibility-menu', { return: 'string', includeBaseClass: true })
const localItems = ref<DraggableVisibilityMenuItem[]>([])

watch(
  () => props.items,
  (items) => {
    localItems.value = [...items]
  },
  { immediate: true, deep: true }
)

function emitItems() {
  emit('update:items', [...localItems.value])
}

function moveItem(index: number, direction: -1 | 1) {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= localItems.value.length) {
    return
  }

  const items = [...localItems.value]
  const [item] = items.splice(index, 1)
  items.splice(nextIndex, 0, item)
  localItems.value = items
  emitItems()
}

function toggleVisibility(key: string) {
  localItems.value = localItems.value.map((item) =>
    item.key === key ? { ...item, visible: !item.visible } : item
  )
  emitItems()
}
</script>

<style lang="scss">
.draggable-visibility-menu {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  &__item {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr);
    gap: var(--space-xs);
    align-items: center;
  }

  &__move {
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 85%);
    background: var(--color-background);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
  }

  &__label {
    display: inline-flex;
    gap: var(--space-xs);
    align-items: center;
  }
}
</style>
