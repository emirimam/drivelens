// Server-side render of the landing page, used at build time to put real, crawlable
// content into /, /en/, /de/ and /fr/. React replaces it in the browser.
import { renderToString } from 'react-dom/server'
import { Landing } from './components/Landing'
import { LANGS, makeT, type Lang } from './lib/i18n'
import { LANG_PATH } from './lib/langPath'

export function render(lang: Lang) {
  const t = makeT(lang)
  const topBar = (
    <div className="flex items-center justify-between pt-5">
      <a href={LANG_PATH[lang]} className="flex items-center gap-2.5 font-display font-extrabold text-lg">DriveLens</a>
      <nav className="flex gap-3 text-sm font-bold" aria-label="Language">
        {LANGS.map((l) => <a key={l.code} href={LANG_PATH[l.code]} hrefLang={l.code} lang={l.code}>{l.label}</a>)}
      </nav>
    </div>
  )
  return renderToString(<Landing t={t} lang={lang} error={null} onFile={() => {}} onDemo={() => {}} topBar={topBar} />)
}
