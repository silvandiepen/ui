<template>
  <Card
    :class="blockClasses"
    :color="variant as unknown as Colors"
    :test-id="testId"
  >
    <div
      :class="bemm('container')"
      :data-test-id="getTestId(props.testId, 'container')"
    >
      <Icon
        :name="iconName"
        :class="bemm('icon')"
        :data-test-id="getTestId(props.testId, 'icon')"
      />
      <div
        :class="bemm('content')"
        :data-test-id="getTestId(props.testId, 'content')"
      >
        <h4
          v-if="title"
          :class="bemm('title')"
          :data-test-id="getTestId(props.testId, 'title')"
        >{{ title }}</h4>
        <div
          :class="bemm('description')"
          :data-test-id="getTestId(props.testId, 'description')"
        >
          <slot>{{ description }}</slot>
        </div>
      </div>
      <button
        v-if="dismissible"
        :class="bemm('dismiss')"
        :data-test-id="getTestId(props.testId, 'dismiss')"
        @click="handleDismiss"
      >
        <Icon
          name="close"
          :data-test-id="getTestId(props.testId, 'dismiss-icon')"
        />
      </button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import Card from '../Card/Card.vue'
import Icon from '../Icon/Icon.vue'
import { AlertVariant } from './Alert.model'
import type { Colors, TestIdProps } from '../../types'
import { getTestId } from '../../utils/testId'

interface Props {
  testId?: TestIdProps['testId']
  variant?: AlertVariant
  title?: string
  description?: string
  dismissible?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: AlertVariant.INFO,
  dismissible: false
})

const emit = defineEmits<{
  dismiss: []
}>()

const { bemm } = useBemm('alert')

const iconName = computed(() => {
  if (props.icon) return props.icon

  const iconMap: Record<AlertVariant, string> = {
    [AlertVariant.DEFAULT]: '',
    [AlertVariant.INFO]: 'info',
    [AlertVariant.SUCCESS]: 'check-circle',
    [AlertVariant.WARNING]: 'alert',
    [AlertVariant.ERROR]: 'error'
  }

  return iconMap[props.variant]
})

const handleDismiss = () => {
  emit('dismiss')
}

const blockClasses = computed(()=>{
  return [bemm(),
    props.variant && bemm('',props.variant)
  ]
})
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.alert {
  &__container {
    display: flex;
    gap: m.p('gap', var(--space-m));
    align-items: flex-start;
  }

  &__icon {
    font-size: m.p('size', calc(var(--space) * 1.5));
    color: var(--alert-icon-color);
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-semibold);
    margin: 0 0 var(--space-xs) 0;
    color: var(--alert-color);
  }

  &__description {
    font-size: var(--font-size-m);
    line-height: 1.5;
    color: var(--alert-color);
  }

  &__dismiss {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--alert-color);
    opacity: m.p('opacity', 0.7);
    transition: opacity var(--transition-fast);
    flex-shrink: 0;

    &:hover {
      opacity: 1;
    }

    .icon {
      font-size: m.p('size', calc(var(--space) * 1.25));
    }
  }
}
</style>
