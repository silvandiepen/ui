import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import Sidebar from './Sidebar.vue'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches,
      media: '(max-width: 960px)',
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
    writable: true,
  })
}

describe('Sidebar', () => {
  beforeEach(() => {
    mockMatchMedia(false)
  })

  it('renders title and subtitle props', () => {
    const wrapper = mount(Sidebar, {
      props: {
        title: 'Docs',
        subtitle: 'Shared navigation',
      },
      slots: {
        default: '<div>Body</div>',
      },
    })

    expect(wrapper.text()).toContain('Docs')
    expect(wrapper.text()).toContain('Shared navigation')
    expect(wrapper.text()).toContain('Body')
  })

  it('supports disabling sticky behavior', () => {
    const wrapper = mount(Sidebar, {
      props: {
        sticky: false,
      },
    })

    expect(wrapper.classes()).not.toContain('sidebar--sticky')
  })

  it('renders a mobile trigger and toggles the panel when in mobile viewport', async () => {
    mockMatchMedia(true)

    const wrapper = mount(Sidebar, {
      props: {
        mobileCloseLabel: 'Hide filters',
        mobileOpenLabel: 'Show filters',
      },
      slots: {
        default: '<div>Filters</div>',
      },
    })

    await wrapper.vm.$nextTick()

    const trigger = wrapper.get('.sidebar__mobile-trigger')

    expect(trigger.text()).toBe('→')
    expect(trigger.attributes('aria-label')).toBe('Show filters')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.classes()).toContain('sidebar--mobile')
    expect(wrapper.classes()).not.toContain('sidebar--mobile-open')

    await trigger.trigger('click')

    expect(trigger.text()).toBe('←')
    expect(trigger.attributes('aria-label')).toBe('Hide filters')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.classes()).toContain('sidebar--mobile-open')
  })

  it('closes the mobile sidebar when route changes', async () => {
    mockMatchMedia(true)

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/next', component: { template: '<div />' } },
      ],
    })

    await router.push('/')
    await router.isReady()

    const wrapper = mount(Sidebar, {
      props: {
        mobileCloseLabel: 'Hide filters',
        mobileOpenLabel: 'Show filters',
      },
      slots: {
        default: '<div>Filters</div>',
      },
      global: {
        plugins: [router],
      },
    })

    await wrapper.vm.$nextTick()

    const trigger = wrapper.get('.sidebar__mobile-trigger')
    await trigger.trigger('click')
    expect(wrapper.classes()).toContain('sidebar--mobile-open')
    expect(trigger.attributes('aria-expanded')).toBe('true')

    await router.push('/next')
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).not.toContain('sidebar--mobile-open')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('keeps sidebar always visible when mobile mode is disabled', () => {
    mockMatchMedia(true)

    const wrapper = mount(Sidebar, {
      props: {
        mobileEnabled: false,
      },
      slots: {
        default: '<div>Body</div>',
      },
    })

    expect(wrapper.find('.sidebar__mobile-trigger').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('sidebar--mobile')
  })
})
