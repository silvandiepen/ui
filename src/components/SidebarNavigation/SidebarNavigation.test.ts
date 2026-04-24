import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it, vi } from 'vitest'

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
        showSectionItemCount: true,
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

  it('runs item action from parent and skips default navigation', async () => {
    const action = vi.fn()

    const wrapper = mount(SidebarNavigation, {
      props: {
        linkMode: 'href',
        sections: [
          {
            id: 'workspace',
            label: 'Workspace',
            items: [
              {
                id: 'overview',
                label: 'Overview',
                href: '/dashboard',
                action,
              },
            ],
          },
        ],
      },
    })

    await wrapper.get('.sidebar-navigation__item').trigger('click')

    expect(action).toHaveBeenCalledTimes(1)
  })

  it('uses an explicitly passed router prop for navigation and active state', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/settings', component: { template: '<div />' } },
      ],
    })

    await router.push('/settings')
    await router.isReady()

    const wrapper = mount(SidebarNavigation, {
      props: {
        router,
        sections: [
          {
            id: 'account',
            label: 'Account',
            items: [
              {
                id: 'settings',
                label: 'Settings',
                to: '/settings',
              },
            ],
          },
        ],
      },
    })

    expect(wrapper.find('.sidebar-navigation__item--active').exists()).toBe(true)
  })

  it('hides section item count badge by default and shows it when showSectionItemCount is true', async () => {
    const sections = [
      {
        id: 'group',
        label: 'Group',
        items: [
          { id: 'a', label: 'A', href: '#a' },
          { id: 'b', label: 'B', href: '#b' },
        ],
      },
    ]

    const hidden = mount(SidebarNavigation, { props: { sections } })
    expect(hidden.find('.badge').exists()).toBe(false)

    const visible = mount(SidebarNavigation, { props: { sections, showSectionItemCount: true } })
    expect(visible.find('.badge').exists()).toBe(true)
    expect(visible.find('.badge').text()).toBe('2')
  })
})
