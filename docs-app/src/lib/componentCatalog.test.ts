import { describe, expect, it } from 'vitest'

import { buildComponentCatalog, slugifyComponentName } from './componentCatalog'

describe('component catalog', () => {
  it('builds a sorted catalog with docs and examples grouped by top-level component folder', () => {
    const catalog = buildComponentCatalog({
      docKeys: [
        '../../../src/components/Card/README.md',
        '../../../src/components/Form/TForm/TForm.md',
      ],
      exampleKeys: [
        '../../../src/components/Card/Card.example.vue',
      ],
      folderKeys: [
        '../../../src/components/Card/index.ts',
        '../../../src/components/Form/index.ts',
        '../../../src/components/Progress/index.ts',
      ],
      singleFileKeys: [],
    })

    expect(catalog.map((entry) => entry.name)).toEqual([
      'Card',
      'Form',
      'Progress',
    ])
    expect(catalog.find((entry) => entry.name === 'Card')?.examplePath).toBe(
      '../../../src/components/Card/Card.example.vue',
    )
    expect(catalog.find((entry) => entry.name === 'Form')?.docs).toEqual([
      '../../../src/components/Form/TForm/TForm.md',
    ])
  })

  it('slugifies component names consistently', () => {
    expect(slugifyComponentName('StatusBadge')).toBe('status-badge')
    expect(slugifyComponentName('Theme Toggle')).toBe('theme-toggle')
  })
})
