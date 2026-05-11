import { describe, expect, it } from 'vitest'

import { normalizeMarkdownContent, renderMarkdown } from './markdown'

describe('normalizeMarkdownContent', () => {
  it('rewrites package references and component names to the preferred API', () => {
    const markdown = [
      "import { Input, Button } from '@tiko/ui'",
      '',
      '<Input />',
      '<Button />',
    ].join('\n')

    const normalized = normalizeMarkdownContent(markdown, [
      { from: 'Input', to: 'UIInput' },
      { from: 'Button', to: 'UIButton' },
    ])

    expect(normalized).toContain("import { UIInput, UIButton } from '@sil/ui'")
    expect(normalized).toContain('<UIInput />')
    expect(normalized).toContain('<UIButton />')
  })
})

describe('renderMarkdown', () => {
  it('renders fenced code blocks with the code block class', async () => {
    const html = await renderMarkdown([
      '```ts',
      "const message = 'hello'",
      '```',
    ].join('\n'))

    expect(html).toContain('docs-code-block')
    expect(html).toContain('language-ts')
  })
})
