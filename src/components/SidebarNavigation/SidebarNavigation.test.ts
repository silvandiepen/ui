import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'

import SidebarNavigation from './SidebarNavigation.vue'

describe('SidebarNavigation', () => {
  it('renders grouped items and badges', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/button',
          component: { template: '<div />' },
        },
      ],
    })

    await router.push('/button')
    await router.isReady()

    const wrapper = mount(SidebarNavigation, {
      global: {
        plugins: [router],
      },
      props: {
        sections: [
          {
            id: 'group',
            label: 'Foundations',
            items: [
              {
                id: 'button',
                label: 'Button',
                labelPrefix: 'UI',
                badge: 'stable',
                badgeTone: 'success',
                to: '/button',
              },
            ],
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('Foundations')
    expect(wrapper.text()).toContain('Button')
    expect(wrapper.get('.sidebar-navigation__item-label-prefix').text()).toBe('UI')
    expect(wrapper.text()).toContain('stable')
    expect(wrapper.find('.sidebar-navigation__item--active').exists()).toBe(true)
  })

  it('supports collapsible sections with default collapsed state', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/toast',
          component: { template: '<div />' },
        },
      ],
    })

    await router.push('/toast')
    await router.isReady()

    const wrapper = mount(SidebarNavigation, {
      global: {
        plugins: [router],
      },
      props: {
        sections: [
          {
            id: 'feedback',
            label: 'Feedback',
            defaultCollapsed: true,
            items: [
              {
                id: 'toast',
                label: 'Toast',
                to: '/toast',
              },
            ],
          },
        ],
      },
    })

    expect(wrapper.find('.sidebar-navigation__items').isVisible()).toBe(false)

    await wrapper.get('.sidebar-navigation__section-toggle').trigger('click')

    expect(wrapper.find('.sidebar-navigation__items').isVisible()).toBe(true)
    expect(wrapper.find('.sidebar-navigation__section-icon--expanded').exists()).toBe(true)
  })
})
