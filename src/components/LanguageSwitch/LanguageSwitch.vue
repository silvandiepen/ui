<template>
  <div :class="[bemm(), bemm('', surface)]">
    <div v-if="surface === 'inline'" :class="bemm('panel')">
      <header v-if="title" :class="bemm('panel-header')">
        <strong :class="bemm('panel-title')">{{ title }}</strong>
      </header>

      <LanguageSwitchOptions
        :active-value="modelValue"
        :options="options"
        :show-descriptions="showDescriptions"
        :show-flags="showFlags"
        :show-selection-indicator="showSelectionIndicator"
        @select="handleSelect"
      />
    </div>

    <DropdownMenu
      v-else-if="usesSimpleDropdown"
      :close-on-select="closeOnSelect"
    >
      <template #trigger="{ toggle }">
        <button :class="bemm('trigger')" type="button" @click="toggle">
          {{ triggerValue }}
        </button>
      </template>

      <template #menu="{ closeMenu }">
        <div :class="bemm('simple-menu')">
          <header v-if="title" :class="bemm('panel-header')">
            <strong :class="bemm('panel-title')">{{ title }}</strong>
          </header>

          <div :class="bemm('simple-list')">
            <button
              v-for="option in simpleOptions"
              :key="option.value"
              :class="[
                bemm('simple-option'),
                option.value === modelValue ? bemm('simple-option', 'active') : '',
              ]"
              :disabled="option.disabled"
              type="button"
              @click="handleSimpleSelect(option, closeMenu)"
            >
              <span :class="bemm('simple-option-label')">{{ option.label }}</span>
              <Icon
                v-if="showSelectionIndicator && option.value === modelValue"
                :class="bemm('simple-option-indicator')"
                name="check"
              />
            </button>
          </div>
        </div>
      </template>
    </DropdownMenu>

    <Popover
      v-else-if="surface === 'popover'"
      v-model="popoverOpen"
      :close-on-content-click="false"
      :placement="popoverPlacement"
      :width="popoverWidth"
    >
      <template #trigger>
        <button :class="bemm('trigger')" type="button">
          {{ triggerValue }}
        </button>
      </template>

      <div :class="bemm('panel')">
        <header v-if="title" :class="bemm('panel-header')">
          <strong :class="bemm('panel-title')">{{ title }}</strong>
        </header>

        <LanguageSwitchOptions
          :active-value="modelValue"
          :options="options"
          :show-descriptions="showDescriptions"
          :show-flags="showFlags"
          :show-selection-indicator="showSelectionIndicator"
          @select="handleSelect"
        />
      </div>
    </Popover>

    <ContextPanel
      v-else
      ref="contextPanelRef"
      :class="bemm('context-panel')"
      :config="contextPanelConfig"
    >
      <template #default>
        <button :class="bemm('trigger')" type="button">
          {{ triggerValue }}
        </button>
      </template>

      <template #content>
        <div :class="bemm('panel')">
          <header v-if="title" :class="bemm('panel-header')">
            <strong :class="bemm('panel-title')">{{ title }}</strong>
          </header>

          <LanguageSwitchOptions
            :active-value="modelValue"
            :options="options"
            :show-descriptions="showDescriptions"
            :show-flags="showFlags"
            :show-selection-indicator="showSelectionIndicator"
            @select="handleSelect"
          />
        </div>
      </template>
    </ContextPanel>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBemm } from 'bemm'

import {
  ContextPanel,
  ContextPanelClickModeEnum,
  ContextPanelPositionEnum,
} from '../ContextMenu'
import { DropdownMenu } from '../Dropdown'
import { Icon } from '../Icon'
import { Popover } from '../Popover'

import type { LanguageSwitchOption, LanguageSwitchProps } from './LanguageSwitch.model'
import LanguageSwitchOptions from './LanguageSwitchOptions.vue'
import {
  flattenLanguageSwitchOptions,
  findLanguageSwitchOption,
  getLanguageSwitchOptionCode,
} from './LanguageSwitch.utils'

defineOptions({
  name: 'LanguageSwitch',
})

const props = withDefaults(defineProps<LanguageSwitchProps>(), {
  closeOnSelect: true,
  contextPanelClickMode: ContextPanelClickModeEnum.SHORT,
  contextPanelPosition: ContextPanelPositionEnum.BOTTOM_ALIGN_RIGHT,
  displayMode: 'code',
  modelValue: undefined,
  mode: 'default',
  placeholder: 'Select language',
  popoverPlacement: 'bottom',
  popoverWidth: '22rem',
  showDescriptions: false,
  showFlags: true,
  showSelectionIndicator: true,
  surface: 'popover',
  title: '',
  triggerLabel: '',
})

const emit = defineEmits<{
  select: [option: LanguageSwitchOption]
  'update:modelValue': [value: string]
}>()

const bemm = useBemm('language-switch')
const popoverOpen = ref(false)
const contextPanelRef = ref<{ close?: () => void } | null>(null)

const selectedOption = computed(() => findLanguageSwitchOption(props.options, props.modelValue))
const simpleOptions = computed(() => flattenLanguageSwitchOptions(props.options))
const usesSimpleDropdown = computed(() => props.mode === 'simple' && props.surface !== 'inline')

const triggerValue = computed(() => {
  if (!selectedOption.value) {
    return props.placeholder
  }

  const optionCode = getLanguageSwitchOptionCode(selectedOption.value)

  if (props.displayMode === 'label') {
    return selectedOption.value.label
  }

  if (props.displayMode === 'label-code' && optionCode) {
    return `${selectedOption.value.label} (${optionCode})`
  }

  return optionCode || selectedOption.value.label
})

const contextPanelConfig = computed(() => ({
  clickMode: props.contextPanelClickMode,
  position: props.contextPanelPosition,
}))

function closeSurface() {
  if (props.surface === 'popover') {
    popoverOpen.value = false
    return
  }

  if (props.surface === 'context-panel') {
    contextPanelRef.value?.close?.()
  }
}

function handleSelect(option: LanguageSwitchOption) {
  if (!option.value || option.disabled) {
    return
  }

  emit('update:modelValue', option.value)
  emit('select', option)

  if (props.closeOnSelect) {
    closeSurface()
  }
}

function handleSimpleSelect(
  option: LanguageSwitchOption,
  closeMenu?: () => void,
) {
  if (!option.value || option.disabled) {
    return
  }

  emit('update:modelValue', option.value)
  emit('select', option)

  if (props.closeOnSelect) {
    closeMenu?.()
  }
}
</script>

<style lang="scss">
.language-switch {
  display: inline-flex;

  &--inline {
    display: block;
  }

  &__context-panel {
    display: inline-flex;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: 1px solid var(--border-color, var(--color-accent));
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-foreground), transparent 97%);
    color: var(--color-foreground);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: color-mix(in srgb, var(--color-primary), transparent 88%);
      border-color: color-mix(in srgb, var(--color-primary), transparent 35%);
      color: var(--color-foreground);
    }

    &:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &__panel {
    display: grid;
    gap: 0.8rem;
    min-width: min(100%, 22rem);
  }

  &__simple-menu {
    display: grid;
    gap: 0.75rem;
    min-width: 12rem;
    padding: 0.25rem;
  }

  &__simple-list {
    display: grid;
    gap: 0.15rem;
  }

  &__simple-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    padding: 0.65rem 0.7rem;
    border: 0;
    border-radius: 0.8rem;
    background: transparent;
    color: inherit;
    text-align: left;
    transition: background-color 150ms ease;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-primary), transparent 94%);
    }
  }

  &__simple-option--active {
    background: color-mix(in srgb, var(--color-primary), transparent 91%);
  }

  &__simple-option-label {
    min-width: 0;
  }

  &__simple-option-indicator {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &__panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__panel-title {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
  }
}
</style>
