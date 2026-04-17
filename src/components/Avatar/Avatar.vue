<template>
  <div :class="['avatar', size && `avatar--${size}`]">
    <img v-if="src" :src="src" :alt="alt" class="avatar__image" />
    <div v-else class="avatar__initials">
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'medium'
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
})
</script>

<script lang="ts">
import { computed } from 'vue'
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: m.p('border-radius', 50%);
  background: m.p('background', var(--color-primary));
  color: m.p('color', white);
  font-weight: m.p('font-weight', var(--font-weight-semibold));
  overflow: hidden;

  &--small {
    width: m.p('size', var(--space));
    height: m.p('size', var(--space));
    font-size: var(--font-size-xs);
  }

  &--medium {
    width: m.p('size', var(--space-l));
    height: m.p('size', var(--space-l));
    font-size: var(--font-size-s);
  }

  &--large {
    width: m.p('size', var(--space-xl));
    height: m.p('size', var(--space-xl));
    font-size: var(--font-size-m);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__initials {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
