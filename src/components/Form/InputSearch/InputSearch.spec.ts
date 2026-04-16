import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import InputSearch from './InputSearch.vue'

describe('InputSearch', () => {
  it('emits search when the right icon button is clicked', async () => {
    const wrapper = mount(InputSearch, {
      props: {
        modelValue: 'query',
      },
      global: {
        stubs: {
          Icon: {
            template: '<span class="icon-stub" />',
          },
        },
      },
    })

    await wrapper.get('.input-search__action').trigger('click')

    expect(wrapper.emitted('search')?.[0]).toEqual(['query'])
  })

  it('calls custom searchAction on icon click instead of emitting search', async () => {
    const searchAction = vi.fn()
    const wrapper = mount(InputSearch, {
      props: {
        modelValue: 'query',
        rightIcon: true,
        searchAction,
      },
      global: {
        stubs: {
          Icon: {
            template: '<span class="icon-stub" />',
          },
        },
      },
    })

    await wrapper.get('.input-search__action').trigger('click')

    expect(searchAction).toHaveBeenCalledWith('query')
    expect(wrapper.emitted('search')).toBeFalsy()
  })

  it('renders an optional left icon', () => {
    const wrapper = mount(InputSearch, {
      props: {
        leftIcon: true,
      },
      global: {
        stubs: {
          Icon: {
            template: '<span class="icon-stub" />',
          },
        },
      },
    })

    expect(wrapper.find('.input-search__icon--left').exists()).toBe(true)
  })

  it('hides right action when leftIcon is enabled and rightIcon is not defined', () => {
    const wrapper = mount(InputSearch, {
      props: {
        leftIcon: true,
      },
      global: {
        stubs: {
          Icon: {
            template: '<span class="icon-stub" />',
          },
        },
      },
    })

    expect(wrapper.find('.input-search__icon--left').exists()).toBe(true)
    expect(wrapper.find('.input-search__action').exists()).toBe(false)
  })

  it('shows both icons when rightIcon is explicitly defined', () => {
    const wrapper = mount(InputSearch, {
      props: {
        leftIcon: true,
        rightIcon: 'arrow-right',
      },
      global: {
        stubs: {
          Icon: {
            template: '<span class="icon-stub" />',
          },
        },
      },
    })

    expect(wrapper.find('.input-search__icon--left').exists()).toBe(true)
    expect(wrapper.find('.input-search__action').exists()).toBe(true)
  })

  it('supports booleans and icon names for both icon props', () => {
    const wrapper = mount(InputSearch, {
      props: {
        leftIcon: 'search-m',
        rightIcon: true,
      },
      global: {
        stubs: {
          Icon: {
            template: '<span class="icon-stub" />',
          },
        },
      },
    })

    expect(wrapper.find('.input-search__icon--left').exists()).toBe(true)
    expect(wrapper.find('.input-search__action').exists()).toBe(true)
  })

  it('expands and focuses the field in icon-only mode on action click', async () => {
    const wrapper = mount(InputSearch, {
      props: {
        iconOnly: true,
      },
      attachTo: document.body,
      global: {
        stubs: {
          Icon: {
            template: '<span class="icon-stub" />',
          },
        },
      },
    })

    const action = wrapper.get('.input-search__action')

    expect(wrapper.find('.input-search__wrapper--collapsed').exists()).toBe(true)

    await action.trigger('click')

    expect(wrapper.find('.input-search__wrapper--collapsed').exists()).toBe(false)
    expect(wrapper.find('input').element).toBe(document.activeElement)
    expect(wrapper.emitted('search')).toBeFalsy()
  })

  it('forwards minlength and maxlength to the native input', () => {
    const wrapper = mount(InputSearch, {
      props: {
        minlength: 3,
        maxlength: 12,
      },
      global: {
        stubs: {
          Icon: {
            template: '<span class="icon-stub" />',
          },
        },
      },
    })

    const input = wrapper.get('input')
    expect(input.attributes('minlength')).toBe('3')
    expect(input.attributes('maxlength')).toBe('12')
  })
})
