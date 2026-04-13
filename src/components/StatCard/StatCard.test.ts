import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import StatCard from './StatCard.vue'

describe('StatCard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders a value with supporting text', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 23,
        label: 'cataloged surfaces',
        description: 'in this category',
        locale: 'en-US'
      }
    })

    expect(wrapper.text()).toContain('23')
    expect(wrapper.text()).toContain('cataloged surfaces')
    expect(wrapper.text()).toContain('in this category')
  })

  it('shows an icon and color treatment when configured', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 1284,
        color: 'success',
        icon: 'check'
      },
      global: {
        stubs: {
          Icon: {
            template: '<span class="icon-stub" />'
          }
        }
      }
    })

    expect(wrapper.classes()).toContain('stat-card--has-color')
    expect(wrapper.classes()).toContain('stat-card--has-icon')
    expect(wrapper.find('.icon-stub').exists()).toBe(true)
  })

  it('counts up to the provided numeric value', async () => {
    let frame = 0

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frame += 1
      callback(frame === 1 ? 0 : 1600)
      return frame
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    const wrapper = mount(StatCard, {
      props: {
        value: 2400,
        countUp: true,
        locale: 'en-US'
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('2,400')
  })
})
