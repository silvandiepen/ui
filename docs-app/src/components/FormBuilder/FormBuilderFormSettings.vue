<template>
  <div class="form-builder-form-settings">

    <!-- Layout -->
    <div class="form-builder-form-settings__section">
      <div class="form-builder-form-settings__section-title">Layout</div>
      <InputSwitch
        label="Columns"
        :model-value="String(draft.columns ?? 1)"
        :items="['1', '2', '3', '4']"
        @update:model-value="draft.columns = Number($event); emitUpdate()"
      />
    </div>

    <!-- Validation behavior -->
    <div class="form-builder-form-settings__section">
      <div class="form-builder-form-settings__section-title">Validation</div>
      <InputToggle
        size="small"
        label="Validate on change"
        :model-value="!!draft.validateOnChange"
        @update:model-value="draft.validateOnChange = $event as boolean; emitUpdate()"
      />
      <InputToggle
        size="small"
        label="Validate on blur"
        :model-value="!!draft.validateOnBlur"
        @update:model-value="draft.validateOnBlur = $event as boolean; emitUpdate()"
      />
    </div>

    <!-- Initial values -->
    <div class="form-builder-form-settings__section">
      <div class="form-builder-form-settings__section-title">Initial Values (JSON)</div>
      <InputTextArea
        size="small"
        :model-value="initialValuesJson"
        :min-rows="4"
        :max-rows="10"
        :auto-grow="true"
        @change="onInitialValuesChange"
      />
      <span v-if="initialValuesError" class="form-builder-form-settings__error">{{ initialValuesError }}</span>
    </div>

    <!-- Config preview -->
    <Card variant="elevated" class="form-builder-form-settings__config-card">
      <div class="form-builder-form-settings__section-title">Config Preview</div>
      <pre class="form-builder-form-settings__preview">{{ JSON.stringify(config, null, 2) }}</pre>
    </Card>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Card } from '@ui-lib/components/Card'
import InputSwitch from '@ui-lib/components/Form/InputSwitch/InputSwitch.vue'
import InputToggle from '@ui-lib/components/Form/InputToggle/InputToggle.vue'
import InputTextArea from '@ui-lib/components/Form/InputTextArea/InputTextArea.vue'
import type { FormConfig } from '@ui-lib/components/Form/Form/FormConfig.model'

const props = defineProps<{
  config: FormConfig
}>()

const emit = defineEmits<{
  update: [config: FormConfig]
}>()

const draft = ref<FormConfig>(JSON.parse(JSON.stringify(props.config)))
const initialValuesError = ref('')

watch(() => props.config, (newConfig) => {
  draft.value = JSON.parse(JSON.stringify(newConfig))
}, { deep: true })

const initialValuesJson = computed(() =>
  JSON.stringify(draft.value.initialValues ?? {}, null, 2)
)

function emitUpdate() {
  emit('update', JSON.parse(JSON.stringify(draft.value)))
}

function onInitialValuesChange(value: string) {
  try {
    draft.value.initialValues = JSON.parse(value)
    initialValuesError.value = ''
    emitUpdate()
  } catch {
    initialValuesError.value = 'Invalid JSON'
  }
}
</script>

<style lang="scss">
.form-builder-form-settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  padding: var(--space-s);
  height: 100%;
  overflow-y: auto;

  &__section {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    padding: var(--space-s);
    background: color-mix(in srgb, var(--color-foreground), transparent 97%);
    border-radius: var(--border-radius);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  }

  &__section-title {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }

  &__preview {
    font-size: var(--font-size-xs);
    font-family: monospace;
    background: color-mix(in srgb, var(--color-foreground), transparent 95%);
    border-radius: var(--border-radius-s);
    padding: var(--space-s);
    overflow: auto;
    max-height: 300px;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  &__config-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  &__error {
    font-size: var(--font-size-xs);
    color: var(--color-error);
  }
}
</style>
