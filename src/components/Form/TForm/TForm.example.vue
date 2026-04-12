<template>
  <TForm :class="bemm()" @submit="handleSubmit">
    <TInputText
      v-model="name"
      name="name"
      label="Project name"
      placeholder="Shared UI cleanup"
      description="This form shows how `UIForm` composes several shared `T*` inputs together."
    />

    <TInputEmail
      v-model="ownerEmail"
      name="ownerEmail"
      label="Owner email"
      placeholder="team@example.com"
    />

    <TInputSelect
      v-model="environment"
      name="environment"
      label="Environment"
      :options="environmentOptions"
    />

    <TInputToggle
      v-model="releaseReady"
      name="releaseReady"
      label="Ready for release"
      :labels="{ on: 'Yes', off: 'No' }"
    />

    <TInputTextArea
      v-model="notes"
      name="notes"
      label="Release notes"
      placeholder="Describe what changed in this release."
    />

    <TFormActions>
      <Button type="submit">Save form</Button>
    </TFormActions>

    <p :class="bemm('summary')">
      Last submit:
      <strong>{{ submissionSummary }}</strong>
    </p>
  </TForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import Button from '../../Button/Button.vue'
import TFormActions from '../TFormActions/TFormActions.vue'
import TForm from './TForm.vue'
import TInputEmail from './InputEmail/InputEmail.vue'
import TInputSelect from './inputs/TInputSelect/TInputSelect.vue'
import TInputText from './inputs/TInputText/TInputText.vue'
import TInputTextArea from './inputs/TInputTextArea/TInputTextArea.vue'
import TInputToggle from './inputs/TInputToggle/TInputToggle.vue'

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
