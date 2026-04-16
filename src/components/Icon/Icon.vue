<template>
  <div :class="iconClasses" :aria-hidden="!ariaLabel" :aria-label="ariaLabel" v-bind="$attrs" v-html="iconContent" />
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useBemm } from 'bemm'
import { getIcon } from 'open-icon'
import type { IconProps } from './Icon.model'
import { resolveIconName } from './Icon.data'

const props = withDefaults(defineProps<IconProps>(), {
  size: 'medium'
})

const { bemm } = useBemm('icon')

const iconClasses = computed(() => {
  const classes = [bemm()]

  if (props.size) {
    classes.push(bemm('', props.size))
  }

  if (props.color) {
    classes.push(bemm('', `color-${props.color}`))
  }

  return classes
})

// Store the icon SVG content
const iconContent = ref('')

// Load icon when name changes
watchEffect(async () => {
  if (!props.name) {
    iconContent.value = ''
    return
  }

  const iconName = resolveIconName(props.name)

  try {
    if (iconName) {
      iconContent.value = await getIcon(iconName)
    } else {
      console.warn(`Icon "${props.name}" not found`)
      iconContent.value = ''
    }
  } catch {
    console.warn(`Icon "${props.name}" not found`)
    iconContent.value = ''
  }
})
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.icon {
  @include m.component-props((
    'fill':        'transparent',
    'size-small':  '1em',
    'size-medium': '1.25em',
    'size-large':  '2em',
    'size-xl':     '4em',
  ), 'icon');

  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  color: currentColor;

  --icon-fill: var(--int-icon-fill);

  // SVG styling
  svg {
    width: 100%;
    height: 100%;
    path,rect,line,circle, polyline{
      stroke: currentColor;
    }
  }

  // Size variants
  &--small {
    width: var(--int-icon-size-small);
    height: var(--int-icon-size-small);
  }

  &--medium {
    width: var(--int-icon-size-medium);
    height: var(--int-icon-size-medium);
  }

  &--large {
    width: var(--int-icon-size-large);
    height: var(--int-icon-size-large);
  }

  &--xl {
    width: var(--int-icon-size-xl);
    height: var(--int-icon-size-xl);
  }
}
</style>
