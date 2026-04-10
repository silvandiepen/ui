import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LezuHeader from './LezuHeader.vue'

describe('LezuHeader', () => {
  it('renders brand text and nav items', () => {
    const wrapper = mount(LezuHeader, {
      props: {
        brandHref: '/',
        brandSuffix: 'Documentation',
        currentPath: '/docs',
        navItems: [
          { label: 'Docs', href: '/docs' },
          { label: 'API', href: '/api' },
        ],
      },
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Documentation')
    expect(wrapper.text()).toContain('Docs')
    expect(wrapper.find('.lezu-header__nav-link--active').text()).toContain('Docs')
  })

  it('supports utility and action slots', () => {
    const wrapper = mount(LezuHeader, {
      slots: {
        utilities: '<div class="utility-slot">utility</div>',
        actions: '<div class="action-slot">action</div>',
      },
    })

    expect(wrapper.find('.utility-slot').exists()).toBe(true)
    expect(wrapper.find('.action-slot').exists()).toBe(true)
  })
})
