import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import InputCascader from './InputCascader.vue'

describe('InputCascader', () => {
  const options = [
    {
      label: 'Europe',
      value: 'europe',
      children: [
        {
          label: 'Malta',
          value: 'malta',
          children: [
            { label: 'Valletta', value: 'valletta' },
          ],
        },
      ],
    },
  ]

  it('renders the configured label', () => {
    const wrapper = mount(InputCascader, {
      props: {
        label: 'Destination',
        options,
      },
    })

    expect(wrapper.text()).toContain('Destination')
  })

  it('opens the panel and renders root options', async () => {
    const wrapper = mount(InputCascader, {
      props: {
        options,
      },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.find('.input-cascader__panel').exists()).toBe(true)
    expect(wrapper.text()).toContain('Europe')
  })
})
