import { describe, expect, it } from 'vitest'

import { buildComponentCatalog, slugifyComponentName, slugifyComponentPath } from './componentCatalog'

describe('component catalog', () => {
  it('builds a sorted catalog with docs and examples grouped by component source path', () => {
    const catalog = buildComponentCatalog({
      docKeys: [
        '../../../src/components/Card/README.md',
        '../../../src/components/Form/README.md',
        '../../../src/components/Form/Form/Form.md',
        '../../../src/components/Form/Input/README.md',
      ],
      exampleKeys: [
        '../../../src/components/Card/Card.example.vue',
        '../../../src/components/Form/Input/Input.example.vue',
      ],
      folderKeys: [
        '../../../src/components/Card/index.ts',
        '../../../src/components/Form/index.ts',
        '../../../src/components/Form/Input/index.ts',
        '../../../src/components/Progress/index.ts',
      ],
      singleFileKeys: [],
    })

    expect(catalog.map((entry) => entry.name)).toEqual([
      'Card',
      'Form',
      'Input',
      'Progress',
    ])
    expect(catalog.map((entry) => entry.apiName)).toEqual([
      'UICard',
      'UIForms',
      'UIInput',
      'UIProgress',
    ])
    expect(catalog.find((entry) => entry.name === 'Card')?.examplePath).toBe(
      '../../../src/components/Card/Card.example.vue',
    )
    expect(catalog.find((entry) => entry.name === 'Form')?.docs).toEqual([
      '../../../src/components/Form/README.md',
    ])
    expect(catalog.find((entry) => entry.name === 'Input')).toEqual(
      expect.objectContaining({
        aliases: ['Input'],
        apiName: 'UIInput',
        categoryId: 'forms',
        examplePath: '../../../src/components/Form/Input/Input.example.vue',
        slug: 'form-input',
        sourcePath: 'src/components/Form/Input',
      }),
    )
  })

  it('slugifies component names consistently', () => {
    expect(slugifyComponentName('StatusBadge')).toBe('status-badge')
    expect(slugifyComponentName('Theme Toggle')).toBe('theme-toggle')
    expect(slugifyComponentPath('Form/Input')).toBe('form-input')
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

  it('includes manual aliases for auth surface compatibility names', () => {
    const catalog = buildComponentCatalog({
      docKeys: [
        '../../../src/components/SigninForm/README.md',
        '../../../src/components/SignupForm/README.md',
      ],
      exampleKeys: [],
      folderKeys: [
        '../../../src/components/SigninForm/index.ts',
        '../../../src/components/SignupForm/index.ts',
      ],
      singleFileKeys: [],
    })

    expect(catalog.find((entry) => entry.name === 'SigninForm')?.aliases).toEqual([
      'SigninForm',
      'LoginForm',
      'UILoginForm',
    ])
    expect(catalog.find((entry) => entry.name === 'SignupForm')?.aliases).toEqual([
      'SignupForm',
      'RegisterForm',
      'UIRegisterForm',
    ])
  })
})
