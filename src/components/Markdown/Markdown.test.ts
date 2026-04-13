import { describe, expect, it } from 'vitest'

import {
  createMarkdownRenderer,
  normalizeCodeBlockLanguage,
  renderMarkdownCodeBlock,
  renderMarkdownContent,
  renderMarkdownInline,
} from './markdown'

describe('normalizeCodeBlockLanguage', () => {
  it('maps shorthand aliases to supported highlighter languages', () => {
    expect(normalizeCodeBlockLanguage('ts')).toBe('typescript')
    expect(normalizeCodeBlockLanguage('vue')).toBe('xml')
    expect(normalizeCodeBlockLanguage('zsh')).toBe('bash')
  })
})

describe('renderMarkdownCodeBlock', () => {
  it('renders highlighted code blocks with the markdown component class', () => {
    const html = renderMarkdownCodeBlock('const count = 1', 'ts')

    expect(html).toContain('ui-markdown__code-block')
    expect(html).toContain('hljs')
    expect(html).toContain('language-typescript')
  })
})

describe('renderMarkdownContent', () => {
  it('renders fenced code blocks with highlighted output', () => {
    const html = renderMarkdownContent([
      '```ts',
      "const message = 'hello'",
      '```',
    ].join('\n'))

    expect(html).toContain('ui-markdown__code-block')
    expect(html).toContain('hljs')
    expect(html).toContain('language-typescript')
  })

  it('applies markdown-it plugins to the renderer instance', () => {
    const html = renderMarkdownContent('Paragraph', {
      plugins: [
        (renderer) => {
          renderer.renderer.rules.paragraph_open = () => '<p data-plugin="enabled">'
        },
      ],
    })

    expect(html).toContain('<p data-plugin="enabled">')
  })
})

describe('renderMarkdownInline', () => {
  it('renders inline markdown without wrapping paragraphs', () => {
    expect(renderMarkdownInline('**Bold** text')).toBe('<strong>Bold</strong> text')
  })
})

describe('createMarkdownRenderer', () => {
  it('accepts custom highlight functions', () => {
    const renderer = createMarkdownRenderer({
      highlight: () => '<pre data-custom="highlight"></pre>',
    })

    expect(renderer.render('```ts\nconst value = 1\n```')).toContain('data-custom="highlight"')
  })
})
