import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TabBar from './TabBar.vue'

const TabNavigationStub = defineComponent({
  name: 'TabNavigation',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: null
    }
  },
  emits: ['input'],
  template: `
    <button
      class="tab-navigation-stub"
      :data-items="JSON.stringify(items)"
      :data-value="value"
      @click="$emit('input', items[1]?.id)"
    />
  `
})

describe('TabBar', () => {
  it('maps tabs onto the shared tab navigation surface and preserves badges', async () => {
    const wrapper = mount(TabBar, {
      props: {
        modelValue: 'overview',
        tabs: [
          {
            label: 'Overview',
            value: 'overview',
            icon: 'home'
          },
          {
            label: 'Activity',
            value: 'activity',
            badge: 3
          }
        ]
      },
      global: {
        stubs: {
          TabNavigation: TabNavigationStub
        }
      }
    })

    const items = JSON.parse(
      wrapper.get('.tab-navigation-stub').attributes('data-items') ?? '[]'
    )

    expect(items).toEqual([
      {
        id: 'overview',
        label: 'Overview',
        icon: 'home'
      },
      {
        id: 'activity',
        label: 'Activity',
        badge: 3
      }
    ])

    await wrapper.get('.tab-navigation-stub').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['activity']])
    expect(wrapper.emitted('change')).toEqual([['activity']])
  })

  it('applies the minimal variant class', () => {
    const wrapper = mount(TabBar, {
      props: {
        modelValue: 'overview',
        variant: 'minimal',
        tabs: [
          {
            label: 'Overview',
            value: 'overview'
          }
        ]
      },
      global: {
        stubs: {
          TabNavigation: TabNavigationStub
        }
      }
    })

    expect(wrapper.classes()).toContain('tab-bar--minimal')
  })
})
