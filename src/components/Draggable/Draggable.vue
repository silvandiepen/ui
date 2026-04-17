<template>
  <div :class="bemm()">
    <div
      v-for="(item, index) in modelValue"
      :key="resolveKey(item, index)"
      :class="[
        bemm('item'),
        draggingIndex === index && bemm('item', 'dragging'),
        dragOverIndex === index && dropPosition === 'before' && bemm('item', 'drop-before'),
        dragOverIndex === index && dropPosition === 'after' && bemm('item', 'drop-after'),
        props.itemClass && (typeof props.itemClass === 'string' ? props.itemClass : props.itemClass(item, index)),
      ]"
      :draggable="!disabled"
      @dragstart="onDragStart(index, $event)"
      @dragover.prevent="onDragOver(index, $event)"
      @drop.prevent="onDrop(index)"
      @dragend="onDragEnd"
    >
      <span :class="bemm('handle')" aria-hidden="true">
        <Icon name="grip-vertical" />
      </span>
      <slot name="item" :item="item" :index="index" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useBemm } from 'bemm'
import { Icon } from '../Icon'
import type { DraggableProps } from './Draggable.model'

defineOptions({ name: 'Draggable' })

const props = withDefaults(defineProps<DraggableProps>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [items: unknown[]]
}>()

const { bemm } = useBemm('draggable')

const draggingIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const dropPosition = ref<'before' | 'after'>('before')

function resolveKey(item: unknown, index: number): string | number {
  if (!props.itemKey) return index
  if (typeof props.itemKey === 'string') return (item as Record<string, unknown>)[props.itemKey] as string ?? index
  return props.itemKey(item, index)
}

function onDragStart(index: number, e: DragEvent) {
  draggingIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragOver(index: number, e: DragEvent) {
  if (draggingIndex.value === null) return
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  dropPosition.value = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
  dragOverIndex.value = index
}

function onDrop(targetIndex: number) {
  const from = draggingIndex.value
  if (from === null || from === targetIndex) { onDragEnd(); return }

  const items = [...props.modelValue]
  const [moved] = items.splice(from, 1)

  // After removing `from`, indices shift when from < targetIndex
  const insertAt = dropPosition.value === 'before'
    ? (from < targetIndex ? targetIndex - 1 : targetIndex)
    : (from < targetIndex ? targetIndex : targetIndex + 1)

  items.splice(insertAt, 0, moved)
  emit('update:modelValue', items)
  onDragEnd()
}

function onDragEnd() {
  draggingIndex.value = null
  dragOverIndex.value = null
}
</script>

<style lang="scss">
.draggable {
  display: flex;
  flex-direction: column;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--space-s);
    cursor: default;
    user-select: none;

    &--dragging {
      opacity: 0.35;
    }

    &--drop-before::before,
    &--drop-after::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-primary);
      border-radius: 1px;
      pointer-events: none;
    }

    &--drop-before::before { top: -1px; }
    &--drop-after::after  { bottom: -1px; }
  }

  &__handle {
    display: flex;
    align-items: center;
    color: color-mix(in srgb, var(--color-foreground), transparent 65%);
    cursor: grab;
    flex-shrink: 0;
    padding: var(--space-xs) 0;

    &:active { cursor: grabbing; }

    .icon {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>
