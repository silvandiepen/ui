import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Steps from './Steps.vue'
import type { StepItem } from './Steps.model'

const sampleSteps: StepItem[] = [
  { title: 'Account' },
  { title: 'Profile', description: 'Your info' },
  { title: 'Confirm' },
]

describe('Steps.vue', () => {
  it('renders correct number of steps', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps },
    })

    expect(wrapper.findAll('.steps__step')).toHaveLength(3)
  })

  it('shows step titles', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps },
    })

    const titles = wrapper.findAll('.steps__title')
    expect(titles[0].text()).toBe('Account')
    expect(titles[1].text()).toBe('Profile')
    expect(titles[2].text()).toBe('Confirm')
  })

  it('shows descriptions when provided', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps },
    })

    const descriptions = wrapper.findAll('.steps__description')
    expect(descriptions).toHaveLength(1)
    expect(descriptions[0].text()).toBe('Your info')
  })

  it('marks steps before currentStep as completed', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps, currentStep: 2 },
    })

    const steps = wrapper.findAll('.steps__step')
    expect(steps[0].classes()).toContain('steps__step--completed')
    expect(steps[1].classes()).toContain('steps__step--completed')
  })

  it('marks current step as active', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps, currentStep: 1 },
    })

    const steps = wrapper.findAll('.steps__step')
    expect(steps[1].classes()).toContain('steps__step--active')
  })

  it('marks steps after currentStep as pending', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps, currentStep: 0 },
    })

    const steps = wrapper.findAll('.steps__step')
    expect(steps[1].classes()).toContain('steps__step--pending')
    expect(steps[2].classes()).toContain('steps__step--pending')
  })

  it('respects per-step status override', () => {
    const steps: StepItem[] = [
      { title: 'A' },
      { title: 'B', status: 'error' },
      { title: 'C' },
    ]

    const wrapper = mount(Steps, {
      props: { steps },
    })

    const stepEls = wrapper.findAll('.steps__step')
    expect(stepEls[1].classes()).toContain('steps__step--error')
  })

  it('defaults to horizontal direction', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps },
    })

    expect(wrapper.find('.steps').attributes('data-direction')).toBe('horizontal')
  })

  it('renders vertical direction when specified', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps, direction: 'vertical' },
    })

    expect(wrapper.find('.steps').attributes('data-direction')).toBe('vertical')
  })

  it('renders connectors between steps', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps },
    })

    expect(wrapper.findAll('.steps__connector')).toHaveLength(2)
  })

  it('shows step numbers by default', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps },
    })

    const numbers = wrapper.findAll('.steps__number')
    expect(numbers).toHaveLength(3)
  })

  it('shows completed checkmark for completed steps', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps, currentStep: 2 },
    })

    const checks = wrapper.findAll('.steps__check')
    expect(checks.length).toBeGreaterThanOrEqual(1)
  })

  it('applies global color as CSS variable', () => {
    const wrapper = mount(Steps, {
      props: { steps: sampleSteps, color: 'success' },
    })

    const firstStep = wrapper.find('.steps__step')
    expect(firstStep.attributes('style')).toContain('--steps-color')
  })

  it('applies per-step color override', () => {
    const steps: StepItem[] = [
      { title: 'A', color: 'error' },
      { title: 'B' },
    ]

    const wrapper = mount(Steps, {
      props: { steps },
    })

    const stepEls = wrapper.findAll('.steps__step')
    expect(stepEls[0].attributes('style')).toContain('--color-error')
  })

  it('renders with empty steps array', () => {
    const wrapper = mount(Steps, {
      props: { steps: [] },
    })

    expect(wrapper.find('.steps').exists()).toBe(true)
    expect(wrapper.findAll('.steps__step')).toHaveLength(0)
  })
})
