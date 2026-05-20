<script setup lang="ts">
const props = withDefaults(defineProps<{
  productName: string
  hoverLabel: string
  title?: string
  scrolled?: boolean
  icon?: 'check' | 'document' | 'grid'
  label?: string
}>(), {
  title: '',
  scrolled: false,
  icon: 'check',
  label: 'Open sidebar',
})

const emit = defineEmits<{
  click: []
  pointerdown: [event: PointerEvent]
}>()
</script>

<template>
  <header class="ikki-header">
    <button class="ikki-header__brand" type="button" :aria-label="label" @pointerdown="emit('pointerdown', $event)" @click="emit('click')">
      <span class="ikki-header__mark" aria-hidden="true">
        <svg class="ikki-header__mark-svg ikki-header__mark-svg--default" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="22" height="22" rx="5" fill="var(--color-primary)" />
          <path
            v-if="props.icon === 'check'"
            d="M6 11l3 3 7-7"
            stroke="white"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            v-else-if="props.icon === 'document'"
            d="M6 7h10v2H6zM6 11h7v2H6zM6 15h9v2H6z"
            fill="white"
            opacity="0.85"
          />
          <g v-else fill="white">
            <rect x="5" y="5" width="5" height="5" rx="1" opacity="0.6" />
            <rect x="12" y="5" width="5" height="5" rx="1" opacity="0.8" />
            <rect x="5" y="12" width="5" height="5" rx="1" opacity="0.8" />
            <rect x="12" y="12" width="5" height="5" rx="1" />
          </g>
        </svg>
        <svg class="ikki-header__mark-svg ikki-header__mark-svg--hover" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="22" height="22" rx="5" fill="var(--color-primary)" />
          <path d="M8 6l6 5-6 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      <span v-if="!scrolled" class="ikki-header__brand-text">
        <span class="ikki-header__brand-default">{{ productName }}</span>
        <span class="ikki-header__brand-hover">{{ hoverLabel }}</span>
      </span>
      <Transition name="ikki-header-title-swap">
        <span v-if="scrolled && title" :key="title" class="ikki-header__scrolled-title">{{ title }}</span>
      </Transition>
    </button>

    <div class="ikki-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style lang="scss">
.ikki-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-s) var(--space);
  padding-top: calc(var(--space-s) + env(safe-area-inset-top, 0px));
  background: var(--color-toolbar-bg, color-mix(in srgb, var(--color-background), transparent 12%));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: background var(--transition-color, 0.2s ease);

  &__brand {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-decoration: none;
    color: var(--color-foreground);
    font: inherit;
    min-width: 0;

    &:hover {
      .ikki-header__brand-default {
        opacity: 0;
        transform: translateX(-4px);
      }

      .ikki-header__brand-hover {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
      }

      .ikki-header__mark-svg--default {
        opacity: 0;
        transform: rotate(-90deg) scale(0.8);
      }

      .ikki-header__mark-svg--hover {
        opacity: 1;
        transform: rotate(0deg) scale(1);
      }
    }
  }

  &__mark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    position: relative;
    flex: 0 0 22px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__mark-svg {
    position: absolute;
    inset: 0;
    transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    &--default {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    &--hover {
      opacity: 0;
      transform: rotate(90deg) scale(0.8);
    }
  }

  &__brand-text,
  &__scrolled-title {
    font-size: var(--font-size-s);
    font-weight: 600;
    letter-spacing: normal;
    white-space: nowrap;
  }

  &__brand-text {
    position: relative;
  }

  &__brand-default {
    display: inline;
    opacity: 1;
    transform: translateX(0);
    transition: opacity 0.2s ease, transform 0.25s ease;
  }

  &__brand-hover {
    display: inline;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
    white-space: nowrap;
    transform: translateX(4px);
    transition: opacity 0.2s ease 0.05s, transform 0.25s ease 0.05s;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__scrolled-title {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100vw - 180px);
    text-align: left;

    @media (min-width: 769px) {
      max-width: 300px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    flex-shrink: 0;
  }
}

.ikki-header-title-swap-enter-active,
.ikki-header-title-swap-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.ikki-header-title-swap-enter-from,
.ikki-header-title-swap-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
