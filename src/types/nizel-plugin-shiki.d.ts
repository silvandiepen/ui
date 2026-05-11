declare module 'nizel-plugin-shiki/javascript' {
  import type { NizelPlugin } from 'nizel'

  export type ShikiHighlighterInput = {
    lang?: string
    theme?: string
    meta?: string
    filename?: string
    highlightLines?: number[]
  }

  export type JavaScriptShikiHighlighter = (
    code: string,
    input: ShikiHighlighterInput,
  ) => string | undefined

  export function shikiPlugin(options?: {
    highlighter?: JavaScriptShikiHighlighter
    mode?: 'blocks' | 'inline'
    theme?: string
  }): NizelPlugin

  export function createJavaScriptShikiHighlighter(options?: {
    themes?: string[]
    defaultLang?: string
    defaultTheme?: string
  }): Promise<JavaScriptShikiHighlighter>
}
