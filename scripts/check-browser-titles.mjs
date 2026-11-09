import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const siteTitle = '/bloom/docs | The programmable financial harness for AI agents.'
const sourceRoot = 'src/pages'
const outputRoot = 'dist/public'

async function pages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? pages(path) : path.endsWith('.mdx') ? [path] : []
  }))).flat()
}

const sourcePages = await pages(sourceRoot)
for (const source of sourcePages) {
  const route = source.slice(sourceRoot.length + 1, -4)
  const output = route === 'index' ? join(outputRoot, 'index.html') : join(outputRoot, route, 'index.html')
  const html = await readFile(output, 'utf8')
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]
  assert.ok(head, `${output}: missing head`)
  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => match[1])
  assert.equal(titles.length, 1, `${output}: expected exactly one title`)
  if (route === 'index') assert.equal(titles[0], siteTitle, output)
  else assert.ok(titles[0].endsWith(` | ${siteTitle}`) && titles[0].length > siteTitle.length + 3, `${output}: ${titles[0]}`)
}
console.log(`Verified browser titles in ${sourcePages.length} built documentation pages.`)
