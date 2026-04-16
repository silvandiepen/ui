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
import { useBemm } from 'bemm'
import InputBase from '../Form/InputBase.vue'
import { Button, ButtonVariant } from '../../Button'
import Icon from '../../Icon/Icon.vue'
import { popupService } from '../../Feedback/Popup/Popup.service'
import ImageInputDialog from './ImageInputDialog.vue'
import { Colors, Size } from '../../../types'
import { Icons } from 'open-icon'
import type { ImageValue, ImageInputProps } from './ImageInput.model'

const modelValue = defineModel<ImageValue | null>()

const props = withDefaults(defineProps<ImageInputProps>(), {
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

const openSelector = () => {
  popupService.open({
    component: ImageInputDialog,
    title: props.title,
    props: {
      initialUrl: modelValue.value?.url ?? '',
      initialAlt: modelValue.value?.alt ?? '',
      onConfirm: (value: ImageValue) => {
        modelValue.value = value
        emit('change', value)
        popupService.close()
      },
      onCancel: () => {
        popupService.close()
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
@use '../Form/Form.scss' as form;
@use '../../../styles/mixins' as m;

.image-input {
  @include form.inputBase();

  @include form.inputImage();

  @include m.component-props((
    'preview-size': '8em',
    'preview-small-size': '3em',
    'actions-top': '0.5rem',
    'actions-right': '0.5rem',
    'actions-gap': '0.25rem',
    'actions-small-top': '0.25em',
    'actions-small-right': '0.25em',
    'actions-small-gap': '0.125em',
    'placeholder-size': '150px',
    'placeholder-small-size': '3rem',
    'placeholder-gap': '0.5rem',
    'placeholder-padding': '2rem',
    'placeholder-small-padding': '0.5rem',
    'placeholder-border-radius': '0.5rem',
    'placeholder-font-size': '0.875rem',
  ), 'image-input');

  &__preview {
    position: relative;
    width: var(--int-image-input-preview-size);
    height: var(--int-image-input-preview-size);
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
      width: var(--int-image-input-preview-small-size);
      height: var(--int-image-input-preview-small-size);
      border-radius: .5em;

      .image-input__actions {
        top: var(--int-image-input-actions-small-top);
        right: var(--int-image-input-actions-small-right);
        gap: var(--int-image-input-actions-small-gap);

        .t-button {
          --button-size-small: 1.25em;
          --button-font-size-small: 0.625em;
        }
      }
    }
  }

  &__actions {
    position: absolute;
    top: var(--int-image-input-actions-top);
    right: var(--int-image-input-actions-right);
    display: flex;
    gap: var(--int-image-input-actions-gap);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: var(--int-image-input-placeholder-gap);
    padding: var(--int-image-input-placeholder-padding);
    background: var(--color-background);
    border: 2px dashed var(--color-accent);
    border-radius: var(--int-image-input-placeholder-border-radius);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    width: var(--int-image-input-placeholder-size);
    height: var(--int-image-input-placeholder-size);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    &--small {
      width: var(--int-image-input-placeholder-small-size);
      height: var(--int-image-input-placeholder-small-size);
      padding: var(--int-image-input-placeholder-small-padding);

      span {
        display: none;
      }
    }

    span {
      font-size: var(--int-image-input-placeholder-font-size);
      text-align: center;
    }
  }
}
</style>
