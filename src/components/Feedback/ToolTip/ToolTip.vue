<template>
  <div :class="blockClasses" :style="tooltipStyle">
    <div :class="bemm('text')">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm';
import { watch, useSlots, ref, computed, type PropType } from 'vue';
import { ToolTipPosition } from './ToolTip.model';

const bemm = useBemm('tool-tip');
const slots = useSlots();

const props = defineProps({
  position: {
    type: String as PropType<ToolTipPosition>,
    default: ToolTipPosition.BOTTOM,
  },
  delay: {
    type: Number,
    default: 0.5,
  },
});

const isLarge = ref(false);

watch(
  () => slots,
  () => {
    if (slots.default) {
      isLarge.value = !!(slots.default.length > 50);
    }
  },
  {
    immediate: true,
  },
);

const tooltipStyle = computed(() => ({
  '--tooltip-delay': `${props.delay}s`,
}));

const blockClasses = computed(() => {
  return [bemm(), bemm('', props.position)];
});
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

:has(> .tool-tip) {
  &:hover {
    .tool-tip {
      opacity: 1 !important;
      transition-delay: var(--tooltip-delay, 0.5s);
    }
  }
}

.tool-tip {
  @include m.component-props((
    'z-index': '20',
    'initial-transform': 'scale(0) translateX(-50%) translateY(50%)',
    'transition': 'all 0.2s ease-in-out',
    'arrow-size': '0.75em',
  ), 'tool-tip');

  position: absolute;
  opacity: 0;
  background-color: var(--color-foreground);
  color: var(--color-background);
  padding: var(--space-s) calc(var(--space) / 3 * 2);
  border-radius: var(--border-radius);
  font-size: var(--tooltip-font-size, 0.75em);
  z-index: var(--int-tool-tip-z-index);
  pointer-events: none;
  white-space: nowrap;
  transform: var(--int-tool-tip-initial-transform);
  transition: var(--int-tool-tip-transition);
  transition-delay: 0s;

  &--bottom {
    left: 50%;
    top: 100%;
    transform: scale(1) translateX(var(--context-tooltip-x, -50%))
      translateY(var(--context-tooltip-y, 50%));

    &::before {
      top: 0;
      left: 50%;
      transform: translateY(-50%) translateX(-50%) rotate(-45deg);
      border-top-right-radius: 0.25em;
    }
  }

  &--top {
    left: 50%;
    bottom: 100%;
    transform: scale(1) translateX(var(--context-tooltip-x, -50%))
      translateY(var(--context-tooltip-y, 0%));

    &::before {
      bottom: 0;
      left: 50%;
      transform: translateY(50%) translateX(-50%) rotate(135deg);
      border-top-right-radius: 0.25em;
      background-color: blue;
    }
  }

  &--right {
    left: 100%;
    top: 50%;
    transform: scale(1) translateX(var(--context-tooltip-x, 10%))
      translateY(var(--context-tooltip-y, -50%));

    &::before {
      top: 50%;
      left: 0%;
      transform: translateY(-50%) translateX(-50%) rotate(-45deg);
      border-top-left-radius: 0.25em;
    }
  }

  &::before {
    content: '';
    width: var(--int-tool-tip-arrow-size);
    height: var(--int-tool-tip-arrow-size);
    display: block;
    position: absolute;
    background-color: inherit;
  }

  &__text {
    position: relative;
    z-index: 2;
    width: fit-content;
    display: block;
  }
}
</style>
