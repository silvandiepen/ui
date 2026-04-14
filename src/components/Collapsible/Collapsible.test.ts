import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'

import Collapsible from './Collapsible.vue'

describe('Collapsible', () => {
  it('toggles open state and emits lifecycle events from the header click', async () => {
    const wrapper = mount(Collapsible, {
      props: {
        label: 'Filters',
      },
      slots: {
        default: '<p>Body content</p>',
      },
    })

    expect(wrapper.find('.collapsible__content').isVisible()).toBe(false)

    await wrapper.get('.collapsible__header').trigger('click')

    expect(wrapper.find('.collapsible__content').isVisible()).toBe(true)
    expect(wrapper.emitted('header-click')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('toggle')?.[0]?.[0]).toMatchObject({ isOpen: true })
    expect(wrapper.emitted('open')?.[0]?.[0]).toMatchObject({ isOpen: true })
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('supports controlled usage through modelValue', async () => {
    const wrapper = mount(Collapsible, {
      props: {
        label: 'Filters',
        modelValue: false,
      },
      slots: {
        default: '<p>Body content</p>',
      },
    })

    await wrapper.get('.collapsible__header').trigger('click')

    expect(wrapper.find('.collapsible__content').isVisible()).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.classes()).not.toContain('collapsible--open')
  })

  it('passes toggle helpers into the default slot', async () => {
    const wrapper = mount(Collapsible, {
      props: {
        label: 'Filters',
        defaultOpen: true,
      },
      slots: {
        default: ({ close, isOpen }) => [
          h('button', {
            class: 'close-content',
            onClick: () => close(),
          }, 'Close'),
          h('span', { class: 'slot-state' }, isOpen ? 'open' : 'closed'),
        ],
      },
    })

    expect(wrapper.get('.slot-state').text()).toBe('open')

    await wrapper.get('.close-content').trigger('click')

    expect(wrapper.find('.collapsible__content').isVisible()).toBe(false)
    expect(wrapper.emitted('close')?.[0]?.[0]).toMatchObject({ isOpen: false })
  })

  it('renders the configured indicator variant and prevents toggling when disabled', async () => {
    const wrapper = mount(Collapsible, {
      props: {
        disabled: true,
        label: 'Filters',
        toggleIcon: 'plus',
      },
    })

    expect(wrapper.get('.collapsible__indicator').attributes('data-toggle-icon')).toBe('plus')

    await wrapper.get('.collapsible__header').trigger('click')

    expect(wrapper.emitted('toggle')).toBeUndefined()
    expect(wrapper.classes()).toContain('collapsible--disabled')
  })
})
