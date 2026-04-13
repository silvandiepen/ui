# useContent

`useContent()` manages lightweight searchable content entries for guides, docs, or app-owned static content.

It is designed for static or semi-static content that should be searchable without pulling in a heavy full-text engine.

## Returns

- `items`: computed normalized content entries ready for lightweight search

## Registry Helpers

- `configureContent({ entries, sources })`: replace the shared global content registry
- `registerContentSource(source)`: add or replace one shared source by id
- `removeContentSource(id)`: remove one shared source

## Source Format

Each source provides a small list of entries:

```ts
{
  id: 'docs-guides',
  entries: [
    {
      id: 'guide:getting-started',
      title: 'Getting Started',
      summary: 'Use @sil/ui in a Vite project.',
      content: 'Shared CSS variables, theme config, and aliases.',
      keywords: ['guide', 'vite', 'theme'],
      route: { name: 'docs-guide-getting-started' },
      kind: 'guide',
    },
  ],
}
```

## App-Fed Content

You can feed content directly from the app side:

```ts
import { registerContentSource } from '@sil/ui'

registerContentSource({
  id: 'marketing-pages',
  entries: [
    {
      id: 'page:pricing',
      title: 'Pricing',
      summary: 'Plans and limits',
      content: 'Starter, Growth, and Enterprise plans.',
      route: '/pricing',
      kind: 'page',
    },
  ],
})
```

## Notes

- Content is normalized once per source update into lightweight plain text.
- Markdown and HTML markup are stripped before indexing.
- This keeps static search small and predictable for app-owned content.
