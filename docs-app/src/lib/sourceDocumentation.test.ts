import { describe, expect, it } from 'vitest'
import { Status } from '../../../src/types'

import { getSourceDocumentation } from './sourceDocumentation'

describe('source documentation', () => {
  it('extracts props from component model files and defaults from component source', () => {
    const docs = getSourceDocumentation({
      aliases: ['ThemeToggle'],
      apiName: 'UIThemeToggle',
      category: 'Foundations',
      categoryId: 'foundations',
      docs: [],
      examplePath: '../../../src/components/ThemeToggle/ThemeToggle.example.vue',
      name: 'ThemeToggle',
      slug: 'theme-toggle',
      sourcePath: 'src/components/ThemeToggle',
      status: 'stable',
      statusTone: Status.SUCCESS,
      summary: 'Theme toggle',
    })

    expect(docs.props).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          defaultValue: "'light'",
          name: 'theme',
          required: false,
          type: "'light' | 'dark' | 'system'",
        }),
      ]),
    )
    expect(docs.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'toggle',
          payload: 'none',
        }),
      ]),
    )
  })

  it('extracts inline props and emits from component source', () => {
    const docs = getSourceDocumentation({
      aliases: ['Notification'],
      apiName: 'UINotification',
      category: 'Feedback',
      categoryId: 'feedback',
      docs: [],
      examplePath: null,
      name: 'Notification',
      slug: 'notification',
      sourcePath: 'src/components/Notification',
      status: 'stable',
      statusTone: Status.SUCCESS,
      summary: 'Notification',
    })

    expect(docs.props).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'message',
          required: true,
        }),
        expect.objectContaining({
          defaultValue: "'Dismiss'",
          name: 'dismissLabel',
          required: false,
        }),
      ]),
    )
    expect(docs.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'dismiss',
        }),
      ]),
    )
  })

  it('extracts model props and emits from nested component paths', () => {
    const docs = getSourceDocumentation({
      aliases: ['Input'],
      apiName: 'UIInput',
      category: 'Forms',
      categoryId: 'forms',
      docs: [],
      examplePath: null,
      name: 'Input',
      slug: 'form-t-input',
      sourcePath: 'src/components/Form/Input',
      status: 'stable',
      statusTone: Status.SUCCESS,
      summary: 'Input',
    })

    expect(docs.props).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          defaultValue: "'text'",
          name: 'type',
          required: false,
        }),
        expect.objectContaining({
          defaultValue: 'true',
          name: 'showSpinners',
          required: false,
        }),
      ]),
    )
    expect(docs.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'update:modelValue',
          payload: 'value: string | number',
        }),
        expect.objectContaining({
          name: 'enter',
          payload: 'event: KeyboardEvent',
        }),
      ]),
    )
  })

  it('extracts component slots from template source', () => {
    const docs = getSourceDocumentation({
      aliases: ['Sidebar'],
      apiName: 'UISidebar',
      category: 'Data and Navigation',
      categoryId: 'data-and-navigation',
      docs: ['../../../src/components/Sidebar/README.md'],
      examplePath: '../../../src/components/Sidebar/Sidebar.example.vue',
      name: 'Sidebar',
      slug: 'sidebar',
      sourcePath: 'src/components/Sidebar',
      status: 'stable',
      statusTone: Status.SUCCESS,
      summary: 'Sidebar',
    })

    expect(docs.slots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'default' }),
        expect.objectContaining({ name: 'header' }),
        expect.objectContaining({ name: 'footer' }),
      ]),
    )
  })

  it('resolves source files when the folder exports a differently named component file', () => {
    const docs = getSourceDocumentation({
      aliases: ['DropdownMenu'],
      apiName: 'UIDropdownMenu',
      category: 'Data and Navigation',
      categoryId: 'data-and-navigation',
      docs: [],
      examplePath: null,
      name: 'DropdownMenu',
      slug: 'dropdown-menu',
      sourcePath: 'src/components/Dropdown',
      status: 'stable',
      statusTone: Status.SUCCESS,
      summary: 'Dropdown menu',
    })

    expect(docs.sourcePath).toBe('../../../src/components/Dropdown/DropdownMenu.vue')
    expect(docs.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'select' }),
        expect.objectContaining({ name: 'close' }),
      ]),
    )
    expect(docs.slots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'trigger' }),
        expect.objectContaining({ name: 'menu' }),
      ]),
    )
  })

  it('extracts supporting types from model files', () => {
    const docs = getSourceDocumentation({
      aliases: ['Steps'],
      apiName: 'UISteps',
      category: 'Data and Navigation',
      categoryId: 'data-and-navigation',
      docs: [],
      examplePath: '../../../src/components/Steps/Steps.example.vue',
      name: 'Steps',
      slug: 'steps',
      sourcePath: 'src/components/Steps',
      status: 'stable',
      statusTone: Status.SUCCESS,
      summary: 'Steps',
    })

    const typeNames = docs.types.map(t => t.name)
    expect(typeNames).toContain('StepItem')
    expect(typeNames).toContain('StepStatus')
    expect(typeNames).toContain('StepsDirection')

    const stepItem = docs.types.find(t => t.name === 'StepItem')
    expect(stepItem?.kind).toBe('interface')
    expect(stepItem?.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'title', required: true, type: 'string' }),
        expect.objectContaining({ name: 'description', required: false }),
      ]),
    )

    const stepStatus = docs.types.find(t => t.name === 'StepStatus')
    expect(stepStatus?.kind).toBe('type-alias')
  })

  it('extracts const enum types from model files', () => {
    const docs = getSourceDocumentation({
      aliases: ['Button'],
      apiName: 'UIButton',
      category: 'Foundations',
      categoryId: 'foundations',
      docs: [],
      examplePath: '../../../src/components/Button/Button.example.vue',
      name: 'Button',
      slug: 'button',
      sourcePath: 'src/components/Button',
      status: 'stable',
      statusTone: Status.SUCCESS,
      summary: 'Button',
    })

    const typeNames = docs.types.map(t => t.name)
    expect(typeNames).toContain('ButtonSize')
    expect(typeNames).toContain('ButtonVariant')
    expect(typeNames).toContain('ButtonType')

    const buttonSize = docs.types.find(t => t.name === 'ButtonSize')
    expect(buttonSize?.kind).toBe('const-enum')
    expect(buttonSize?.values).toEqual(
      expect.arrayContaining(['xsmall', 'small', 'medium', 'large', 'xlarge']),
    )

    const buttonVariant = docs.types.find(t => t.name === 'ButtonVariant')
    expect(buttonVariant?.values).toEqual(
      expect.arrayContaining(['default', 'primary', 'secondary', 'outline', 'ghost', 'danger']),
    )
  })

  it('excludes Props and Emits interfaces from types', () => {
    const docs = getSourceDocumentation({
      aliases: ['Button'],
      apiName: 'UIButton',
      category: 'Foundations',
      categoryId: 'foundations',
      docs: [],
      examplePath: '../../../src/components/Button/Button.example.vue',
      name: 'Button',
      slug: 'button',
      sourcePath: 'src/components/Button',
      status: 'stable',
      statusTone: Status.SUCCESS,
      summary: 'Button',
    })

    const typeNames = docs.types.map(t => t.name)
    expect(typeNames).not.toContain('ButtonProps')
    expect(typeNames).not.toContain('ButtonEmits')
  })
})
