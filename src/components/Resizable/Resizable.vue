<template>
  <section
    ref="rootElement"
    :class="blockClasses"
    :style="rootStyles"
    :aria-label="props.ariaLabel"
    :data-test-id="testId"
  >
    <div
      :class="[bemm('pane'), bemm('pane', 'start')]"
      :data-test-id="getTestId(props.testId, 'start')"
    >
      <slot name="start" :size="currentSize" />
    </div>

    <div
      :class="bemm('handle')"
      role="separator"
      :aria-disabled="props.disabled ? 'true' : 'false'"
      :aria-label="resolvedHandleLabel"
      :aria-orientation="props.direction"
      :aria-valuemax="maximumSize"
      :aria-valuemin="props.minSize"
      :aria-valuenow="currentSize"
      :tabindex="props.disabled ? -1 : 0"
      :data-test-id="getTestId(props.testId, 'handle')"
      @keydown="handleHandleKeydown"
      @pointerdown="handlePointerDown"
    >
      <span
        :class="bemm('grip')"
        :data-test-id="getTestId(props.testId, 'grip')"
        aria-hidden="true"
      >
        <span
          :class="bemm('grip-line')"
          :data-test-id="getTestId(props.testId, 'grip-line')"
        />
      </span>
    </div>

    <div
      :class="[bemm('pane'), bemm('pane', 'end')]"
      :data-test-id="getTestId(props.testId, 'end')"
    >
      <slot name="end" :size="currentSize" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useBemm } from 'bemm'

import { useSettingsStore } from '@/stores/settings'

import type { ResizableEventContext, ResizableProps, ResizableSource } from './Resizable.model'
import { getTestId } from '../../utils/testId'

defineOptions({
  name: 'Resizable',
})

const props = withDefaults(defineProps<ResizableProps>(), {
  ariaLabel: undefined,
  defaultSize: 280,
  direction: 'horizontal',
  disabled: false,
  handleLabel: undefined,
  keyboardStep: 16,
  maxSize: undefined,
  minSecondarySize: 320,
  minSize: 180,
  modelValue: undefined,
  settingsKey: undefined,
})

const emit = defineEmits<{
  'resize': [payload: ResizableEventContext]
  'resize-end': [payload: ResizableEventContext]
  'resize-start': [payload: ResizableEventContext]
  'update:modelValue': [value: number]
}>()

defineSlots<{
  end?: (props: { size: number }) => any
  start?: (props: { size: number }) => any
}>()

interface DragState {
  origin: number
  size: number
}

const bemm = useBemm('resizable')
const settingsStore = useSettingsStore()
const rootElement = ref<HTMLElement | null>(null)
const storedSize = typeof props.settingsKey === 'string'
  ? settingsStore.getResizableSize(props.settingsKey)
  : null
const currentSize = ref(
  typeof props.modelValue === 'number'
    ? props.modelValue
    : storedSize ?? props.defaultSize
)
const dragState = ref<DragState | null>(null)

watch(() => props.modelValue, (value) => {
  if (typeof value === 'number') {
    currentSize.value = value
  }
})

watch(() => props.settingsKey, (value) => {
  if (!value || typeof props.modelValue === 'number') {
    return
  }

  const nextStoredSize = settingsStore.getResizableSize(value)

  if (typeof nextStoredSize === 'number') {
    currentSize.value = nextStoredSize
  }
}, { immediate: true })

const maximumSize = computed(() => getMaximumSize())
const resolvedHandleLabel = computed(() => {
  if (props.handleLabel) {
    return props.handleLabel
  }

  return props.direction === 'vertical' ? 'Resize panels vertically' : 'Resize panels horizontally'
})
const blockClasses = computed(() => [
  bemm(),
  bemm('', props.direction),
  props.disabled ? bemm('', 'disabled') : '',
])
const rootStyles = computed(() => ({
  '--resizable-primary-size': `${currentSize.value}px`,
  '--resizable-min-size': `${props.minSize}px`,
  '--resizable-min-secondary-size': `${props.minSecondarySize}px`,
}))

function getContainerSize() {
  const rect = rootElement.value?.getBoundingClientRect()

  if (!rect) {
    return 0
  }

  return props.direction === 'vertical' ? rect.height : rect.width
}

function getMaximumSize() {
  const containerSize = getContainerSize()
  const fallbackMaximum = props.maxSize ?? currentSize.value

  if (containerSize <= 0) {
    return Math.max(props.minSize, fallbackMaximum)
  }

  const availableMaximum = Math.max(props.minSize, containerSize - props.minSecondarySize)

  if (typeof props.maxSize === 'number') {
    return Math.max(props.minSize, Math.min(props.maxSize, availableMaximum))
  }

  return availableMaximum
}

function normalizeSize(size: number) {
  const maximum = getMaximumSize()

  return Math.min(Math.max(size, props.minSize), maximum)
}

function setSize(nextSize: number, source: ResizableSource, event?: Event) {
  const normalizedSize = normalizeSize(nextSize)

  if (normalizedSize === currentSize.value) {
    return normalizedSize
  }

  currentSize.value = normalizedSize

  if (props.settingsKey) {
    settingsStore.setResizableSize(props.settingsKey, normalizedSize)
  }

  emit('update:modelValue', normalizedSize)
  emit('resize', {
    event,
    size: normalizedSize,
    source,
  })

  return normalizedSize
}

function getEventCoordinate(event: PointerEvent) {
  return props.direction === 'vertical' ? event.clientY : event.clientX
}

function handlePointerMove(event: PointerEvent) {
  if (!dragState.value) {
    return
  }

  const delta = getEventCoordinate(event) - dragState.value.origin

  setSize(dragState.value.size + delta, 'pointer', event)
}

function stopPointerResize(event?: PointerEvent) {
  if (!dragState.value) {
    return
  }

  dragState.value = null

  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  emit('resize-end', {
    event,
    size: currentSize.value,
    source: 'pointer',
  })
}

function handlePointerUp(event: PointerEvent) {
  handlePointerMove(event)
  stopPointerResize(event)
}

function handlePointerDown(event: PointerEvent) {
  if (props.disabled) {
    return
  }

  event.preventDefault()

  dragState.value = {
    origin: getEventCoordinate(event),
    size: currentSize.value,
  }

  emit('resize-start', {
    event,
    size: currentSize.value,
    source: 'pointer',
  })

  if (typeof window !== 'undefined') {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }
}

function handleHandleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  const isHorizontal = props.direction === 'horizontal'
  let nextSize: number | null = null

  if ((isHorizontal && event.key === 'ArrowRight') || (!isHorizontal && event.key === 'ArrowDown')) {
    nextSize = currentSize.value + props.keyboardStep
  }

  if ((isHorizontal && event.key === 'ArrowLeft') || (!isHorizontal && event.key === 'ArrowUp')) {
    nextSize = currentSize.value - props.keyboardStep
  }

  if (event.key === 'Home') {
    nextSize = props.minSize
  }

  if (event.key === 'End') {
    nextSize = getMaximumSize()
  }

  if (nextSize === null) {
    return
  }

  event.preventDefault()
  setSize(nextSize, 'keyboard', event)
}

function resizeTo(size: number, event?: Event) {
  return setSize(size, 'programmatic', event)
}

onBeforeUnmount(() => {
  stopPointerResize()
})

defineExpose({
  resizeTo,
})
</script>

<style lang="scss">
.resizable {
  --resizable-handle-size: 0;

  display: grid;
  min-width: 0;
  min-height: 0;

  &--horizontal {
    grid-template-columns:
      minmax(var(--resizable-min-size), var(--resizable-primary-size))
      var(--resizable-handle-size)
      minmax(var(--resizable-min-secondary-size), 1fr);
  }

  &--vertical {
    grid-template-rows:
      minmax(var(--resizable-min-size), var(--resizable-primary-size))
      var(--resizable-handle-size)
      minmax(var(--resizable-min-secondary-size), 1fr);
  }

  &__pane {
    min-width: 0;
    min-height: 0;
  }

  &__handle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-foreground);
    transition: background-color 160ms ease, color 160ms ease;
    touch-action: none;
    width: 0;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
    }

    &:hover {
      background: color-mix(in srgb, var(--color-primary), transparent 94%);
      color: color-mix(in srgb, var(--color-foreground), transparent 16%);
    }
  }

  &__grip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: .5em;
    flex-shrink: 0;
    height: 100%;
  }

  &__grip-line {
    display: block;
    border-radius: var(--border-radius);
    background: currentColor;
    opacity: .25;
  }

  &--horizontal {
    .resizable__handle {
      cursor: col-resize;
    }

    .resizable__grip {
      flex-direction: column;
    }

    .resizable__grip-line {
      width: var(--space-xs);
      height: var(--space-l);
    }
  }

  &--vertical {
    .resizable__handle {
      cursor: row-resize;
    }

    .resizable__grip {
      flex-direction: row;
    }

    .resizable__grip-line {
      width:  var(--space-l);
      height: var(--space-xs);
    }
  }

  &--disabled {
    .resizable__handle {
      cursor: default;
      opacity: 0.5;
    }
  }
}
</style>
