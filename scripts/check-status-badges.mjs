import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const pagesRoot = fileURLToPath(new URL('../src/pages/', import.meta.url))

async function collectMdxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return collectMdxFiles(path)
    return entry.isFile() && entry.name.endsWith('.mdx') ? [path] : []
  }))
  return nested.flat()
}

const files = await collectMdxFiles(pagesRoot)
const errors = []
for (const file of files) {
  const source = await readFile(file, 'utf8')
  if (/:badge\[(?:Shipped|Partial|Planned)\]/i.test(source)) {
    errors.push(`${relative(pagesRoot, file)}: implementation-status badges are not allowed`)
  }
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Verified ${files.length} pages have no implementation-status badges.`)
}
