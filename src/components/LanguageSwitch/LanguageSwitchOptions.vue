<template>
  <div
    :class="[bemm(), bemm('', `level-${level}`)]"
    :data-test-id="testId"
  >
    <div
      v-for="(option, index) in options"
      :key="option.value ?? `${level}-${option.label}-${index}`"
      :class="entryClasses(option)"
      :data-test-id="getOptionTestId(option, index, 'entry')"
    >
      <button
        v-if="getSelectableOption(option)"
        :class="optionClasses(option)"
        :disabled="getSelectableOption(option)?.disabled"
        :aria-expanded="option.children?.length ? shouldShowChildren(option) : undefined"
        :aria-pressed="isOptionActive(option)"
        :data-test-id="getOptionTestId(option, index)"
        type="button"
        @click="handleSelect(option)"
      >
        <span
          :class="bemm('option-main')"
          :data-test-id="getOptionTestId(option, index, 'main')"
        >
          <span
            v-if="showFlags"
            :class="bemm('flag')"
            :data-test-id="getOptionTestId(option, index, 'flag')"
          >
            <img
              v-if="getLanguageSwitchFlagSrc(option)"
              :src="getLanguageSwitchFlagSrc(option) || undefined"
              :alt="`${option.label} flag`"
              :class="bemm('flag-image')"
              :data-test-id="getOptionTestId(option, index, 'flag-image')"
            />
            <span
              v-else-if="getLanguageSwitchFlagEmoji(option)"
              :class="bemm('flag-emoji')"
              :data-test-id="getOptionTestId(option, index, 'flag-emoji')"
            >
              {{ getLanguageSwitchFlagEmoji(option) }}
            </span>
          </span>

          <span
            :class="bemm('copy')"
            :data-test-id="getOptionTestId(option, index, 'copy')"
          >
            <strong
              :class="bemm('label')"
              :data-test-id="getOptionTestId(option, index, 'label')"
            >{{ option.label }}</strong>
            <span
              v-if="showDescriptions && option.description"
              :class="bemm('description')"
              :data-test-id="getOptionTestId(option, index, 'description')"
            >
              {{ option.description }}
            </span>
          </span>
        </span>

        <span
          :class="bemm('meta')"
          :data-test-id="getOptionTestId(option, index, 'meta')"
        >
          <code
            v-if="getLanguageSwitchOptionCode(option)"
            :class="bemm('code')"
            :data-test-id="getOptionTestId(option, index, 'code')"
          >
            {{ getLanguageSwitchOptionCode(option) }}
          </code>
          <Icon
            v-if="option.children?.length"
            :class="[
              bemm('group-indicator'),
              shouldShowChildren(option) ? bemm('group-indicator', 'open') : '',
            ]"
            name="chevron-down"
            :data-test-id="getOptionTestId(option, index, 'group-indicator')"
          />
          <Icon
            v-if="showSelectionIndicator && isOptionSelected(option)"
            :class="bemm('indicator')"
            name="check"
            :data-test-id="getOptionTestId(option, index, 'indicator')"
          />
        </span>
      </button>

      <div
        v-else
        :class="optionClasses(option)"
        :data-test-id="getOptionTestId(option, index)"
      >
        <span
          :class="bemm('option-main')"
          :data-test-id="getOptionTestId(option, index, 'main')"
        >
          <span
            v-if="showFlags"
            :class="bemm('flag')"
            :data-test-id="getOptionTestId(option, index, 'flag')"
          >
            <img
              v-if="getLanguageSwitchFlagSrc(option)"
              :src="getLanguageSwitchFlagSrc(option) || undefined"
              :alt="`${option.label} flag`"
              :class="bemm('flag-image')"
              :data-test-id="getOptionTestId(option, index, 'flag-image')"
            />
            <span
              v-else-if="getLanguageSwitchFlagEmoji(option)"
              :class="bemm('flag-emoji')"
              :data-test-id="getOptionTestId(option, index, 'flag-emoji')"
            >
              {{ getLanguageSwitchFlagEmoji(option) }}
            </span>
          </span>

          <span
            :class="bemm('copy')"
            :data-test-id="getOptionTestId(option, index, 'copy')"
          >
            <strong
              :class="bemm('label')"
              :data-test-id="getOptionTestId(option, index, 'label')"
            >{{ option.label }}</strong>
            <span
              v-if="showDescriptions && option.description"
              :class="bemm('description')"
              :data-test-id="getOptionTestId(option, index, 'description')"
            >
              {{ option.description }}
            </span>
          </span>
        </span>
      </div>

      <LanguageSwitchOptions
        v-if="shouldShowChildren(option)"
        :active-value="activeValue"
        :level="level + 1"
        :options="option.children ?? []"
        :show-descriptions="showDescriptions"
        :show-flags="showFlags"
        :show-selection-indicator="showSelectionIndicator"
        :test-id="getOptionTestId(option, index, 'children')"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Icon } from '../Icon'
import { getTestId } from '../../utils/testId'

import type { LanguageSwitchOption } from './LanguageSwitch.model'
import {
  getLanguageSwitchPrimaryOption,
  getLanguageSwitchFlagEmoji,
  getLanguageSwitchFlagSrc,
  getLanguageSwitchOptionCode,
  optionHasSelectedDescendant,
} from './LanguageSwitch.utils'

defineOptions({
  name: 'LanguageSwitchOptions',
})

const props = withDefaults(defineProps<{
  activeValue?: string
  level?: number
  options: LanguageSwitchOption[]
  showDescriptions?: boolean
  showFlags?: boolean
  showSelectionIndicator?: boolean
  testId?: string
}>(), {
  activeValue: undefined,
  level: 0,
  showDescriptions: false,
  showFlags: true,
  showSelectionIndicator: true,
  testId: undefined,
})

const emit = defineEmits<{
  select: [option: LanguageSwitchOption]
}>()

const bemm = useBemm('language-switch-options')

function getOptionTestId(option: LanguageSwitchOption, index: number, part?: string) {
  const key = option.value ?? option.code ?? `${props.level}-${index}`
  return getTestId(props.testId, part ? `option-${key}-${part}` : `option-${key}`)
}

function getSelectableOption(option: LanguageSwitchOption) {
  if (option.value) {
    return option
  }

  return getLanguageSwitchPrimaryOption(option)
}

function isOptionSelected(option: LanguageSwitchOption) {
  return getSelectableOption(option)?.value === props.activeValue
}

function isOptionActive(option: LanguageSwitchOption) {
  return isOptionSelected(option) || optionHasSelectedDescendant(option, props.activeValue)
}

function shouldShowChildren(option: LanguageSwitchOption) {
  return Boolean(option.children?.length) && optionHasSelectedDescendant(option, props.activeValue)
}

function handleSelect(option: LanguageSwitchOption) {
  const selectableOption = getSelectableOption(option)

  if (!selectableOption) {
    return
  }

  emit('select', selectableOption)
}

function entryClasses(option: LanguageSwitchOption) {
  return [
    bemm('entry'),
    option.children?.length ? bemm('entry', 'group') : '',
    isOptionActive(option) ? bemm('entry', 'branch-active') : '',
  ]
}

function optionClasses(option: LanguageSwitchOption) {
  return [
    bemm('option'),
    isOptionActive(option) ? bemm('option', 'active') : '',
    getSelectableOption(option)?.disabled ? bemm('option', 'disabled') : '',
    option.children?.length ? bemm('option', 'group-label') : '',
  ]
}
</script>

<style lang="scss">
.language-switch-options {
  display: grid;
  gap: 0.35rem;

  &--level-0 {
    gap: 0.55rem;
  }

  &__entry {
    display: grid;
    gap: 0.35rem;
  }

  &__entry--group {
    padding-top: 0.1rem;
  }

  &__entry--branch-active > .language-switch-options__option {
    border-color: color-mix(in srgb, var(--color-primary), transparent 60%);
  }

  &--level-1,
  &--level-2,
  &--level-3 {
    margin-left: 0.85rem;
    padding-left: 0.85rem;
    border-left: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.85rem;
    width: 100%;
    padding: 0.8rem 0.9rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 0.95rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 1.5%);
    color: inherit;
    text-align: left;
    transition:
      border-color 150ms ease,
      background-color 150ms ease,
      transform 150ms ease;
  }

  button.language-switch-options__option {
    cursor: pointer;

    &:hover:not(:disabled) {
      transform: translateY(-0.04rem);
      border-color: color-mix(in srgb, var(--color-primary), transparent 46%);
      background: color-mix(in srgb, var(--color-primary), transparent 94%);
    }
  }

  &__option--active {
    border-color: color-mix(in srgb, var(--color-primary), transparent 44%);
    background: color-mix(in srgb, var(--color-primary), transparent 92%);
  }

  &__option--disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &__option--group-label {
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
  }

  &__option-main {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  &__flag {
    width: 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__flag-image {
    width: 1.35rem;
    height: 1rem;
    object-fit: cover;
    border-radius: 0.2rem;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-foreground), transparent 88%);
  }

  &__flag-emoji {
    font-size: 1rem;
    line-height: 1;
  }

  &__copy {
    display: grid;
    gap: 0.2rem;
    min-width: 0;
  }

  &__label {
    font-size: 0.95rem;
    line-height: 1.2;
  }

  &__description {
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    font-size: 0.84rem;
    line-height: 1.45;
  }

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    flex-shrink: 0;
  }

  &__group-indicator {
    width: 0.95rem;
    height: 0.95rem;
    opacity: 0.66;
    transition: transform 150ms ease;
  }

  &__group-indicator--open {
    transform: rotate(180deg);
  }

  &__code {
    padding: 0.18rem 0.42rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-foreground), transparent 92%);
    font-size: 0.76rem;
    line-height: 1;
  }

  &__indicator {
    width: 1rem;
    height: 1rem;
  }
}
</style>
