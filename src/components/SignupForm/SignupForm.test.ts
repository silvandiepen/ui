import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SignupForm from './SignupForm.vue'

describe('SignupForm', () => {
  it('blocks submit while passwords mismatch', async () => {
    const wrapper = mount(SignupForm, {
      props: {
        modelValue: {
          name: 'Ada',
          email: 'ada@example.com',
          password: 'secret-one',
          confirmPassword: 'secret-two',
          acceptTerms: true,
          marketingOptIn: false,
        },
      },
      global: {
        stubs: {
          Button: {
            props: ['disabled'],
            template: '<button :disabled="disabled"><slot /></button>',
          },
          Notification: true,
          InputCheckbox: true,
          Icon: true,
        },
      },
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('Passwords must match.')
  })

  it('emits submit when the state is valid', async () => {
    const wrapper = mount(SignupForm, {
      props: {
        modelValue: {
          name: 'Ada',
          email: 'ada@example.com',
          password: 'secret-pass',
          confirmPassword: 'secret-pass',
          acceptTerms: true,
          marketingOptIn: true,
        },
      },
      global: {
        stubs: {
          Button: {
            props: ['disabled'],
            template: '<button :disabled="disabled"><slot /></button>',
          },
          Notification: true,
          InputCheckbox: true,
          Icon: true,
        },
      },
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'secret-pass',
      confirmPassword: 'secret-pass',
      acceptTerms: true,
      marketingOptIn: true,
    })
  })
})
