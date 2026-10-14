import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { analyze, DEFAULT_SETTINGS, monthKey, type Settings } from './lib/analyze'
import { demoCsv } from './lib/demo'
import { LANGS, makeFmt, makeT, type Lang } from './lib/i18n'
import { parseTripsCsv } from './lib/parse'
import type { ParseResult } from './lib/types'
import { Landing } from './components/Landing'
import { SettingsPanel } from './components/SettingsPanel'
import { ReportControls } from './components/ReportControls'
import { guessMarket, MARKETS, withMarket } from './lib/markets'
import { Icon } from './components/ui'
import { bucket, track } from './lib/track'

const Report = lazy(() => import('./components/Report').then((m) => ({ default: m.Report })))
const ShareDialog = lazy(() => import('./components/ShareDialog').then((m) => ({ default: m.ShareDialog })))

const LS = { settings: 'drivelens.settings', csv: 'drivelens.csv', lang: 'drivelens.lang', theme: 'drivelens.theme' }
const load = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const save = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k)
    else localStorage.setItem(k, v)
  } catch {
    /* storage unavailable */
  }
}

const isLang = (s: unknown): s is Lang => LANGS.some((l) => l.code === s)

function initialLang(): Lang {
  const q = new URLSearchParams(location.search).get('lang')
  if (isLang(q)) return q
  const s = load(LS.lang)
  if (isLang(s)) return s
  const n = navigator.language.toLowerCase()
  if (/^(bs|hr|sr|sh|me)/.test(n)) return 'bs'
  if (n.startsWith('de')) return 'de'
  if (n.startsWith('fr')) return 'fr'
  return 'en'
}

function initialSettings(): Settings {
  let stored: Partial<Settings> = {}
  try {
    stored = JSON.parse(load(LS.settings) ?? '{}')
  } catch {
    /* ignore broken storage */
  }
  const base: Settings = { ...DEFAULT_SETTINGS, ...stored, period: { ...DEFAULT_SETTINGS.period, ...(stored.period ?? {}) } }
  if (!stored.market) {
    // older saved settings with own price points keep them; otherwise pick the country from the browser
    if (stored.pricePoints?.length && stored.currency === 'KM') base.market = 'BA'
    else if (stored.pricePoints?.length) base.market = 'custom'
    else {
      const m = guessMarket(initialLang())
      return withMarket({ ...base, market: '' }, { market: m })
    }
  }
  // refresh a known market's price history (it grows with every release)
  return MARKETS[base.market] ? withMarket(base, {}) : base
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (load(LS.theme) as 'dark' | 'light') ?? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'))
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [parsed, setParsed] = useState<ParseResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const closeShare = useCallback(() => setShowShare(false), [])
  const [remember, setRemember] = useState(() => load(LS.csv) !== null)
  const [rawCsv, setRawCsv] = useState<string | null>(null)

  const t = useMemo(() => makeT(lang), [lang])
  const f = useMemo(() => makeFmt(lang), [lang])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.lang = lang
    save(LS.theme, theme)
    save(LS.lang, lang)
    const u = new URL(location.href)
    if (u.searchParams.get('lang') && u.searchParams.get('lang') !== lang) {
      u.searchParams.set('lang', lang)
      history.replaceState(null, '', u)
    }
  }, [theme, lang])
  useEffect(() => save(LS.settings, JSON.stringify(settings)), [settings])
  useEffect(() => save(LS.csv, remember && rawCsv ? rawCsv : null), [remember, rawCsv])

  const loadCsv = useCallback((text: string, source: 'file' | 'demo' | 'restore' = 'file') => {
    const format = /^\s*[[{]/.test(text.replace(/^\uFEFF/, '')) ? 'json' : 'csv'
    try {
      const p = parseTripsCsv(text)
      setParsed(p)
      if (source !== 'restore') setSettings((st) => ({ ...st, period: { from: null, to: null } }))
      setRawCsv(source === 'demo' ? null : text)
      setError(null)
      window.scrollTo({ top: 0 })
      if (source !== 'restore') track(source === 'demo' ? 'demo_opened' : 'report_created', { format, pt: p.powertrain, trips: bucket(p.trips.length, [50, 200, 500, 1000, 3000]) })
    } catch {
      setError('errParse')
      if (source === 'file') track('parse_error', { format })
    }
  }, [])

  useEffect(() => {
    const c = load(LS.csv)
    if (c) loadCsv(c, 'restore')
    else if (location.hash === '#demo') loadCsv(demoCsv(), 'demo')
  }, [loadCsv])

  const months = useMemo(() => (parsed ? [...new Set(parsed.trips.map((x) => monthKey(x.start)))].sort() : []), [parsed])
  const view = useMemo(() => {
    if (!parsed) return null
    const { from, to } = settings.period
    if (!from && !to) return parsed
    const trips = parsed.trips.filter((x) => {
      const k = monthKey(x.start)
      return (!from || k >= from) && (!to || k <= to)
    })
    return trips.length ? { ...parsed, trips } : parsed
  }, [parsed, settings.period])
  const analysis = useMemo(() => (view ? analyze(view, settings) : null), [view, settings])
  const toggleMonth = (k: string) =>
    setSettings((s) => ({ ...s, excludedMonths: s.excludedMonths.includes(k) ? s.excludedMonths.filter((x) => x !== k) : [...s.excludedMonths, k] }))

  const btn = 'grid place-items-center w-10 h-10 rounded-xl transition hover:brightness-110'
  const Brand = (
    <a href="/" className="flex items-center gap-2.5 font-display font-extrabold text-lg">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
        <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0d3a2" /><stop offset="1" stopColor="#38bdf8" /></linearGradient></defs>
        <circle cx="16" cy="16" r="13" fill="none" stroke="url(#lg)" strokeWidth="3.5" strokeDasharray="62 20" strokeLinecap="round" transform="rotate(130 16 16)" />
        <circle cx="16" cy="16" r="4" fill="url(#lg)" />
      </svg>
      DriveLens
    </a>
  )
  const controls = (dark: boolean) => {
    const st = dark ? { background: 'rgba(255,255,255,.08)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--t1)' }
    return (
      <div className="flex items-center gap-2 no-print">
        <label className="sr-only" htmlFor="lang-select">Language</label>
        <select id="lang-select" value={lang} onChange={(e) => { setLang(e.target.value as Lang); track('lang_changed', { lang: e.target.value }) }} className="h-10 rounded-xl px-2 text-sm font-bold cursor-pointer outline-none" style={{ ...st, border: dark ? '1px solid rgba(255,255,255,.12)' : '1px solid var(--line)' }}>
          {LANGS.map((l) => <option key={l.code} value={l.code} style={{ color: '#111' }}>{l.label}</option>)}
        </select>
        <button type="button" className={btn} style={st} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Theme"><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button>
      </div>
    )
  }

  if (!parsed || !analysis) {
    return (
      <Landing
        t={t}
        lang={lang}
        error={error ? t('errParse') : null}
        onFile={(txt) => loadCsv(txt)}
        onDemo={() => loadCsv(demoCsv(), 'demo')}
        topBar={<div className="flex items-center justify-between pt-5">{Brand}{controls(true)}</div>}
      />
    )
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-[600] no-print" style={{ background: 'color-mix(in oklab, var(--bg) 85%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-2">
          {Brand}
          <div className="flex items-center gap-2">
            <button type="button" className={btn} style={{ background: 'var(--card)', border: '1px solid var(--line)' }} onClick={() => { setParsed(null); setRawCsv(null) }} aria-label={t('newFile')} title={t('newFile')}><Icon name="file" /></button>
            <button type="button" className="h-10 px-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition hover:brightness-110" style={{ background: 'linear-gradient(135deg, var(--el2), var(--el))', color: '#06121c' }} onClick={() => { setShowShare(true); track('share_opened') }} aria-label={t('share')} title={t('share')}><Icon name="share" /><span className="hidden md:inline">{t('share')}</span></button>
            <button type="button" className={`${btn} hidden sm:grid`} style={{ background: 'var(--card)', border: '1px solid var(--line)' }} onClick={() => window.print()} aria-label={t('print')} title={t('print')}><Icon name="print" /></button>
            <button type="button" className={btn} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: '#15131b' }} onClick={() => setShowSettings(true)} aria-label={t('settings')} title={t('settings')}><Icon name="gear" /></button>
            {controls(false)}
          </div>
        </div>
      </header>
      <div className="grain text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <p className="text-sm" style={{ color: 'var(--gold2)' }}>{f.date(analysis.period.from)} – {f.date(analysis.period.to)}</p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold mt-1">{f.n(analysis.totals.km)} km</h1>
          <p className="text-white/70 mt-1">{f.n(analysis.totals.trips)} {t('trips')} · {f.n(analysis.totals.hours)} {t('hours')}{analysis.powertrain !== 'ice' ? ` · ${f.n(analysis.energy.elShare * 100)} % ${t('electric')}` : ''}</p>
          <ReportControls s={settings} set={setSettings} months={months} lang={lang} t={t} monthLabel={(k) => f.month(k, true)} />
          <button type="button" onClick={() => { setShowShare(true); track('share_opened', { from: 'hero' }) }} className="no-print mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition hover:brightness-110" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: '#15131b' }}><Icon name="share" /> {t('share')}</button>
        </div>
      </div>
      <Suspense fallback={<div className="h-96" />}>
        <Report a={analysis} parsed={parsed} s={settings} t={t} f={f} theme={theme} toggleMonth={toggleMonth} />
      </Suspense>
      {showShare && (
        <Suspense fallback={null}>
          <ShareDialog a={analysis} t={t} f={f} cur={settings.currency} onClose={closeShare} />
        </Suspense>
      )}
      {showSettings && (
        <SettingsPanel s={settings} set={setSettings} months={months} monthLabel={(k) => f.month(k)} t={t} onClose={() => setShowSettings(false)} remember={remember} setRemember={setRemember} />
      )}
    </div>
  )
}
