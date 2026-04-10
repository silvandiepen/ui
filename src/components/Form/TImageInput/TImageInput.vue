<template>
  <InputBase
    v-model="modelValue"
    :block="block"
    :label="label"
    :disabled="disabled"
    :inline="inline"
    :size="size"
    :description="description"
    @change="$emit('change', $event)"
    @touched="$emit('touched', $event)"
  >
    <template #control>
      <!-- Image preview when image is selected -->
      <div
        v-if="modelValue?.url"
        :class="bemm('preview', ['', small ? 'small' : ''])"
        :style="`--current-color: var(--color-${color || 'primary'})`"
        @click="openSelector"
      >
        <img :src="modelValue.url" :alt="modelValue.alt || placeholder" />
        <div :class="bemm('actions')">
          <Button
            :icon="Icons.IMAGE"
            size="small"
            :variant="ButtonVariant.OUTLINE"
            :color="Colors.PRIMARY"
            @click.stop="openSelector"
          />
          <Button
            v-if="!small"
            :icon="Icons.TRASH"
            size="small"
            :variant="ButtonVariant.GHOST"
            :color="Colors.ERROR"
            @click.stop="clearImage"
          />
        </div>
      </div>

      <!-- Placeholder when no image is selected -->
      <div
        v-else
        :class="bemm('placeholder', { small })"
        @click="openSelector"
      >
        <Icon :name="Icons.IMAGE" :size="small ? 'small' : 'large'" />
        <span v-if="!small">{{ placeholder }}</span>
      </div>
    </template>
  </InputBase>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useBemm } from 'bemm'
import InputBase from '../TForm/InputBase.vue'
import { Button, ButtonVariant } from '../../Button'
import Icon from '../../Icon/Icon.vue'
import TMediaSelector from '../../media/TMediaSelector/TMediaSelector.vue'
import { Colors, Size } from '../../../types'
import { Icons } from 'open-icon'
import type { ImageValue, TImageInputProps } from './TImageInput.model'

const modelValue = defineModel<ImageValue | null>()

const props = withDefaults(defineProps<TImageInputProps>(), {
  block: 'image-input',
  color: 'primary',
  placeholder: 'Click to select image',
  small: false,
  multiple: false,
  title: 'Select Image',
  label: '',
  inline: false,
  size: Size.MEDIUM,
  disabled: false,
  description: ''
})

const emit = defineEmits<{
  change: [value: ImageValue | null]
  touched: [value: boolean]
}>()

const bemm = useBemm(props.block)
const popupService = inject<any>('popupService')

const openSelector = () => {
  popupService?.open({
    component: TMediaSelector,
    title: props.title,
    props: {
      multiple: props.multiple,
      selectedIds: modelValue.value?.url ? [modelValue.value.url] : [],
      onConfirm: (selectedItems: any[]) => {
        if (selectedItems.length > 0) {
          const item = selectedItems[0]
          const imageValue: ImageValue = {
            url: item.original_url || item.url || '',
            alt: item.title || item.original_filename || ''
          }
          modelValue.value = imageValue
          emit('change', imageValue)
        }
        popupService?.close()
      },
      onCancel: () => {
        popupService?.close()
      }
    }
  })
}

const clearImage = () => {
  modelValue.value = null
  emit('change', null)
}
</script>

<style lang="scss">
@use '../TForm/Form.scss' as form;

.image-input {
  @include form.inputBase();

  @include form.inputImage();

  &__preview {
    position: relative;
    width: 8em;
    height: 8em;
    border-radius: calc(var(--border-radius) / 2);
    overflow: hidden;
    border: 1px solid var(--color-accent);
    background-color: var(--current-color);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--color-primary);

      .image-input__actions {
        opacity: 1;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--small {
      width: 3em;
      height: 3em;
      border-radius: .5em;

      .image-input__actions {
        top: 0.25em;
        right: 0.25em;
        gap: 0.125em;

        .t-button {
          --button-size-small: 1.25em;
          --button-font-size-small: 0.625em;
        }
      }
    }
  }

  &__actions {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.5rem;
    padding: 2rem;
    background: var(--color-background);
    border: 2px dashed var(--color-accent);
    border-radius: 0.5rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 150px;
    height: 150px;

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    &--small {
      width: 3rem;
      height: 3rem;
      padding: 0.5rem;

      span {
        display: none;
      }
    }

    span {
      font-size: 0.875rem;
      text-align: center;
    }
  }
}
</style>
