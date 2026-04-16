<template>
  <div
    :class="[bemm(), size ? bemm('', String(size)) : '']"
  >
    <div :class="bemm('wrapper')">
      <button
        v-if="leftItem"
        type="button"
        :class="bemm('side', { active: isLeft })"
        :disabled="disabled"
        @click="selectLeft"
      >
        <Icon
          v-if="leftItem.icon"
          :name="leftItem.icon"
          :class="bemm('side-icon')"
        />
        <span v-if="leftItem.label" :class="bemm('side-label')">{{ leftItem.label }}</span>
      </button>

      <label
        :class="bemm('control', { disabled })"
        :style="controlStyle"
      >
        <input
          ref="inputRef"
          :checked="isChecked"
          :class="bemm('input')"
          :disabled="disabled"
          :name="name"
          type="checkbox"
          @change="handleToggle"
        />
        <span :class="bemm('track')">
          <span :class="bemm('thumb')">
            <Icon
              v-if="activeIcon"
              :name="activeIcon"
              :class="bemm('thumb-icon')"
            />
          </span>
        </span>
      </label>

      <button
        v-if="rightItem"
        type="button"
        :class="bemm('side', { active: !isLeft })"
        :disabled="disabled"
        @click="selectRight"
      >
        <Icon
          v-if="rightItem.icon"
          :name="rightItem.icon"
          :class="bemm('side-icon')"
        />
        <span v-if="rightItem.label" :class="bemm('side-label')">{{ rightItem.label }}</span>
      </button>

      <span
        v-if="label"
        :class="bemm('label')"
        @click="focusInput"
      >
        {{ label }}
      </span>
    </div>

    <div
      v-if="description"
      :class="bemm('description')"
    >
      {{ description }}
    </div>

    <div
      v-if="error.length"
      :class="bemm('errors')"
    >
      <span
        v-for="err in error"
        :key="err"
        :class="bemm('error')"
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
.input-toggle {
  --input-toggle-height: 1.5rem;
  --input-toggle-width: 2.55rem;
  --input-toggle-padding: 0.18rem;
  --input-toggle-thumb-size: calc(var(--input-toggle-height) - (var(--input-toggle-padding) * 2));
  --input-toggle-active-color: var(--color-primary);

  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;

  &--small {
    --input-toggle-height: 1.25rem;
    --input-toggle-width: 2.2rem;

    .input-toggle__thumb-icon {
      display: none;
    }
  }

  &--large {
    --input-toggle-height: 1.8rem;
    --input-toggle-width: 3rem;
  }

  &__wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__label {
    font-size: 0.9em;
    cursor: pointer;
    user-select: none;
  }

  &__description {
    font-size: 0.8em;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }

  &__errors {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__error {
    font-size: 0.8em;
    color: var(--color-error);
  }

  &__side {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    border: none;
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    font-size: 0.85rem;
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
    width: 1rem;
    height: 1rem;
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
