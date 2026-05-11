import { describe, expect, it } from 'vitest'

import {
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
  })
})

describe('renderMarkdownInline', () => {
  it('renders inline markdown without wrapping paragraphs', async () => {
    const html = await renderMarkdownInline('**Bold** text')
    expect(html).toBe('<strong>Bold</strong> text')
  })
})
