import type { Settings } from '../lib/analyze'
import { withMarket } from '../lib/markets'
import type { Key } from '../lib/i18n'
import { Icon } from './ui'

interface Props {
  s: Settings
  set: (s: Settings) => void
  months: string[]
  monthLabel: (k: string) => string
  t: (k: Key) => string
  onClose: () => void
  remember: boolean
  setRemember: (v: boolean) => void
}

const inputCls = 'w-full rounded-xl px-3 py-2.5 text-[15px] outline-none focus:ring-2'
const inputStyle = { background: 'var(--card2)', border: '1px solid var(--line)', color: 'var(--t1)' }

function Num({ label, value, onChange, step = 0.01 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium" style={{ color: 'var(--t2)' }}>{label}</span>
      <input type="number" inputMode="decimal" step={step} min={0} value={Number.isFinite(value) ? value : ''} onChange={(e) => onChange(Number(e.target.value))} className={inputCls} style={inputStyle} />
    </label>
  )
}

export function SettingsPanel({ s, set, months, monthLabel, t, onClose, remember, setRemember }: Props) {
  const upd = (p: Partial<Settings>) => set(withMarket(s, p))
  const own = (p: Partial<Settings>) => set(withMarket(s, { ...p, market: 'custom' }))
  return (
    <div className="fixed inset-0 z-[1000] no-print" role="dialog" aria-modal="true" aria-label={t('settings')}>
      <button type="button" aria-label={t('close')} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md overflow-y-auto p-5 sm:p-6 fade-in" style={{ background: 'var(--bg)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold">{t('settings')}</h2>
          <button type="button" onClick={onClose} className="chip p-2" aria-label={t('close')}><Icon name="x" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[13px] font-medium" style={{ color: 'var(--t2)' }}>{t('currency')}</span>
            <input value={s.currency} maxLength={4} onChange={(e) => upd({ currency: e.target.value })} className={inputCls} style={inputStyle} />
          </label>
          <label className="block">
            <span className="text-[13px] font-medium" style={{ color: 'var(--t2)' }}>{t('fuelType')}</span>
            <select value={s.fuelType} onChange={(e) => upd({ fuelType: e.target.value as Settings['fuelType'] })} className={inputCls} style={inputStyle}>
              <option value="petrol">{t('petrol')}</option>
              <option value="diesel">{t('diesel')}</option>
            </select>
          </label>
          <Num label={t('fuelPrice')} value={s.fuelPrice} onChange={(v) => own({ fuelPrice: v })} />
          <Num label={t('elPrice')} value={s.electricityPrice} onChange={(v) => upd({ electricityPrice: v })} />
          <Num label={t('kwh100')} value={s.kwhPer100} step={0.5} onChange={(v) => upd({ kwhPer100: v })} />
        </div>

        <div className="card p-4 mt-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-semibold">{t('priceHistory')}</h3>
            {s.pricePoints.length > 0 && <button type="button" className="text-sm" style={{ color: 'var(--bad)' }} onClick={() => own({ pricePoints: [] })}>{t('clear')}</button>}
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--t3)' }}>{s.market === 'custom' ? t('rcSourceCustom') : t('pricesFromMarket')}</p>
          <div className="space-y-2">
            {s.pricePoints.map((p, i) => (
              <div key={i} className="grid grid-cols-[1fr_96px_36px] gap-2">
                <input type="date" value={p.date} onChange={(e) => own({ pricePoints: s.pricePoints.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)) })} className={inputCls} style={inputStyle} />
                <input type="number" step={0.01} value={p.price} onChange={(e) => own({ pricePoints: s.pricePoints.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)) })} className={inputCls} style={inputStyle} />
                <button type="button" aria-label="x" className="rounded-xl grid place-items-center" style={{ color: 'var(--t3)' }} onClick={() => own({ pricePoints: s.pricePoints.filter((_, j) => j !== i) })}><Icon name="x" size={16} /></button>
              </div>
            ))}
          </div>
          <button type="button" className="mt-3 text-sm font-semibold" style={{ color: 'var(--gold)' }} onClick={() => own({ pricePoints: [...s.pricePoints, { date: new Date().toISOString().slice(0, 10), price: s.fuelPrice }] })}>
            + {t('addPoint')}
          </button>
        </div>

        <div className="card p-4 mt-4">
          <h3 className="font-semibold mb-2">{t('excludeMonths')}</h3>
          <div className="flex flex-wrap gap-2">
            {months.map((m) => {
              const on = s.excludedMonths.includes(m)
              return (
                <button key={m} type="button" aria-pressed={on} onClick={() => upd({ excludedMonths: on ? s.excludedMonths.filter((x) => x !== m) : [...s.excludedMonths, m] })}
                  className="rounded-full px-3 py-1.5 text-sm font-medium transition"
                  style={on ? { background: 'var(--bad)', color: '#fff' } : { background: 'var(--card2)', color: 'var(--t2)', border: '1px solid var(--line)' }}>
                  {monthLabel(m)}
                </button>
              )
            })}
          </div>
        </div>

        <label className="flex items-center gap-3 mt-5 text-sm">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-5 h-5 accent-[var(--gold)]" />
          {t('remember')}
        </label>
        <p className="text-xs mt-6" style={{ color: 'var(--t3)' }}>{t('approx')} {t('disclaimer')}</p>
      </aside>
    </div>
  )
}
