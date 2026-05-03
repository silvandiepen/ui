<template>
  <InputBase
    v-model="modelValue"
    :block="block"
    :label="label"
    :disabled="disabled"
    :inline="inline"
    :size="size"
    :description="description"
    :test-id="testId"
    @change="$emit('change', $event)"
    @touched="$emit('touched', $event)"
  >
    <template #control>
      <!-- Image preview when image is selected -->
      <div
        v-if="modelValue?.url"
        :class="bemm('preview', ['', small ? 'small' : ''])"
        :style="`--current-color: var(--color-${color || 'primary'})`"
        :data-test-id="getTestId(testId, 'preview')"
        @click="openSelector"
      >
        <img :src="modelValue.url" :alt="modelValue.alt || placeholder" :data-test-id="getTestId(testId, 'image')" />
        <div :class="bemm('actions')" :data-test-id="getTestId(testId, 'actions')">
          <Button
            :icon="Icons.MEDIA_IMAGE"
            size="small"
            :variant="ButtonVariant.OUTLINE"
            :color="Colors.PRIMARY"
            :test-id="getTestId(testId, 'select-button')"
            @click.stop="openSelector"
          />
          <Button
            v-if="!small"
            :icon="Icons.UI_TRASH"
            size="small"
            :variant="ButtonVariant.GHOST"
            :color="Colors.ERROR"
            :test-id="getTestId(testId, 'clear-button')"
            @click.stop="clearImage"
          />
        </div>
      </div>

      <!-- Placeholder when no image is selected -->
      <div
        v-else
        :class="bemm('placeholder', { small })"
        :data-test-id="getTestId(testId, 'placeholder')"
        @click="openSelector"
      >
        <Icon :name="Icons.MEDIA_IMAGE" :size="small ? 'small' : 'large'" :data-test-id="getTestId(testId, 'placeholder-icon')" />
        <span v-if="!small" :data-test-id="getTestId(testId, 'placeholder-label')">{{ placeholder }}</span>
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
import { getTestId } from '../../../utils'

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

  &__preview {
    position: relative;
    width: m.p('preview-size', 8em);
    height: m.p('preview-size', 8em);
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
      width: m.p('preview-size', 3em);
      height: m.p('preview-size', 3em);
      border-radius: .5em;

      .image-input__actions {
        top: m.p('actions-top', 0.25em);
        right: m.p('actions-right', 0.25em);
        gap: m.p('actions-gap', 0.125em);

        .t-button {
          --button-size-small: 1.25em;
          --button-font-size-small: 0.625em;
        }
      }
    }
  }

  &__actions {
    position: absolute;
    top: m.p('actions-top', var(--space-s));
    right: m.p('actions-right', var(--space-s));
    display: flex;
    gap: m.p('actions-gap', var(--space-xs));
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: m.p('placeholder-gap', var(--space-s));
    padding: m.p('placeholder-padding', var(--space-l));
    background: var(--color-background);
    border: 2px dashed var(--color-accent);
    border-radius: m.p('placeholder-border-radius', var(--border-radius));
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    width: m.p('placeholder-size', 150px);
    height: m.p('placeholder-size', 150px);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    &--small {
      width: m.p('placeholder-size', calc(var(--space) * 3));
      height: m.p('placeholder-size', calc(var(--space) * 3));
      padding: m.p('placeholder-padding', var(--space-s));

      span {
        display: none;
      }
    }

    span {
      font-size: m.p('placeholder-font-size', var(--font-size-s));
      text-align: center;
    }
  }
}
</style>
