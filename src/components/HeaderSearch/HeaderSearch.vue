<template>
  <div
    ref="searchElement"
    :class="[
      bemm(),
      isExpanded ? bemm('', 'expanded') : '',
      isPanelVisible ? bemm('', 'open') : '',
    ]"
    :style="{ '--header-search-max-width': maxWidth }"
    @click.stop
  >
    <div :class="bemm('control')">
      <Transition name="header-search-control" mode="out-in">
        <button
          v-if="!isExpanded"
          :key="'trigger'"
          :class="bemm('trigger')"
          :aria-label="resolvedOpenLabel"
          :title="resolvedOpenLabel"
          type="button"
          @click="openSearch"
        >
          <Icon :name="iconName" />
        </button>

        <div v-else :key="'shell'" :class="bemm('shell')">
          <Icon :name="iconName" :class="bemm('icon')" />
          <input
            ref="inputElement"
            :value="modelValue"
            :class="bemm('input')"
            :aria-label="resolvedInputLabel"
            :placeholder="placeholder"
            type="search"
            @input="handleInput"
            @keydown="handleKeydown"
          />
          <button
            v-if="hasValue"
            :class="bemm('clear')"
            :aria-label="clearLabel"
            type="button"
            @click="clearSearch"
          >
            <Icon name="close" />
          </button>
        </div>
      </Transition>
    </div>

    <Transition name="header-search-panel">
      <div v-if="isPanelVisible" :class="bemm('panel')">
        <slot
          name="panel"
          :clearSearch="clearSearch"
          :closeSearch="closeSearch"
          :isExpanded="isExpanded"
          :query="modelValue"
        />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useSlots } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'

import { Icon } from '../Icon'

import type {
  HeaderSearchEmits,
  HeaderSearchExposed,
  HeaderSearchProps,
} from './HeaderSearch.model'
import {
  isOutsideHeaderSearch,
  shouldShowHeaderSearchPanel,
  useHeaderSearchState,
} from './HeaderSearch.util'

defineOptions({
  name: 'HeaderSearch',
})

const props = withDefaults(defineProps<HeaderSearchProps>(), {
  autoFocus: true,
  clearLabel: 'Clear search',
  clearOnClose: true,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  iconName: Icons.SEARCH_M,
  maxWidth: '36rem',
  modelValue: '',
  openLabel: 'Search',
  placeholder: '',
  showPanelOnEmptyQuery: false,
})

const emit = defineEmits<HeaderSearchEmits>()

const bemm = useBemm('header-search')
const slots = useSlots()

const searchElement = ref<HTMLElement | null>(null)
const inputElement = ref<HTMLInputElement | null>(null)
const query = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
  },
})
const { clearSearch: clearStateSearch, closeSearch: collapseSearch, hasValue, isExpanded, openSearch: expandSearch } =
  useHeaderSearchState(query, {
    clearOnClose: props.clearOnClose,
  })

const resolvedOpenLabel = computed(() => props.openLabel || props.placeholder || 'Search')
const resolvedInputLabel = computed(() => props.placeholder || props.openLabel || 'Search')
const isPanelVisible = computed(() => (
  Boolean(slots.panel)
  && shouldShowHeaderSearchPanel(
    isExpanded.value,
    hasValue.value,
    props.showPanelOnEmptyQuery,
  )
))

function focusInput() {
  if (!props.autoFocus) {
    return
  }

  nextTick(() => {
    inputElement.value?.focus()
  })
}

function openSearch() {
  const wasExpanded = isExpanded.value

  expandSearch()

  if (!wasExpanded) {
    emit('open')
  }

  focusInput()
}

function closeSearch() {
  const wasExpanded = isExpanded.value

  collapseSearch()

  if (wasExpanded) {
    emit('close')
  }
}

function clearSearch() {
  const hadValue = hasValue.value

  clearStateSearch()

  if (hadValue) {
    emit('clear')
  }

  focusInput()
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | null

  emit('update:modelValue', target?.value ?? '')
}

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event)

  if (event.key === 'Escape' && props.closeOnEscape) {
    closeSearch()
  }
}

function handleDocumentClick(event: MouseEvent) {
  if (!props.closeOnOutsideClick || !isExpanded.value) {
    return
  }

  const target = event.target as Node | null

  if (isOutsideHeaderSearch(searchElement.value, target)) {
    closeSearch()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})

defineExpose<HeaderSearchExposed>({
  clearSearch,
  closeSearch,
  focusInput,
  openSearch,
})
</script>

<style lang="scss">
.header-search {
  position: relative;
  flex: 0 0 auto;
  width: 2.5rem;
  min-width: 2.5rem;
  max-width: 2.5rem;
  transition:
    width 220ms cubic-bezier(0.22, 1, 0.36, 1),
    max-width 220ms cubic-bezier(0.22, 1, 0.36, 1),
    flex-basis 220ms cubic-bezier(0.22, 1, 0.36, 1);

  &--expanded {
    flex: 1 1 24rem;
    width: 100%;
    min-width: 0;
    max-width: var(--header-search-max-width, 36rem);
  }

  &__control {
    position: relative;
    min-height: 2.5rem;
  }

  &__trigger {
    --icon-fill: color-mix(in srgb, currentColor, transparent 25%);
    --icon-fill-opacity: 1;
    --icon-stroke-color: currentColor;
    --icon-stroke-color-secondary: currentColor;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid var(--border-color, var(--color-accent));
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-foreground), transparent 97%);
    color: var(--color-foreground);
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

  &__shell {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    min-width: 0;
    padding: 0.35rem 0.5rem 0.35rem 0.8rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
    transition:
      border-color 140ms ease,
      background-color 140ms ease,
      box-shadow 140ms ease;

    &:focus-within,
    .header-search--open & {
      border-color: color-mix(in srgb, var(--color-primary), transparent 55%);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary), transparent 90%);
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 1%);
    }
  }

  &__icon {
    color: color-mix(in srgb, var(--color-foreground), transparent 44%);
    font-size: 0.95rem;
  }

  &__input {
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;

    &::placeholder {
      color: color-mix(in srgb, var(--color-foreground), transparent 52%);
    }

    &:focus {
      outline: none;
    }
  }

  &__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.8rem;
    height: 1.8rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 42%);
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 94%);
      color: inherit;
    }
  }

  &__panel {
    position: absolute;
    top: calc(100% + 0.6rem);
    right: 0;
    width: 100%;
    max-height: min(70vh, 34rem);
    overflow: auto;
    padding: 0.55rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 1rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
    box-shadow: 0 1.2rem 3rem color-mix(in srgb, var(--color-foreground), transparent 90%);
    transform-origin: top right;
  }

  @media (max-width: 700px) {
    &--expanded {
      max-width: none;
    }
  }
}

.header-search-control-enter-active,
.header-search-control-leave-active {
  transition:
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 220ms ease;
}

.header-search-control-enter-from {
  opacity: 0;
  transform: translateX(0.85rem) scale(0.96);
  filter: blur(6px);
}

.header-search-control-leave-to {
  opacity: 0;
  transform: translateX(-0.35rem) scale(0.92);
  filter: blur(4px);
}

.header-search-panel-enter-active,
.header-search-panel-leave-active {
  transition:
    opacity 190ms ease,
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
    clip-path 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.header-search-panel-enter-from,
.header-search-panel-leave-to {
  opacity: 0;
  transform: translateY(-0.45rem) scale(0.98);
  clip-path: inset(0 0 100% 0 round 1rem);
}

@media (prefers-reduced-motion: reduce) {
  .header-search {
    transition: none;
  }

  .header-search-control-enter-active,
  .header-search-control-leave-active,
  .header-search-panel-enter-active,
  .header-search-panel-leave-active {
    transition: none;
  }
}
</style>
