import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import InputSwitch from '../InputSwitch/InputSwitch.vue'
import InputSwitchOptions from './InputSwitchOptions.vue'

describe('InputSwitchOptions', () => {
  it('forwards options and label to InputSwitch', () => {
    const options = [
      { label: 'Planned', value: 'planned' },
      { label: 'Active', value: 'active' },
      { label: 'Blocked', value: 'blocked' },
    ]

    const wrapper = mount(InputSwitchOptions, {
      props: {
        label: 'Status',
        options,
        modelValue: 'active',
      },
    })

    const inputSwitch = wrapper.getComponent(InputSwitch)

    expect(inputSwitch.props('label')).toBe('Status')
    expect(inputSwitch.props('options')).toEqual(options)
    expect(inputSwitch.props('modelValue')).toBe('active')
  })

  it('re-emits child change and touched events', async () => {
    const wrapper = mount(InputSwitchOptions, {
      props: {
        options: [
          { label: 'Planned', value: 'planned' },
          { label: 'Active', value: 'active' },
          { label: 'Blocked', value: 'blocked' },
        ],
      },
    })

    const inputSwitch = wrapper.getComponent(InputSwitch)

    inputSwitch.vm.$emit('update:modelValue', 'blocked')
    inputSwitch.vm.$emit('change', 'blocked')
    inputSwitch.vm.$emit('touched', true)

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['blocked'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['blocked'])
    expect(wrapper.emitted('touched')?.[0]).toEqual([true])
  })
})
