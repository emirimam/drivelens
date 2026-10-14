import type { LatLon, ParseResult, Trip } from './types'

export interface PricePoint {
  date: string // YYYY-MM-DD
  price: number
}

export interface Settings {
  currency: string
  fuelType: 'petrol' | 'diesel'
  fuelPrice: number
  pricePoints: PricePoint[]
  electricityPrice: number
  kwhPer100: number
  excludedMonths: string[]
  /** Country whose fuel price history is used ('custom' = user-entered prices). */
  market: string
  /** Report period as inclusive month keys (YYYY-MM); null = open end. */
  period: { from: string | null; to: string | null }
}

export const DEFAULT_SETTINGS: Settings = {
  currency: 'KM',
  fuelType: 'petrol',
  fuelPrice: 2.8,
  pricePoints: [],
  electricityPrice: 0.27,
  kwhPer100: 23,
  excludedMonths: [],
  market: 'BA',
  period: { from: null, to: null },
}

/** Average retail price of 95-octane petrol in the Federation of BiH (FMT reports / press). */
export const PRESET_BIH_PETROL: PricePoint[] = [
  { date: '2025-01-15', price: 2.44 },
  { date: '2025-05-15', price: 2.31 },
  { date: '2025-07-07', price: 2.37 },
  { date: '2025-10-15', price: 2.35 },
  { date: '2025-12-15', price: 2.37 },
  { date: '2026-01-15', price: 2.32 },
  { date: '2026-02-09', price: 2.31 },
  { date: '2026-02-28', price: 2.32 },
  { date: '2026-03-20', price: 2.73 },
  { date: '2026-04-13', price: 2.89 },
  { date: '2026-04-29', price: 2.94 },
  { date: '2026-05-11', price: 2.95 },
  { date: '2026-08-22', price: 3.01 },
  { date: '2026-09-01', price: 3.06 },
  { date: '2026-09-10', price: 3.16 },
  { date: '2026-09-22', price: 3.31 },
]

export const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
const dayKey = (d: Date) => `${monthKey(d)}-${String(d.getDate()).padStart(2, '0')}`

export function priceAt(s: Settings, d: Date): number {
  const pts = [...s.pricePoints].filter((p) => p.price > 0).sort((a, b) => a.date.localeCompare(b.date))
  if (!pts.length) return s.fuelPrice
  const t = d.getTime()
  const ts = pts.map((p) => new Date(p.date + 'T12:00:00').getTime())
  if (t <= ts[0]) return pts[0].price
  if (t >= ts[ts.length - 1]) return pts[pts.length - 1].price
  for (let i = 1; i < ts.length; i++) {
    if (t <= ts[i]) {
      const f = (t - ts[i - 1]) / (ts[i] - ts[i - 1])
      return pts[i - 1].price + f * (pts[i].price - pts[i - 1].price)
    }
  }
  return s.fuelPrice
}

const median = (a: number[]) => {
  if (!a.length) return 0
  const s = [...a].sort((x, y) => x - y)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function haversine(a: LatLon, b: LatLon) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

export interface MonthStat {
  key: string
  km: number
  elKm: number
  fuelKm: number
  litres: number
  fuelCost: number
  elCost: number
  trips: number
  gapKm: number
  avgPrice: number
  excluded: boolean
}

export interface Place {
  id: number
  lat: number
  lon: number
  visits: number
  role: 'home' | 'work' | null
}

export interface Gap {
  from: Date
  to: Date
  km: number
  fromPos: LatLon | null
  toPos: LatLon | null
}

export interface Analysis {
  powertrain: ParseResult['powertrain']
  period: { from: Date; to: Date; days: number; months: number }
  totals: { trips: number; km: number; hours: number; avgSpeed: number; drivingDays: number; medianKm: number; medianMin: number }
  energy: {
    litres: number
    fuelCost: number
    avgPricePaid: number
    elKm: number
    pureElKm: number
    elShare: number
    kwh: number
    elCost: number
    saved: number
    savedLitres: number
    allFuelCost: number
    engineL100: number
    fuelL100: number
    tripL100: number
    costPer100Fuel: number
    costPer100El: number
    costPer100Mix: number
    co2Kg: number
    elOnlyDays: number
  }
  months: MonthStat[]
  heat: number[][] // [weekday 0=Mon][hour]
  hours: number[]
  weekdayKm: number[]
  histogram: { label: string; count: number }[]
  records: {
    maxDay: { date: Date; km: number } | null
    longest: Trip | null
    fastest: { trip: Trip; speed: number } | null
    mostTrips: { date: Date; count: number } | null
    earliest: Trip | null
    evStreakKm: number
    maxEvDay: { date: Date; km: number } | null
    greenestMonth: MonthStat | null
    longestStreakDays: number
  }
  gaps: { list: Gap[]; totalKm: number; odometerKm: number; estLo: { litres: number; cost: number }; estHi: { litres: number; cost: number }; perMonthKm: number; perYearKm: number }
  places: Place[]
  routes: { from: LatLon; to: LatLon; km: number }[]
  excluded: { key: string; km: number; litres: number; fuelCost: number; trips: number }[]
  fixedDates: number
}

const HIST: [number, string][] = [[2, '≤2'], [5, '3–5'], [10, '6–10'], [20, '11–20'], [50, '21–50'], [100, '51–100'], [Infinity, '100+']]
const CO2 = { petrol: 2.31, diesel: 2.68 }

export function analyze(parsed: ParseResult, s: Settings): Analysis {
  const all = parsed.trips
  const isExcluded = (t: Trip) => s.excludedMonths.includes(monthKey(t.start))
  const trips = all.filter((t) => !isExcluded(t))
  const pt = parsed.powertrain

  // ---- engine baseline: l/100 km on long trips (battery is a small share of those) ----
  const longFuel = trips.filter((t) => t.km >= 150 && t.litres && t.litres > 0)
  const longFuelAlt = trips.filter((t) => t.km >= 60 && t.litres && t.litres > 0)
  const base = (arr: Trip[]) => (arr.reduce((a, t) => a + (t.litres ?? 0), 0) / arr.reduce((a, t) => a + t.km, 0)) * 100
  let engineL100 = longFuel.length >= 2 ? base(longFuel) : longFuelAlt.length >= 2 ? base(longFuelAlt) : 6.5
  if (!Number.isFinite(engineL100) || engineL100 <= 0) engineL100 = 6.5

  // average litres/km for ICE trips with missing consumption
  const known = trips.filter((t) => t.litres !== null)
  const avgLkm = known.length ? known.reduce((a, t) => a + (t.litres ?? 0), 0) / Math.max(1, known.reduce((a, t) => a + t.km, 0)) : engineL100 / 100

  const perTrip = trips.map((t) => {
    const litres = t.litres ?? (pt === 'ice' ? t.km * avgLkm : 0)
    let elKm = 0
    if (pt === 'ev') elKm = t.km
    else if (pt === 'phev') elKm = t.electricOnly ? t.km : Math.max(0, t.km - (litres / engineL100) * 100)
    const price = priceAt(s, t.start)
    return { t, litres, elKm, price, fuelCost: litres * price }
  })

  const sum = <T,>(a: T[], f: (x: T) => number) => a.reduce((acc, x) => acc + f(x), 0)
  const km = sum(trips, (t) => t.km)
  const minutes = sum(trips, (t) => t.duration)
  const litres = sum(perTrip, (p) => p.litres)
  const fuelCost = sum(perTrip, (p) => p.fuelCost)
  const elKm = sum(perTrip, (p) => p.elKm)
  const kwhFromData = sum(trips, (t) => t.kwh ?? 0)
  const kwh = pt === 'ev' && kwhFromData > 0 ? kwhFromData : (elKm * s.kwhPer100) / 100
  const elCost = kwh * s.electricityPrice
  const savedLitres = pt === 'phev' ? (elKm * engineL100) / 100 : 0
  const saved = pt === 'phev' ? sum(perTrip, (p) => (p.elKm * engineL100) / 100 * p.price) : 0
  const allFuelCost = sum(perTrip, (p) => (p.t.km * engineL100) / 100 * p.price)
  const fuelKm = km - elKm
  const fuelTrips = trips.filter((t) => !t.electricOnly && (t.litres ?? 0) > 0)

  const days = new Map<string, Trip[]>()
  trips.forEach((t) => {
    const k = dayKey(t.start)
    days.set(k, [...(days.get(k) ?? []), t])
  })

  // ---- months (incl. excluded, flagged) ----
  const monthMap = new Map<string, MonthStat>()
  const ensure = (k: string) => {
    if (!monthMap.has(k)) monthMap.set(k, { key: k, km: 0, elKm: 0, fuelKm: 0, litres: 0, fuelCost: 0, elCost: 0, trips: 0, gapKm: 0, avgPrice: 0, excluded: s.excludedMonths.includes(k) })
    return monthMap.get(k)!
  }
  const allPer = all.map((t) => {
    const l = t.litres ?? (pt === 'ice' ? t.km * avgLkm : 0)
    const e = pt === 'ev' ? t.km : pt === 'phev' ? (t.electricOnly ? t.km : Math.max(0, t.km - (l / engineL100) * 100)) : 0
    return { t, l, e, price: priceAt(s, t.start) }
  })
  allPer.forEach(({ t, l, e, price }) => {
    const m = ensure(monthKey(t.start))
    m.km += t.km
    m.elKm += e
    m.fuelKm += t.km - e
    m.litres += l
    m.fuelCost += l * price
    m.elCost += (e * s.kwhPer100) / 100 * s.electricityPrice
    m.trips++
    m.avgPrice += price
  })

  // ---- odometer gaps ----
  const gaps: Gap[] = []
  let gapTotal = 0
  for (let i = 1; i < all.length; i++) {
    const a = all[i - 1], b = all[i]
    if (a.odometer === null || b.odometer === null) continue
    const g = b.odometer - a.odometer - b.km
    if (g > 0) gapTotal += g
    if (g >= 20) {
      gaps.push({ from: a.end, to: b.start, km: g, fromPos: a.to, toPos: b.from })
    }
    if (g > 0) {
      // spread over the days between the two trips
      const d0 = new Date(a.start.getFullYear(), a.start.getMonth(), a.start.getDate())
      const d1 = new Date(b.start.getFullYear(), b.start.getMonth(), b.start.getDate())
      const n = Math.max(1, Math.round((d1.getTime() - d0.getTime()) / 86400000) + 1)
      for (let k = 0; k < n; k++) ensure(monthKey(new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + k))).gapKm += g / n
    }
  }
  const months = [...monthMap.values()].sort((a, b) => a.key.localeCompare(b.key))
  months.forEach((m) => (m.avgPrice = m.trips ? m.avgPrice / m.trips : priceAt(s, new Date(m.key + '-15'))))

  const first = all[0].start, last = all[all.length - 1].start
  const spanDays = Math.round((last.getTime() - first.getTime()) / 86400000) + 1
  const exclDays = s.excludedMonths.reduce((acc, k) => {
    const [y, mo] = k.split('-').map(Number)
    return acc + (monthMap.has(k) ? new Date(y, mo, 0).getDate() : 0)
  }, 0)
  const effDays = Math.max(1, spanDays - exclDays)
  const effMonths = effDays / 30.44
  const includedGapKm = sum(months.filter((m) => !m.excluded), (m) => m.gapKm)
  const odoKm = km + includedGapKm
  const lkmMix = km ? litres / km : 0
  const gapPrice = (m: MonthStat) => m.avgPrice || s.fuelPrice
  const estLoL = sum(months.filter((m) => !m.excluded), (m) => m.gapKm * lkmMix)
  const estLoC = sum(months.filter((m) => !m.excluded), (m) => m.gapKm * lkmMix * gapPrice(m))
  const estHiL = sum(months.filter((m) => !m.excluded), (m) => (m.gapKm * engineL100) / 100)
  const estHiC = sum(months.filter((m) => !m.excluded), (m) => (m.gapKm * engineL100) / 100 * gapPrice(m))

  // ---- time patterns ----
  const heat = Array.from({ length: 7 }, () => Array(24).fill(0) as number[])
  const hours = Array(24).fill(0) as number[]
  const weekdayKm = Array(7).fill(0) as number[]
  trips.forEach((t) => {
    const wd = (t.start.getDay() + 6) % 7
    heat[wd][t.start.getHours()]++
    hours[t.start.getHours()]++
    weekdayKm[wd] += t.km
  })
  const histogram = HIST.map(([, label]) => ({ label, count: 0 }))
  trips.forEach((t) => histogram[HIST.findIndex(([max]) => Math.round(t.km) <= max)].count++)

  // ---- records ----
  let maxDay: Analysis['records']['maxDay'] = null
  let mostTrips: Analysis['records']['mostTrips'] = null
  let maxEvDay: Analysis['records']['maxEvDay'] = null
  let elOnlyDays = 0
  for (const ts of days.values()) {
    const dkm = sum(ts, (t) => t.km)
    if (!maxDay || dkm > maxDay.km) maxDay = { date: ts[0].start, km: dkm }
    if (!mostTrips || ts.length > mostTrips.count) mostTrips = { date: ts[0].start, count: ts.length }
    const ekm = sum(ts.filter((t) => t.electricOnly), (t) => t.km)
    if (pt === 'phev' && (!maxEvDay || ekm > maxEvDay.km)) maxEvDay = { date: ts[0].start, km: ekm }
    if (ts.every((t) => t.electricOnly)) elOnlyDays++
  }
  const longest = trips.reduce<Trip | null>((a, t) => (!a || t.km > a.km ? t : a), null)
  const fastest = trips
    .filter((t) => t.km >= 50 && t.duration > 0)
    .reduce<{ trip: Trip; speed: number } | null>((a, t) => {
      const sp = t.km / (t.duration / 60)
      return sp < 200 && (!a || sp > a.speed) ? { trip: t, speed: sp } : a
    }, null)
  const earliest = trips.reduce<Trip | null>((a, t) => {
    const m = (x: Trip) => ((x.start.getHours() + 21) % 24) * 60 + x.start.getMinutes() // day starts at 03:00
    return !a || m(t) < m(a) ? t : a
  }, null)
  let streak = 0, best = 0
  all.forEach((t) => {
    if (isExcluded(t)) streak = 0
    else if (t.electricOnly) {
      streak += t.km
      best = Math.max(best, streak)
    } else streak = 0
  })
  const dayList = [...days.keys()].sort()
  let run = 1, longestRun = dayList.length ? 1 : 0
  for (let i = 1; i < dayList.length; i++) {
    const diff = (new Date(dayList[i]).getTime() - new Date(dayList[i - 1]).getTime()) / 86400000
    run = Math.round(diff) === 1 ? run + 1 : 1
    longestRun = Math.max(longestRun, run)
  }
  const greenestMonth = pt === 'phev' ? months.filter((m) => !m.excluded && m.km >= 150).reduce<MonthStat | null>((a, m) => (!a || m.elKm / m.km > a.elKm / a.km ? m : a), null) : null

  // ---- places: grid clustering of trip end points ----
  const cell = (p: LatLon) => `${Math.round(p.lat / 0.004)}:${Math.round(p.lon / 0.004)}`
  const clusters = new Map<string, { lat: number; lon: number; n: number; morning: number; night: number }>()
  trips.forEach((t) => {
    if (!t.to) return
    const k = cell(t.to)
    const c = clusters.get(k) ?? { lat: 0, lon: 0, n: 0, morning: 0, night: 0 }
    c.lat += t.to.lat
    c.lon += t.to.lon
    c.n++
    const h = t.start.getHours(), wd = t.start.getDay()
    if (h >= 4 && h < 10 && wd >= 1 && wd <= 5) c.morning++
    if (h >= 16 || h < 3) c.night++
    clusters.set(k, c)
  })
  const placesRaw = [...clusters.values()].map((c) => ({ lat: c.lat / c.n, lon: c.lon / c.n, visits: c.n, morning: c.morning, night: c.night })).sort((a, b) => b.visits - a.visits)
  const top = placesRaw.slice(0, 12)
  const homeIdx = top.length ? top.reduce((bi, p, i) => (p.night > top[bi].night ? i : bi), 0) : -1
  const workIdx = top.reduce((bi, p, i) => (i !== homeIdx && p.morning >= 10 && (bi < 0 || p.morning > top[bi].morning) ? i : bi), -1)
  const places: Place[] = top.map((p, i) => ({ id: i, lat: p.lat, lon: p.lon, visits: p.visits, role: i === homeIdx ? 'home' : i === workIdx ? 'work' : null }))

  const routes = trips
    .filter((t) => t.from && t.to && t.km >= 25 && haversine(t.from, t.to) > 5)
    .map((t) => ({ from: t.from!, to: t.to!, km: t.km }))

  const excluded = s.excludedMonths
    .filter((k) => monthMap.has(k))
    .map((k) => {
      const m = monthMap.get(k)!
      return { key: k, km: m.km, litres: m.litres, fuelCost: m.fuelCost, trips: m.trips }
    })

  return {
    powertrain: pt,
    period: { from: first, to: last, days: spanDays, months: effMonths },
    totals: {
      trips: trips.length, km, hours: minutes / 60, avgSpeed: minutes ? km / (minutes / 60) : 0,
      drivingDays: days.size, medianKm: median(trips.map((t) => t.km)), medianMin: median(trips.map((t) => t.duration)),
    },
    energy: {
      litres, fuelCost, avgPricePaid: litres ? fuelCost / litres : s.fuelPrice,
      elKm, pureElKm: sum(trips.filter((t) => t.electricOnly), (t) => t.km), elShare: km ? elKm / km : 0,
      kwh, elCost, saved, savedLitres, allFuelCost, engineL100,
      fuelL100: fuelKm > 0 ? (litres / fuelKm) * 100 : 0,
      tripL100: fuelTrips.length ? (sum(fuelTrips, (t) => t.litres ?? 0) / sum(fuelTrips, (t) => t.km)) * 100 : 0,
      costPer100Fuel: fuelKm > 0 ? (fuelCost / fuelKm) * 100 : 0,
      costPer100El: (s.kwhPer100 * s.electricityPrice),
      costPer100Mix: km ? ((fuelCost + elCost) / km) * 100 : 0,
      co2Kg: litres * CO2[s.fuelType],
      elOnlyDays,
    },
    months, heat, hours, weekdayKm, histogram,
    records: { maxDay, longest, fastest, mostTrips, earliest, evStreakKm: best, maxEvDay, greenestMonth, longestStreakDays: longestRun },
    gaps: {
      list: gaps.filter((g) => !s.excludedMonths.includes(monthKey(g.to))).sort((a, b) => b.km - a.km),
      totalKm: gapTotal, odometerKm: odoKm,
      estLo: { litres: estLoL, cost: estLoC }, estHi: { litres: estHiL, cost: estHiC },
      perMonthKm: odoKm / effMonths, perYearKm: (odoKm / effMonths) * 12,
    },
    places, routes,
    excluded,
    fixedDates: parsed.fixedDates,
  }
}
