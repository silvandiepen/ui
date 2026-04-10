<template>
  <select
    v-bind="$attrs"
    :id="id"
    :class="selectClasses"
    :value="modelValue"
    :disabled="disabled"
    @change="onChange"
  >
    <slot />
  </select>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useBemm } from "bemm";

import type { SelectProps } from "./Select.model";

defineOptions({ name: "SilSelect", inheritAttrs: false });

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: "",
  disabled: false,
  id: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const bemm = useBemm("sil-select", { return: "string", includeBaseClass: true });

const selectClasses = computed(() =>
  bemm("", { "is-disabled": props.disabled })
);

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  emit("update:modelValue", value);
  emit("change", value);
}
</script>

<style>
.sil-select {
  width: 100%;
  min-height: 3.3rem;
  padding: calc(var(--space) * 0.92) var(--space);
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 84%);
  border-radius: var(--border-radius-xl);
  background: color-mix(in srgb, var(--color-background), transparent 2%);
  color: var(--color-foreground);
  font-size: var(--font-size-m, 1rem);
  line-height: 1.5;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    background-color 0.15s;
  outline: none;
  appearance: none;
}

.sil-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 var(--border-width) color-mix(in srgb, var(--color-primary), transparent 14%);
  background: white;
}

.sil-select--is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
