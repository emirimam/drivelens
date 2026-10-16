// Generates static, crawlable HTML pages (guides, articles, FAQ) + sitemap.xml into dist/.
// Runs after `vite build`. No dependencies.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'
import { FAQ_PAGE, HOME, HOME_PATH, HUBS, LANGS, PAGES, SITE, UI } from './content.mjs'

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
nav.lang{display:flex;gap:6px;font-size:12px;font-weight:700}nav.lang a{color:var(--t3);text-decoration:none;padding:3px 6px;border-radius:7px;text-transform:uppercase}nav.lang a[aria-current]{color:var(--t1);background:var(--card2)}
.top .wrap{flex-wrap:wrap;height:auto;min-height:62px;padding-top:8px;padding-bottom:8px}
footer{border-top:1px solid var(--line);margin-top:50px;padding:24px 0 40px;font-size:13px;color:var(--t3)}`

const LOGO = `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0d3a2"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs><circle cx="16" cy="16" r="13" fill="none" stroke="url(#lg)" stroke-width="3.5" stroke-dasharray="62 20" stroke-linecap="round" transform="rotate(130 16 16)"/><circle cx="16" cy="16" r="4" fill="url(#lg)"/></svg>`

/** Generic, brand-neutral illustration of an app screen for a guide step. */
function phone(rows, hl, n, title, u) {
  const w = 210, h = 380
  const items = rows.slice(1).map((r, i) => {
    const y = 104 + i * 58
    const on = i + 1 === hl
    return `<rect x="22" y="${y}" width="166" height="46" rx="11" fill="${on ? 'url(#hi)' : '#22222d'}" ${on ? 'stroke="#f0d3a2" stroke-width="2"' : ''}/><text x="36" y="${y + 29}" font-size="13" font-weight="${on ? 800 : 600}" fill="${on ? '#15131b' : '#d8d7e2'}">${esc(r)}</text>`
  }).join('')
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(`${u.illAlt} ${n}: ${title}`)}" style="width:100%;height:auto;display:block;font-family:Plus Jakarta Sans,system-ui,sans-serif"><defs><linearGradient id="hi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6b07a"/><stop offset="1" stop-color="#f0d3a2"/></linearGradient></defs>
<rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="30" fill="#0e0e14" stroke="#3a3a48" stroke-width="3"/><rect x="80" y="16" width="50" height="8" rx="4" fill="#2a2a36"/>
<text x="22" y="66" font-size="11" fill="#8b8a92" font-weight="700" letter-spacing="1.2">${u.step} ${n}</text><text x="22" y="88" font-size="18" font-weight="800" fill="#f4f3f8">${esc(rows[0])}</text>${items}
<rect x="72" y="${h - 22}" width="66" height="5" rx="3" fill="#3a3a48"/></svg>`
}

const url = (slug) => `${SITE}/${slug ? slug + '/' : ''}`
const APP_URL = (l) => url(HOME_PATH[l])
const ORG = { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'DriveLens', url: `${SITE}/`, logo: { '@type': 'ImageObject', url: `${SITE}/icon-512.png`, width: 512, height: 512 } }

// All language versions of every page, keyed by shared id → { lang: slug }
const VERSIONS = {}
const reg = (id, lang, slug) => ((VERSIONS[id] ??= {})[lang] = slug)
for (const p of PAGES) reg(p.id, p.lang, p.slug)
for (const h of HUBS) reg(h.id, h.lang, h.slug)
for (const l of LANGS) reg('faq', l, FAQ_PAGE[l].slug)
for (const l of LANGS) reg('home', l, HOME_PATH[l])
const hubSlug = (lang, kind) => HUBS.find((h) => h.lang === lang && h.kind === kind).slug

function layout({ lang, id, title, description, path, body, jsonld = [], kind = 'website' }) {
  const u = UI[lang]
  const v = VERSIONS[id] || {}
  const alts = LANGS.filter((l) => v[l] !== undefined).map((l) => `<link rel="alternate" hreflang="${l}" href="${url(v[l])}">`).join('') + (v.bs !== undefined ? `<link rel="alternate" hreflang="x-default" href="${url(v.bs)}">` : '')
  const switcher = LANGS.filter((l) => v[l] !== undefined).map((l) => `<a href="/${v[l] ? v[l] + '/' : ''}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="page"' : ''}>${l}</a>`).join('')
  const nav = [u.app, `/${hubSlug(lang, 'guide')}/`, `/${hubSlug(lang, 'article')}/`, `/${FAQ_PAGE[lang].slug}/`].map((href, i) => `<a href="${href}">${u.nav[i]}</a>`).join('')
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url(path)}">${alts}
<meta property="og:type" content="${kind}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url(path)}"><meta property="og:image" content="${SITE}/og.png"><meta property="og:locale" content="${u.locale}"><meta property="og:site_name" content="DriveLens"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="DriveLens"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#0b0b10">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Sora:wght@700;800&display=swap" rel="stylesheet">
<style>${CSS}</style>${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('')}${ANALYTICS}</head><body>
<header class="top"><div class="wrap"><a class="brand" href="${u.app}">${LOGO}DriveLens</a><nav class="main">${nav}</nav><nav class="lang" aria-label="${u.langLabel}">${switcher}</nav></div></header>
<main class="wrap">${body}</main>
<footer><div class="wrap">${esc(u.footer)}</div></footer>
</body></html>`
}

const crumbs = (items) => `<div class="crumbs">${items.map((c, i) => (i < items.length - 1 ? `<a href="${c.href}">${esc(c.name)}</a>` : esc(c.name))).join(' › ')}</div>`
const crumbLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.href.startsWith('http') ? c.href : SITE + c.href })) })
const cta = (lang) => { const u = UI[lang]; return `<div class="cta"><b>${esc(u.ctaT)}</b><p>${esc(u.ctaD)}</p><a class="btn" href="${u.app}">${esc(u.ctaB)}</a></div>` }

function write(path, html) {
  const file = join(dist, path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

for (const p of PAGES) {
  const u = UI[p.lang]
  const hubInfo = HUBS.find((h) => h.kind === p.kind && h.lang === p.lang)
  const trail = [{ name: 'DriveLens', href: u.app }, { name: hubInfo.h1, href: `/${hubInfo.slug}/` }, { name: p.h1, href: `/${p.slug}/` }]
  let body = crumbs(trail) + `<article><div class="kicker">${esc(p.kicker)}</div><h1>${esc(p.h1)}</h1>`
  const ld = [crumbLd(trail)]
  if (p.kind === 'guide') {
    body += `<p class="lead">${esc(p.description)}</p><p>${esc(u.validFor(p.models))}</p>`
    if (p.extra) body += `<p class="note">${esc(p.extra)}</p>`
    body += `<ol class="steps">${p.steps.map((s, i) => `<li class="step"><div><h3><span class="num">${i + 1}</span>${esc(s.t)}</h3><p>${esc(s.d)}</p></div><figure style="margin:0">${s.img ? `<img class="shot" src="${s.img}" alt="${esc(s.alt || s.t)}" width="540" height="1171" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async"><figcaption class="cap">${esc(u.shot)}</figcaption>` : `${phone(s.screen, s.hl, i + 1, s.t, u)}<figcaption class="cap">${esc(u.ill)}</figcaption>`}</figure></li>`).join('')}</ol>`
    body += `<h2>${esc(u.problemsH)}</h2><ul>${u.problems.map((x) => `<li>${x}</li>`).join('')}</ul>`
    if (p.source) body += `<p class="note">${esc(u.source)}: <a href="${p.source.url}" rel="nofollow noopener" target="_blank">${esc(p.source.label)}</a></p>`
    ld.push({ '@context': 'https://schema.org', '@type': 'HowTo', name: p.h1, description: p.description, inLanguage: p.lang, step: p.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.t, text: s.d, ...(s.img ? { image: SITE + s.img } : {}) })) })
  } else {
    body += p.body.join('')
    ld.push({ '@context': 'https://schema.org', '@type': 'Article', headline: p.h1, description: p.description, inLanguage: p.lang, datePublished: p.date, dateModified: p.date, author: { '@type': 'Organization', name: 'DriveLens', url: `${SITE}/` }, publisher: ORG, mainEntityOfPage: url(p.slug), image: `${SITE}/og.png` })
  }
  const related = PAGES.filter((x) => x.lang === p.lang && x !== p).slice(0, 4)
  body += `</article>${cta(p.lang)}<h2>${esc(u.readAlso)}</h2><div class="cards">${related.map((r) => `<a href="/${r.slug}/"><b>${esc(r.h1)}</b><span>${esc(r.description.slice(0, 110))}…</span></a>`).join('')}</div>`
  write(p.slug, layout({ lang: p.lang, id: p.id, title: `${p.title} | DriveLens`, description: p.description, path: p.slug, body, jsonld: ld, kind: 'article' }))
}

for (const h of HUBS) {
  const u = UI[h.lang]
  const trail = [{ name: 'DriveLens', href: u.app }, { name: h.h1, href: `/${h.slug}/` }]
  const items = PAGES.filter((p) => p.lang === h.lang && p.kind === h.kind)
  const body = crumbs(trail) + `<h1>${esc(h.h1)}</h1><p class="lead">${esc(h.description)}</p><div class="cards">${items.map((r) => `<a href="/${r.slug}/"><b>${esc(r.h1)}</b><span>${esc(r.description)}</span></a>`).join('')}</div>${cta(h.lang)}`
  write(h.slug, layout({ lang: h.lang, id: h.id, title: `${h.title} | DriveLens`, description: h.description, path: h.slug, body, jsonld: [crumbLd(trail)] }))
}

for (const lang of LANGS) {
  const u = UI[lang]
  const f = FAQ_PAGE[lang]
  const trail = [{ name: 'DriveLens', href: u.app }, { name: u.nav[3], href: `/${f.slug}/` }]
  const body = crumbs(trail) + `<h1>${esc(f.h1)}</h1><p class="lead">${esc(f.lead)}</p>` +
    faq[lang].map((x) => `<details><summary>${esc(x.q)}</summary><p>${esc(x.a)}${x.link ? ` <a href="${x.link}">${esc(u.more)}</a>` : ''}</p></details>`).join('') + cta(lang)
  const ld = [crumbLd(trail), { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: lang, mainEntity: faq[lang].map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: strip(x.a) } })) }]
  write(f.slug, layout({ lang, id: 'faq', title: `${f.title} | DriveLens`, description: f.description, path: f.slug, body, jsonld: ld }))
}

// Homepages: the app shell (dist/index.html from Vite) with prerendered landing content and per-language SEO head.
const { render } = await import(pathToFileURL(join(root, 'dist-ssr/prerender.js')).href)
const shell = readFileSync(join(dist, 'index.html'), 'utf8')
for (const lang of LANGS) {
  const h = HOME[lang]
  const u = UI[lang]
  const v = VERSIONS.home
  const self = url(HOME_PATH[lang])
  const alts = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${url(v[l])}" />`).join('\n    ') + `\n    <link rel="alternate" hreflang="x-default" href="${SITE}/" />`
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      ORG,
      { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'DriveLens', inLanguage: LANGS, publisher: { '@id': `${SITE}/#org` } },
      { '@type': 'WebApplication', '@id': `${self}#app`, name: 'DriveLens', url: self, description: h.description, inLanguage: lang, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, featureList: h.features, screenshot: `${SITE}/og.png`, publisher: { '@id': `${SITE}/#org` } },
      { '@type': 'WebPage', '@id': self, url: self, name: h.title, description: h.description, inLanguage: lang, isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${self}#app` }, primaryImageOfPage: `${SITE}/og.png` },
      { '@type': 'FAQPage', '@id': `${self}#faq`, inLanguage: lang, mainEntity: faq[lang].map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: strip(x.a) } })) },
    ],
  }
  const head = `<title>${esc(h.title)}</title>
    <meta name="description" content="${esc(h.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
    <link rel="canonical" href="${self}" />
    ${alts}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DriveLens" />
    <meta property="og:title" content="${esc(h.ogTitle)}" />
    <meta property="og:description" content="${esc(h.description)}" />
    <meta property="og:url" content="${self}" />
    <meta property="og:image" content="${SITE}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(h.ogTitle)}" />
    <meta property="og:locale" content="${u.locale}" />
    ${LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${UI[l].locale}" />`).join('\n    ')}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(h.ogTitle)}" />
    <meta name="twitter:description" content="${esc(h.description)}" />
    <script type="application/ld+json">${JSON.stringify(graph)}</script>`
  const html = shell
    .replace(/<html lang="[a-z]+"/, `<html lang="${lang}"`)
    .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, head)
    .replace('<!--app-->', render(lang))
  const out = HOME_PATH[lang] ? join(dist, HOME_PATH[lang], 'index.html') : join(dist, 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

// 404 page (Vercel serves dist/404.html with status 404)
{
  const body = `<h1>404</h1><p class="lead">Stranica ne postoji. · Page not found. · Seite nicht gefunden. · Page introuvable.</p><div class="cards">${LANGS.map((l) => `<a href="${UI[l].app}"><b>DriveLens (${l.toUpperCase()})</b><span>${esc(HOME[l].ogTitle)}</span></a>`).join('')}</div>`
  const html = layout({ lang: 'bs', id: '404', title: '404 | DriveLens', description: 'Stranica ne postoji.', path: '', body }).replace('<link rel="canonical" href="' + SITE + '/">', '<meta name="robots" content="noindex">').replace(/<meta name="robots" content="index[^"]*">/, '')
  writeFileSync(join(dist, '404.html'), html)
}

// sitemap with hreflang alternates for every page that exists in several languages
const pageAlt = (id) => { const v = VERSIONS[id]; return LANGS.filter((l) => v[l] !== undefined).map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${url(v[l])}"/>`).join('') + (v.bs !== undefined ? `<xhtml:link rel="alternate" hreflang="x-default" href="${url(v.bs)}"/>` : '') }
const prio = (id) => (id === 'home' ? '1.0' : id.startsWith('guide-') ? '0.9' : id.startsWith('hub') ? '0.6' : '0.7')
const urls = [
  ...Object.entries(VERSIONS).flatMap(([id, v]) => Object.values(v).map((slug) => `<url><loc>${url(slug)}</loc><lastmod>${today}</lastmod><priority>${prio(id)}</priority>${pageAlt(id)}</url>`)),
]
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`)
console.log(`static pages: ${PAGES.length + HUBS.length + LANGS.length}, sitemap urls: ${urls.length}`)
