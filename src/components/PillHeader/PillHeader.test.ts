import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PillHeader from './PillHeader.vue'

describe('PillHeader', () => {
  it('exports the component module', async () => {
    const mod = await import('./PillHeader.vue')
    expect(mod.default).toBeDefined()
    expect(mod.default.name || mod.default.__name).toBeTruthy()
  })

  it('exports types from the model', async () => {
    const mod = await import('./PillHeader.model')
    expect(mod).toBeDefined()
  })

  it('applies an explicit inverse color mode modifier', () => {
    const wrapper = mount(PillHeader, {
      props: {
        colorMode: 'inverse',
      },
    })

    expect(wrapper.classes()).toContain('pill-header--color-mode-inverse')
  })

  it('renders shared navigation items with icons and nested subnavigation', () => {
    const wrapper = mount(PillHeader, {
      props: {
        currentPath: '/projects/releases',
        navItems: [
          {
            id: 'projects',
            label: 'Projects',
            href: '/projects',
            icon: 'folder',
            items: [
              {
                id: 'overview',
                label: 'Overview',
                href: '/projects',
                icon: 'dashboard',
                exact: true,
              },
              {
                id: 'releases',
                label: 'Releases',
                href: '/projects/releases',
                icon: 'rocket',
              },
            ],
          },
        ],
      },
      global: {
        stubs: {
          Icon: {
            props: ['name'],
            template: '<span class="icon-stub" :data-name="name" />',
          },
          RouterLink: {
            props: ['to'],
            template: '<a :href="typeof to === `string` ? to : `#`"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.get('[data-test-id="link-projects"]').text()).toContain('Projects')
    expect(wrapper.get('[data-test-id="submenu-projects"]').text()).toContain('Releases')
    expect(wrapper.findAll('.icon-stub').map((icon) => icon.attributes('data-name'))).toEqual(
      expect.arrayContaining(['folder', 'dashboard', 'rocket']),
    )
    expect(wrapper.find('.pill-header__link--active').exists()).toBe(true)
    expect(wrapper.find('.pill-header__submenu-link--active').text()).toContain('Releases')
  })
})
