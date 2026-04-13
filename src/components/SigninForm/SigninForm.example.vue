<template>
  <div class="signin-form-example">
    <SigninForm
      v-model="signin"
      title="Sign in to Workspace"
      description="Jump back into your projects, comments, and pending review flows."
      forgot-password-href="#reset-password"
      alternate-href="#signup"
      :providers="providers"
      @submit="handleSubmit"
    >
      <template #brand>
        <strong>Workspace</strong>
      </template>
    </SigninForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { SigninForm } from './index'
import type { AuthProviderAction, SigninFormValue } from './SigninForm.model'

const signin = ref<SigninFormValue>({
  email: 'hello@example.com',
  password: '',
  rememberMe: true,
})

const providers: AuthProviderAction[] = [
  { id: 'google', label: 'Continue with Google', icon: 'search' },
  { id: 'github', label: 'Continue with GitHub', icon: 'settings' },
]

function handleSubmit(value: SigninFormValue) {
  console.info('submit signin', value)
}
</script>

<style scoped lang="scss">
.signin-form-example {
  display: grid;
  place-items: start;
}
</style>
