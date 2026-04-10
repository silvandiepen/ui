<template>
  <div :class="blockClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBemm } from 'bemm';
import type { ButtonGroupProps } from './ButtonGroup.model';

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  direction: 'row',
  fluid: false,
  gap: 'medium',
  align: 'start',
  justify: 'start'
});

const { bemm } = useBemm('button-group');

const blockClasses = computed(() => {
  const classes = [bemm()];
  
  classes.push(bemm('', props.direction));
  classes.push(bemm('', `gap-${props.gap}`));
  classes.push(bemm('', `align-${props.align}`));
  classes.push(bemm('', `justify-${props.justify}`));
  
  if (props.fluid) {
    classes.push(bemm('', 'fluid'));
  }
  
  if (props.wrap) {
    classes.push(bemm('', 'wrap'));
  }
  
  return classes;
});
</script>

<style lang="scss">
.button-group {
  display: flex;
  gap: var(--button-group-gap, var(--space-s));

  // Direction
  &--row {
    flex-direction: row;
  }

  &--column {
    flex-direction: column;
  }

  // Gap sizes
  &--gap-none {
    --button-group-gap: 0;
  }

  &--gap-small {
    --button-group-gap: var(--space-xs);
  }

  &--gap-medium {
    --button-group-gap: var(--space-s);
  }

  &--gap-large {
    --button-group-gap: var(--space);
  }

  // Alignment
  &--align-start {
    align-items: flex-start;
  }

  &--align-center {
    align-items: center;
  }

  &--align-end {
    align-items: flex-end;
  }

  &--align-stretch {
    align-items: stretch;
  }

  // Justify
  &--justify-start {
    justify-content: flex-start;
  }

  &--justify-center {
    justify-content: center;
  }

  &--justify-end {
    justify-content: flex-end;
  }

  &--justify-between {
    justify-content: space-between;
  }

  &--justify-around {
    justify-content: space-around;
  }

  // Modifiers
  &--fluid {
    width: 100%;
    
    &.button-group--gap-none {
      .button {
        flex: 1;
        border-radius: 0;
        
        &:first-child {
          border-top-left-radius: var(--border-radius);
          border-bottom-left-radius: var(--border-radius);
        }
        
        &:last-child {
          border-top-right-radius: var(--border-radius);
          border-bottom-right-radius: var(--border-radius);
        }
      }
    }
  }

  &--wrap {
    flex-wrap: wrap;
  }

  // Reset margins on buttons
  .button {
    margin: 0;
  }
}
</style>