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
      <template #trigger="{ isOpen, toggle }">
        <Button
          :class="bemm('trigger')"
          :size="triggerSize"
          :variant="triggerVariant"
          type="button"
          @click="toggle"
        >
          <span :class="bemm('trigger-content')">
            <span v-if="showFlags" :class="bemm('trigger-flag')">
              <img
                v-if="triggerFlagSrc"
                :src="triggerFlagSrc"
                :alt="selectedOption ? `${selectedOption.label} flag` : ''"
                :class="bemm('trigger-flag-image')"
              />
              <span
                v-else-if="triggerFlagEmoji"
                :class="bemm('trigger-flag-emoji')"
              >
                {{ triggerFlagEmoji }}
              </span>
            </span>
            <span :class="bemm('trigger-copy')">
              <strong v-if="triggerLabel" :class="bemm('trigger-label')">{{ triggerLabel }}</strong>
              <span :class="bemm('trigger-value')">{{ triggerValue }}</span>
            </span>
            <Icon
              :class="[bemm('trigger-icon'), isOpen ? bemm('trigger-icon', 'open') : '']"
              name="chevron-down"
            />
          </span>
        </Button>
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
      <template #trigger="{ isOpen }">
        <Button
          :class="bemm('trigger')"
          :size="triggerSize"
          :variant="triggerVariant"
          type="button"
        >
          <span :class="bemm('trigger-content')">
            <span v-if="showFlags" :class="bemm('trigger-flag')">
              <img
                v-if="triggerFlagSrc"
                :src="triggerFlagSrc"
                :alt="selectedOption ? `${selectedOption.label} flag` : ''"
                :class="bemm('trigger-flag-image')"
              />
              <span
                v-else-if="triggerFlagEmoji"
                :class="bemm('trigger-flag-emoji')"
              >
                {{ triggerFlagEmoji }}
              </span>
            </span>
            <span :class="bemm('trigger-copy')">
              <strong v-if="triggerLabel" :class="bemm('trigger-label')">{{ triggerLabel }}</strong>
              <span :class="bemm('trigger-value')">{{ triggerValue }}</span>
            </span>
            <Icon
              :class="[bemm('trigger-icon'), isOpen ? bemm('trigger-icon', 'open') : '']"
              name="chevron-down"
            />
          </span>
        </Button>
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
        <Button
          :class="bemm('trigger')"
          :size="triggerSize"
          :variant="triggerVariant"
          type="button"
        >
          <span :class="bemm('trigger-content')">
            <span v-if="showFlags" :class="bemm('trigger-flag')">
              <img
                v-if="triggerFlagSrc"
                :src="triggerFlagSrc"
                :alt="selectedOption ? `${selectedOption.label} flag` : ''"
                :class="bemm('trigger-flag-image')"
              />
              <span
                v-else-if="triggerFlagEmoji"
                :class="bemm('trigger-flag-emoji')"
              >
                {{ triggerFlagEmoji }}
              </span>
            </span>
            <span :class="bemm('trigger-copy')">
              <strong v-if="triggerLabel" :class="bemm('trigger-label')">{{ triggerLabel }}</strong>
              <span :class="bemm('trigger-value')">{{ triggerValue }}</span>
            </span>
            <Icon :class="bemm('trigger-icon')" name="chevron-down" />
          </span>
        </Button>
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

import { Button, ButtonSize, ButtonVariant } from '../Button'
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
  getLanguageSwitchFlagEmoji,
  getLanguageSwitchFlagSrc,
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
  triggerSize: ButtonSize.SMALL,
  triggerVariant: ButtonVariant.GHOST,
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

const triggerFlagEmoji = computed(() => {
  if (!selectedOption.value || !props.showFlags) {
    return null
  }

  return getLanguageSwitchFlagEmoji(selectedOption.value)
})

const triggerFlagSrc = computed(() => {
  if (!selectedOption.value || !props.showFlags) {
    return null
  }

  return getLanguageSwitchFlagSrc(selectedOption.value)
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
    min-width: 0;
  }

  &__trigger-content {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    min-width: 0;
  }

  &__trigger-flag {
    width: 1.35rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__trigger-flag-image {
    width: 1.3rem;
    height: 0.95rem;
    object-fit: cover;
    border-radius: 0.16rem;
  }

  &__trigger-flag-emoji {
    font-size: 1rem;
    line-height: 1;
  }

  &__trigger-copy {
    display: grid;
    gap: 0.1rem;
    min-width: 0;
    text-align: left;
  }

  &__trigger-label {
    font-size: 0.68rem;
    line-height: 1;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.72;
  }

  &__trigger-value {
    line-height: 1.2;
  }

  &__trigger-icon {
    width: 0.95rem;
    height: 0.95rem;
    transition: transform 150ms ease;
  }

  &__trigger-icon--open {
    transform: rotate(180deg);
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
