<template>
  <component
    :is="componentTag"
    :to="componentTag === 'router-link' ? props.to : undefined"
    :href="linkHref"
    :class="blockClasses"
    :disabled="componentTag === 'button' ? isDisabled : undefined"
    :type="buttonType"
    :style="buttonStyles"
    :title="tooltip"
    v-bind="$attrs"
  >
    <div :class="bemm('container')">
      <span v-if="icon && !iconAfter" :class="bemm('icon')">
        <Icon :name="icon" />
      </span>
      <span v-if="hasSlot && !props.iconOnly" :class="bemm('text')">
        <slot />
      </span>
      <span v-if="icon && iconAfter" :class="bemm('icon')">
        <Icon :name="icon" />
      </span>
    </div>
    <div v-if="loading" :class="bemm('loading')">
      <span class="spinner" />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, useSlots, ref, watch } from 'vue'
import { useBemm } from 'bemm'
import Icon from '../Icon/Icon.vue'
import {
  ButtonType,
  ButtonSize,
  ButtonVariant,
  type ButtonProps
} from './Button.model'

const props = withDefaults(defineProps<ButtonProps>(), {
  size: ButtonSize.MEDIUM,
  type: ButtonType.BUTTON,
  variant: ButtonVariant.PRIMARY,
  color: undefined,
  disabled: false,
  loading: false,
  iconOnly: false,
  iconAfter: false,
  to: undefined,
  href: undefined,
  element: 'button',
})

const { bemm } = useBemm('button')
const slots: ReturnType<typeof useSlots> = useSlots()

const resolvedVariant = computed(() =>
  props.variant === ButtonVariant.DEFAULT ? ButtonVariant.PRIMARY : props.variant
)

const blockClasses = computed(() => {
  const classes = [bemm()]

  if (props.icon) {
    classes.push(bemm('', 'has-icon'))
  }

  classes.push(bemm('', props.size))
  classes.push(bemm('', resolvedVariant.value))

  if (!hasSlot.value && props.icon || props.iconOnly) {
    classes.push(bemm('', 'icon-only'))
  }

  if (hasSlot.value && props.icon) {
    classes.push(bemm('', 'text-icon'))
  }

  if (props.loading) {
    classes.push(bemm('', 'loading'))
  }

  if (props.block) {
    classes.push(bemm('', 'block'))
  }

  if (isDisabled.value) {
    classes.push(bemm('', 'disabled'))
  }

  return classes
})

const isDisabled = ref(props.disabled)
watch(
  () => props.disabled,
  (newValue) => {
    isDisabled.value = newValue || props.loading
  },
  { immediate: true }
)

watch(
  () => props.loading,
  (newValue) => {
    isDisabled.value = props.disabled || newValue
  }
)

const hasSlot = computed((): boolean => !!slots?.default)

// Computed properties for component rendering
const componentTag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return props.element || 'button'
})

const linkHref = computed(() => {
  if (componentTag.value === 'router-link') return undefined
  return props.href ? props.href : undefined
})

const buttonType = computed(() => {
  if (componentTag.value !== 'button') return undefined
  return props.type
})

const buttonStyles = computed(() => {
  const baseStyles: Record<string, string> = {}

  if (props.color) {
    baseStyles['--button-color'] = `var(--color-${props.color})`;
    baseStyles['--button-color-text'] = `var(--color-${props.color}-text)`;
    // For outline variant, text color should match the border color
    if (resolvedVariant.value === ButtonVariant.OUTLINE) {
      baseStyles['--button-color-text'] = `var(--color-${props.color})`;
      baseStyles['--button-color-text-hover'] = `var(--color-${props.color}-text)`;
    }
  }

  return baseStyles
})
</script>

<style lang="scss">
.button {
  --button-color: var(--color-primary);
  --button-color-text: var(--color-primary-text);
  --button-background: var(--button-color);

  position: relative;
  width: fit-content;
  display: inline-flex;
  color: var(--button-color-text);
  background-color: transparent;
  border: none;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: var(--border-radius-xl);
  font-family: inherit;


  &--outline {
    --button-background: transparent;
    --button-color-text: var(--button-color, var(--color-primary));
    --button-border: 1px solid var(--button-color, var(--color-primary));

    &:hover:not(:disabled) {
      --button-background: var(--button-color, var(--color-primary));
      --button-color-text: var(--button-color-text-hover, var(--color-primary-text));
    }
  }

  &--ghost {
    --button-background: transparent;
    --button-color-text: var(--button-color);

    &:hover:not(:disabled) {
      --button-color-text: var(--button-color-text);
      --button-background: color-mix(in srgb, var(--button-color), transparent 75%);
    }
  }

  &--danger {
    --button-background: var(--color-error);
    --button-color-text: var(--color-background);

    &:hover:not(:disabled) {
      opacity: 0.85;
    }
  }

  // Background
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--button-background);
    border: var(--button-border, none);
    border-radius: var(--border-radius-xl);
    transition: all 0.2s ease;
    z-index: 0;
  }

  // States
  &:disabled,
  &--disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  &--loading {
    pointer-events: none;

    .button__container {
      opacity: 0;
    }
  }

  &--block {
    width: 100%;
  }

  // Container
  &__container {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-s);
    border-radius: inherit;
    width: 100%;
  }

  // Sizes
  &--small {
    .button__container {
      padding: var(--space-xs) var(--space-s);
      font-size: 0.66em;
    }
  }

  &--medium {
    .button__container {
      padding: var(--space-s) var(--space);
      font-size: 1rem;
    }
  }

  &--large {
    .button__container {
      padding: var(--space) var(--space-l);
      font-size: 1.125rem;
    }
  }

  &--icon-only {
    .button__container {
      padding: var(--space-s);
      aspect-ratio: 1;
    }

    .button__text {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }
  }

  // Elements
  &__text {
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  &__icon {
    display: flex;
    align-items: center;
    font-size: 1.25em;
  }

  &__loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;

    .spinner {
      width: 1.5em;
      height: 1.5em;
      border: 2px solid var(--button-color-text);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
