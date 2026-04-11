import { describe, expect, it } from 'vitest'

import { normalizeMarkdownContent } from './markdown'

describe('normalizeMarkdownContent', () => {
  it('rewrites legacy package references and component names to the preferred API', () => {
    const markdown = [
      "import { TInput, Button } from '@tiko/ui'",
      '',
      '<TInput />',
      '<Button />',
    ].join('\n')

    const normalized = normalizeMarkdownContent(markdown, [
      { from: 'TInput', to: 'UIInput' },
      { from: 'Button', to: 'UIButton' },
    ])

    expect(normalized).toContain("import { UIInput, UIButton } from '@sil/ui'")
    expect(normalized).toContain('<UIInput />')
    expect(normalized).toContain('<UIButton />')
  })
})
