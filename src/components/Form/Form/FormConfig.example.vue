<template>
  <div class="form-config-example">
    <!-- ------------------------------------------------------------------ -->
    <!-- Example 1: Simple contact form (flat) -->
    <!-- ------------------------------------------------------------------ -->
    <section class="form-config-example__section">
      <h2 class="form-config-example__heading">Contact Form (flat)</h2>
      <p class="form-config-example__description">
        A simple two-column flat form with blur-time validation.
      </p>

      <FormConfig
        :config="contactConfig"
        v-model="contactValues"
        @submit="handleContactSubmit"
      />

      <pre class="form-config-example__json">{{ JSON.stringify(contactValues, null, 2) }}</pre>
    </section>

    <!-- ------------------------------------------------------------------ -->
    <!-- Example 2: Multi-step registration form with conditional fields -->
    <!-- ------------------------------------------------------------------ -->
    <section class="form-config-example__section">
      <h2 class="form-config-example__heading">Registration (multi-step + conditional)</h2>
      <p class="form-config-example__description">
        Three steps. The "Team name" and "Team size" fields only appear when
        Account type is set to "Team".
      </p>

      <FormConfig
        :config="registrationConfig"
        v-model="registrationValues"
        @submit="handleRegistrationSubmit"
        @step-change="registrationStep = $event"
      />

      <pre class="form-config-example__json">{{ JSON.stringify(registrationValues, null, 2) }}</pre>
    </section>

    <!-- ------------------------------------------------------------------ -->
    <!-- Example 3: Programmatic control via useFormConfig -->
    <!-- ------------------------------------------------------------------ -->
    <section class="form-config-example__section">
      <h2 class="form-config-example__heading">Programmatic control (useFormConfig)</h2>
      <p class="form-config-example__description">
        Using <code>useFormConfig</code> directly to build a custom UI.
      </p>

      <div class="form-config-example__custom">
        <div
          v-for="field in customForm.visibleFields.value"
          :key="field.key"
          class="form-config-example__custom-field"
        >
          <FormConfigField
            :config="field"
            :model-value="customForm.values.value[field.key]"
            :error="customForm.errors.value[field.key]"
            :disabled="customForm.checkFieldDisabled(field)"
            @update:model-value="customForm.setValue(field.key, $event)"
            @blur="customForm.setTouched(field.key)"
          />
        </div>

        <div class="form-config-example__custom-actions">
          <button
            type="button"
            @click="handleCustomReset"
          >
            Reset
          </button>
          <button
            type="button"
            @click="handleCustomSubmit"
          >
            Submit
          </button>
        </div>
      </div>

      <pre class="form-config-example__json">{{ JSON.stringify(customSubmitted, null, 2) }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormConfig from './FormConfig.vue'
import FormConfigField from './FormConfigField.vue'
import { useFormConfig } from './useFormConfig'
import type { FormConfig as FormConfigType, FormConfigData } from './FormConfig.model'

// ---------------------------------------------------------------------------
// Example 1: Contact form
// ---------------------------------------------------------------------------
const contactConfig: FormConfigType = {
  columns: 2,
  validateOnBlur: true,
  fields: [
    { key: 'firstName', type: 'text', label: 'First name', required: true, cols: 1 },
    { key: 'lastName', type: 'text', label: 'Last name', required: true, cols: 1 },
    {
      key: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validation: [{ type: 'email', message: 'Enter a valid email' }],
    },
    {
      key: 'subject',
      type: 'select',
      label: 'Subject',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Bug report', value: 'bug' },
        { label: 'Feature request', value: 'feature' },
      ],
    },
    {
      key: 'message',
      type: 'textarea',
      label: 'Message',
      cols: 2,
      validation: [
        { type: 'minLength', value: 20, message: 'Message must be at least 20 characters' },
      ],
    },
    { key: 'subscribe', type: 'toggle', label: 'Subscribe to newsletter', defaultValue: false, cols: 2 },
  ],
}

const contactValues = ref<FormConfigData>({})

function handleContactSubmit(values: FormConfigData) {
  contactValues.value = { ...values, _submitted: true }
}

// ---------------------------------------------------------------------------
// Example 2: Multi-step registration
// ---------------------------------------------------------------------------
const registrationConfig: FormConfigType = {
  steps: [
    {
      id: 'account',
      title: 'Account',
      description: 'Create your login credentials',
      fields: [
        {
          key: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          validation: [{ type: 'email', message: 'Enter a valid email' }],
        },
        {
          key: 'password',
          type: 'password',
          label: 'Password',
          required: true,
          validation: [{ type: 'minLength', value: 8, message: 'At least 8 characters required' }],
        },
        {
          key: 'accountType',
          type: 'switch',
          label: 'Account type',
          defaultValue: 'personal',
          options: [
            { label: 'Personal', value: 'personal' },
            { label: 'Team', value: 'team' },
          ],
        },
      ],
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Tell us about yourself',
      fields: [
        { key: 'name', type: 'text', label: 'Full name', required: true },
        { key: 'role', type: 'text', label: 'Your role', placeholder: 'e.g. Designer, Developer' },
        {
          key: 'teamName',
          type: 'text',
          label: 'Team name',
          required: true,
          condition: { field: 'accountType', operator: 'eq', value: 'team' },
        },
        {
          key: 'teamSize',
          type: 'select',
          label: 'Team size',
          options: [
            { label: '2–5', value: 'small' },
            { label: '6–20', value: 'medium' },
            { label: '21+', value: 'large' },
          ],
          condition: { field: 'accountType', operator: 'eq', value: 'team' },
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      fields: [
        { key: 'notifications', type: 'toggle', label: 'Email notifications', defaultValue: true },
        {
          key: 'theme',
          type: 'radio',
          label: 'Theme preference',
          defaultValue: 'system',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
          ],
        },
      ],
    },
  ],
}

const registrationValues = ref<FormConfigData>({})
const registrationStep = ref(0)

function handleRegistrationSubmit(values: FormConfigData) {
  registrationValues.value = { ...values, _submitted: true }
}

// ---------------------------------------------------------------------------
// Example 3: Programmatic control
// ---------------------------------------------------------------------------
const customConfig: FormConfigType = {
  validateOnBlur: true,
  fields: [
    {
      key: 'username',
      type: 'text',
      label: 'Username',
      required: true,
      validation: [{ type: 'minLength', value: 3, message: 'At least 3 characters' }],
    },
    {
      key: 'age',
      type: 'number',
      label: 'Age',
      validation: [
        { type: 'min', value: 18, message: 'Must be at least 18' },
        { type: 'max', value: 120, message: 'Must be at most 120' },
      ],
    },
    {
      key: 'agree',
      type: 'checkbox',
      label: 'I agree to the terms',
      defaultValue: false,
      required: true,
    },
  ],
}

const customForm = useFormConfig(customConfig)
const customSubmitted = ref<FormConfigData | null>(null)

function handleCustomSubmit() {
  if (customForm.validateAll()) {
    customSubmitted.value = { ...customForm.values.value }
  }
}

function handleCustomReset() {
  customForm.reset()
  customSubmitted.value = null
}
</script>

<style lang="scss">
.form-config-example {
  display: flex;
  flex-direction: column;
  gap: calc(var(--space) * 3);
  padding: var(--space);

  &__section {
    display: flex;
    flex-direction: column;
    gap: var(--space);
    padding: var(--space);
    border: var(--border-width, 1px) solid var(--color-border, currentColor);
    border-radius: var(--border-radius);
    opacity: 0.2;
  }

  &__heading {
    margin: 0;
    font-size: var(--font-size-l);
  }

  &__description {
    margin: 0;
    font-size: var(--font-size-s);
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }

  &__json {
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 5%);
    padding: var(--space-s);
    border-radius: var(--border-radius);
    font-size: var(--font-size-xs);
    overflow: auto;
    max-height: 200px;
    margin: 0;
  }

  &__custom {
    display: flex;
    flex-direction: column;
    gap: var(--space);
  }

  &__custom-field {
    // individual field wrapper
  }

  &__custom-actions {
    display: flex;
    gap: var(--space-s);
    justify-content: flex-end;
  }
}
</style>
