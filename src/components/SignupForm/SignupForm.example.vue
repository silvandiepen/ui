<template>
  <div class="signup-form-example">
    <SignupForm
      v-model="signup"
      title="Create a Workspace account"
      description="Set up a secure account, agree to the basics, and invite the rest of your team later."
      legal-note="By continuing you agree to fair use, privacy, and secure account handling."
      alternate-href="#signin"
      :providers="providers"
      @submit="handleSubmit"
    >
      <template #brand>
        <strong>Workspace</strong>
      </template>
    </SignupForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { SignupForm } from './index'
import type { SignupFormValue, SignupProviderAction } from './SignupForm.model'

const signup = ref<SignupFormValue>({
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  password: '',
  confirmPassword: '',
  acceptTerms: true,
  marketingOptIn: false,
})

const providers: SignupProviderAction[] = [
  { id: 'google', label: 'Continue with Google', icon: 'search' },
  { id: 'microsoft', label: 'Continue with Microsoft', icon: 'grid' },
]

function handleSubmit(value: SignupFormValue) {
  console.info('submit signup', value)
}
</script>

<style scoped lang="scss">
.signup-form-example {
  display: grid;
  place-items: start;
}
</style>
