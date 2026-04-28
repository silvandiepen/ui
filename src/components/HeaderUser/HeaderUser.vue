<template>
  <component
    :is="componentTag"
    :to="componentTag === 'router-link' ? to : undefined"
    :href="componentTag === 'a' ? href : undefined"
    :type="componentTag === 'button' ? 'button' : undefined"
    :class="bemm()"
    :data-test-id="testId"
  >
    <span
      :class="bemm('avatar')"
      :data-test-id="getTestId(props.testId, 'avatar')"
    >{{ initials }}</span>
    <span
      :class="bemm('copy')"
      :data-test-id="getTestId(props.testId, 'copy')"
    >
      <span
        :class="bemm('name')"
        :data-test-id="getTestId(props.testId, 'name')"
      >{{ name }}</span>
      <span
        v-if="email"
        :class="bemm('email')"
        :data-test-id="getTestId(props.testId, 'email')"
      >{{ email }}</span>
    </span>
    <Icon
      v-if="trailingIcon"
      :name="trailingIcon"
      :class="bemm('icon')"
      :data-test-id="getTestId(props.testId, 'icon')"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { Icon } from '../Icon'
import type { HeaderUserProps } from './HeaderUser.model'
import { getTestId } from '../../utils/testId'

const props = withDefaults(defineProps<HeaderUserProps>(), {
  email: '',
  href: undefined,
  to: undefined,
  element: 'button',
  trailingIcon: '',
})

const { bemm } = useBemm('header-user', { includeBaseClass: true })

const componentTag = computed(() => {
  if (props.to) {
    return 'router-link'
  }

  if (props.href) {
    return 'a'
  }

  return props.element
})

const initials = computed(() => {
  const parts = props.name.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
  }

  return (parts[0] || 'A').slice(0, 2).toUpperCase()
})
</script>

<style lang="scss">
.header-user {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
  padding: 0.55rem 0.7rem 0.55rem 0.6rem;
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-background), transparent 6%);
  color: var(--color-foreground);
  text-decoration: none;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);

  &:hover,
  &:focus-visible {
    text-decoration: none;
    background: color-mix(in srgb, var(--color-foreground), transparent 96%);
    border-color: color-mix(in srgb, var(--color-primary), transparent 76%);
  }

  &__avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary), transparent 84%);
    color: var(--color-foreground);
    font-size: 0.8rem;
    font-weight: var(--font-weight-extra-bold, 700);
    letter-spacing: 0.04em;
    flex: 0 0 2.3rem;
  }

  &__copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
    text-align: left;
  }

  &__name,
  &__email {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__name {
    font-weight: var(--font-weight-semibold, 600);
    line-height: 1.1;
  }

  &__email {
    color: color-mix(in srgb, var(--color-foreground), transparent 36%);
    font-size: 0.85rem;
    line-height: 1.1;
  }

  &__icon {
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
    flex: 0 0 auto;
  }
}
</style>
