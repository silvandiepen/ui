import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Container from './Container.vue'

describe('Container', () => {
  it('renders title, subtitle, and header slot content', () => {
    const wrapper = shallowMount(Container, {
      props: {
        title: 'Projects',
        subtitle: 'Manage all translation projects',
      },
      slots: {
        header: '<div data-testid="header-slot">Filters</div>',
        default: '<div>Body</div>',
      },
      global: {
        stubs: {
          Actions: true,
          Button: true,
        },
      },
    })

    expect(wrapper.find('.container__title').text()).toBe('Projects')
    expect(wrapper.find('.container__subtitle').text()).toBe('Manage all translation projects')
    expect(wrapper.find('[data-testid="header-slot"]').text()).toBe('Filters')
  })

  it('passes small-sized header actions to the shared actions component', () => {
    const wrapper = shallowMount(Container, {
      props: {
        title: 'Projects',
        headerActions: [
          {
            label: 'Create Project',
            action: () => undefined,
          },
        ],
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    const actions = wrapper.findComponent({ name: 'Actions' })

    expect(actions.exists()).toBe(true)
    expect(actions.props('size')).toBe('small')
    expect(actions.props('align')).toBe('end')
  })
})
