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
    expect(wrapper.text()).toContain('stable')
    expect(wrapper.find('.sidebar-navigation__item--active').exists()).toBe(true)
  })
})
