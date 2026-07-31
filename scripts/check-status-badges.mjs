import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const pagesRoot = fileURLToPath(new URL('../src/pages/', import.meta.url))
const expectedStyle = {
  Shipped: 'success',
  Partial: 'warning',
  Planned: undefined,
}

async function collectMdxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) return collectMdxFiles(path)
      return entry.isFile() && entry.name.endsWith('.mdx') ? [path] : []
    }),
  )
  return nested.flat()
}

const files = await collectMdxFiles(pagesRoot)
const errors = []

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const matches = [
    ...source.matchAll(/:badge\[(Shipped|Partial|Planned)\](?:\{([^}]+)\})?/g),
  ]
  const page = relative(pagesRoot, file)

  if (matches.length !== 1) {
    errors.push(`${page}: expected exactly one status badge, found ${matches.length}`)
    continue
  }

  const [, status, style] = matches[0]
  if (style !== expectedStyle[status]) {
    const expected = expectedStyle[status] ?? 'no style'
    errors.push(`${page}: ${status} must use ${expected}`)
  }

  const firstLines = source.split('\n').slice(0, 15).join('\n')
  if (!firstLines.includes(matches[0][0])) {
    errors.push(`${page}: status badge must appear near the top of the page`)
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Verified status badges on ${files.length} pages.`)
}
