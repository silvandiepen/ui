import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Icons } from 'open-icon'

import ThemeToggle from './ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('renders the moon icon for light mode', () => {
    const wrapper = shallowMount(ThemeToggle, {
      props: {
        theme: 'light',
      },
    })

    expect(wrapper.findComponent({ name: 'Icon' }).props('name')).toBe(Icons.WEATHER_MOON)
  })

  it('emits toggle when clicked', async () => {
    const wrapper = shallowMount(ThemeToggle)

    await wrapper.trigger('click')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })
})
