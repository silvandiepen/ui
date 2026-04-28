<template>
  <InputBase
    v-model="model"
    :block="blockName"
    :label="label"
    :placeholder="placeholder"
    :description="description"
    :instructions="instructions"
    :disabled="disabled"
    :error="resolvedErrors"
    :maxErrors="maxErrors"
    :size="size"
    :status="status"
    type="search"
    :maxlength="maxlength"
    :minlength="minlength"
    :autoComplete="autoComplete"
    :autofocus="autofocus"
    inputmode="search"
    :reset="false"
    :controls="controls"
    :autoFocusNext="autoFocusNext"
    :test-id="testId"
    :class="[
      bemm(),
      props.block ? bemm('', 'block') : '',
      props.iconOnly ? bemm('', 'icon-only') : '',
      isCollapsed ? bemm('', 'collapsed') : '',
      isExpanded ? bemm('', 'expanded') : '',
    ]"
    :style="wrapperStyle"
    @change="handleChange"
    @touched="handleTouched"
    @focus="handleFocus"
    @blur="handleBlur"
    @reset="handleReset"
  >
    <template #control="{ id, value: inputValue, disabled, controlTestId, testIdPart, handleInput, handleTouch, handleFocus: onBaseFocus, handleBlur: onBaseBlur, placeholder: templatePlaceholder }">
      <div
        :class="[
          bemm('wrapper'),
          isCollapsed ? bemm('wrapper', 'collapsed') : '',
          isExpanded ? bemm('wrapper', 'expanded') : '',
        ]"
        :data-test-id="testIdPart('wrapper')"
      >
        <Icon
          v-if="leftIconName && !isCollapsed"
          :name="leftIconName"
          :class="bemm('icon', ['left'])"
          :data-test-id="testIdPart('left-icon')"
        />

        <input
          :id="id"
          ref="control"
          :value="inputValue"
          :class="bemm('control')"
          :data-test-id="controlTestId"
          :placeholder="isCollapsed ? '' : templatePlaceholder"
          type="search"
          :disabled="disabled"
          :maxlength="props.maxlength"
          :minlength="props.minlength"
          :autocomplete="autoComplete"
          @input="(event) => onInput(event, handleInput)"
          @click="handleTouch"
          @focus="(event) => onControlFocus(event, onBaseFocus)"
          @blur="(event) => onControlBlur(event, onBaseBlur)"
          @keydown.enter.prevent="onEnter(inputValue)"
        />

        <button
          v-if="showRightAction"
          type="button"
          :class="bemm('action')"
          :data-test-id="testIdPart('action')"
          :aria-label="isCollapsed ? 'Open search' : 'Search'"
          @click="onSearchButtonClick(inputValue)"
        >
          <Icon
            v-if="rightIconName"
            :name="rightIconName"
            :data-test-id="testIdPart('right-icon')"
          />
        </button>

        <button
          v-if="clearable && inputValue && !isCollapsed"
          type="button"
          :class="bemm('clear')"
          :data-test-id="testIdPart('clear')"
          aria-label="Clear search"
          @click="handleClear"
        >
          <Icon
            name="close"
            :data-test-id="testIdPart('clear-icon')"
          />
        </button>
      </div>
    </template>
  </InputBase>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue'
import { useBemm } from 'bemm'

import { Size, Status } from '../../../types'
import Icon from '../../Icon/Icon.vue'
import InputBase from '../Form/InputBase.vue'

import type { InputSearchProps } from './InputSearch.model'

const { bemm } = useBemm('input-search', {
  includeBaseClass: true,
})

const model = defineModel<string>({
  default: '',
})

const props = withDefaults(defineProps<InputSearchProps>(), {
  label: '',
  placeholder: 'Search...',
  description: '',
  instructions: '',
  disabled: false,
  error: () => [],
  maxErrors: 1,
  size: Size.MEDIUM,
  status: Status.IDLE,
  minlength: undefined,
  maxlength: undefined,
  autoComplete: 'off',
  autofocus: false,
  clearable: true,
  controls: false,
  autoFocusNext: false,
  block: false,
  searchOnEnter: true,
  iconOnly: false,
  expandWidth: '100%',
  collapseOnBlur: true,
})

const emit = defineEmits<{
  change: [value: string]
  touched: []
  focus: []
  blur: []
  reset: []
  clear: []
  search: [value: string]
}>()

const blockName = 'input-search'
const vm = getCurrentInstance()
const control = ref<HTMLInputElement | null>(null)
const isExpanded = ref(!props.iconOnly || Boolean(model.value))

const resolvedErrors = computed(() =>
  Array.isArray(props.error) ? props.error : props.error ? [props.error] : []
)

const resolveIcon = (icon: boolean | string | undefined): string | null => {
  if (typeof icon === 'string') {
    return icon
  }

  if (icon === true) {
    return 'search-m'
  }

  return null
}

const leftIconName = computed(() => resolveIcon(props.leftIcon))
const hasExplicitRightIcon = computed(() => {
  const vnodeProps = vm?.vnode.props ?? {}
  return Object.prototype.hasOwnProperty.call(vnodeProps, 'rightIcon') ||
    Object.prototype.hasOwnProperty.call(vnodeProps, 'right-icon')
})

const rightIconName = computed(() => {
  if (hasExplicitRightIcon.value) {
    const resolvedRightIcon = resolveIcon(props.rightIcon)
    if (resolvedRightIcon) {
      return resolvedRightIcon
    }

    return null
  }

  if (props.leftIcon) {
    return null
  }

  return 'search-m'
})

const showRightAction = computed(() => props.iconOnly || Boolean(rightIconName.value))

const isCollapsed = computed(() => props.iconOnly && !isExpanded.value)

const wrapperStyle = computed(() => ({
  '--input-search-expanded-width': props.expandWidth,
}))

function handleChange(value: string) {
  if (props.iconOnly && value) {
    isExpanded.value = true
  }

  emit('change', value)
}

function handleTouched() {
  emit('touched')
}

function handleFocus() {
  emit('focus')
}

function handleBlur() {
  emit('blur')
}

function handleReset() {
  emit('reset')
}

function onInput(event: Event, handleInput: (event: Event) => void) {
  handleInput(event)
}

function onControlFocus(event: FocusEvent, onBaseFocus: () => void) {
  onBaseFocus()

  if (props.iconOnly) {
    isExpanded.value = true
  }
}

function onControlBlur(event: FocusEvent, onBaseBlur: () => void) {
  onBaseBlur()

  const currentValue = model.value || ''
  if (props.iconOnly && props.collapseOnBlur && !currentValue) {
    isExpanded.value = false
  }
}

async function expandAndFocus() {
  if (!props.iconOnly) {
    return
  }

  isExpanded.value = true
  await nextTick()
  control.value?.focus()
}

function runSearch(value?: string) {
  const currentValue = value ?? model.value ?? ''
  emit('search', currentValue)
}

function executeSearchAction(value?: string) {
  const currentValue = value ?? model.value ?? ''

  if (props.searchAction) {
    props.searchAction(currentValue)
    return
  }

  runSearch(currentValue)
}

async function onSearchButtonClick(inputValue?: string) {
  if (isCollapsed.value) {
    await expandAndFocus()
    return
  }

  executeSearchAction(inputValue)
  control.value?.focus()
}

function onEnter(inputValue?: string) {
  if (!props.searchOnEnter) {
    return
  }

  executeSearchAction(inputValue)
}

function handleClear() {
  model.value = ''
  emit('clear')
  emit('change', '')

  if (props.iconOnly && props.collapseOnBlur) {
    isExpanded.value = false
  }
}

watch(
  () => model.value,
  (value) => {
    if (!props.iconOnly) {
      return
    }

    if (value) {
      isExpanded.value = true
      return
    }

    if (props.collapseOnBlur) {
      isExpanded.value = false
    }
  },
)
</script>

<style lang="scss">
@use '../Form/Form.scss' as form;

.input-search {
  @include form.inputBase();

  &__control-container {
    width: var(--input-search-expanded-width, 100%);
    transition: width 0.2s ease;
  }

  &--icon-only {
    .input-search__control-container {
      width: var(--input-search-expanded-width, 100%);
    }

    &.input-search--collapsed {
      .input-search__control-container {
        width: var(--input-search-collapsed-width, 2.75rem);
      }
    }
  }

  &__wrapper {
    --input-search-collapsed-width: calc(var(--sizing) * 2.5em);
    --input-search-expanded-width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    width: var(--input-search-expanded-width);
    transition: width 0.2s ease;
  }

  &__wrapper--collapsed {
    width: var(--input-search-collapsed-width);
  }

  &__control {
    width: 100%;
    padding-left: calc(var(--space) * 0.9);
    padding-right: calc(var(--space) * 2.75);
    appearance: none;
    -webkit-appearance: none;

    .input-search__icon--left ~ & {
      padding-left: calc(var(--space) * 2.45);
    }

    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration {
      display: none;
      -webkit-appearance: none;
    }

    &::-ms-clear,
    &::-ms-reveal {
      display: none;
      width: 0;
      height: 0;
    }
  }

  &__icon {
    position: absolute;
    z-index: 3;
    color: color-mix(in srgb, var(--color-foreground), transparent 38%);
    pointer-events: none;

    &--left {
      left: calc(var(--space) * 0.75);
    }
  }

  &__action,
  &__clear {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 4;
    border: 0;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: color-mix(in srgb, var(--color-foreground), transparent 24%);
    padding: calc(var(--space) * 0.25);
    border-radius: 999px;
  }

  &__action {
    right: calc(var(--space) * 0.55);
  }

  &__clear {
    right: calc(var(--space) * 2.05);
  }

  &__action:hover,
  &__clear:hover {
    color: currentColor;
    background: color-mix(in srgb, var(--color-foreground), transparent 92%);
  }

  &__action:focus-visible,
  &__clear:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
  }

  &__wrapper--collapsed &__control {
    opacity: 0;
    pointer-events: none;
    padding-right: calc(var(--space) * 2.25);
  }

  &__wrapper--collapsed &__action {
    right: 50%;
    transform: translate(50%, -50%);
  }
}
</style>
