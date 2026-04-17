<template>
  <div v-if="visible" :class="notificationClasses" role="alert">
    <Icon v-if="iconName" :name="iconName" :class="bemm('icon')" />
    <span :class="bemm('message')">
      <slot>{{ message }}</slot>
    </span>
    <button
      v-if="dismissible"
      :class="bemm('close')"
      type="button"
      :aria-label="dismissLabel"
      @click="dismiss"
    >
      <Icon :name="Icons.CLOSE" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useBemm } from 'bemm';
import { Icons } from '../../types';
import Icon from '../Icon/Icon.vue';
import type { NotificationVariant } from './Notification.model';

defineOptions({ name: 'SilNotification' });

const props = withDefaults(
  defineProps<{
    message?: string;
    type?: NotificationVariant;
    dismissible?: boolean;
    dismissLabel?: string;
    showIcon?: boolean;
  }>(),
  {
    message: undefined,
    type: 'info',
    dismissible: false,
    dismissLabel: 'Dismiss',
    showIcon: true,
  }
);

const emit = defineEmits<{
  dismiss: [];
}>();

const visible = ref(true);

const bemm = useBemm('ui-notification', { return: 'string', includeBaseClass: true });

const iconMap: Record<string, string> = {
  success: Icons.CHECK_L,
  error: Icons.CIRCLED_EXCLAMATION_MARK,
  warning: Icons.CIRCLED_EXCLAMATION_MARK,
  info: Icons.CIRCLED_INFO,
};

const iconName = computed(() =>
  props.showIcon ? (iconMap[props.type ?? 'info'] ?? null) : null
);

const notificationClasses = computed(() =>
  bemm('', { [`type-${props.type}`]: true, dismissible: props.dismissible })
);

function dismiss() {
  visible.value = false;
  emit('dismiss');
}
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.ui-notification {
  display: flex;
  align-items: center;
  gap: var(--space-s, m.p('gap', var(--space-s)));
  padding: var(--space-s, m.p('padding-y', var(--space-s))) var(--space-m, m.p('padding-x', var(--space)));
  border-radius: var(--border-radius, m.p('border-radius', var(--border-radius)));
  font-size: var(--font-size-s, m.p('font-size', var(--font-size-s)));
  line-height: m.p('line-height', 1.5);
}

.ui-notification--type-success {
  background: color-mix(in srgb, var(--color-success), transparent 85%);
  color: var(--color-success);
  border: 1px solid color-mix(in srgb, var(--color-success), transparent 60%);
}

.ui-notification--type-error {
  background: color-mix(in srgb, var(--color-error), transparent 85%);
  color: var(--color-error);
  border: 1px solid color-mix(in srgb, var(--color-error), transparent 60%);
}

.ui-notification--type-warning {
  background: color-mix(in srgb, var(--color-warning), transparent 85%);
  color: var(--color-warning);
  border: 1px solid color-mix(in srgb, var(--color-warning), transparent 60%);
}

.ui-notification--type-info {
  background: color-mix(in srgb, var(--color-info), transparent 85%);
  color: var(--color-info);
  border: 1px solid color-mix(in srgb, var(--color-info), transparent 60%);
}

.ui-notification__message {
  flex: 1;
  font-weight: 500;
}

.ui-notification__icon {
  flex-shrink: 0;
}

.ui-notification__close {
  background: none;
  border: none;
  cursor: pointer;
  color: currentColor;
  padding: var(--space-xs);
  border-radius: var(--border-radius-s, m.p('close-border-radius', var(--border-radius-s)));
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.ui-notification__close:hover {
  opacity: 1;
}
</style>
