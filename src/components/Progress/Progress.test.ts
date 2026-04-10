import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Progress from './Progress.vue'

describe('Progress', () => {
  it('renders the computed percentage', () => {
    const wrapper = mount(Progress, {
      props: {
        value: 25,
        max: 50,
      },
    })

    expect(wrapper.text()).toContain('50%')
  })
})
