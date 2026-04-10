import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Sidebar from './Sidebar.vue'

describe('Sidebar', () => {
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
})
