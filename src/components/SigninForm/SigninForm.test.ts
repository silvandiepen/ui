import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SigninForm from './SigninForm.vue'

describe('SigninForm', () => {
  it('emits submit with the current auth payload', async () => {
    const wrapper = mount(SigninForm, {
      props: {
        modelValue: {
          email: 'user@example.com',
          password: 'secret',
          rememberMe: true,
        },
      },
      global: {
        stubs: {
          Button: {
            template: '<button><slot /></button>',
          },
          Notification: true,
          InputCheckbox: {
            props: ['modelValue', 'label'],
            emits: ['update:modelValue'],
            template: '<label><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />{{ label }}</label>',
          },
          Icon: true,
        },
      },
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      email: 'user@example.com',
      password: 'secret',
      rememberMe: true,
    })
  })

  it('renders provider actions when configured', () => {
    const wrapper = mount(SigninForm, {
      props: {
        providers: [
          { id: 'google', label: 'Continue with Google' },
          { id: 'github', label: 'Continue with GitHub' },
        ],
      },
      global: {
        stubs: {
          Button: {
            props: ['icon', 'href'],
            template: '<button><slot /></button>',
          },
          Notification: true,
          InputCheckbox: true,
          Icon: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Continue with Google')
    expect(wrapper.text()).toContain('Continue with GitHub')
    expect(wrapper.text()).toContain('or')
  })
})
