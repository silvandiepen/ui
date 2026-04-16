<template>
  <div :class="bemm()">
    <div :class="bemm('preview')">
      <slot>
        <component
          :is="component"
          v-if="component && hasModelValue"
          v-bind="nonModelProps"
          v-model="modelValue"
        />
        <component
          :is="component"
          v-else-if="component"
          v-bind="nonModelProps"
        />
      </slot>
    </div>

    <Collapsible
      v-if="controls.length"
      v-model="controlsOpen"
      :class="bemm('collapsible')"
      :label="`Props (${controls.length})`"
      icon="tune"
    >
      <div :class="bemm('controls')">
        <div
          v-for="control in controls"
          :key="control.name"
          :class="[bemm('control'), bemm('control', control.type)]"
        >
          <span :class="bemm('control-label')">
            {{ control.name }}
          </span>

          <span :class="bemm('control-type')">{{ control.type }}</span>

          <span :class="bemm('control-input')">
            <InputCheckbox
              v-if="control.type === 'boolean'"
              :model-value="Boolean(propValues[control.name])"
              :label="''"
              @update:model-value="(value) => setControlValue(control, value)"
            />

            <InputSelect
              v-else-if="control.options?.length"
              :model-value="getSelectValue(control)"
              :options="getSelectOptions(control)"
              :allow-null="false"
              @update:model-value="(value) => handleSelectChange(control, value)"
            />

            <InputNumber
              v-else-if="control.type === 'number'"
              :model-value="Number(propValues[control.name])"
              :controls="false"
              @update:model-value="(value) => setControlValue(control, value)"
            />

            <InputText
              v-else
              :model-value="String(propValues[control.name] ?? '')"
              :controls="false"
              @update:model-value="(value) => setControlValue(control, value)"
            />
          </span>

          <button
            v-if="control.defaultValue !== undefined && propValues[control.name] !== control.defaultValue"
            :class="bemm('control-reset')"
            title="Reset to default"
            type="button"
            @click="propValues[control.name] = control.defaultValue"
          >
            ↺
          </button>
        </div>
      </div>
    </Collapsible>

    <Collapsible
      v-if="generatedCode"
      v-model="sourceOpen"
      :class="bemm('collapsible')"
      label="Source"
      icon="code"
    >
      <pre :class="bemm('code')"><code>{{ generatedCode }}</code></pre>
    </Collapsible>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch, onMounted, type Component } from 'vue'
import { useBemm } from 'bemm'
import { Collapsible } from '@ui-lib/components/Collapsible'
import { InputCheckbox } from '@ui-lib/components/Form/InputCheckbox'
import { InputNumber } from '@ui-lib/components/Form/InputNumber'
import { InputSelect } from '@ui-lib/components/Form/InputSelect'
import { InputText } from '@ui-lib/components/Form/InputText'

interface ControlDef {
  name: string
  type: 'boolean' | 'string' | 'number' | 'array' | 'unknown'
  options?: any[]
  defaultValue?: any
}

const STORAGE_KEY = 'sil-ui-example-props'

const props = defineProps<{
  component?: Component
  name?: string
  propOptions?: Record<string, any[]>
  excludeProps?: string[]
  source?: string
}>()

const bemm = useBemm('example', { includeBaseClass: true })

function resolvePropType(type: any): ControlDef['type'] {
  if (type === Boolean) return 'boolean'
  if (type === Number) return 'number'
  if (type === String) return 'string'
  if (type === Array) return 'array'
  if (Array.isArray(type)) {
    if (type.includes(Boolean)) return 'boolean'
    if (type.includes(Number)) return 'number'
    if (type.includes(String)) return 'string'
  }
  return 'unknown'
}

function resolveDefault(def: any): any {
  if (def === undefined || def === null) return undefined
  if (typeof def === 'function') {
    try { return def() } catch { return undefined }
  }
  return def
}

const propDefs = computed(() => {
  const comp = props.component as any
  return comp?.props ?? {}
})

const hasModelValue = computed(() => {
  return 'modelValue' in propDefs.value
})

const controls = computed<ControlDef[]>(() => {
  if (!props.component) return []

  const defs = propDefs.value
  const excluded = new Set([...(props.excludeProps ?? []), 'modelValue'])

  return Object.entries(defs)
    .filter(([name]) => !excluded.has(name))
    .map(([name, def]: [string, any]) => ({
      name,
      type: resolvePropType(def.type),
      options: props.propOptions?.[name],
      defaultValue: resolveDefault(def.default),
    }))
    .filter((control) => {
      // Keep array/unknown props controllable when explicit example options are provided.
      if (control.type === 'array' || control.type === 'unknown') {
        return Boolean(control.options?.length)
      }
      return true
    })
})

const propValues = reactive<Record<string, any>>({})
const modelValue = ref<any>(undefined)
const controlsOpen = ref(true)
const sourceOpen = ref(false)

const componentKey = computed(() => props.name ?? '')

function loadSaved(): Record<string, any> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const all = JSON.parse(raw)
      return all[componentKey.value] ?? {}
    }
  } catch { /* ignore */ }
  return {}
}

function save() {
  if (!componentKey.value) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    all[componentKey.value] = { ...propValues }
    if (hasModelValue.value) {
      all[componentKey.value].__modelValue = modelValue.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch { /* ignore */ }
}

function initValues() {
  const saved = loadSaved()
  for (const control of controls.value) {
    if (control.name in saved) {
      propValues[control.name] = saved[control.name]
    } else if (control.options?.length) {
      propValues[control.name] = control.options[0]
    } else if (control.defaultValue !== undefined) {
      propValues[control.name] = control.defaultValue
    } else {
      switch (control.type) {
        case 'boolean': propValues[control.name] = false; break
        case 'string': propValues[control.name] = ''; break
        case 'number': propValues[control.name] = 0; break
      }
    }
  }
  if (hasModelValue.value) {
    const modelType = resolvePropType(propDefs.value.modelValue?.type)
    if ('__modelValue' in saved) {
      modelValue.value = saved.__modelValue
    } else if (modelType === 'boolean') {
      modelValue.value = false
    } else if (modelType === 'number') {
      modelValue.value = 0
    } else {
      modelValue.value = ''
    }
  }
}

onMounted(() => {
  initValues()
})

watch([propValues, modelValue], save, { deep: true })

const nonModelProps = computed(() => {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(propValues)) {
    result[key] = value
  }
  return result
})

function setControlValue(control: ControlDef, value: unknown) {
  propValues[control.name] = value
}

function getSelectOptions(control: ControlDef) {
  return (control.options ?? []).map((option, index) => ({
    label: String(option),
    value: String(index),
  }))
}

function getSelectValue(control: ControlDef) {
  const options = control.options ?? []
  const valueIndex = options.findIndex((option) => Object.is(option, propValues[control.name]))

  return valueIndex >= 0 ? String(valueIndex) : null
}

function handleSelectChange(control: ControlDef, value: unknown) {
  if (Array.isArray(value) || value === null || typeof value !== 'string') {
    return
  }

  const optionIndex = Number(value)
  if (!Number.isInteger(optionIndex)) {
    return
  }

  const options = control.options ?? []
  if (optionIndex < 0 || optionIndex >= options.length) {
    return
  }

  propValues[control.name] = options[optionIndex]
}

function isDefault(control: ControlDef, value: any): boolean {
  if (control.defaultValue === undefined) return value === '' || value === false || value === 0
  return value === control.defaultValue
}

const generatedCode = computed(() => {
  if (props.source) return props.source
  if (!props.component || !props.name) return ''

  const tag = props.name
  const attrs: string[] = []

  if (hasModelValue.value) {
    attrs.push('v-model="value"')
  }

  for (const control of controls.value) {
    const value = propValues[control.name]
    if (isDefault(control, value)) continue

    if (control.type === 'boolean') {
      attrs.push(value ? `  ${control.name}` : `  :${control.name}="false"`)
    } else if (control.type === 'string' && value) {
      attrs.push(`  ${control.name}="${value}"`)
    } else if (control.type === 'number') {
      attrs.push(`  :${control.name}="${value}"`)
    } else if (control.options?.length) {
      attrs.push(`  :${control.name}="${JSON.stringify(value)}"`)
    }
  }

  if (attrs.length === 0) return `<${tag} />`

  const indent = attrs.every(a => a.startsWith('  ')) ? '' : '  '
  const lines = attrs.map(a => `${indent}${a.trimStart()}`)
  return `<${tag}\n${lines.join('\n')}\n/>`
})
</script>

<style lang="scss">
.example {
  display: grid;
  gap: var(--space);

  &__preview {
    padding: var(--space);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
  }

  &__collapsible {
    background: transparent;
  }

  &__controls {
    display: grid;
    gap: var(--space-xs);
    padding: var(--space);
  }

  &__control {
    display: grid;
    grid-template-columns: minmax(8rem, auto) minmax(4rem, auto) 1fr auto;
    gap: var(--space-s);
    align-items: center;
    padding: var(--space-xs) 0;

    &:not(:last-child) {
      border-bottom: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    }
  }

  &__control-label {
    font-family: var(--font-family-mono, monospace);
    font-size: var(--font-size-s);
    font-weight: 500;
  }

  &__control-type {
    font-size: var(--font-size-xs);
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    font-family: var(--font-family-mono, monospace);
  }

  &__control-input {
    display: flex;
    align-items: center;

    .input-text,
    .input-number,
    .input-select {
      width: 100%;
      max-width: 18rem;
      margin: 0;
    }
  }

  &__control-reset {
    width: 1.6rem;
    height: 1.6rem;
    border: none;
    border-radius: var(--border-radius-s);
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    cursor: pointer;
    font-size: 0.9rem;
    display: grid;
    place-items: center;
    opacity: 0;
    transition: opacity 150ms ease, background 150ms ease;

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 90%);
      color: var(--color-foreground);
    }
  }

  &__control:hover &__control-reset {
    opacity: 1;
  }

  &__code {
    margin: 0;
    padding: var(--space);
    overflow-x: auto;
    font-size: var(--font-size-s);
    line-height: 1.6;
    font-family: var(--font-family-mono, monospace);
    color: color-mix(in srgb, var(--color-background), var(--color-foreground) 8%);
    background: color-mix(in srgb, var(--color-foreground), var(--color-background) 12%);
    border-radius: var(--border-radius-s);
  }
}

@media (max-width: 640px) {
  .example__control {
    grid-template-columns: 1fr auto auto;
  }

  .example__control-type {
    display: none;
  }
}
</style>
