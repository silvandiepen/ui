import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { resolve, join, extname } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'

interface MarkdownFile {
  relativePath: string
  content: string
}

interface CatalogEntry {
  folder: string
  apiName: string
  category: string
  status: string
  summary: string
  aliases: string[]
  sourcePath: string
}

interface ComposableEntry {
  name: string
  slug: string
  summary: string
  description: string
  sourcePath: string
}

function readTextFile(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch {
    return ''
  }
}

function collectFiles(dir: string, extensions: string[], suffix?: string): MarkdownFile[] {
  const results: MarkdownFile[] = []

  function walk(currentDir: string) {
    const entries = readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walk(fullPath)
      } else if (entry.isFile()) {
        const ext = extname(entry.name)
        if (extensions.includes(ext) && (!suffix || entry.name.endsWith(suffix))) {
          results.push({
            relativePath: fullPath.replace(dir + '/', ''),
            content: readTextFile(fullPath),
          })
        }
      }
    }
  }

  try {
    walk(dir)
  } catch {
    // directory may not exist
  }

  return results
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseComponentOverrides(source: string): Map<string, CatalogEntry> {
  const entries = new Map<string, CatalogEntry>()
  const blockRegex = /(\w[\w/]*)\s*:\s*\{([^}]+)\}/g

  for (const match of source.matchAll(blockRegex)) {
    const folder = match[1]
    const body = match[2]

    const apiNameMatch = body.match(/apiName\s*:\s*'([^']+)'/)
    const categoryMatch = body.match(/category\s*:\s*'([^']+)'/)
    const statusMatch = body.match(/status\s*:\s*'([^']+)'/)
    const summaryMatch = body.match(/summary\s*:\s*'([^']+)'/)
    const sourcePathMatch = body.match(/sourcePath\s*:\s*'([^']+)'/)
    const nameMatch = body.match(/name\s*:\s*'([^']+)'/)
    const aliasesMatch = body.match(/aliases\s*:\s*\[([^\]]*)\]/)

    const name = nameMatch?.[1] ?? folder.split('/').pop() ?? folder
    const apiName = apiNameMatch?.[1] ?? `UI${name}`
    const category = categoryMatch?.[1] ?? ''
    const status = statusMatch?.[1] ?? 'stable'
    const summary = summaryMatch?.[1] ?? ''
    const sourcePath = sourcePathMatch?.[1] ?? `src/components/${folder}`
    const aliases = aliasesMatch?.[1]
      ?.split(',')
      .map((s) => s.trim().replace(/'/g, ''))
      .filter(Boolean) ?? []

    entries.set(folder, { folder, apiName, category, status, summary, aliases, sourcePath })
  }

  return entries
}

function parseComposableCatalog(source: string): ComposableEntry[] {
  const entries: ComposableEntry[] = []
  const blockRegex = /\{[^}]*description\s*:\s*'([^']+)'\s*[^}]*name\s*:\s*'([^']+)'\s*[^}]*slug\s*:\s*slugifyComposableName\('([^']+)'\)\s*[^}]*sourcePath\s*:\s*'([^']+)'\s*[^}]*summary\s*:\s*'([^']+)'\s*[^}]*\}/g

  for (const match of source.matchAll(blockRegex)) {
    entries.push({
      description: match[1],
      name: match[2],
      slug: match[3],
      sourcePath: match[4],
      summary: match[5],
    })
  }

  if (entries.length === 0) {
    const blockRegex2 = /\{\s*description\s*:\s*'([^']+)'[\s\S]*?name\s*:\s*'([^']+)'[\s\S]*?slug\s*:\s*slugifyComposableName\('([^']+)'\)[\s\S]*?sourcePath\s*:\s*'([^']+)'[\s\S]*?summary\s*:\s*'([^']+)'/g

    for (const match of source.matchAll(blockRegex2)) {
      entries.push({
        description: match[1],
        name: match[2],
        slug: match[3],
        sourcePath: match[4],
        summary: match[5],
      })
    }
  }

  return entries
}

function parseGuideContent(i18nSource: string): {
  gettingStarted: Record<string, string>
  themeBuilder: Record<string, string>
  composables: Record<string, string>
} {
  function extractSection(name: string): Record<string, string> {
    const result: Record<string, string> = {}

    const sectionStart = i18nSource.indexOf(`    ${name}: {`)
    if (sectionStart === -1) return result

    const bodyStart = sectionStart + name.length + 4 + 2
    const bodyEnd = extractBlockBody(i18nSource, bodyStart)
    if (bodyEnd <= bodyStart) return result

    const body = i18nSource.substring(bodyStart, bodyEnd)

    const pairRegex = /(\w+)\s*:\s*'((?:[^'\\]|\\.)*)'/g
    for (const match of body.matchAll(pairRegex)) {
      result[match[1]] = match[2].replace(/\\'/g, "'")
    }

    return result
  }

  return {
    composables: extractSection('composables'),
    gettingStarted: extractSection('gettingStarted'),
    themeBuilder: extractSection('themeBuilder'),
  }
}

function extractBlockBody(source: string, openBracePos: number): number {
  let braceCount = 0
  let i = openBracePos
  let inString = false
  let stringChar = ''

  while (i < source.length) {
    const ch = source[i]

    if (inString) {
      if (ch === '\\') {
        i++
      } else if (ch === stringChar) {
        inString = false
      }
      i++
      continue
    }

    if (ch === "'" || ch === '`') {
      inString = true
      stringChar = ch
      i++
      continue
    }

    if (ch === '{') {
      braceCount++
    } else if (ch === '}') {
      braceCount--
      if (braceCount <= 0) return i
    }

    i++
  }

  return -1
}

function parseCategories(source: string): Array<{ id: string; label: string; description: string; order: number }> {
  const categories: Array<{ id: string; label: string; description: string; order: number }> = []
  const blockRegex = /\{\s*id\s*:\s*'([^']+)'\s*,\s*label\s*:\s*'([^']+)'\s*,\s*description\s*:\s*'([^']+)'\s*,\s*order\s*:\s*(\d+)/g

  for (const match of source.matchAll(blockRegex)) {
    categories.push({
      description: match[3],
      id: match[1],
      label: match[2],
      order: parseInt(match[4], 10),
    })
  }

  return categories.sort((a, b) => a.order - b.order)
}

function generateHtml(data: {
  aiGuide: string
  catalog: Map<string, CatalogEntry>
  categories: Array<{ id: string; label: string; description: string; order: number }>
  composableCatalog: ComposableEntry[]
  composableDocs: MarkdownFile[]
  componentDocs: MarkdownFile[]
  gettingStarted: Record<string, string>
  readme: string
  themeBuilder: Record<string, string>
  composablesGuide: Record<string, string>
  modelFiles: MarkdownFile[]
  exampleFiles: MarkdownFile[]
}): string {
  const { readme, aiGuide, gettingStarted, themeBuilder, composablesGuide, categories, catalog, composableCatalog, componentDocs, composableDocs, modelFiles, exampleFiles } = data

  const docsByFolder = new Map<string, MarkdownFile[]>()
  for (const doc of componentDocs) {
    const folder = doc.relativePath.split('/').slice(0, -1).join('/')
    const list = docsByFolder.get(folder) ?? []
    list.push(doc)
    docsByFolder.set(folder, list)
  }

  const composableDocsMap = new Map<string, string>()
  for (const doc of composableDocs) {
    const name = doc.relativePath.replace('.md', '')
    composableDocsMap.set(name, doc.content)
  }

  const modelByComponent = new Map<string, string>()
  for (const model of modelFiles) {
    const parts = model.relativePath.split('/')
    const componentFolder = parts.slice(0, -1).join('/')
    modelByComponent.set(componentFolder, model.content)
  }

  const componentsByCategory = new Map<string, CatalogEntry[]>()
  for (const entry of catalog.values()) {
    const list = componentsByCategory.get(entry.category) ?? []
    list.push(entry)
    componentsByCategory.set(entry.category, list)
  }
  for (const list of componentsByCategory.values()) {
    list.sort((a, b) => a.apiName.localeCompare(b.apiName))
  }

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Complete API documentation for @sil/ui - machine-readable reference for AI assistants">
  <meta name="robots" content="noindex">
  <title>@sil/ui - Complete Documentation (AI Reference)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 960px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #1a1a1a; }
    h1 { border-bottom: 3px solid #2563eb; padding-bottom: 0.5rem; }
    h2 { border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3rem; margin-top: 3rem; color: #1e40af; }
    h3 { color: #374151; margin-top: 2rem; }
    h4 { color: #6b7280; }
    pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1rem; overflow-x: auto; font-size: 0.875rem; line-height: 1.5; }
    code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.875em; }
    .meta { color: #6b7280; font-size: 0.875rem; }
    .badge { display: inline-block; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .badge-stable { background: #dcfce7; color: #166534; }
    .badge-category { background: #dbeafe; color: #1e40af; }
    article { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #f3f4f6; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.875rem; }
    th { background: #f8fafc; font-weight: 600; }
    nav { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem 1.5rem; margin-bottom: 2rem; }
    nav ul { columns: 2; }
    nav li { margin: 0.25rem 0; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .toc-hint { color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <h1>@sil/ui &mdash; Complete Documentation</h1>
  <p class="meta">Auto-generated reference for AI assistants. This page contains all component documentation, composable docs, guides, type definitions, and usage examples. Last updated at build time.</p>
`

  // Table of Contents
  html += `  <nav>
    <p class="toc-hint">This page is generated at build time and contains the full documentation for <code>@sil/ui</code>.</p>
    <h2 style="margin-top:0">Table of Contents</h2>
    <ul>
      <li><a href="#overview">Overview</a></li>
      <li><a href="#ai-guide">Implementation Guide</a></li>
      <li><a href="#getting-started">Getting Started</a></li>
      <li><a href="#theme-builder">Theme Builder</a></li>
      <li><a href="#composables-guide">Composables</a></li>
      <li><a href="#categories">Component Categories</a></li>
      <li><a href="#components">Components</a></li>
      <li><a href="#composables">Composables Reference</a></li>
      <li><a href="#type-definitions">Type Definitions</a></li>
      <li><a href="#examples">Example Files</a></li>
    </ul>
  </nav>
`

  // Overview
  html += `  <section id="overview">
    <h2>Overview</h2>
    <pre>${escapeHtml(readme)}</pre>
  </section>
`

  // AI Guide
  if (aiGuide) {
    html += `  <section id="ai-guide">
    <h2>Implementation Guide</h2>
    <pre>${escapeHtml(aiGuide)}</pre>
  </section>
`
  }

  // Getting Started
  html += `  <section id="getting-started">
    <h2>Getting Started</h2>
`
  for (const [key, value] of Object.entries(gettingStarted)) {
    html += `    <h3>${escapeHtml(key)}</h3>
    <p>${escapeHtml(value)}</p>
`
  }
  html += `  </section>
`

  // Theme Builder
  html += `  <section id="theme-builder">
    <h2>Theme Builder</h2>
`
  for (const [key, value] of Object.entries(themeBuilder)) {
    html += `    <h3>${escapeHtml(key)}</h3>
    <p>${escapeHtml(value)}</p>
`
  }
  html += `  </section>
`

  // Composables Guide
  html += `  <section id="composables-guide">
    <h2>Composables Guide</h2>
`
  for (const [key, value] of Object.entries(composablesGuide)) {
    html += `    <h3>${escapeHtml(key)}</h3>
    <p>${escapeHtml(value)}</p>
`
  }
  html += `  </section>
`

  // Categories
  html += `  <section id="categories">
    <h2>Component Categories</h2>
    <table>
      <thead><tr><th>ID</th><th>Label</th><th>Description</th><th>Components</th></tr></thead>
      <tbody>
`
  for (const cat of categories) {
    const count = componentsByCategory.get(cat.label)?.length ?? 0
    html += `        <tr><td><code>${escapeHtml(cat.id)}</code></td><td>${escapeHtml(cat.label)}</td><td>${escapeHtml(cat.description)}</td><td>${count}</td></tr>
`
  }
  html += `      </tbody>
    </table>
  </section>
`

  // Components
  html += `  <section id="components">
    <h2>Components (${catalog.size})</h2>
`
  for (const cat of categories) {
    const catEntries = componentsByCategory.get(cat.label)
    if (!catEntries?.length) continue

    html += `    <h3>${escapeHtml(cat.label)}</h3>
`
    for (const entry of catEntries) {
      html += `    <article id="component-${escapeHtml(entry.apiName.toLowerCase())}">
      <h4><code>${escapeHtml(entry.apiName)}</code> <span class="badge badge-category">${escapeHtml(entry.category)}</span> <span class="badge badge-stable">${escapeHtml(entry.status)}</span></h4>
      <p>${escapeHtml(entry.summary)}</p>
      <p class="meta">Source: <code>${escapeHtml(entry.sourcePath)}</code>${entry.aliases.length ? ` &middot; Aliases: ${entry.aliases.map((a) => `<code>${escapeHtml(a)}</code>`).join(', ')}` : ''}</p>
`
      // Find docs for this component
      const folderKey = entry.folder
      const componentDocs = docsByFolder.get(folderKey) ?? []
      for (const doc of componentDocs) {
        html += `      <h5>${escapeHtml(doc.relativePath)}</h5>
      <pre>${escapeHtml(doc.content)}</pre>
`
      }

      // Model file
      const modelContent = modelByComponent.get(folderKey)
      if (modelContent) {
        html += `      <h5>Type Definitions</h5>
      <pre>${escapeHtml(modelContent)}</pre>
`
      }

      html += `    </article>
`
    }
  }
  html += `  </section>
`

  // Composables
  html += `  <section id="composables">
    <h2>Composables (${composableCatalog.length})</h2>
`
  for (const entry of composableCatalog) {
    const docContent = composableDocsMap.get(entry.name)
    html += `    <article id="composable-${escapeHtml(entry.slug)}">
      <h4><code>${escapeHtml(entry.name)}</code></h4>
      <p>${escapeHtml(entry.summary)}</p>
      <p>${escapeHtml(entry.description)}</p>
      <p class="meta">Source: <code>${escapeHtml(entry.sourcePath)}</code></p>
`
    if (docContent) {
      html += `      <h5>Documentation</h5>
      <pre>${escapeHtml(docContent)}</pre>
`
    }
    html += `    </article>
`
  }
  html += `  </section>
`

  // Type Definitions
  if (modelFiles.length > 0) {
    html += `  <section id="type-definitions">
    <h2>All Type Definitions</h2>
`
    for (const model of modelFiles) {
      html += `    <h3>${escapeHtml(model.relativePath)}</h3>
    <pre>${escapeHtml(model.content)}</pre>
`
    }
    html += `  </section>
`
  }

  // Examples
  if (exampleFiles.length > 0) {
    html += `  <section id="examples">
    <h2>Example Files</h2>
`
    for (const example of exampleFiles) {
      html += `    <h3>${escapeHtml(example.relativePath)}</h3>
    <pre>${escapeHtml(example.content)}</pre>
`
    }
    html += `  </section>
`
  }

  html += `</body>
</html>`

  return html
}

function generateLlmsTxt(data: {
  aiGuide: string
  catalog: Map<string, CatalogEntry>
  categories: Array<{ id: string; label: string; description: string; order: number }>
  composableCatalog: ComposableEntry[]
  composableDocs: MarkdownFile[]
  componentDocs: MarkdownFile[]
  gettingStarted: Record<string, string>
  readme: string
  themeBuilder: Record<string, string>
  composablesGuide: Record<string, string>
  modelFiles: MarkdownFile[]
}): string {
  const { readme, gettingStarted, themeBuilder, composablesGuide, categories, catalog, composableCatalog, componentDocs, composableDocs, modelFiles } = data

  const docsByFolder = new Map<string, MarkdownFile[]>()
  for (const doc of componentDocs) {
    const folder = doc.relativePath.split('/').slice(0, -1).join('/')
    const list = docsByFolder.get(folder) ?? []
    list.push(doc)
    docsByFolder.set(folder, list)
  }

  const composableDocsMap = new Map<string, string>()
  for (const doc of composableDocs) {
    composableDocsMap.set(doc.relativePath.replace('.md', ''), doc.content)
  }

  const modelByComponent = new Map<string, string>()
  for (const model of modelFiles) {
    const parts = model.relativePath.split('/')
    modelByComponent.set(parts.slice(0, -1).join('/'), model.content)
  }

  const componentsByCategory = new Map<string, CatalogEntry[]>()
  for (const entry of catalog.values()) {
    const list = componentsByCategory.get(entry.category) ?? []
    list.push(entry)
    componentsByCategory.set(entry.category, list)
  }
  for (const list of componentsByCategory.values()) {
    list.sort((a, b) => a.apiName.localeCompare(b.apiName))
  }

  let output = `# @sil/ui

> Shared UI components for SIL applications - complete API reference

`

  // Overview
  output += `## Overview\n\n${readme}\n\n`

  // Getting Started
  output += `## Getting Started\n\n`
  for (const [key, value] of Object.entries(gettingStarted)) {
    output += `### ${key}\n\n${value}\n\n`
  }

  // Theme Builder
  output += `## Theme Configuration\n\n`
  for (const [key, value] of Object.entries(themeBuilder)) {
    output += `### ${key}\n\n${value}\n\n`
  }

  // Composables Guide
  output += `## Composables Guide\n\n`
  for (const [key, value] of Object.entries(composablesGuide)) {
    output += `### ${key}\n\n${value}\n\n`
  }

  // Categories
  output += `## Component Categories\n\n`
  for (const cat of categories) {
    const count = componentsByCategory.get(cat.label)?.length ?? 0
    output += `- **${cat.label}** (${cat.id}): ${cat.description} — ${count} components\n`
  }
  output += '\n'

  // Components
  output += `## Components\n\n`
  for (const cat of categories) {
    const catEntries = componentsByCategory.get(cat.label)
    if (!catEntries?.length) continue

    output += `### ${cat.label}\n\n`
    for (const entry of catEntries) {
      output += `#### ${entry.apiName}\n\n`
      output += `- **Summary**: ${entry.summary}\n`
      output += `- **Category**: ${entry.category}\n`
      output += `- **Status**: ${entry.status}\n`
      output += `- **Source**: ${entry.sourcePath}\n`
      if (entry.aliases.length) output += `- **Aliases**: ${entry.aliases.join(', ')}\n`
      output += '\n'

      const folderKey = entry.folder
      const componentDocs = docsByFolder.get(folderKey) ?? []
      for (const doc of componentDocs) {
        output += `${doc.content}\n\n`
      }

      const modelContent = modelByComponent.get(folderKey)
      if (modelContent) {
        output += `**Type definitions:**\n\n\`\`\`typescript\n${modelContent}\n\`\`\`\n\n`
      }
    }
  }

  // Composables
  output += `## Composables\n\n`
  for (const entry of composableCatalog) {
    const docContent = composableDocsMap.get(entry.name)
    output += `### ${entry.name}\n\n`
    output += `${entry.summary}\n\n${entry.description}\n\n`
    output += `- **Source**: ${entry.sourcePath}\n\n`
    if (docContent) {
      output += `${docContent}\n\n`
    }
  }

  return output
}

export function generateAiDocs(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'sil-ui-generate-ai-docs',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    transformIndexHtml() {
      return [
        {
          tag: 'link',
          attrs: {
            href: '/ai/',
            rel: 'ai-docs',
            title: 'Machine-readable documentation for @sil/ui',
          },
          injectTo: 'head' as const,
        },
        {
          tag: 'link',
          attrs: {
            href: '/llms.txt',
            rel: 'llms-txt',
            type: 'text/markdown',
          },
          injectTo: 'head' as const,
        },
        {
          tag: 'meta',
          attrs: {
            content: '/llms-full.txt',
            name: 'llms-full',
          },
          injectTo: 'head' as const,
        },
      ]
    },

    closeBundle() {
      const rootDir = resolve(config.root, '..')
      const distDir = resolve(config.root, 'dist')

      // Read static files
      const readme = readTextFile(resolve(rootDir, 'README.md'))
      const aiGuide = readTextFile(resolve(rootDir, 'AI_GUIDE.md'))

      // Read all markdown docs
      const componentDocs = collectFiles(resolve(rootDir, 'src/components'), ['.md'])
      const composableDocs = collectFiles(resolve(rootDir, 'src/composables'), ['.md'])

      // Read model files for type definitions
      const modelFiles = collectFiles(resolve(rootDir, 'src/components'), ['.ts'], '.model.ts')

      // Read example files
      const exampleFiles = collectFiles(resolve(rootDir, 'src/components'), ['.example.vue'])

      // Parse catalog data
      const catalogSource = readTextFile(resolve(config.root, 'src/lib/componentCatalog.ts'))
      const catalog = parseComponentOverrides(catalogSource)

      // Parse composable catalog
      const composableCatalogSource = readTextFile(resolve(config.root, 'src/lib/composableCatalog.ts'))
      const composableCatalog = parseComposableCatalog(composableCatalogSource)

      // Parse categories
      const categoriesSource = readTextFile(resolve(config.root, 'src/lib/componentCategories.ts'))
      const categories = parseCategories(categoriesSource)

      // Parse guide content from i18n
      const i18nSource = readTextFile(resolve(config.root, 'src/i18n.ts'))
      const guideContent = parseGuideContent(i18nSource)

      const sharedData = {
        aiGuide,
        catalog,
        categories,
        composableCatalog,
        composableDocs,
        componentDocs,
        composablesGuide: guideContent.composables,
        exampleFiles,
        gettingStarted: guideContent.gettingStarted,
        modelFiles,
        readme,
        themeBuilder: guideContent.themeBuilder,
      }

      // Generate /ai/index.html
      const aiDir = resolve(distDir, 'ai')
      mkdirSync(aiDir, { recursive: true })
      const html = generateHtml(sharedData)
      writeFileSync(resolve(aiDir, 'index.html'), html)

      // Generate /llms.txt
      const llmsContent = generateLlmsTxt(sharedData)
      writeFileSync(resolve(distDir, 'llms.txt'), llmsContent)
      writeFileSync(resolve(distDir, 'llms-full.txt'), llmsContent)

      console.log(`[sil-ui-ai-docs] Generated /ai/index.html, /llms.txt, /llms-full.txt (${catalog.size} components, ${composableCatalog.length} composables)`)
    },
  }
}
