<template>
  <Example>
<Form :class="bemm()" @submit="handleSubmit">
    <InputText
      v-model="name"
      name="name"
      label="Project name"
      placeholder="Shared UI cleanup"
      description="This form shows how `UIForm` composes several shared `T*` inputs together."
    />

    <InputEmail
      v-model="ownerEmail"
      name="ownerEmail"
      label="Owner email"
      placeholder="team@example.com"
    />

    <InputSelect
      v-model="environment"
      name="environment"
      label="Environment"
      :options="environmentOptions"
    />

    <InputToggle
      v-model="releaseReady"
      name="releaseReady"
      label="Ready for release"
      :labels="{ on: 'Yes', off: 'No' }"
    />

    <InputTextArea
      v-model="notes"
      name="notes"
      label="Release notes"
      placeholder="Describe what changed in this release."
    />

    <FormActions>
      <Button type="submit">Save form</Button>
    </FormActions>

    <p :class="bemm('summary')">
      Last submit:
      <strong>{{ submissionSummary }}</strong>
    </p>
  </Form>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import Button from '../../Button/Button.vue'
import FormActions from '../FormActions/FormActions.vue'
import Form from './Form.vue'
import InputEmail from '../InputEmail/InputEmail.vue'
import InputSelect from '../InputSelect/InputSelect.vue'
import InputText from '../InputText/InputText.vue'
import InputTextArea from '../InputTextArea/InputTextArea.vue'
import InputToggle from '../InputToggle/InputToggle.vue'

const bemm = useBemm('t-form-example')

const name = ref('Docs refresh')
const ownerEmail = ref('team@sil.mt')
const environment = ref<string | null>('staging')
const notes = ref('Tighten docs examples, verify tokens, and update component references.')
const releaseReady = ref(true)
const submissionSummary = ref('Nothing submitted yet')

const environmentOptions = [
  { label: 'Development', value: 'development' },
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'production' },
]

function handleSubmit(_event: Event, formData: FormData) {
  submissionSummary.value = `${formData.get('name') || name.value} / ${formData.get('environment') || environment.value || 'none'} / ready: ${releaseReady.value ? 'yes' : 'no'}`
}
</script>

<style lang="scss">
.t-form-example {
  display: grid;
  gap: var(--space);

  &__summary {
    margin: 0;
  }
}
</style>
