import { describe, expect, it } from 'vitest'

import { normalizeCodeBlockLanguage, renderCodeBlock } from './codeBlock'

describe('normalizeCodeBlockLanguage', () => {
  it('maps shorthand aliases to supported highlighter languages', () => {
    expect(normalizeCodeBlockLanguage('ts')).toBe('typescript')
    expect(normalizeCodeBlockLanguage('vue')).toBe('xml')
    expect(normalizeCodeBlockLanguage('zsh')).toBe('bash')
  })
})

describe('renderCodeBlock', () => {
  it('renders a highlighted block with language classes', () => {
    const html = renderCodeBlock('const count = 1', 'ts')

    expect(html).toContain('docs-code-block')
    expect(html).toContain('hljs')
    expect(html).toContain('language-typescript')
  })

  it('auto-highlights unlabeled snippets while preserving escaped markup', () => {
    const html = renderCodeBlock('<aside>Hello</aside>')

    expect(html).toContain('docs-code-block')
    expect(html).toContain('&lt;')
    expect(html).toContain('hljs-selector-tag')
  })
})
