import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LezuLogo from './LezuLogo.vue'

describe('LezuLogo', () => {
  it('renders the logo svg', () => {
    const wrapper = mount(LezuLogo)

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.classes()).toContain('lezu-logo')
    expect(wrapper.classes()).toContain('lezu-logo--medium')
  })

  it('supports size and animation modifiers', () => {
    const wrapper = mount(LezuLogo, {
      props: {
        size: 'small',
        animated: true,
      },
    })

    expect(wrapper.classes()).toContain('lezu-logo--small')
    expect(wrapper.classes()).toContain('lezu-logo--animated')
  })
})
