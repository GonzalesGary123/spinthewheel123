import { rmSync, existsSync } from 'fs'
import { resolve } from 'path'

// Clean .nuxt cache in both possible directories
const dirs = [
  resolve('/vercel/share/v0-next-shadcn/.nuxt'),
  resolve('/vercel/share/v0-project/.nuxt'),
  resolve('/vercel/share/v0-project/app/.nuxt'),
]

for (const dir of dirs) {
  if (existsSync(dir)) {
    console.log(`Removing stale .nuxt cache at: ${dir}`)
    rmSync(dir, { recursive: true, force: true })
    console.log(`Removed: ${dir}`)
  } else {
    console.log(`No cache at: ${dir}`)
  }
}

console.log('Done cleaning .nuxt caches')
