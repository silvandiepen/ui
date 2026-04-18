<template>
  <Teleport to="body">
    <div
      v-for="group in toastGroups"
      :key="group.pos"
      :class="['toast-container', `toast-container--${group.pos}`]"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in group.toasts"
          :key="toast.id"
          :class="[bemm(), bemm('', resolveToastType(toast))]"
          :role="getRole(toast.type)"
          :aria-live="getAriaLive(toast.type)"
          :style="`--toast-color: var(--color-${resolveToastColor(toast)})`"
        >
          <div :class="bemm('content')">
            <Icon :class="bemm('icon')" :name="resolveToastIcon(toast)" size="small" />
            <div :class="bemm('body')">
              <p v-if="toast.title" :class="bemm('title')">{{ toast.title }}</p>
              <p :class="bemm('message')">{{ toast.message }}</p>
            </div>
          </div>
          <button
            v-if="toast.dismissible"
            :class="bemm('close')"
            type="button"
            title="Dismiss notification"
            aria-label="Dismiss notification"
            @click="dismiss(toast.id)"
          >
            <Icon name="x" size="small" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { Icon } from '../Icon'
import type { ToastInstance } from './Toast.service'
import { ToastPosition, ToastType } from './Toast.model'
import { toastService } from './Toast.service'

const { bemm } = useBemm('toast', { includeBaseClass: true })

const TOP_POSITIONS = new Set<string>([
  ToastPosition.TOP,
  ToastPosition.TOP_LEFT,
  ToastPosition.TOP_RIGHT,
])

const toastGroups = computed(() =>
  Object.values(ToastPosition)
    .map(pos => {
      const toasts = toastService.toasts.value.filter(
        t => (t.position ?? ToastPosition.TOP_RIGHT) === pos,
      )
      // Top positions: reverse so newest (last appended) renders first = visually on top
      return { pos, toasts: TOP_POSITIONS.has(pos) ? [...toasts].reverse() : toasts }
    })
    .filter(g => g.toasts.length > 0),
)

const getRole = (type?: ToastType) => (type === ToastType.ERROR ? 'alert' : 'status')
const getAriaLive = (type?: ToastType) => (type === ToastType.ERROR ? 'assertive' : 'polite')
const dismiss = (id: string) => toastService.hide(id)
const resolveToastType = (toast: ToastInstance) => toast.type || ToastType.INFO
const resolveToastColor = (toast: ToastInstance) =>
  resolveToastType(toast) === ToastType.DEFAULT ? 'primary' : resolveToastType(toast)

const resolveToastIcon = (toast: ToastInstance) => {
  if (toast.icon?.trim()) return toast.icon
  switch (resolveToastType(toast)) {
    case ToastType.SUCCESS: return 'check-circle'
    case ToastType.ERROR:
    case ToastType.WARNING: return 'alert-circle'
    default: return 'info-circle'
  }
}
</script>

<style lang="scss">
// ── Containers ────────────────────────────────────────────────────────────────

.toast-container {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs, 0.5rem);
  width: min(26rem, calc(100vw - 2rem));
  padding: var(--space, 1rem);
  pointer-events: none;
  max-height: calc(100svh - 2rem);
  overflow: hidden;

  > * {
    pointer-events: auto;
  }

  &--top    { top: 0; left: 50%; transform: translateX(-50%); align-items: center; }
  &--top-left  { top: 0; left: 0; align-items: flex-start; }
  &--top-right { top: 0; right: 0; align-items: flex-end; }

  &--bottom    { bottom: 0; left: 50%; transform: translateX(-50%); align-items: center; flex-direction: column-reverse; }
  &--bottom-left  { bottom: 0; left: 0; align-items: flex-start; flex-direction: column-reverse; }
  &--bottom-right { bottom: 0; right: 0; align-items: flex-end; flex-direction: column-reverse; }
}

// ── Transition animations ─────────────────────────────────────────────────────

.toast-enter-active,
.toast-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.toast-move {
  transition: transform 0.25s ease;
}

.toast-container--top-right,
.toast-container--bottom-right {
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateX(2rem);
  }
}

.toast-container--top-left,
.toast-container--bottom-left {
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateX(-2rem);
  }
}

.toast-container--top {
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateY(-1rem);
  }
}

.toast-container--bottom {
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateY(1rem);
  }
}

// ── Toast item ────────────────────────────────────────────────────────────────

.toast {
  --toast-border-color: color-mix(in srgb, var(--toast-color), var(--color-background) 44%);
  --toast-background-color: color-mix(in srgb, var(--toast-color), var(--color-background) 92%);
  --toast-text-color: color-mix(in srgb, var(--toast-color), var(--color-foreground) 22%);

  display: flex;
  align-items: flex-start;
  gap: var(--space-s, 0.75rem);
  width: 100%;
  padding: var(--space-m, 1rem);
  border: 1px solid var(--toast-border-color);
  border-radius: var(--border-radius-m);
  background: var(--toast-background-color);
  color: var(--toast-text-color);
  box-shadow: 0 18px 40px color-mix(in srgb, var(--color-foreground), transparent 90%);

  &__content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: var(--space-s, 0.75rem);
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 0.15rem;
    color: var(--toast-color);
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 0.2rem;
  }

  &__title {
    margin: 0;
    color: var(--color-foreground);
    font-size: 0.95rem;
    line-height: 1.35;
    font-weight: 700;
  }

  &__message {
    margin: 0;
    line-height: 1.5;
    color: color-mix(in srgb, var(--toast-text-color), var(--color-foreground) 12%);
  }

  &__close {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: none;
    border-radius: 999rem;
    background: transparent;
    color: color-mix(in srgb, var(--toast-text-color), transparent 12%);
    cursor: pointer;
    transition: background 140ms ease, color 140ms ease;

    &:hover {
      background: color-mix(in srgb, var(--toast-color), transparent 90%);
      color: var(--color-foreground);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus, var(--color-primary));
      outline-offset: 2px;
    }
  }
}
</style>
