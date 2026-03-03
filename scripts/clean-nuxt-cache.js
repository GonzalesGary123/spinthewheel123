import { rmSync, existsSync } from 'fs';
import { resolve } from 'path';

const paths = [
  resolve('/vercel/share/v0-next-shadcn/.nuxt'),
  resolve('/vercel/share/v0-project/.nuxt'),
  resolve('/vercel/share/v0-project/app/.nuxt'),
];

for (const p of paths) {
  if (existsSync(p)) {
    rmSync(p, { recursive: true, force: true });
    console.log(`Deleted: ${p}`);
  } else {
    console.log(`Not found (skipping): ${p}`);
  }
}

console.log('Done cleaning .nuxt caches');
