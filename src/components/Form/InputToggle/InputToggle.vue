<template>
  <div
    :class="[bemm(), size ? bemm('', String(size)) : '']"
    :data-test-id="testId"
  >
    <div
      :class="bemm('wrapper')"
      :data-test-id="getTestId(props.testId, 'wrapper')"
    >
      <button
        v-if="leftItem"
        type="button"
        :class="bemm('side', { active: isLeft })"
        :disabled="disabled"
        :data-test-id="getTestId(props.testId, 'left')"
        @click="selectLeft"
      >
        <Icon
          v-if="leftItem.icon"
          :name="leftItem.icon"
          :class="bemm('side-icon')"
          :data-test-id="getTestId(props.testId, 'left-icon')"
        />
        <span
          v-if="leftItem.label"
          :class="bemm('side-label')"
          :data-test-id="getTestId(props.testId, 'left-label')"
        >{{ leftItem.label }}</span>
      </button>

      <label
        :class="bemm('control', { disabled })"
        :style="controlStyle"
        :data-test-id="getTestId(props.testId, 'control')"
      >
        <input
          ref="inputRef"
          :checked="isChecked"
          :class="bemm('input')"
          :data-test-id="getTestId(props.testId, 'input')"
          :disabled="disabled"
          :name="name"
          type="checkbox"
          @change="handleToggle"
        />
        <span
          :class="bemm('track')"
          :data-test-id="getTestId(props.testId, 'track')"
        >
          <span
            :class="bemm('thumb')"
            :data-test-id="getTestId(props.testId, 'thumb')"
          >
            <Icon
              v-if="activeIcon"
              :name="activeIcon"
              :class="bemm('thumb-icon')"
              :data-test-id="getTestId(props.testId, 'thumb-icon')"
            />
          </span>
        </span>
      </label>

      <button
        v-if="rightItem"
        type="button"
        :class="bemm('side', { active: !isLeft })"
        :disabled="disabled"
        :data-test-id="getTestId(props.testId, 'right')"
        @click="selectRight"
      >
        <Icon
          v-if="rightItem.icon"
          :name="rightItem.icon"
          :class="bemm('side-icon')"
          :data-test-id="getTestId(props.testId, 'right-icon')"
        />
        <span
          v-if="rightItem.label"
          :class="bemm('side-label')"
          :data-test-id="getTestId(props.testId, 'right-label')"
        >{{ rightItem.label }}</span>
      </button>

      <span
        v-if="label"
        :class="bemm('label')"
        :data-test-id="getTestId(props.testId, 'label')"
        @click="focusInput"
      >
        {{ label }}
      </span>
    </div>

    <div
      v-if="description"
      :class="bemm('description')"
      :data-test-id="getTestId(props.testId, 'description')"
    >
      {{ description }}
    </div>

    <div
      v-if="error.length"
      :class="bemm('errors')"
      :data-test-id="getTestId(props.testId, 'errors')"
    >
      <span
        v-for="err in error"
        :key="err"
        :class="bemm('error')"
        :data-test-id="getTestId(props.testId, 'error')"
      >
        {{ err }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useBemm } from 'bemm'
import Icon from '../../Icon/Icon.vue'
import type { InputToggleEmits, InputToggleProps, ToggleItem, ToggleValue } from './InputToggle.model'
import { getTestId } from '../../../utils/testId'

const model = defineModel<ToggleValue>({ default: false })

const props = withDefaults(defineProps<InputToggleProps>(), {
  label: '',
  description: '',
  disabled: false,
  error: () => [],
  size: 'medium',
  color: 'primary',
  required: false,
})

const emit = defineEmits<InputToggleEmits>()

const block = 'input-toggle'
const bemm = useBemm(block, { includeBaseClass: true })

const inputRef = ref<HTMLInputElement | null>(null)

const leftItem = computed<ToggleItem | null>(() => {
  if (!props.items) return null
  return props.items[0] ?? null
})

const rightItem = computed<ToggleItem | null>(() => {
  if (!props.items) return null
  return props.items[1] ?? null
})

const isChecked = computed(() => {
  if (props.items) {
    return model.value === rightItem.value?.value
  }
  return Boolean(model.value)
})

const isLeft = computed(() => !isChecked.value)

const activeIcon = computed(() => {
  if (!props.items) return null
  return isChecked.value
    ? rightItem.value?.icon ?? null
    : leftItem.value?.icon ?? null
})

const controlStyle = computed(() => ({
  '--input-toggle-active-color': `var(--color-${props.color})`,
}))

function focusInput() {
  inputRef.value?.focus()
}

function handleToggle(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  if (props.items) {
    model.value = checked
      ? rightItem.value!.value
      : leftItem.value!.value
  } else {
    model.value = checked
  }
  emit('change', model.value)
  emit('touched', true)
}

function selectLeft() {
  if (props.disabled) return
  if (props.items) {
    model.value = leftItem.value!.value
  } else {
    model.value = false
  }
  emit('change', model.value)
  emit('touched', true)
}

function selectRight() {
  if (props.disabled) return
  if (props.items) {
    model.value = rightItem.value!.value
  } else {
    model.value = true
  }
  emit('change', model.value)
  emit('touched', true)
}
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.input-toggle {
  --input-toggle-height: m.p('height', calc(var(--space) * 1.5));
  --input-toggle-width: m.p('width', calc(var(--space) * 2.55));
  --input-toggle-padding: m.p('padding', calc(var(--space-xs) * 0.7));
  --input-toggle-thumb-size: calc(var(--input-toggle-height) - (var(--input-toggle-padding) * 2));
  --input-toggle-active-color: var(--color-primary);

  display: inline-flex;
  flex-direction: column;
  gap: m.p('gap', var(--space-xs));

  &--small {
    --input-toggle-height: m.p('height', calc(var(--space) * 1.25));
    --input-toggle-width: m.p('width', calc(var(--space) * 2.2));

    .input-toggle__thumb-icon {
      display: none;
    }
  }

  &--large {
    --input-toggle-height: m.p('height', calc(var(--space) * 1.8));
    --input-toggle-width: m.p('width', calc(var(--space) * 3));
  }

  &__wrapper {
    display: inline-flex;
    align-items: center;
    gap: m.p('wrapper-gap', var(--space-s));
  }

  &__label {
    font-size: m.p('label-font-size', 0.9em);
    cursor: pointer;
    user-select: none;
  }

  &__description {
    font-size: m.p('description-font-size', 0.8em);
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }

  &__errors {
    display: flex;
    flex-direction: column;
    gap: m.p('errors-gap', var(--space-xs));
  }

  &__error {
    font-size: m.p('description-font-size', 0.8em);
    color: var(--color-error);
  }

  &__side {
    display: inline-flex;
    align-items: center;
    gap: m.p('side-gap', calc(var(--space-xs) * 1.2));
    border: none;
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    font-size: m.p('side-font-size', calc(var(--font-size) * 0.85));
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    transition: color 160ms ease;

    &:hover:not(&--disabled) {
      color: var(--color-foreground);
    }

    &--active {
      color: var(--input-toggle-active-color);
      font-weight: 700;
    }
  }

  &__side-icon {
    width: m.p('side-icon-size', var(--space));
    height: m.p('side-icon-size', var(--space));
  }

  &__side-label {
    white-space: nowrap;
  }

  &__control {
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    &--disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }
  }

  &__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;

    &:focus-visible + .input-toggle__track {
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--input-toggle-active-color), transparent 75%);
    }

    &:checked + .input-toggle__track {
      background: color-mix(in srgb, var(--input-toggle-active-color), var(--color-background) 12%);
      border-color: color-mix(in srgb, var(--input-toggle-active-color), transparent 45%);
    }

    &:checked + .input-toggle__track .input-toggle__thumb {
      transform: translateX(calc(var(--input-toggle-width) - var(--input-toggle-thumb-size) - (var(--input-toggle-padding) * 2)));
    }
  }

  &__track {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: var(--input-toggle-width);
    height: var(--input-toggle-height);
    padding: var(--input-toggle-padding);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 82%);
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-foreground), transparent 93%);
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  &__thumb {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--input-toggle-thumb-size);
    height: var(--input-toggle-thumb-size);
    border-radius: 999px;
    background: var(--color-background);
    box-shadow: 0 0.12rem 0.5rem color-mix(in srgb, var(--color-foreground), transparent 84%);
    transition: transform 180ms ease;
  }

  &__thumb-icon {
    width: calc(var(--input-toggle-thumb-size) * 0.6);
    height: calc(var(--input-toggle-thumb-size) * 0.6);
    color: var(--input-toggle-active-color);
  }
}
</style>
