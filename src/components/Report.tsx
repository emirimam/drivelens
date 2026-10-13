import { lazy, Suspense, useMemo } from 'react'
import type { Analysis, Settings } from '../lib/analyze'
import type { ParseResult } from '../lib/types'
import type { Key } from '../lib/i18n'
import type { makeFmt } from '../lib/i18n'
import { costOption, donutOption, gaugeOption, heatOption, histOption, monthlyOption, odoOption, priceOption, readPalette, weekdayOption } from '../lib/charts'
import { Chart } from './Chart'
import { Card, Fact, Icon, Section, Stat } from './ui'

const MapView = lazy(() => import('./MapView'))

interface Props {
  a: Analysis
  parsed: ParseResult
  s: Settings
  t: (k: Key, v?: Record<string, string | number>) => string
  f: ReturnType<typeof makeFmt>
  theme: string
  toggleMonth: (key: string) => void
}

export function Report({ a, parsed, s, t, f, theme, toggleMonth }: Props) {
  // palette depends on theme; recompute chart options when either changes
  const p = useMemo(() => readPalette(), [theme])
  const cur = s.currency
  const n = f.n
  const hasEl = a.powertrain !== 'ice'
  const phev = a.powertrain === 'phev'
  const E = a.energy
  const labels = a.months.map((m) => f.month(m.key))

  const charts = useMemo(() => {
    // only show price points around the data period
    const lo = new Date(a.period.from.getFullYear(), a.period.from.getMonth() - 1, 1).toISOString().slice(0, 10)
    const hi = new Date(a.period.to.getFullYear(), a.period.to.getMonth() + 2, 1).toISOString().slice(0, 10)
    const pricePts = s.pricePoints.filter((x) => x.date >= lo && x.date <= hi)
    const odo: [number, number][] = []
    const logged: [number, number][] = []
    const trips = parsed.trips
    const odo0 = trips.find((x) => x.odometer !== null)
    if (odo0?.odometer != null) {
      const base = odo0.odometer - odo0.km
      let cum = 0
      trips.forEach((x) => {
        cum += x.km
        if (x.odometer !== null) odo.push([x.start.getTime(), x.odometer - base])
        logged.push([x.start.getTime(), cum])
      })
    }
    return {
      gEl: gaugeOption(p, { value: E.elShare * 100, max: 100, unit: '%', colors: [p.el2, p.el] }, n),
      gL: gaugeOption(p, { value: E.tripL100 || E.fuelL100, max: 14, unit: t('gL100Hint'), decimals: 1, colors: [p.save, p.fuel] }, n),
      gSpeed: gaugeOption(p, { value: a.totals.avgSpeed, max: 120, unit: 'km/h', colors: [p.dist, p.el2] }, n),
      gCost: gaugeOption(p, { value: E.costPer100Mix, max: Math.max(25, Math.ceil((E.allFuelCost / Math.max(1, a.totals.km)) * 100 / 5) * 5 + 5), unit: cur, decimals: 1, colors: [p.gold2, p.gold], marker: phev ? (E.allFuelCost / Math.max(1, a.totals.km)) * 100 : undefined }, n),
      monthly: monthlyOption(p, a, labels, { el: t('electric'), fuel: t('fuel'), gap: t('gap'), excluded: t('excluded') }, (v) => n(v)),
      cost: costOption(p, a, labels, cur, (v) => n(v)),
      price: pricePts.length > 1 ? priceOption(p, pricePts, cur, n, (d) => f.month(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)) : null,
      donut: donutOption(p, E.elKm, a.totals.km - E.elKm, { el: t('electric'), fuel: t('fuel') }, `${n(E.elShare * 100)}%`, t('electric'), (v) => n(v)),
      heat: heatOption(p, a.heat, f.weekdays, t('trips')),
      hist: histOption(p, a.histogram, t('trips')),
      week: weekdayOption(p, a.weekdayKm, f.weekdays, (v) => n(v)),
      odo: odo.length ? odoOption(p, { odo, logged }, { odo: t('odo'), logged: t('logged') }, (v) => n(v), (d) => f.month(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)) : null,
    }
  }, [a, p, s, t, f, parsed, cur, n, E, labels, phev])

  const R = a.records
  const nav: [string, Key][] = [['overview', 'sOverview'], ['money', 'sMoney'], ...(hasEl ? [['energy', 'sEnergy'] as [string, Key]] : []), ['habits', 'sTime'], ['places', 'sMap'], ['records', 'sRecords'], ['gaps', 'sGaps']]
  const ptLabel = t(a.powertrain)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      <nav className="sticky top-[60px] z-[500] -mx-4 px-4 sm:mx-0 sm:px-0 py-3 flex gap-2 overflow-x-auto no-scrollbar no-print" style={{ background: 'color-mix(in oklab, var(--bg) 88%, transparent)', backdropFilter: 'blur(10px)' }}>
        {nav.map(([id, k]) => (
          <a key={id} href={`#${id}`} className="chip px-4 py-1.5 text-sm font-semibold whitespace-nowrap hover:brightness-95">{t(k)}</a>
        ))}
      </nav>

      {(a.excluded.length > 0 || a.fixedDates > 0) && (
        <div className="mt-3 space-y-2">
          {a.excluded.length > 0 && (
            <div className="rounded-2xl px-4 py-3 text-sm flex flex-wrap items-center gap-2" style={{ background: 'color-mix(in oklab, var(--warn) 14%, var(--card))', border: '1px solid color-mix(in oklab, var(--warn) 40%, var(--line))' }}>
              <b style={{ color: 'var(--warn)' }}>{t('excludedNote', { m: '' })}</b>
              {a.excluded.map((e) => (
                <button key={e.key} type="button" onClick={() => toggleMonth(e.key)} className="chip px-2.5 py-0.5 text-xs font-semibold no-print">{f.month(e.key, true)} · {n(e.km)} km ✕</button>
              ))}
            </div>
          )}
          {a.fixedDates > 0 && <div className="rounded-2xl px-4 py-3 text-sm card" style={{ color: 'var(--t2)' }}>{t('clockFixed', { n: a.fixedDates })}</div>}
        </div>
      )}

      {/* ---------- OVERVIEW ---------- */}
      <Section id="overview" title={t('sOverview')} accent="gold" right={<span className="chip px-3 py-1 text-xs font-bold" style={{ color: phev ? 'var(--el)' : 'var(--t2)' }}>{ptLabel}</span>}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat value={`${n(a.totals.km)} km`} label={`${n(a.totals.trips)} ${t('trips')}`} tone="dist" />
          <Stat value={`${n(a.totals.hours)} h`} label={t('hours')} tone="dist" />
          <Stat value={`${n(a.gaps.perMonthKm, 0)} km`} label={t('perMonth')} tone="gold" />
          <Stat value={`${n(a.totals.drivingDays)}`} label={t('drivingDays')} tone="gold" sub={`${f.date(a.period.from)} – ${f.date(a.period.to)}`} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {[
            hasEl && { o: charts.gEl, label: t('gElShare') },
            a.powertrain !== 'ev' && { o: charts.gL, label: t('gL100') },
            { o: charts.gSpeed, label: t('gSpeed') },
            { o: charts.gCost, label: `${t('gCost')}` },
          ].filter(Boolean).map((g) => {
            const x = g as { o: typeof charts.gEl; label: string }
            return (
              <div key={x.label} className="card pt-3 pb-2 px-2 text-center">
                <Chart option={x.o} height={200} label={x.label} />
                <div className="text-[13px] font-semibold -mt-4 pb-1" style={{ color: 'var(--t2)' }}>{x.label}</div>
              </div>
            )
          })}
        </div>
        <Card className="mt-3" title={t('monthly')} hint={t('monthlyHint')}>
          <Chart option={charts.monthly} height={300} label={t('monthly')} onClick={(e) => toggleMonth(a.months[e.dataIndex].key)} />
        </Card>
      </Section>

      {/* ---------- MONEY ---------- */}
      <Section id="money" title={t('sMoney')} accent="save">
        {phev && E.saved > 0 && (
          <div className="rounded-3xl p-5 sm:p-7 mb-3 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, color-mix(in oklab, var(--save) 20%, var(--card)), var(--card))', border: '1px solid color-mix(in oklab, var(--save) 45%, var(--line))' }}>
            <div className="font-display tnum text-4xl sm:text-6xl font-extrabold" style={{ color: 'var(--save)' }}>~{n(E.saved, 0)} {cur}</div>
            <div className="mt-1 font-semibold">{t('saved')}</div>
            <div className="text-sm" style={{ color: 'var(--t2)' }}>{t('savedSub', { km: n(E.elKm), l: n(E.savedLitres) })}</div>
            <div className="mt-5 space-y-2.5 max-w-2xl">
              {[
                { label: t('allFuel'), v: E.allFuelCost, w: 100, bg: 'var(--bad)' },
                { label: t('yourMix'), v: E.fuelCost + E.elCost, w: ((E.fuelCost + E.elCost) / Math.max(1, E.allFuelCost)) * 100, bg: `linear-gradient(90deg, var(--fuel) ${(E.fuelCost / Math.max(1, E.fuelCost + E.elCost)) * 100}%, var(--el) 0)` },
              ].map((r) => (
                <div key={r.label} className="grid grid-cols-[84px_1fr_auto] sm:grid-cols-[110px_1fr_auto] items-center gap-3 text-sm">
                  <span style={{ color: 'var(--t2)' }}>{r.label}</span>
                  <span className="h-3.5 rounded-full block" style={{ width: `${Math.max(3, r.w)}%`, background: r.bg }} />
                  <b className="tnum whitespace-nowrap">{n(r.v)} {cur}</b>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat value={`${n(E.fuelCost)} ${cur}`} label={t('fuelCost')} tone="fuel" />
          <Stat value={`${n(E.litres)} l`} label={t('litres')} tone="fuel" sub={`${t('avgPrice')} ${n(E.avgPricePaid, 2)} ${cur}/l`} />
          {hasEl && <Stat value={`~${n(E.elCost)} ${cur}`} label={t('elCost')} tone="el" sub={`~${n(E.kwh)} kWh`} />}
          {a.powertrain !== 'ev' && <Stat value={`${n(E.costPer100Fuel, 1)} ${cur}`} label={t('per100Fuel')} tone="fuel" />}
          {hasEl && <Stat value={`${n(E.costPer100El, 1)} ${cur}`} label={t('per100El')} tone="el" />}
          <Stat value={`${n(E.co2Kg)}`} label={t('co2')} tone="plain" />
        </div>
        <div className="grid lg:grid-cols-2 gap-3 mt-3">
          <Card title={t('monthlyCost')}><Chart option={charts.cost} height={260} label={t('monthlyCost')} /></Card>
          {charts.price && <Card title={t('priceChart')} hint={`${cur}/l`}><Chart option={charts.price} height={260} label={t('priceChart')} /></Card>}
        </div>
      </Section>

      {/* ---------- ENERGY ---------- */}
      {hasEl && (
        <Section id="energy" title={t('sEnergy')} accent="el">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-3">
            <Card title={t('energySplit')}><Chart option={charts.donut} height={260} label={t('energySplit')} /></Card>
            <div className="grid grid-cols-2 gap-3 content-start">
              <Stat value={`${n(E.pureElKm)} km`} label={t('pureEl')} tone="el" />
              <Stat value={`${n(E.elOnlyDays)}`} label={t('elDays')} tone="el" sub={`${n((E.elOnlyDays / Math.max(1, a.totals.drivingDays)) * 100)} %`} />
              {phev && <Stat value={`${n(R.evStreakKm)} km`} label={t('evStreak')} tone="el" />}
              {R.maxEvDay && <Stat value={`${n(R.maxEvDay.km)} km`} label={t('maxEvDay')} tone="el" sub={f.date(R.maxEvDay.date)} />}
              {R.greenestMonth && <Stat value={`${n((R.greenestMonth.elKm / R.greenestMonth.km) * 100)} %`} label={t('greenest')} tone="save" sub={f.month(R.greenestMonth.key, true)} />}
              {phev && <Stat value={`${n(E.engineL100, 1)} l/100`} label={t('engineL100')} tone="fuel" />}
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--t3)' }}>{t('howElectric')}</p>
        </Section>
      )}

      {/* ---------- HABITS ---------- */}
      <Section id="habits" title={t('sTime')} accent="warn">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <Stat value={`${n(a.totals.medianKm)} km`} label={t('medianTrip')} tone="dist" sub={`${n(a.totals.medianMin)} min`} />
          <Stat value={`${n(a.totals.avgSpeed)} km/h`} label={t('avgSpeed')} tone="dist" />
          <Stat value={`${n(R.longestStreakDays)}`} label={t('rStreak')} tone="gold" sub={t('days')} />
          <Stat value={`${n(a.gaps.perYearKm, -2)}`} label={t('perYear')} tone="gold" />
        </div>
        <Card title={t('heat')} hint={t('heatHint')}><Chart option={charts.heat} height={250} label={t('heat')} /></Card>
        <div className="grid lg:grid-cols-2 gap-3 mt-3">
          <Card title={t('weekday')}><Chart option={charts.week} height={300} label={t('weekday')} /></Card>
          <Card title={t('hist')}><Chart option={charts.hist} height={300} label={t('hist')} /></Card>
        </div>
      </Section>

      {/* ---------- PLACES ---------- */}
      <Section id="places" title={t('sMap')} accent="dist">
        <Card title={t('mapTitle')}>
          <div className="mt-2 rounded-2xl overflow-hidden isolate">
            <Suspense fallback={<div style={{ height: 380 }} />}>
              <MapView places={a.places} routes={a.routes} labels={{ home: t('home'), work: t('work'), visits: t('visits') }} />
            </Suspense>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {a.places.slice(0, 8).map((pl) => (
              <span key={pl.id} className="chip px-3 py-1 text-xs font-semibold inline-flex items-center gap-1.5" style={{ color: pl.role === 'home' ? 'var(--save)' : pl.role === 'work' ? 'var(--el)' : 'var(--t2)' }}>
                {pl.role && <Icon name={pl.role} size={13} />}
                {pl.role === 'home' ? t('home') : pl.role === 'work' ? t('work') : `#${pl.id + 1}`} · {pl.visits}
              </span>
            ))}
          </div>
        </Card>
      </Section>

      {/* ---------- RECORDS ---------- */}
      <Section id="records" title={t('sRecords')} accent="dist">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {R.maxDay && <Fact tone="dist" kicker={t('rMaxDay')} value={`${n(R.maxDay.km)} km`} sub={f.date(R.maxDay.date)} />}
          {R.longest && <Fact tone="dist" kicker={t('rLongest')} value={`${n(R.longest.km)} km · ${Math.floor(R.longest.duration / 60)} h ${R.longest.duration % 60} min`} sub={f.date(R.longest.start)} />}
          {R.fastest && <Fact tone="dist" kicker={t('rFastest')} value={`${n(R.fastest.speed)} km/h`} sub={`${n(R.fastest.trip.km)} km · ${f.date(R.fastest.trip.start)}`} />}
          {R.mostTrips && <Fact tone="dist" kicker={t('rMostTrips')} value={`${R.mostTrips.count}`} sub={f.date(R.mostTrips.date)} />}
          {R.earliest && <Fact tone="dist" kicker={t('rEarliest')} value={f.time(R.earliest.start)} sub={`${f.date(R.earliest.start)} · ${n(R.earliest.km)} km`} />}
          <Fact tone="dist" kicker={t('rStreak')} value={`${R.longestStreakDays} ${t('days')}`} />
        </div>
      </Section>

      {/* ---------- GAPS ---------- */}
      <Section id="gaps" title={t('sGaps')} accent="bad">
        {a.gaps.list.length === 0 ? (
          <Card><p style={{ color: 'var(--t2)' }}>{t('noGaps')}</p></Card>
        ) : (
          <>
            <Card>
              <p className="text-sm" style={{ color: 'var(--t2)' }}>{t('gapsText', { odo: n(a.gaps.odometerKm), log: n(a.totals.km), gap: n(a.gaps.odometerKm - a.totals.km) })}</p>
              <div className="mt-3 divide-y" style={{ borderColor: 'var(--line)' }}>
                {a.gaps.list.slice(0, 6).map((g, i) => (
                  <div key={i} className="py-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 items-center" style={{ borderColor: 'var(--line)' }}>
                    <div className="font-semibold text-sm">{f.date(g.from)} – {f.date(g.to)}</div>
                    <div className="font-display font-extrabold tnum" style={{ color: 'var(--bad)' }}>{n(g.km)} km</div>
                    <div className="col-span-2 h-2 rounded-full" style={{ background: 'var(--card2)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${(g.km / a.gaps.list[0].km) * 100}%`, background: 'linear-gradient(90deg, var(--bad), var(--fuel))' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <Stat tone="el" value={`${n(a.gaps.estLo.litres)} l · ${n(a.gaps.estLo.cost)} ${cur}`} label={`${t('gapEst')}: ${t('gapLo')}`} />
              <Stat tone="fuel" value={`${n(a.gaps.estHi.litres)} l · ${n(a.gaps.estHi.cost)} ${cur}`} label={`${t('gapEst')}: ${t('gapHi')}`} />
            </div>
          </>
        )}
        {charts.odo && <Card className="mt-3" title={t('odoChart')}><Chart option={charts.odo} height={260} label={t('odoChart')} /></Card>}
      </Section>

      <p className="text-xs text-center mt-12" style={{ color: 'var(--t3)' }}>{t('approx')} {t('disclaimer')}</p>
    </div>
  )
}
