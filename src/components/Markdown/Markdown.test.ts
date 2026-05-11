import { describe, expect, it } from 'vitest'

import {
  createMarkdownRenderer,
  renderMarkdownContent,
  renderMarkdownInline,
} from './markdown'

describe('renderMarkdownContent', () => {
  it('renders fenced code blocks with the markdown component class', async () => {
    const html = await renderMarkdownContent([
      '```ts',
      "const message = 'hello'",
      '```',
    ].join('\n'))

    expect(html).toContain('ui-markdown__code-block')
    expect(html).toContain('language-ts')
  })
})

describe('renderMarkdownInline', () => {
  it('renders inline markdown without wrapping paragraphs', async () => {
    const html = await renderMarkdownInline('**Bold** text')
    expect(html).toBe('<strong>Bold</strong> text')
  })
})

describe('createMarkdownRenderer', () => {
  it('accepts nizel options', async () => {
    const processor = createMarkdownRenderer({
      nizelOptions: { elements: { p: { class: 'custom-paragraph' } } },
    })

    const html = await processor.html('Hello world')
    expect(html).toContain('custom-paragraph')
  })
})
