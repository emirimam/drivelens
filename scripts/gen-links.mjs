// Writes content/links.json (guide/article titles + URLs per language) for the app's landing page.
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FAQ_PAGE, LANGS, PAGES } from './content.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = Object.fromEntries(LANGS.map((l) => [l, {
  faq: `/${FAQ_PAGE[l].slug}/`,
  pages: PAGES.filter((p) => p.lang === l).map((p) => ({ href: `/${p.slug}/`, title: p.h1, guide: p.kind === 'guide' })),
}]))
writeFileSync(join(root, 'content/links.json'), JSON.stringify(out, null, 1) + '\n')
console.log('links.json written')
