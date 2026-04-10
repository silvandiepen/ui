<template>
  <div :class="bemm()">
    <label v-if="label" :class="bemm('label')">
      {{ label }}
      <span v-if="required" :class="bemm('required')">*</span>
    </label>

    <div :class="bemm('container', { error: !!error, disabled, readonly })">
      <!-- Simple textarea fallback instead of rich editor -->
      <textarea
        :value="modelValue"
        :placeholder="placeholder || 'Enter text...'"
        :disabled="disabled"
        :readonly="readonly"
        :class="bemm('textarea')"
        :style="{
          height: height,
          maxHeight: maxHeight
        }"
        @input="handleInput"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
    </div>

    <span v-if="error" :class="bemm('error')">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import type { TRichTextEditorProps } from './TRichTextEditor.model'

withDefaults(defineProps<TRichTextEditorProps>(), {
  modelValue: '',
  height: '300px',
  maxHeight: '500px',
  features: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': []
  'blur': []
}>()

const bemm = useBemm('tiko-rich-text-editor')

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<style lang="scss">
.tiko-rich-text-editor {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  &__label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-foreground);
  }

  &__required {
    color: var(--color-error);
    margin-left: var(--space-xs);
  }

  &__container {
    display: flex;
    flex-direction: column;
    background: var(--color-background);
    border: 1px solid var(--color-accent);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-10);
    }

    &--error {
      border-color: var(--color-error);

      &:focus-within {
        box-shadow: 0 0 0 3px var(--color-error-10);
      }
    }

    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--color-gray-light);
    }

    &--readonly {
      background: var(--color-gray-light);
    }
  }

  &__textarea {
    width: 100%;
    padding: var(--space);
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    
    &:disabled {
      cursor: not-allowed;
    }
  }

  &__error {
    font-size: var(--font-size-sm);
    color: var(--color-error);
  }
}
</style>
