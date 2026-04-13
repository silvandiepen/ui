<template>
  <div :class="bemm()">
    <h3 :class="bemm('title')">{{ title }}</h3>
    <p v-if="message" :class="bemm('message')">{{ message }}</p>
    
    <InputText
      v-model="inputValue"
      :placeholder="placeholder"
      :type="type"
      :error="errorMessage ? [errorMessage] : []"
      :class="bemm('input')"
      @keyup.enter="handleConfirm"
      ref="inputRef"
    />
    
    <div :class="bemm('actions')">
      <Button
        :variant="ButtonVariant.OUTLINE"
        :color="Colors.SECONDARY"
        @click="handleCancel"
      >
        {{ cancelLabel }}
      </Button>
      <Button
        :variant="ButtonVariant.PRIMARY"
        :color="Colors.PRIMARY"
        @click="handleConfirm"
      >
        {{ confirmLabel }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBemm } from 'bemm'
import { InputText } from '../../../Form/Form/inputs/InputText'
import { Button, ButtonVariant } from '../../../Button'
import { Colors } from '../../../../types'

interface Props {
  title: string
  message?: string
  placeholder?: string
  initialValue?: string
  confirmLabel?: string
  cancelLabel?: string
  validate?: (value: string) => boolean | string
  type?: 'text' | 'email' | 'number' | 'password'
  onConfirm?: (value: string) => void
  onCancel?: () => void
  popupId?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'OK',
  cancelLabel: 'Cancel',
  initialValue: '',
  type: 'text'
})

const { bemm } = useBemm('input-dialog')
const inputValue = ref(props.initialValue)
const errorMessage = ref('')
const inputRef = ref<any>(null)

const handleConfirm = () => {
  const value = inputValue.value.trim()
  
  if (props.validate) {
    const validationResult = props.validate(value)
    if (validationResult !== true) {
      errorMessage.value = typeof validationResult === 'string' ? validationResult : 'Invalid input'
      return
    }
  }
  
  props.onConfirm?.(value)
}

const handleCancel = () => {
  props.onCancel?.()
}

onMounted(() => {
  // Focus the input when dialog opens
  setTimeout(() => {
    inputRef.value?.focus()
  }, 100)
})
</script>

<style lang="scss">
.input-dialog {
  padding: var(--space-l);
  min-width: 400px;
  max-width: 500px;
  
  &__title {
    margin: 0 0 var(--space-m) 0;
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-semibold);
  }
  
  &__message {
    margin: 0 0 var(--space-m) 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 20%);
  }
  
  &__input {
    margin-bottom: var(--space-l);
    width: 100%;
  }
  
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-s);
  }
}</style>
