import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Resizable from './Resizable.vue'

function createRect(width: number, height: number) {
  return {
    width,
    height,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }
}

describe('Resizable', () => {
  it('resizes with keyboard input and emits the next size', async () => {
    const wrapper = mount(Resizable, {
      props: {
        defaultSize: 240,
        minSize: 180,
        minSecondarySize: 200,
      },
      slots: {
        start: '<div>Sidebar</div>',
        end: '<div>Main</div>',
      },
    })

    Object.defineProperty(wrapper.element, 'getBoundingClientRect', {
      value: () => createRect(900, 600),
    })

    await wrapper.get('.resizable__handle').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[256]])
    expect(wrapper.emitted('resize')?.[0]?.[0]).toMatchObject({
      size: 256,
      source: 'keyboard',
    })
    expect(wrapper.attributes('style')).toContain('--resizable-primary-size: 256px;')
  })

  it('clamps keyboard resizing to the configured minimum', async () => {
    const wrapper = mount(Resizable, {
      props: {
        defaultSize: 190,
        minSize: 180,
      },
      slots: {
        start: '<div>Sidebar</div>',
        end: '<div>Main</div>',
      },
    })

    Object.defineProperty(wrapper.element, 'getBoundingClientRect', {
      value: () => createRect(900, 600),
    })

    await wrapper.get('.resizable__handle').trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[180]])
  })

  it('supports controlled sizes and disabled state', async () => {
    const wrapper = mount(Resizable, {
      props: {
        disabled: true,
        modelValue: 320,
      },
      slots: {
        start: '<div>Sidebar</div>',
        end: '<div>Main</div>',
      },
    })

    Object.defineProperty(wrapper.element, 'getBoundingClientRect', {
      value: () => createRect(900, 600),
    })

    await wrapper.get('.resizable__handle').trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.classes()).toContain('resizable--disabled')
    expect(wrapper.attributes('style')).toContain('--resizable-primary-size: 320px;')
  })
})
