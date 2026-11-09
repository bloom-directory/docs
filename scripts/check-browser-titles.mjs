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

async function checkTitle(output, expected) {
  const html = await readFile(output, 'utf8')
  assert.ok(!/<h[1-6]\b[^>]*>\s*(?:title|description):\s/i.test(html), `${output}: exposed frontmatter in a heading`)
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]
  assert.ok(head, `${output}: missing head`)
  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => match[1])
  assert.equal(titles.length, 1, `${output}: expected exactly one title`)
  const escaped = expected.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  assert.equal(titles[0], escaped, output)
}

const sourcePages = await pages(sourceRoot)
for (const source of sourcePages) {
  const route = source.slice(sourceRoot.length + 1, -4)
  const output = route === 'index' ? join(outputRoot, 'index.html') : join(outputRoot, route, 'index.html')
  if (route === 'index') {
    await checkTitle(output, siteTitle)
    continue
  }
  const content = await readFile(source, 'utf8')
  const heading = content.match(/^# (.+)$/m)?.[1]
  assert.ok(heading, `${source}: missing page heading`)
  await checkTitle(output, `${heading} | ${siteTitle}`)
}
await checkTitle(join(outputRoot, '404.html'), `Page not found | ${siteTitle}`)
console.log(`Verified exact browser titles in ${sourcePages.length} built documentation pages and 404.`)
