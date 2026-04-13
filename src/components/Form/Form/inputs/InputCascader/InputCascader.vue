<template>
  <div
    ref="rootElement"
    :class="bemm()"
  >
    <InputBase
      :block="block"
      :label="label"
      :description="description"
      :disabled="disabled"
      :error="error"
      :value="selectedLabel"
      @touched="$emit('touched', $event)"
    >
      <template #control="{ id, disabled: controlDisabled }">
        <div :class="bemm('control')">
          <button
            :id="id"
            type="button"
            :class="bemm('trigger', {
              open,
              disabled: controlDisabled,
            })"
            :disabled="controlDisabled"
            @click="toggleOpen"
          >
            <span :class="bemm('trigger-text', { placeholder: !selectedLabel })">
              {{ selectedLabel || placeholder }}
            </span>
            <Icon
              :class="bemm('trigger-icon')"
              name="arrow-down"
              size="small"
            />
          </button>

          <div
            v-if="open"
            :class="bemm('panel')"
          >
            <div
              v-for="(column, depth) in columns"
              :key="depth"
              :class="bemm('column')"
            >
              <button
                v-for="option in column"
                :key="option.value"
                type="button"
                :class="bemm('option', {
                  active: draftPath[depth] === option.value,
                  disabled: option.disabled,
                })"
                :disabled="option.disabled"
                @click="handleOptionSelect(option, depth)"
              >
                <span :class="bemm('option-main')">
                  <Icon
                    v-if="option.icon"
                    :class="bemm('option-icon')"
                    :name="option.icon"
                    size="small"
                  />
                  <span>{{ option.label }}</span>
                </span>
                <Icon
                  v-if="option.children?.length"
                  :class="bemm('option-arrow')"
                  name="arrow-right"
                  size="small"
                />
              </button>
            </div>
          </div>
        </div>
      </template>
    </InputBase>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useBemm } from 'bemm'

import Icon from '../../../../Icon/Icon.vue'
import InputBase from '../../InputBase.vue'

import type { InputCascaderEmits, InputCascaderOption, InputCascaderProps } from './InputCascader.model'

const props = withDefaults(defineProps<InputCascaderProps>(), {
  modelValue: () => [],
  label: '',
  description: '',
  disabled: false,
  error: () => [],
  placeholder: 'Select an option',
  allowBranchSelection: false,
  changeOnSelect: false,
})

const emit = defineEmits<InputCascaderEmits>()

const block = 'input-cascader'
const bemm = useBemm(block)
const rootElement = ref<HTMLElement | null>(null)
const open = ref(false)
const draftPath = ref<string[]>([...props.modelValue])

const selectedLabel = computed(() => {
  const labels: string[] = []
  let currentOptions = props.options

  for (const value of props.modelValue) {
    const option = currentOptions.find((item) => item.value === value)

    if (!option) {
      break
    }

    labels.push(option.label)
    currentOptions = option.children ?? []
  }

  return labels.join(' / ')
})

const columns = computed(() => {
  const result: InputCascaderOption[][] = [props.options]
  let currentOptions = props.options

  for (const value of draftPath.value) {
    const option = currentOptions.find((item) => item.value === value)

    if (!option?.children?.length) {
      break
    }

    result.push(option.children)
    currentOptions = option.children
  }

  return result
})

function syncDraftPath() {
  draftPath.value = [...props.modelValue]
}

function closePanel() {
  if (!open.value) {
    return
  }

  open.value = false
  syncDraftPath()
  emit('close')
}

function openPanel() {
  if (props.disabled) {
    return
  }

  syncDraftPath()
  open.value = true
  emit('open')
}

function toggleOpen() {
  if (open.value) {
    closePanel()
    return
  }

  openPanel()
}

function commit(path: string[]) {
  emit('update:modelValue', path)
  emit('change', path)
  emit('touched', true)
}

function handleOptionSelect(option: InputCascaderOption, depth: number) {
  const nextPath = [...draftPath.value.slice(0, depth), option.value]

  draftPath.value = nextPath

  if (props.changeOnSelect || props.allowBranchSelection) {
    commit(nextPath)
  }

  if (!option.children?.length) {
    commit(nextPath)
    closePanel()
  }
}

function handleDocumentPointer(event: MouseEvent) {
  if (!open.value || !rootElement.value) {
    return
  }

  if (!rootElement.value.contains(event.target as Node)) {
    closePanel()
  }
}

watch(
  () => props.modelValue,
  () => {
    if (!open.value) {
      syncDraftPath()
    }
  },
  { deep: true },
)

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentPointer)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentPointer)
})
</script>

<style lang="scss">
.input-cascader {
  position: relative;

  &__control {
    position: relative;
    width: 100%;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    min-height: 3rem;
    padding: 0.8rem 1rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 84%);
    border-radius: var(--border-radius-xl);
    background: color-mix(in srgb, var(--color-background), transparent 2%);
    color: var(--color-foreground);
    text-align: left;
    cursor: pointer;

    &--open {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 var(--border-width) color-mix(in srgb, var(--color-primary), transparent 14%);
      background: color-mix(in srgb, var(--color-background), var(--color-primary) 6%);
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__trigger-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--placeholder {
      color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    }
  }

  &__trigger-icon {
    flex-shrink: 0;
  }

  &__panel {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    z-index: 40;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(11rem, 14rem);
    width: max-content;
    max-width: min(100vw - 2rem, 48rem);
    overflow: auto;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: calc(var(--border-radius) * 1.1);
    background: color-mix(in srgb, var(--color-background), white 2%);
    box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--color-foreground), transparent 90%);
  }

  &__column {
    display: grid;
    gap: 0.15rem;
    min-width: 0;
    padding: 0.5rem;
    border-right: 1px solid color-mix(in srgb, var(--color-foreground), transparent 92%);

    &:last-child {
      border-right: 0;
    }
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.65rem;
    width: 100%;
    padding: 0.55rem 0.7rem;
    border: 0;
    border-radius: calc(var(--border-radius) * 0.75);
    background: transparent;
    color: var(--color-foreground);
    text-align: left;
    cursor: pointer;

    &:hover:not(&--disabled) {
      background: color-mix(in srgb, var(--color-foreground), transparent 96%);
    }

    &--active {
      background: color-mix(in srgb, var(--color-primary), transparent 90%);
      color: var(--color-primary);
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__option-main {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    min-width: 0;
  }

  &__option-icon,
  &__option-arrow {
    flex-shrink: 0;
  }

  @media (max-width: 700px) {
    &__panel {
      right: 0;
      left: 0;
      width: auto;
      grid-auto-flow: row;
      grid-auto-columns: auto;
    }

    &__column {
      border-right: 0;
      border-bottom: 1px solid color-mix(in srgb, var(--color-foreground), transparent 92%);

      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
