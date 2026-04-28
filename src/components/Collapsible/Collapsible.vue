<template>
  <section
    :class="blockClasses"
    :data-test-id="testId"
  >
    <button
      type="button"
      :class="bemm('header')"
      :aria-controls="resolvedContentId"
      :aria-expanded="`${isOpen}`"
      :aria-label="resolvedAriaLabel"
      :disabled="props.disabled"
      :data-test-id="getTestId(props.testId, 'header')"
      @click="handleHeaderClick"
    >
      <span
        :class="bemm('header-main')"
        :data-test-id="getTestId(props.testId, 'header-main')"
      >
        <span
          v-if="hasIcon"
          :class="bemm('icon')"
          :data-test-id="getTestId(props.testId, 'icon')"
        >
          <slot name="icon">
            <Icon
              v-if="props.icon"
              :name="props.icon"
              :data-test-id="getTestId(props.testId, 'icon-svg')"
            />
          </slot>
        </span>

        <span
          v-if="hasLabel"
          :class="bemm('copy')"
          :data-test-id="getTestId(props.testId, 'label')"
        >
          <slot name="label">{{ props.label }}</slot>
        </span>
      </span>

      <span
        :class="indicatorClasses"
        :data-toggle-icon="props.toggleIcon"
        :data-test-id="getTestId(props.testId, 'indicator')"
        aria-hidden="true"
      />
    </button>

    <div
      v-show="isOpen"
      :id="resolvedContentId"
      :class="bemm('content')"
      :data-test-id="getTestId(props.testId, 'content')"
    >
      <slot
        :is-open="isOpen"
        :toggle="toggle"
        :open="open"
        :close="close"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'
import { useBemm } from 'bemm'

import { useId } from '@/composables/useId'

import { Icon } from '../Icon'

import type { CollapsibleEventContext, CollapsibleProps } from './Collapsible.model'
import { getTestId } from '../../utils/testId'

defineOptions({
  name: 'Collapsible',
})

const props = withDefaults(defineProps<CollapsibleProps>(), {
  ariaLabel: undefined,
  contentId: undefined,
  defaultOpen: false,
  disabled: false,
  icon: undefined,
  label: undefined,
  modelValue: undefined,
  toggleIcon: 'chevron',
})

const emit = defineEmits<{
  'close': [payload: CollapsibleEventContext]
  'header-click': [event: MouseEvent]
  'open': [payload: CollapsibleEventContext]
  'toggle': [payload: CollapsibleEventContext]
  'update:modelValue': [value: boolean]
}>()

defineSlots<{
  default?: (props: {
    close: (event?: Event) => void
    isOpen: boolean
    open: (event?: Event) => void
    toggle: (event?: Event) => void
  }) => any
  icon?: () => any
  label?: () => any
}>()

const slots = useSlots()
const bemm = useBemm('collapsible')
const fallbackContentId = useId()
const internalOpen = ref(props.defaultOpen)

const isControlled = computed(() => typeof props.modelValue === 'boolean')
const isOpen = computed(() => isControlled.value ? Boolean(props.modelValue) : internalOpen.value)
const resolvedContentId = computed(() => props.contentId || `collapsible-content-${fallbackContentId}`)
const resolvedAriaLabel = computed(() => props.ariaLabel || props.label || 'Toggle section')
const hasIcon = computed(() => Boolean(props.icon || slots.icon))
const hasLabel = computed(() => Boolean(props.label || slots.label))
const blockClasses = computed(() => [
  bemm(),
  isOpen.value ? bemm('', 'open') : '',
  props.disabled ? bemm('', 'disabled') : '',
])
const indicatorClasses = computed(() => [
  bemm('indicator'),
  bemm('indicator', props.toggleIcon),
  isOpen.value ? bemm('indicator', 'open') : '',
])

function setOpen(nextValue: boolean, event?: Event) {
  if (props.disabled || nextValue === isOpen.value) {
    return
  }

  if (!isControlled.value) {
    internalOpen.value = nextValue
  }

  emit('update:modelValue', nextValue)

  const payload: CollapsibleEventContext = {
    event,
    isOpen: nextValue,
  }

  emit('toggle', payload)

  if (nextValue) {
    emit('open', payload)
    return
  }

  emit('close', payload)
}

function open(event?: Event) {
  setOpen(true, event)
}

function close(event?: Event) {
  setOpen(false, event)
}

function toggle(event?: Event) {
  setOpen(!isOpen.value, event)
}

function handleHeaderClick(event: MouseEvent) {
  emit('header-click', event)
  toggle(event)
}

defineExpose({
  close,
  isOpen,
  open,
  toggle,
})
</script>

<style lang="scss">
.collapsible {
  display: grid;
  gap: 0;
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
  border-radius: calc(var(--border-radius, 1rem) * 0.9);
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 1%) 0%,
      color-mix(in srgb, var(--color-background), var(--color-primary) 1.5%) 100%
    );
  overflow: clip;

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.95rem 1rem;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition: background-color 160ms ease;

    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-primary), transparent 94%);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  &__header-main {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: color-mix(in srgb, currentColor, transparent 12%);
    flex-shrink: 0;
  }

  &__copy {
    min-width: 0;
    font-size: var(--font-size-s);
    font-weight: 600;
    line-height: 1.35;
  }

  &__indicator {
    position: relative;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    color: color-mix(in srgb, currentColor, transparent 20%);
    transition: transform 160ms ease, opacity 160ms ease;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      background: currentColor;
      transform-origin: center;
      transition: transform 160ms ease, opacity 160ms ease;
    }

    &--chevron {
      &::before {
        width: 0.5rem;
        height: 0.5rem;
        background: transparent;
        border-right: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        transform: translate(-60%, -50%) rotate(-45deg);
      }

      &::after {
        display: none;
      }
    }

    &--plus {
      &::before {
        width: 0.75rem;
        height: 2px;
        transform: translate(-50%, -50%);
      }

      &::after {
        width: 2px;
        height: 0.75rem;
        transform: translate(-50%, -50%);
      }
    }

    &--open {
      &.collapsible__indicator--chevron::before {
        transform: translate(-50%, -62%) rotate(45deg);
      }

      &.collapsible__indicator--plus::after {
        opacity: 0;
      }
    }
  }

  &__content {
    padding: 0 1rem 1rem;
    border-top: 1px solid color-mix(in srgb, var(--color-foreground), transparent 92%);
  }

  &--open {
    .collapsible__header {
      background: color-mix(in srgb, var(--color-primary), transparent 96%);
    }
  }

  &--disabled {
    opacity: 0.6;
  }
}
</style>
