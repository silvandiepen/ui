import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LezuHeaderUser from './LezuHeaderUser.vue'

describe('LezuHeaderUser', () => {
  it('renders initials, name, and email', () => {
    const wrapper = mount(LezuHeaderUser, {
      props: {
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
    })

    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.text()).toContain('jane@example.com')
    expect(wrapper.text()).toContain('JD')
  })

  it('renders as a link when href is provided', () => {
    const wrapper = mount(LezuHeaderUser, {
      props: {
        name: 'Jane Doe',
        href: '/projects',
      },
    })

    expect(wrapper.find('a').attributes('href')).toBe('/projects')
  })
})
