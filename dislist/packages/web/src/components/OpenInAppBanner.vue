<script setup lang="ts">
import { Icon } from '@sil/ui'
import { useAppDetection } from '@/composables/useAppDetection'

const { isIOS, showBanner, dismissBanner } = useAppDetection()

function openInApp() {
  if (isIOS.value) {
    // Try Universal Link — iOS opens the app if installed,
    // or silently fails and stays on the page
    window.location.href = window.location.href.replace('https://', 'chikki://')
  } else {
    // Android — try intent URI or just show store
    window.location.href = 'https://apps.apple.com/app/chikki/id6738850564'
  }
}
</script>

<template>
  <Transition name="banner-collapse">
    <div v-if="showBanner" class="open-in-app">
      <div class="open-in-app__content">
        <div class="open-in-app__icon">
          <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="22" height="22" rx="5" fill="var(--color-primary)" />
            <path d="M6 11l3 3 7-7" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="open-in-app__text">
          <strong class="open-in-app__title">Open in Chikki</strong>
          <span class="open-in-app__subtitle">Disposable checklists</span>
        </div>
      </div>
      <div class="open-in-app__actions">
        <button class="open-in-app__btn" @click="openInApp">
          Open
        </button>
        <button class="open-in-app__close" @click="dismissBanner">
          <Icon name="wayfinding/cross" size="small" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
.open-in-app {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);
  padding: var(--space-s) var(--space-m);
  padding-top: calc(var(--space-s) + env(safe-area-inset-top, 0px));
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);

  &__content {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    flex: 1;
    min-width: 0;
  }

  &__icon {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: var(--border-radius-s);

    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__title {
    font-size: var(--font-size-s);
    font-weight: 600;
    color: var(--color-text);
  }

  &__subtitle {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    flex-shrink: 0;
  }

  &__btn {
    padding: var(--space-xs) var(--space-m);
    border: none;
    border-radius: var(--border-radius);
    background: var(--color-primary);
    color: var(--color-primary-text);
    font-size: var(--font-size-s);
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity var(--transition-fast);

    &:hover {
      opacity: 0.85;
    }
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--border-radius-round);
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0;
    transition: background var(--transition-fast);

    &:hover {
      background: var(--color-surface-hover);
    }
  }
}

.banner-collapse-enter-active,
.banner-collapse-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 80px;
  overflow: hidden;
}

.banner-collapse-enter-from,
.banner-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
