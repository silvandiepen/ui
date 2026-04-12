import { describe, expect, it } from 'vitest'

import { buildComponentCatalog, slugifyComponentName, slugifyComponentPath } from './componentCatalog'

describe('component catalog', () => {
  it('builds a sorted catalog with docs and examples grouped by component source path', () => {
    const catalog = buildComponentCatalog({
      docKeys: [
        '../../../src/components/Card/README.md',
        '../../../src/components/Form/README.md',
        '../../../src/components/Form/TForm/TForm.md',
        '../../../src/components/Form/TInput/README.md',
      ],
      exampleKeys: [
        '../../../src/components/Card/Card.example.vue',
        '../../../src/components/Form/TInput/TInput.example.vue',
      ],
      folderKeys: [
        '../../../src/components/Card/index.ts',
        '../../../src/components/Form/index.ts',
        '../../../src/components/Form/TInput/index.ts',
        '../../../src/components/Progress/index.ts',
      ],
      singleFileKeys: [],
    })

    expect(catalog.map((entry) => entry.name)).toEqual([
      'Card',
      'Form',
      'Progress',
      'TInput',
    ])
    expect(catalog.map((entry) => entry.apiName)).toEqual([
      'UICard',
      'UIForms',
      'UIProgress',
      'UIInput',
    ])
    expect(catalog.find((entry) => entry.name === 'Card')?.examplePath).toBe(
      '../../../src/components/Card/Card.example.vue',
    )
    expect(catalog.find((entry) => entry.name === 'Form')?.docs).toEqual([
      '../../../src/components/Form/README.md',
    ])
    expect(catalog.find((entry) => entry.name === 'TInput')).toEqual(
      expect.objectContaining({
        aliases: ['TInput'],
        apiName: 'UIInput',
        categoryId: 'forms',
        examplePath: '../../../src/components/Form/TInput/TInput.example.vue',
        slug: 'form-t-input',
        sourcePath: 'src/components/Form/TInput',
      }),
    )
  })

  it('slugifies component names consistently', () => {
    expect(slugifyComponentName('StatusBadge')).toBe('status-badge')
    expect(slugifyComponentName('Theme Toggle')).toBe('theme-toggle')
    expect(slugifyComponentPath('Form/TInput')).toBe('form-t-input')
  })

  it('keeps native T-prefixed component names intact when they are not compatibility T* wrappers', () => {
    const catalog = buildComponentCatalog({
      docKeys: [],
      exampleKeys: [],
      folderKeys: [
        '../../../src/components/Tabs/index.ts',
        '../../../src/components/Toast/index.ts',
        '../../../src/components/Toolbar/index.ts',
        '../../../src/components/Tooltip/index.ts',
      ],
      singleFileKeys: [],
    })

    expect(catalog.map((entry) => entry.apiName)).toEqual([
      'UITabs',
      'UIToast',
      'UIToolbar',
      'UITooltip',
    ])
  })
})
