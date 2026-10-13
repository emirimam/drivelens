import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { analyze, DEFAULT_SETTINGS, monthKey, type Settings } from './lib/analyze'
import { demoCsv } from './lib/demo'
import { makeFmt, makeT, type Lang } from './lib/i18n'
import { parseTripsCsv } from './lib/parse'
import type { ParseResult } from './lib/types'
import { Landing } from './components/Landing'
import { SettingsPanel } from './components/SettingsPanel'
import { Icon } from './components/ui'

const Report = lazy(() => import('./components/Report').then((m) => ({ default: m.Report })))

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

function initialLang(): Lang {
  const s = load(LS.lang)
  if (s === 'bs' || s === 'en') return s
  return /^(bs|hr|sr|sh|me)/i.test(navigator.language) ? 'bs' : 'en'
}

function initialSettings(): Settings {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(load(LS.settings) ?? '{}') }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (load(LS.theme) as 'dark' | 'light') ?? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'))
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [parsed, setParsed] = useState<ParseResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [remember, setRemember] = useState(() => load(LS.csv) !== null)
  const [rawCsv, setRawCsv] = useState<string | null>(null)

  const t = useMemo(() => makeT(lang), [lang])
  const f = useMemo(() => makeFmt(lang), [lang])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.lang = lang
    save(LS.theme, theme)
    save(LS.lang, lang)
  }, [theme, lang])
  useEffect(() => save(LS.settings, JSON.stringify(settings)), [settings])
  useEffect(() => save(LS.csv, remember && rawCsv ? rawCsv : null), [remember, rawCsv])

  const loadCsv = useCallback((text: string) => {
    try {
      const p = parseTripsCsv(text)
      setParsed(p)
      setRawCsv(text)
      setError(null)
      window.scrollTo({ top: 0 })
    } catch {
      setError('errParse')
    }
  }, [])

  useEffect(() => {
    const c = load(LS.csv)
    if (c) loadCsv(c)
    else if (location.hash === '#demo') loadCsv(demoCsv())
  }, [loadCsv])

  const analysis = useMemo(() => (parsed ? analyze(parsed, settings) : null), [parsed, settings])
  const months = useMemo(() => (parsed ? [...new Set(parsed.trips.map((x) => monthKey(x.start)))].sort() : []), [parsed])
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
        <button type="button" className={`${btn} text-sm font-bold`} style={st} onClick={() => setLang(lang === 'bs' ? 'en' : 'bs')} aria-label="Language">{lang === 'bs' ? 'EN' : 'BS'}</button>
        <button type="button" className={btn} style={st} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Theme"><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button>
      </div>
    )
  }

  if (!parsed || !analysis) {
    return (
      <Landing
        t={t}
        error={error ? t('errParse') : null}
        onFile={(txt) => loadCsv(txt)}
        onDemo={() => loadCsv(demoCsv())}
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
        </div>
      </div>
      <Suspense fallback={<div className="h-96" />}>
        <Report a={analysis} parsed={parsed} s={settings} t={t} f={f} theme={theme} toggleMonth={toggleMonth} />
      </Suspense>
      {showSettings && (
        <SettingsPanel s={settings} set={setSettings} months={months} monthLabel={(k) => f.month(k)} t={t} onClose={() => setShowSettings(false)} remember={remember} setRemember={setRemember} />
      )}
    </div>
  )
}
