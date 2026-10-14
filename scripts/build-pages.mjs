// Generates static, crawlable HTML pages (guides, articles, FAQ) + sitemap.xml into dist/.
// Runs after `vite build`. No dependencies.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { HUBS, PAGES, SITE } from './content.mjs'

// Cookieless analytics: Vercel Web Analytics (active once enabled for the project)
// and, optionally, Umami when VITE_UMAMI_ID is set at build time.
const UMAMI_ID = process.env.VITE_UMAMI_ID || ''
const UMAMI_SRC = process.env.VITE_UMAMI_SRC || 'https://cloud.umami.is/script.js'
const ANALYTICS =
  '<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)}</script><script defer src="/_vercel/insights/script.js"></script>' +
  (UMAMI_ID ? `<script defer src="${UMAMI_SRC}" data-website-id="${UMAMI_ID}" data-do-not-track="true"></script>` : '')

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const faq = JSON.parse(readFileSync(join(root, 'content/faq.json'), 'utf8'))
const today = new Date().toISOString().slice(0, 10)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const strip = (s) => String(s).replace(/<[^>]+>/g, '')

const CSS = `:root{--bg:#0b0b10;--card:#15151d;--card2:#1b1b25;--line:#262633;--t1:#f4f3f8;--t2:#b4b3c0;--t3:#7d7c8a;--gold:#d6b07a;--gold2:#f0d3a2;--el:#38bdf8;color-scheme:dark}
@media (prefers-color-scheme:light){:root{--bg:#f4f2ee;--card:#fff;--card2:#f8f7f4;--line:#e4e1da;--t1:#111114;--t2:#55545c;--t3:#8b8a92;--gold:#a87a3d;--gold2:#d4ad6b;--el:#0a84c7;color-scheme:light}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--t1);font:17px/1.7 'Plus Jakarta Sans',system-ui,sans-serif;-webkit-text-size-adjust:100%}
a{color:var(--el)}header.top{border-bottom:1px solid var(--line)}.wrap{max-width:820px;margin:0 auto;padding:0 18px}
.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;height:62px}.brand{font:800 19px 'Sora',sans-serif;color:var(--t1);text-decoration:none;display:flex;align-items:center;gap:9px}
nav.main{display:flex;gap:16px;font-size:14px;font-weight:600;overflow-x:auto}nav.main a{color:var(--t2);text-decoration:none;white-space:nowrap}nav.main a:hover{color:var(--t1)}
.crumbs{font-size:13px;color:var(--t3);margin:22px 0 6px}.crumbs a{color:var(--t3)}
.kicker{color:var(--gold);font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:12px}
h1{font:800 clamp(28px,5vw,42px)/1.15 'Sora',sans-serif;letter-spacing:-.02em;margin:6px 0 14px;text-wrap:balance}
h2{font:700 24px/1.3 'Sora',sans-serif;margin:38px 0 10px}h3{font:700 19px/1.35 'Sora',sans-serif;margin:0 0 6px}
.lead{font-size:19px;color:var(--t2)}article p,article li{color:var(--t1)}article ul,article ol{padding-left:22px}
table{border-collapse:collapse;width:100%;font-size:15px;margin:10px 0;font-variant-numeric:tabular-nums}th,td{border-bottom:1px solid var(--line);padding:9px 10px;text-align:left}th{color:var(--t2);font-weight:600}
.tw{overflow-x:auto}.steps{list-style:none;padding:0;margin:24px 0;display:grid;gap:22px}
.step{display:grid;grid-template-columns:1fr 210px;gap:20px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px}
@media(max-width:620px){.step{grid-template-columns:1fr}.step svg,.step .shot{max-width:230px;margin:0 auto}}
.shot{display:block;width:100%;height:auto;border-radius:22px;border:1px solid var(--line);box-shadow:0 10px 30px rgba(0,0,0,.25)}
.num{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#15131b;font:800 15px 'Sora',sans-serif;margin-right:8px}
.step p{margin:6px 0 0;color:var(--t2)}.cap{font-size:12px;color:var(--t3);text-align:center;margin-top:4px}
.cta{margin:36px 0;padding:22px;border-radius:20px;background:linear-gradient(135deg,color-mix(in oklab,var(--gold) 22%,var(--card)),var(--card));border:1px solid color-mix(in oklab,var(--gold) 40%,var(--line))}
.cta b{font:800 21px 'Sora',sans-serif}.btn{display:inline-block;margin-top:12px;padding:12px 20px;border-radius:14px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#15131b;font-weight:800;text-decoration:none}
.note{background:var(--card2);border:1px solid var(--line);border-radius:14px;padding:12px 16px;font-size:15px;color:var(--t2)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin:18px 0}.cards a{display:block;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;color:var(--t1);text-decoration:none}
.cards a span{display:block;color:var(--t2);font-size:14px;margin-top:4px}.cards a:hover{border-color:var(--gold)}
details{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:10px 0}summary{cursor:pointer;font-weight:700}details p{color:var(--t2);margin:8px 0 0}
footer{border-top:1px solid var(--line);margin-top:50px;padding:24px 0 40px;font-size:13px;color:var(--t3)}`

const LOGO = `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0d3a2"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs><circle cx="16" cy="16" r="13" fill="none" stroke="url(#lg)" stroke-width="3.5" stroke-dasharray="62 20" stroke-linecap="round" transform="rotate(130 16 16)"/><circle cx="16" cy="16" r="4" fill="url(#lg)"/></svg>`

/** Generic, brand-neutral illustration of an app screen for a guide step. */
function phone(rows, hl, n, title) {
  const w = 210, h = 380
  const items = rows.slice(1).map((r, i) => {
    const y = 104 + i * 58
    const on = i + 1 === hl
    return `<rect x="22" y="${y}" width="166" height="46" rx="11" fill="${on ? 'url(#hi)' : '#22222d'}" ${on ? 'stroke="#f0d3a2" stroke-width="2"' : ''}/><text x="36" y="${y + 29}" font-size="13" font-weight="${on ? 800 : 600}" fill="${on ? '#15131b' : '#d8d7e2'}">${esc(r)}</text>`
  }).join('')
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(`Ilustracija koraka ${n}: ${title}`)}" style="width:100%;height:auto;display:block;font-family:Plus Jakarta Sans,system-ui,sans-serif"><defs><linearGradient id="hi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6b07a"/><stop offset="1" stop-color="#f0d3a2"/></linearGradient></defs>
<rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="30" fill="#0e0e14" stroke="#3a3a48" stroke-width="3"/><rect x="80" y="16" width="50" height="8" rx="4" fill="#2a2a36"/>
<text x="22" y="66" font-size="11" fill="#8b8a92" font-weight="700" letter-spacing="1.2">KORAK ${n}</text><text x="22" y="88" font-size="18" font-weight="800" fill="#f4f3f8">${esc(rows[0])}</text>${items}
<rect x="72" y="${h - 22}" width="66" height="5" rx="3" fill="#3a3a48"/></svg>`
}

function layout({ title, description, path, body, jsonld = [], kind = 'website' }) {
  const url = `${SITE}/${path ? path + '/' : ''}`
  return `<!doctype html><html lang="bs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url}">
<meta property="og:type" content="${kind}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/og.png"><meta property="og:locale" content="bs_BA"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="theme-color" content="#0b0b10">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Sora:wght@700;800&display=swap" rel="stylesheet">
<style>${CSS}</style>${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('')}${ANALYTICS}</head><body>
<header class="top"><div class="wrap"><a class="brand" href="/">${LOGO}DriveLens</a><nav class="main"><a href="/">Aplikacija</a><a href="/vodic/">Vodiči</a><a href="/clanci/">Članci</a><a href="/pitanja/">Pitanja</a></nav></div></header>
<main class="wrap">${body}</main>
<footer><div class="wrap">DriveLens · besplatan izvještaj o vožnji iz MyDS, MyCitroën, MyPeugeot i MyOpel podataka. Nezavisan projekat, nije povezan sa Stellantis, DS Automobiles, Citroën, Peugeot ni Opel. Procjene su informativne.</div></footer>
</body></html>`
}

const crumbs = (items) => `<div class="crumbs">${items.map((c, i) => (i < items.length - 1 ? `<a href="${c.href}">${esc(c.name)}</a>` : esc(c.name))).join(' › ')}</div>`
const crumbLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.href })) })
const cta = `<div class="cta"><b>Pretvori svoj CSV u izvještaj</b><p>Struja vs. gorivo, troškovi, ušteda, mapa i rekordi. Besplatno, a podaci ostaju na tvom uređaju.</p><a class="btn" href="/">Otvori DriveLens →</a></div>`
const hub = (kind) => PAGES.filter((p) => p.kind === kind)

function write(path, html) {
  const file = join(dist, path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

for (const p of PAGES) {
  const hubInfo = HUBS.find((h) => h.kind === p.kind)
  const trail = [{ name: 'DriveLens', href: '/' }, { name: hubInfo.h1, href: `/${hubInfo.slug}/` }, { name: p.h1, href: `/${p.slug}/` }]
  let body = crumbs(trail) + `<article><div class="kicker">${p.kicker}</div><h1>${esc(p.h1)}</h1>`
  const ld = [crumbLd(trail)]
  if (p.kind === 'guide') {
    body += `<p class="lead">${esc(p.description)}</p><p>Vodič vrijedi za ${esc(p.app.models)}. Nazivi menija mogu se malo razlikovati zavisno od verzije aplikacije i jezika telefona.</p>`
    if (p.extra) body += `<p class="note">${esc(p.extra)}</p>`
    body += `<ol class="steps">${p.steps.map((s, i) => `<li class="step"><div><h3><span class="num">${i + 1}</span>${esc(s.t)}</h3><p>${esc(s.d)}</p></div><figure style="margin:0">${s.img ? `<img class="shot" src="${s.img}" alt="${esc(s.alt || s.t)}" width="540" height="1171" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async"><figcaption class="cap">Snimak ekrana (iPhone)</figcaption>` : `${phone(s.screen, s.hl, i + 1, s.t)}<figcaption class="cap">Ilustracija ekrana</figcaption>`}</figure></li>`).join('')}</ol>`
    body += `<h2>Česti problemi</h2><ul><li><b>Izvoz je prazan ili ima samo par vožnji.</b> Provjeri izabrani period i da su povezane usluge aktivne. Vožnje koje auto nije poslao (bez mreže, u inostranstvu) ne mogu se izvesti.</li><li><b>Datumi iz 2007. godine.</b> Sat u autu je resetovan. DriveLens takve vožnje sam vrati na prave datume.</li><li><b>Excel pokvari brojeve.</b> CSV ne otvaraj i ne spremaj u Excelu prije učitavanja; učitaj originalnu datoteku.</li></ul>`
    if (p.source) body += `<p class="note">Izvor: <a href="${p.source.url}" rel="nofollow noopener" target="_blank">${esc(p.source.label)}</a></p>`
    ld.push({ '@context': 'https://schema.org', '@type': 'HowTo', name: p.h1, description: p.description, inLanguage: 'bs', step: p.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.t, text: s.d, ...(s.img ? { image: SITE + s.img } : {}) })) })
  } else {
    body += p.body.join('')
    ld.push({ '@context': 'https://schema.org', '@type': 'Article', headline: p.h1, description: p.description, inLanguage: 'bs', datePublished: p.date, dateModified: p.date, author: { '@type': 'Organization', name: 'DriveLens' }, mainEntityOfPage: `${SITE}/${p.slug}/`, image: `${SITE}/og.png` })
  }
  const related = PAGES.filter((x) => x !== p).slice(0, 4)
  body += `</article>${cta}<h2>Pročitaj i ovo</h2><div class="cards">${related.map((r) => `<a href="/${r.slug}/"><b>${esc(r.h1)}</b><span>${esc(r.description.slice(0, 110))}…</span></a>`).join('')}</div>`
  write(p.slug, layout({ title: `${p.title} | DriveLens`, description: p.description, path: p.slug, body, jsonld: ld, kind: 'article' }))
}

for (const h of HUBS) {
  const trail = [{ name: 'DriveLens', href: '/' }, { name: h.h1, href: `/${h.slug}/` }]
  const body = crumbs(trail) + `<h1>${esc(h.h1)}</h1><p class="lead">${esc(h.description)}</p><div class="cards">${hub(h.kind).map((r) => `<a href="/${r.slug}/"><b>${esc(r.h1)}</b><span>${esc(r.description)}</span></a>`).join('')}</div>${cta}`
  write(h.slug, layout({ title: `${h.title} | DriveLens`, description: h.description, path: h.slug, body, jsonld: [crumbLd(trail)] }))
}

{
  const trail = [{ name: 'DriveLens', href: '/' }, { name: 'Česta pitanja', href: '/pitanja/' }]
  const body = crumbs(trail) + `<h1>Česta pitanja o potrošnji, izvozu podataka i DriveLensu</h1><p class="lead">Odgovori na pitanja koja vlasnici DS, Citroën, Peugeot i Opel vozila najčešće postavljaju o potrošnji plug-in hibrida i izvozu vožnji iz aplikacije.</p>` +
    faq.bs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}${f.link ? ` <a href="${f.link}">Više →</a>` : ''}</p></details>`).join('') + cta
  const ld = [crumbLd(trail), { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: 'bs', mainEntity: faq.bs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })) }]
  write('pitanja', layout({ title: 'Česta pitanja: potrošnja plug-in hibrida i izvoz vožnji | DriveLens', description: 'Koliko stvarno troši plug-in hibrid, da li se isplati puniti svaki dan, kako izvesti vožnje iz MyDS, MyCitroën, MyPeugeot i MyOpel aplikacije i još 15 pitanja.', path: 'pitanja', body, jsonld: ld }))
}

// sitemap with hreflang alternates for the app's language versions
const langs = ['bs', 'en', 'de', 'fr']
const alt = langs.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}/?lang=${l}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`
const urls = [
  `<url><loc>${SITE}/</loc><lastmod>${today}</lastmod><priority>1.0</priority>${alt}</url>`,
  ...langs.filter((l) => l !== 'bs').map((l) => `<url><loc>${SITE}/?lang=${l}</loc><lastmod>${today}</lastmod><priority>0.8</priority>${alt}</url>`),
  ...['pitanja', ...HUBS.map((h) => h.slug), ...PAGES.map((p) => p.slug)].map((s) => `<url><loc>${SITE}/${s}/</loc><lastmod>${today}</lastmod><priority>${s.startsWith('vodic/') ? '0.9' : '0.7'}</priority></url>`),
]
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`)
console.log(`static pages: ${PAGES.length + HUBS.length + 1}, sitemap urls: ${urls.length}`)
