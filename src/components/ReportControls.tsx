import { useMemo } from 'react'
import type { Settings } from '../lib/analyze'
import type { Key, Lang } from '../lib/i18n'
import { MARKET_CODES, withMarket } from '../lib/markets'
import { track } from '../lib/track'

interface Props {
  s: Settings
  set: (s: Settings) => void
  months: string[]
  lang: Lang
  t: (k: Key, v?: Record<string, string | number>) => string
  monthLabel: (k: string) => string
}

const LOCALE: Record<Lang, string[]> = { bs: ['bs', 'hr', 'sr-Latn'], en: ['en'], de: ['de'], fr: ['fr'] }

function shiftMonth(key: string, delta: number) {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function regionName(code: string, lang: Lang) {
  if (code === 'BA') return lang === 'bs' ? 'BiH (prosjek FBiH)' : `${safeRegion('BA', lang)} (FBiH)`
  return safeRegion(code, lang)
}

function safeRegion(code: string, lang: Lang) {
  try {
    return new Intl.DisplayNames(LOCALE[lang], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

export function ReportControls({ s, set, months, lang, t, monthLabel }: Props) {
  const first = months[0]
  const last = months[months.length - 1]
  const years = useMemo(() => [...new Set(months.map((m) => m.slice(0, 4)))], [months])

  const presets = useMemo(() => {
    const list: { id: string; label: string; from: string | null; to: string | null }[] = [{ id: 'all', label: t('pAll'), from: null, to: null }]
    if (last && months.length > 12) list.push({ id: 'last12', label: t('pLast12'), from: shiftMonth(last, -11), to: null })
    for (const y of [...years].reverse()) list.push({ id: `y${y}`, label: y, from: `${y}-01`, to: `${y}-12` })
    return list
  }, [months, years, last, t])

  const cur = presets.find((p) => p.from === s.period.from && p.to === s.period.to)
  const periodId = cur ? cur.id : 'custom'

  const upd = (patch: Partial<Settings>, ev?: string) => {
    set(withMarket(s, patch))
    if (ev) track(ev, Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : String(v)])))
  }

  const sel = 'w-full h-11 rounded-xl px-3 text-[15px] font-semibold outline-none cursor-pointer focus-visible:ring-2'
  const selStyle = { background: 'rgba(255,255,255,.09)', border: '1px solid rgba(255,255,255,.16)', color: '#fff' }
  const lab = 'block text-[11px] font-bold uppercase tracking-wider mb-1 text-white/55'
  const opt = { color: '#111' }

  return (
    <div className="no-print mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl" aria-label={t('rcTitle')}>
      <label className="block col-span-2 lg:col-span-1">
        <span className={lab}>{t('period')}</span>
        <select
          className={sel}
          style={selStyle}
          value={periodId}
          onChange={(e) => {
            const p = presets.find((x) => x.id === e.target.value)
            if (p) upd({ period: { from: p.from, to: p.to } }, 'period_changed')
            else upd({ period: { from: s.period.from ?? first, to: s.period.to ?? last } })
          }}
        >
          {presets.map((p) => <option key={p.id} value={p.id} style={opt}>{p.label}</option>)}
          <option value="custom" style={opt}>{t('pCustom')}</option>
        </select>
      </label>

      <label className="block">
        <span className={lab}>{t('rcMarket')}</span>
        <select className={sel} style={selStyle} value={s.market} onChange={(e) => upd({ market: e.target.value }, 'market_changed')}>
          {MARKET_CODES.map((c) => <option key={c} value={c} style={opt}>{regionName(c, lang)}</option>)}
          <option value="custom" style={opt}>{t('rcCustomPrices')}</option>
        </select>
      </label>

      <label className="block">
        <span className={lab}>{t('fuelType')}</span>
        <select className={sel} style={selStyle} value={s.fuelType} onChange={(e) => upd({ fuelType: e.target.value as Settings['fuelType'] })}>
          <option value="petrol" style={opt}>{t('petrol')}</option>
          <option value="diesel" style={opt}>{t('diesel')}</option>
        </select>
      </label>

      <label className="block col-span-2 lg:col-span-1">
        <span className={lab}>{t('currency')}</span>
        <select className={sel} style={selStyle} value={s.currency === 'KM' || s.currency === 'EUR' ? s.currency : 'other'} onChange={(e) => e.target.value !== 'other' && upd({ currency: e.target.value }, 'currency_changed')}>
          <option value="KM" style={opt}>KM (BAM)</option>
          <option value="EUR" style={opt}>EUR (€)</option>
          {s.currency !== 'KM' && s.currency !== 'EUR' && <option value="other" style={opt}>{s.currency}</option>}
        </select>
      </label>

      {periodId === 'custom' && (
        <div className="col-span-2 lg:col-span-4 grid grid-cols-2 gap-3 max-w-md">
          {(['from', 'to'] as const).map((k) => (
            <label key={k} className="block">
              <span className={lab}>{t(k === 'from' ? 'pFrom' : 'pTo')}</span>
              <select
                className={sel}
                style={selStyle}
                value={s.period[k] ?? (k === 'from' ? first : last)}
                onChange={(e) => {
                  const v = e.target.value
                  const from = k === 'from' ? v : s.period.from ?? first
                  const to = k === 'to' ? v : s.period.to ?? last
                  upd({ period: from <= to ? { from, to } : { from: to, to: from } }, 'period_changed')
                }}
              >
                {months.map((m) => <option key={m} value={m} style={opt}>{monthLabel(m)}</option>)}
              </select>
            </label>
          ))}
        </div>
      )}

      <p className="col-span-2 lg:col-span-4 text-xs text-white/50">
        {s.market === 'custom' ? t('rcSourceCustom') : t(s.market === 'BA' ? 'rcSourceBa' : 'rcSourceEu')}
      </p>
    </div>
  )
}
