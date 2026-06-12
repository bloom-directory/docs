import { copyFile } from 'node:fs/promises'

await copyFile('dist/public/index.html', 'dist/public/root.html')
