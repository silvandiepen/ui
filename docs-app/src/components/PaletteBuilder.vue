<template>
  <div :class="bemm()">
    <div :class="bemm('grid')">
      <div
        v-for="color in palette"
        :key="color.name"
        :class="bemm('color')"
      >
        <div :class="bemm('swatch-row')">
          <label
            :class="bemm('swatch')"
            :style="{ backgroundColor: color.hex }"
          >
            <input
              type="color"
              :value="color.hex"
              :class="bemm('native-picker')"
              @input="handleSwatchInput(color.name, ($event.target as HTMLInputElement).value)"
            />
          </label>

          <div :class="bemm('info')">
            <input
              :class="bemm('name-input')"
              :value="color.name"
              :disabled="isDefaultColor(color.name)"
              spellcheck="false"
              @change="handleRename(color.name, ($event.target as HTMLInputElement).value)"
            />
            <input
              :class="bemm('hex-input')"
              :value="color.hex"
              spellcheck="false"
              @change="handleHexChange(color.name, ($event.target as HTMLInputElement).value)"
            />
          </div>

          <button
            v-if="!isDefaultColor(color.name)"
            :class="bemm('remove')"
            title="Remove color"
            @click="$emit('remove', color.name)"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <div :class="bemm('add')">
      <input
        ref="newNameRef"
        :class="bemm('add-name')"
        v-model="newName"
        placeholder="Color name"
        spellcheck="false"
        @keydown.enter="handleAdd"
      />
      <input
        :class="bemm('add-hex')"
        v-model="newHex"
        type="color"
        @input="newHex = ($event.target as HTMLInputElement).value"
      />
      <button
        :class="bemm('add-button')"
        :disabled="!canAdd"
        @click="handleAdd"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBemm } from 'bemm'
import type { PaletteColor } from '@ui-docs/lib/docsTheme'

defineProps<{
  palette: PaletteColor[]
}>()

const emit = defineEmits<{
  add: [name: string, hex: string]
  remove: [name: string]
  rename: [oldName: string, newName: string]
  update: [name: string, hex: string]
}>()

const bemm = useBemm('palette-builder', { includeBaseClass: true })

const newName = ref('')
const newHex = ref('#6366f1')
const newNameRef = ref<HTMLInputElement>()

const canAdd = computed(() => {
  const slug = newName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return slug.length > 0
})

const DEFAULT_NAMES = new Set([
  'red', 'orange', 'yellow', 'green', 'teal', 'blue',
  'indigo', 'purple', 'pink', 'gray', 'white', 'black',
])

function isDefaultColor(name: string) {
  return DEFAULT_NAMES.has(name)
}

function handleAdd() {
  const slug = newName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (!slug) return
  emit('add', slug, newHex.value)
  newName.value = ''
  newNameRef.value?.focus()
}

function handleSwatchInput(name: string, hex: string) {
  emit('update', name, hex)
}

function handleHexChange(name: string, raw: string) {
  const hex = raw.trim()
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    emit('update', name, hex)
  }
}

function handleRename(oldName: string, raw: string) {
  const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (slug && slug !== oldName) {
    emit('rename', oldName, slug)
  }
}
</script>

<style lang="scss">
.palette-builder {
  display: grid;
  gap: 1rem;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 0.5rem;
  }

  &__color {
    border-radius: var(--border-radius, 0.5rem);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    overflow: hidden;
  }

  &__swatch-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  &__swatch {
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: calc(var(--border-radius, 0.5rem) * 0.6);
    cursor: pointer;
    flex-shrink: 0;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    overflow: hidden;

    &:hover {
      border-color: var(--color-foreground);
    }
  }

  &__native-picker {
    position: absolute;
    inset: -0.5rem;
    width: calc(100% + 1rem);
    height: calc(100% + 1rem);
    border: none;
    cursor: pointer;
    padding: 0;
  }

  &__info {
    flex: 1;
    display: grid;
    gap: 0.15rem;
    min-width: 0;
  }

  &__name-input,
  &__hex-input {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--color-foreground);
    font: inherit;
    padding: 0;
    outline: none;
  }

  &__name-input {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  &__hex-input {
    font-size: 0.75rem;
    font-family: var(--font-family-mono, monospace);
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }

  &__remove {
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    border-radius: calc(var(--border-radius, 0.5rem) * 0.4);
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    cursor: pointer;
    font-size: 1rem;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: color-mix(in srgb, var(--color-error, #f40935), transparent 85%);
      color: var(--color-error, #f40935);
    }
  }

  &__add {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding-top: 0.5rem;
    border-top: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  }

  &__add-name {
    flex: 1;
    padding: 0.45rem 0.65rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 78%);
    border-radius: calc(var(--border-radius, 0.5rem) * 0.5);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
    color: var(--color-foreground);
    font: inherit;
    font-size: 0.85rem;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  &__add-hex {
    width: 2.5rem;
    height: 2rem;
    padding: 1px;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 78%);
    border-radius: calc(var(--border-radius, 0.5rem) * 0.5);
    cursor: pointer;
    background: none;

    &:hover {
      border-color: var(--color-foreground);
    }
  }

  &__add-button {
    padding: 0.45rem 0.85rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 78%);
    border-radius: calc(var(--border-radius, 0.5rem) * 0.5);
    background: transparent;
    color: var(--color-foreground);
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;

    &:hover:not(:disabled) {
      border-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary), transparent 90%);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>
