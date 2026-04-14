import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Kbd from './Kbd.vue'

describe('Kbd', () => {
  it('renders keyboard content inside a semantic kbd element', () => {
    const wrapper = mount(Kbd, {
      slots: {
        default: '⌘',
      },
    })

    expect(wrapper.element.tagName).toBe('KBD')
    expect(wrapper.text()).toBe('⌘')
    expect(wrapper.classes()).toContain('kbd')
  })

  it('supports size and variant modifiers', () => {
    const wrapper = mount(Kbd, {
      props: {
        size: 'small',
        variant: 'subtle',
      },
      slots: {
        default: 'K',
      },
    })

    expect(wrapper.classes()).toContain('kbd--small')
    expect(wrapper.classes()).toContain('kbd--subtle')
  })
})
