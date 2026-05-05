import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FloatingHeader from './FloatingHeader.vue'

describe('FloatingHeader', () => {
  it('exports the component module', async () => {
    const mod = await import('./FloatingHeader.vue')
    expect(mod.default).toBeDefined()
    expect(mod.default.name || mod.default.__name).toBeTruthy()
  })

  it('exports types from the model', async () => {
    const mod = await import('./FloatingHeader.model')
    expect(mod).toBeDefined()
  })

  it('applies an explicit color mode modifier', () => {
    const wrapper = mount(FloatingHeader, {
      props: {
        colorMode: 'inverse',
      },
    })

    expect(wrapper.classes()).toContain('floating-header--color-mode-inverse')
  })
})
