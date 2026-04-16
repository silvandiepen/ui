<template>
  <div :class="bemm()">
    <InputText
      v-model="urlValue"
      label="Image URL"
      placeholder="https://..."
      type="url"
      :error="urlError ? [urlError] : []"
      :class="bemm('field')"
      @keyup.enter="handleConfirm"
    />
    <InputText
      v-model="altValue"
      label="Alt text"
      placeholder="Describe the image"
      :class="bemm('field')"
      @keyup.enter="handleConfirm"
    />
    <div v-if="urlValue" :class="bemm('preview')">
      <img :src="urlValue" :alt="altValue" @error="onImgError" @load="onImgLoad" />
      <span v-if="imgBroken" :class="bemm('preview-error')">Invalid image URL</span>
    </div>
    <div :class="bemm('actions')">
      <Button :variant="ButtonVariant.OUTLINE" :color="Colors.SECONDARY" @click="handleCancel">
        Cancel
      </Button>
      <Button :variant="ButtonVariant.PRIMARY" :color="Colors.PRIMARY" :disabled="!urlValue || !!urlError" @click="handleConfirm">
        Select
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'
import { InputText } from '../InputText'
import { Button, ButtonVariant } from '../../Button'
import { Colors } from '../../../types'
import type { ImageValue } from './ImageInput.model'

const props = defineProps<{
  initialUrl?: string
  initialAlt?: string
  onConfirm?: (value: ImageValue) => void
  onCancel?: () => void
}>()

const bemm = useBemm('image-input-dialog')
const urlValue = ref(props.initialUrl ?? '')
const altValue = ref(props.initialAlt ?? '')
const urlError = ref('')
const imgBroken = ref(false)

const onImgError = () => { imgBroken.value = true }
const onImgLoad = () => { imgBroken.value = false; urlError.value = '' }

const handleConfirm = () => {
  if (!urlValue.value.trim()) {
    urlError.value = 'URL is required'
    return
  }
  props.onConfirm?.({ url: urlValue.value.trim(), alt: altValue.value.trim() })
}

const handleCancel = () => {
  props.onCancel?.()
}
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.image-input-dialog {
  @include m.component-props((
    'min-width': '360px',
    'max-width': '480px',
    'preview-height': '160px',
  ), 'image-input-dialog');

  padding: var(--space-l);
  min-width: var(--int-image-input-dialog-min-width);
  max-width: var(--int-image-input-dialog-max-width);
  display: flex;
  flex-direction: column;
  gap: var(--space-m);

  &__preview {
    position: relative;
    height: var(--int-image-input-dialog-preview-height);
    border-radius: var(--border-radius);
    overflow: hidden;
    background: color-mix(in srgb, var(--color-foreground), transparent 92%);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 80%);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-error {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-s);
      color: var(--color-error);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-s);
  }
}
</style>
