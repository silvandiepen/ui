<script setup lang="ts">
import { computed } from 'vue'
import { Popup, Toast, Icon } from '@sil/ui'
import { useInvitations } from '@/composables/useInvitations'
import { useRouter } from 'vue-router'
import OpenInAppBanner from '@/components/OpenInAppBanner.vue'

const router = useRouter()
const { pending, dismiss } = useInvitations()

const latestInvitation = computed(() => pending.value[0] || null)

function openInvitation(invitation: any) {
  router.push(`/l/${invitation.list_id}`)
}

function dismissInvitation() {
  if (latestInvitation.value) {
    dismiss(latestInvitation.value)
  }
}
</script>

<template>
  <Popup />
  <Toast />
  <div class="app">
    <!-- App install/open banner — pushes content down -->
    <OpenInAppBanner />

    <!-- Invitation notification banner — pushes content down -->
    <Transition name="banner-collapse">
      <div v-if="latestInvitation" class="invitation-banner">
        <div class="invitation-banner__content">
          <Icon name="ui/mail" size="small" class="invitation-banner__icon" />
          <div class="invitation-banner__text">
            <strong>{{ latestInvitation.from_user_name }}</strong> shared a list with you:
            <em>{{ latestInvitation.list_title || 'Untitled' }}</em>
          </div>
        </div>
        <div class="invitation-banner__actions">
          <button class="invitation-banner__btn invitation-banner__btn--primary" @click="openInvitation(latestInvitation)">
            Open
          </button>
          <button class="invitation-banner__btn" @click="dismissInvitation">
            Dismiss
          </button>
        </div>
      </div>
    </Transition>

    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// Custom toast overrides — centered top, full color, rounded
.toast-container--top {
  left: 50% !important;
  right: auto !important;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  max-width: 90vw;
}

// Target the @sil/ui toast component
[class*="toast"][role="status"],
[class*="toast"][role="alert"] {
  background: var(--color-primary) !important;
  color: white !important;
  border-radius: var(--border-radius-l) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  [class*="toast__icon"],
  [class*="toast__close"] {
    color: rgba(255, 255, 255, 0.8) !important;
  }

  [class*="toast__message"],
  [class*="toast__title"] {
    color: white !important;
  }
}

// Invitation banner — flow-based, pushes content down
.invitation-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);
  padding: var(--space-s) var(--space-m);
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
    color: var(--color-primary);
  }

  &__text {
    font-size: var(--font-size-s);
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    strong {
      font-weight: 600;
    }

    em {
      font-style: normal;
      color: var(--color-text-muted);
    }
  }

  &__actions {
    display: flex;
    gap: var(--space-xs);
    flex-shrink: 0;
  }

  &__btn {
    padding: var(--space-xs) var(--space-m);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-s);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-xs);
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity var(--transition-fast);

    &:hover {
      opacity: 0.85;
    }

    &--primary {
      background: var(--color-primary);
      color: var(--color-primary-text);
      border-color: var(--color-primary);
    }
  }
}
</style>
