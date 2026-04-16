<template>
  <textarea
    v-bind="$attrs"
    :id="id"
    :class="textareaClasses"
    :value="modelValue"
    :disabled="disabled"
    :rows="rows"
    @input="onInput"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useBemm } from "bemm";

import type { TextareaProps } from "./Textarea.model";

defineOptions({ name: "SilTextarea", inheritAttrs: false });

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: "",
  disabled: false,
  id: undefined,
  rows: 4
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const bemm = useBemm("ui-textarea", { return: "string", includeBaseClass: true });

const textareaClasses = computed(() =>
  bemm("", { "is-disabled": props.disabled })
);

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
}

function onChange(event: Event) {
  emit("change", (event.target as HTMLTextAreaElement).value);
}
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.ui-textarea {
  @include m.component-props((
    'min-height': '7rem',
    'line-height': '1.5',
  ), 'ui-textarea');

  width: 100%;
  min-height: var(--int-ui-textarea-min-height);
  padding: calc(var(--space) * 0.92) var(--space);
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 84%);
  border-radius: var(--border-radius-xl);
  background: color-mix(in srgb, var(--color-background), transparent 2%);
  color: var(--color-foreground);
  font-size: var(--font-size-m, 1rem);
  line-height: var(--int-ui-textarea-line-height);
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    background-color 0.15s;
  outline: none;
  resize: vertical;
}

.ui-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 var(--border-width) color-mix(in srgb, var(--color-primary), transparent 14%);
  background: color-mix(in srgb, var(--color-background), var(--color-primary) 6%);
}

.ui-textarea--is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
