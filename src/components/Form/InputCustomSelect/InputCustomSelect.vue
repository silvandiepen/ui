<!-- InputCustomSelect.vue -->
<script lang="ts" setup>
import { computed, ref, watch, nextTick, onUnmounted } from 'vue'
import { useBemm } from 'bemm'
import InputBase from '../Form/InputBase.vue'
import Icon from '../../Icon/Icon.vue'
import type { InputCustomSelectProps, InputCustomSelectEmits, CustomOption } from './InputCustomSelect.model'
import { Size } from '../../../types'

const model = defineModel<string | null>({
  default: null,
})

const props = withDefaults(defineProps<InputCustomSelectProps>(), {
  modelValue: undefined,
  value: '',
  label: '',
  description: '',
  error: () => [],
  size: Size.MEDIUM,
  allowNull: false,
  nullLabel: 'Please select...',
  disabled: false,
  options: () => [],
  searchable: false,
  placeholder: 'Select an option',
  allowCustom: false,
})

const emit = defineEmits<InputCustomSelectEmits>()

const block = 'input-custom-select'
const bemm = useBemm(block)

const isOpen = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(-1)
const dropdownRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()
const dropdownStyle = ref<any>({})

// Convert options to custom format
const toOption = (option: string | CustomOption): CustomOption => {
  if (typeof option === 'string') {
    return {
      label: option,
      value: option,
    }
  }
  return option
}

// Process options into flat list with hierarchy info
const processedOptions = computed(() => {
  const options: CustomOption[] = []

  if (props.allowNull) {
    options.push({
      value: '',
      label: props.nullLabel,
      isNull: true,
    })
  }

  props.options.forEach((opt) => {
    const option = toOption(opt)
    options.push(option)
  })

  return options
})

// Filter options based on search
const filteredOptions = computed(() => {
  if (!searchQuery.value) return processedOptions.value

  const query = searchQuery.value.toLowerCase()
  return processedOptions.value.filter(option =>
    option.label.toLowerCase().includes(query) ||
    option.value.toLowerCase().includes(query)
  )
})

// Get selected option
const selectedOption = computed(() => {
  return processedOptions.value.find(opt => opt.value === model.value)
})

const resolveCssLength = (value: string, fallback: number): number => {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return fallback
  }

  if (/^-?\d+(\.\d+)?(px)?$/.test(trimmedValue)) {
    const parsedValue = Number.parseFloat(trimmedValue)
    return Number.isFinite(parsedValue) ? parsedValue : fallback
  }

  if (typeof document === 'undefined') {
    return fallback
  }

  const probe = document.createElement('div')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  probe.style.width = trimmedValue
  document.body.appendChild(probe)

  const resolvedValue = probe.getBoundingClientRect().width
  probe.remove()

  return Number.isFinite(resolvedValue) && resolvedValue > 0 ? resolvedValue : fallback
}

// Position dropdown
const positionDropdown = () => {
  if (!triggerRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const spaceBelow = viewportHeight - triggerRect.bottom
  const spaceAbove = triggerRect.top

  // Get CSS variable values from computed styles or use defaults
  const computedStyle = getComputedStyle(triggerRef.value)
  const rootStyle = getComputedStyle(document.documentElement)
  const dropdownGap = resolveCssLength(
    computedStyle.getPropertyValue('--input-custom-select-dropdown-gap')
      || rootStyle.getPropertyValue('--space-xs')
      || '4px',
    4
  )
  const maxDropdownHeight = resolveCssLength(
    computedStyle.getPropertyValue('--input-custom-select-max-height') || '300px',
    300
  )
  const viewportPadding = resolveCssLength(
    computedStyle.getPropertyValue('--input-custom-select-viewport-padding')
      || rootStyle.getPropertyValue('--space-l')
      || '20px',
    20
  )

  // Calculate vertical position
  let top = triggerRect.bottom + dropdownGap
  let maxHeight = Math.min(maxDropdownHeight, spaceBelow - viewportPadding)

  // If not enough space below and more space above, show above
  if (spaceBelow < 150 && spaceAbove > spaceBelow) {
    // We'll position from bottom since we don't know dropdown height yet
    const bottom = viewportHeight - triggerRect.top + dropdownGap
    dropdownStyle.value = {
      position: 'fixed',
      bottom: `${bottom}px`,
      left: `${triggerRect.left}px`,
      width: `${triggerRect.width}px`,
      maxHeight: `${Math.min(maxDropdownHeight, spaceAbove - viewportPadding)}px`
    }
  } else {
    // Position below
    dropdownStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${triggerRect.left}px`,
      width: `${triggerRect.width}px`,
      maxHeight: `${maxHeight}px`
    }
  }

  // Handle horizontal overflow
  if (triggerRect.left + triggerRect.width > viewportWidth - viewportPadding) {
    dropdownStyle.value.right = `${viewportPadding}px`
    dropdownStyle.value.left = 'auto'
  }
}

// Handle dropdown toggle
const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    nextTick(() => {
      positionDropdown()
      if (props.searchable && searchInputRef.value) {
        searchInputRef.value.focus()
      }
      // Set initial selected index
      const currentIndex = filteredOptions.value.findIndex(opt => opt.value === model.value)
      selectedIndex.value = currentIndex >= 0 ? currentIndex : 0
    })
  } else {
    searchQuery.value = ''
    selectedIndex.value = -1
  }
}

// Handle option selection
const selectOption = (option: CustomOption) => {
  const value = option.value || null
  model.value = value
  emit('change', value)
  emit('update:modelValue', value)
  isOpen.value = false
  searchQuery.value = ''
}

// Handle custom value selection
const selectCustomValue = () => {
  if (searchQuery.value) {
    model.value = searchQuery.value
    emit('change', searchQuery.value)
    emit('update:modelValue', searchQuery.value)
    isOpen.value = false
    searchQuery.value = ''
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      toggleDropdown()
    }
    return
  }

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      triggerRef.value?.focus()
      break

    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredOptions.value.length - 1)
      scrollToOption()
      break

    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      scrollToOption()
      break

    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < filteredOptions.value.length) {
        selectOption(filteredOptions.value[selectedIndex.value])
      }
      break

    case 'Tab':
      isOpen.value = false
      break
  }
}

// Scroll to selected option
const scrollToOption = () => {
  nextTick(() => {
    const selectedEl = dropdownRef.value?.querySelector(`[data-index="${selectedIndex.value}"]`)
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

// Close on click outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && triggerRef.value) {
    const target = event.target as Node
    if (!dropdownRef.value.contains(target) && !triggerRef.value.contains(target)) {
      isOpen.value = false
    }
  }
}

// Handle window resize
const handleResize = () => {
  if (isOpen.value) {
    positionDropdown()
  }
}

// Handle scroll
const handleScroll = () => {
  if (isOpen.value) {
    positionDropdown()
  }
}

// Add/remove click outside listener
watch(isOpen, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll, true)
      // Also listen to scroll on all parent elements
      let parent = triggerRef.value?.parentElement
      while (parent) {
        parent.addEventListener('scroll', handleScroll)
        parent = parent.parentElement
      }
    }, 0)
  } else {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll, true)
    // Remove scroll listeners from parents
    let parent = triggerRef.value?.parentElement
    while (parent) {
      parent.removeEventListener('scroll', handleScroll)
      parent = parent.parentElement
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll, true)
})

// Watch for value changes to reset search
watch(model, () => {
  searchQuery.value = ''
})
</script>

<template>
  <InputBase
    v-if="model !== undefined"
    v-model="model"
    :block="block"
    :label="label"
    :description="description"
    :error="error"
    :size="size"
    :disabled="disabled"
    @touched="$emit('touched', $event)"
  >
    <template #control="{ disabled }">
      <div
        ref="triggerRef"
        :class="bemm('wrapper')"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        :aria-disabled="disabled"
        role="combobox"
        tabindex="0"
        @click="toggleDropdown"
        @keydown="handleKeydown"
      >
        <div :class="bemm('trigger')">
          <div :class="bemm('value')">
            <template v-if="selectedOption">
              <Icon
                v-if="selectedOption.icon"
                :name="selectedOption.icon"
                :class="bemm('option-icon')"
              />
              <span
                v-if="selectedOption.color"
                :class="bemm('option-color')"
                :style="{ backgroundColor: selectedOption.color }"
              />
              <span
                :class="bemm('option-label')"
                v-html="selectedOption.customContent || selectedOption.label"
              />
            </template>
            <span v-else :class="bemm('placeholder')">
              {{ placeholder }}
            </span>
          </div>
          <Icon
            name="chevron-down"
            :class="bemm('arrow', { open: isOpen })"
          />
        </div>

        <Teleport to="body">
          <div
            v-if="isOpen"
            ref="dropdownRef"
            :class="bemm('dropdown')"
            :style="dropdownStyle"
            role="listbox"
            :aria-label="label"
          >
          <div v-if="searchable" :class="bemm('search')">
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              :class="bemm('search-input')"
              placeholder="Search..."
              @keydown="handleKeydown"
              @keydown.stop
            />
            <Icon name="search" :class="bemm('search-icon')" />
          </div>

          <div :class="bemm('options')">
            <div
              v-for="(option, index) in filteredOptions"
              :key="option.value"
              :class="bemm('option', [
                option.value === model ? 'selected' : '',
                index === selectedIndex ? 'highlighted' : '',
                option.isNull ? 'null' : '',
                option.disabled ? 'disabled' : ''
              ])"
              :data-index="index"
              :style="{ paddingLeft: option.indent ? `calc(var(--input-custom-select-depth-padding, var(--space-m)) * ${option.indent} + var(--space-m))` : undefined }"
              role="option"
              :aria-selected="option.value === model"
              :aria-disabled="option.disabled"
              @click="!option.disabled && selectOption(option)"
              @mouseenter="selectedIndex = index"
            >
              <Icon
                v-if="option.icon"
                :name="option.icon"
                :class="bemm('option-icon')"
              />
              <span
                v-if="option.color"
                :class="bemm('option-color')"
                :style="{ backgroundColor: option.color }"
              />
              <span
                :class="bemm('option-content')"
                v-html="option.customContent || option.label"
              />
              <Icon
                v-if="option.value === model"
                name="check"
                :class="bemm('option-check')"
              />
            </div>

            <div v-if="filteredOptions.length === 0 && !allowCustom" :class="bemm('no-results')">
              No results found
            </div>

            <div
              v-if="allowCustom && searchQuery && !filteredOptions.find(o => o.value === searchQuery)"
              :class="bemm('option', { custom: true })"
              @click="selectCustomValue"
            >
              <Icon name="add" :class="bemm('option-icon')" />
              <span :class="bemm('option-content')">
                Create "{{ searchQuery }}"
              </span>
            </div>
          </div>
          </div>
        </Teleport>
      </div>
    </template>
  </InputBase>
</template>

<style lang="scss">
@use '../Form/Form.scss' as form;
@use '../../../styles/mixins' as m;

.input-custom-select {
  @include form.inputBase();
  position: relative;

  // CSS Custom Properties with defaults
  --input-custom-select-dropdown-gap: var(--space-xs);
  --input-custom-select-max-height: 300px;
  --input-custom-select-viewport-padding: var(--space-l);
  --input-custom-select-depth-padding: var(--space-m);
  --input-custom-select-search-icon-size: 20px;

  &__wrapper {
    position: relative;
    width: 100%;
    z-index: 10;
    min-height: calc(var(--input-control-padding-y, 0.75em) * 2 + 1em);
    border-radius: var(--input-border-radius, var(--border-radius));
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: inherit;
    padding: var(--input-control-padding, var(--input-control-padding-y, calc(0.75em * var(--sizing))))
      var(--input-control-padding, var(--input-control-padding-x, calc(var(--sizing) * 1em)));
    background: transparent;
    border: none;
    border-radius: inherit;
    cursor: pointer;
    transition: color var(--transition-fast);

    [aria-disabled="true"] & {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__value {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    flex: 1;
    min-width: 0;
  }

  &__placeholder {
    color: color-mix(in srgb, currentColor, transparent 50%);
  }

  &__arrow {
    font-size: var(--font-size-m);
    color: color-mix(in srgb, currentColor, transparent 32%);
    transition: transform var(--transition-fast);
    flex-shrink: 0;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__dropdown {
    position: fixed;
    background: var(--color-background);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 86%);
    border-radius: var(--input-border-radius, var(--border-radius));
    box-shadow: 0 18px 42px color-mix(in srgb, var(--color-foreground), transparent 84%);
    z-index: 9999;
    max-height: var(--input-custom-select-max-height);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__search {
    position: relative;
    padding: var(--space-s);
    border-bottom: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  }

  &__search-input {
    width: 100%;
    padding: m.p('search-padding-y', calc(var(--space) * 0.8)) m.p('search-padding-x', var(--space)) m.p('search-padding-y', calc(var(--space) * 0.8)) m.p('search-left-icon-offset', calc(var(--space) * 2.7));
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 86%);
    border-radius: calc(var(--input-border-radius, var(--border-radius)) - 2px);
    font-size: var(--font-size-m);
    color: currentColor;
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast),
      background-color var(--transition-fast);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary), transparent 88%);
      background: var(--color-background);
    }

    &::placeholder {
      color: color-mix(in srgb, currentColor, transparent 52%);
    }
  }

  &__search-icon {
    position: absolute;
    left: m.p('search-icon-left', calc(var(--space) * 1.45));
    top: 50%;
    transform: translateY(-50%);
    color: color-mix(in srgb, currentColor, transparent 42%);
    pointer-events: none;
    font-size: m.p('search-icon-font-size', var(--font-size));
    z-index: 1;
  }

  &__options {
    overflow-y: auto;
    flex: 1;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    padding: m.p('option-padding-y', calc(var(--space) * 0.8)) m.p('option-padding-x', var(--space));
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);

    &:hover {
      background-color: color-mix(in srgb, var(--color-primary), transparent 94%);
    }

    &--highlighted {
      background-color: color-mix(in srgb, var(--color-primary), transparent 92%);
      color: var(--color-primary);
    }

    &--selected {
      background-color: color-mix(in srgb, var(--color-primary), transparent 82%);
      color: var(--color-primary);
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--null {
      font-style: italic;
      color: color-mix(in srgb, currentColor, transparent 48%);
    }

    &--custom {
      background-color: color-mix(in srgb, var(--color-primary), transparent 84%);
      color: var(--color-primary);
      font-weight: var(--font-weight-medium);
    }
  }

  &__option-icon {
    font-size: var(--font-size-m);
  }

  &__option-color {
    width: var(--space-m);
    height: var(--space-m);
    border-radius: var(--border-radius-s);
    border: 1px solid var(--color-border);
  }

  &__option-content {
    flex: 1;
    min-width: 0;
  }

  &__option-label {
    flex: 1;
  }

  &__option-check {
    margin-left: auto;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  &__no-results {
    padding: var(--space-l);
    text-align: center;
    color: color-mix(in srgb, currentColor, transparent 48%);
  }
}
</style>
