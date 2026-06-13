import { copyFile, mkdir, readdir } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

const publicDir = join(process.cwd(), 'dist/public')
const mdDir = join(publicDir, 'assets/md')

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else if (entry.isFile() && entry.name.endsWith('.md')) yield path
  }
}

for await (const source of walk(mdDir)) {
  const destination = join(publicDir, relative(mdDir, source))
  await mkdir(dirname(destination), { recursive: true })
  await copyFile(source, destination)
}
