<template>
  <div
    :class="iconClasses"
    :aria-hidden="!ariaLabel"
    :aria-label="ariaLabel"
    :data-test-id="testId"
    v-bind="$attrs"
    v-html="iconContent"
  />
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  color: currentColor;

  --icon-fill: #{m.p('fill', transparent)};

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
    width: m.p('size', 1em);
    height: m.p('size', 1em);
  }

  &--medium {
    width: m.p('size', 1.25em);
    height: m.p('size', 1.25em);
  }

  &--large {
    width: m.p('size', 2em);
    height: m.p('size', 2em);
  }

  &--xl {
    width: m.p('size', 4em);
    height: m.p('size', 4em);
  }
}
</style>
