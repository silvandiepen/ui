import { describe, expect, it } from 'vitest'

import { getSourceDocumentation } from './sourceDocumentation'

describe('source documentation', () => {
  it('extracts props from component model files and defaults from component source', () => {
    const docs = getSourceDocumentation({
      category: 'Foundations',
      docs: [],
      examplePath: '../../../src/components/ThemeToggle/ThemeToggle.example.vue',
      name: 'ThemeToggle',
      slug: 'theme-toggle',
      sourcePath: 'src/components/ThemeToggle',
      status: 'stable',
      statusTone: 'success',
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
      category: 'Feedback',
      docs: [],
      examplePath: null,
      name: 'Notification',
      slug: 'notification',
      sourcePath: 'src/components/Notification',
      status: 'stable',
      statusTone: 'success',
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

  it('extracts component slots from template source', () => {
    const docs = getSourceDocumentation({
      category: 'Data and Navigation',
      docs: ['../../../src/components/Sidebar/README.md'],
      examplePath: '../../../src/components/Sidebar/Sidebar.example.vue',
      name: 'Sidebar',
      slug: 'sidebar',
      sourcePath: 'src/components/Sidebar',
      status: 'stable',
      statusTone: 'success',
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
})
