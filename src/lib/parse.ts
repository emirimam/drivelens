import Papa from 'papaparse'
import type { ConsumptionUnit, DistanceUnit, LatLon, ParseResult, Powertrain, Trip } from './types'

/**
 * Parser for the trip CSV exported by the Stellantis companion apps
 * (MyDS, MyCitroën, MyPeugeot, MyOpel …). The export has the same 12 columns
 * in every language, so we map by header keywords first and fall back to the
 * known column order.
 */

type Field =
  | 'date' | 'start' | 'end' | 'duration' | 'from' | 'to'
  | 'distance' | 'odometer' | 'consumption' | 'price' | 'cost' | 'category'

const ORDER: Field[] = ['date', 'start', 'end', 'duration', 'from', 'to', 'distance', 'odometer', 'consumption', 'price', 'cost', 'category']

// Lower-case keyword fragments in many languages. Checked in this order, first match wins.
const KEYWORDS: [Field, RegExp][] = [
  ['odometer', /(kilometra|odometer|mileage|compteur|contachilometri|cuentakil|kilometerst|brojač|brojac|tacho)/],
  ['consumption', /(potrošnja|potrosnja|consumption|consommation|consumo|verbrauch|km\/l|l\/100|mpg|kwh)/],
  ['price', /(cijena|cena|price|prix|prezzo|precio|preis)/],
  ['cost', /(trošak|trosak|cost|coût|cout|costo|coste|kosten)/],
  ['category', /(kategorija|category|catégorie|categorie|categoria|kategorie)/],
  ['distance', /(udaljenost|distance|distanza|distancia|entfernung|strecke|razdaljina)/],
  ['from', /(adresa polaska|start address|departure address|adresse de départ|indirizzo di partenza|dirección de salida|startadresse|polazna)/],
  ['to', /(odredi|destination|arrival address|adresse d'arrivée|indirizzo di arrivo|dirección de llegada|zieladresse|dolazna)/],
  ['start', /(polaska|departure|start time|heure de départ|ora di partenza|hora de salida|abfahrt|startzeit|^start)/],
  ['end', /(dolaska|arrival|end time|heure d'arrivée|ora di arrivo|hora de llegada|ankunft|endzeit|^end)/],
  ['duration', /(hr:min|trajanje|duration|durée|durata|duración|dauer|h:min)/],
  ['date', /(datum|date|data|fecha|dátum)/],
]

export function parseNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null
  let s = String(v).trim().replace(/[\s\u00a0]/g, '')
  if (!s) return null
  if (s.includes(',') && s.includes('.')) {
    // thousands separator is whichever comes first
    s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '')
  } else if (s.includes(',')) s = s.replace(',', '.')
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export function parseLatLon(v: unknown): LatLon | null {
  if (!v) return null
  const m = String(v).match(/(-?\d+(?:[.,]\d+)?)\s*[,;\s]\s*(-?\d+(?:[.,]\d+)?)/)
  if (!m) return null
  const lat = Number(m[1].replace(',', '.'))
  const lon = Number(m[2].replace(',', '.'))
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null
  if (lat === 0 && lon === 0) return null
  return { lat, lon }
}

/** minutes since midnight */
export function parseTime(v: unknown): number | null {
  const m = String(v ?? '').trim().match(/^(\d{1,2})[:.h](\d{2})(?::\d{2})?\s*(am|pm)?/i)
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2])
  const ap = m[3]?.toLowerCase()
  if (ap === 'pm' && h < 12) h += 12
  if (ap === 'am' && h === 12) h = 0
  return h * 60 + min
}

type DateOrder = 'dmy' | 'mdy' | 'ymd'

function splitDate(v: string): [number, number, number] | null {
  const m = v.trim().match(/^(\d{1,4})[./-](\d{1,2})[./-](\d{1,4})\.?/)
  if (!m) return null
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

export function detectDateOrder(values: string[]): DateOrder {
  let dmy = 0, mdy = 0
  for (const v of values) {
    const p = splitDate(v)
    if (!p) continue
    if (p[0] > 31) return 'ymd'
    if (p[0] > 12) dmy++
    if (p[1] > 12) mdy++
  }
  return mdy > dmy ? 'mdy' : 'dmy'
}

function toDate(v: string, order: DateOrder, minutes: number): Date | null {
  const p = splitDate(v)
  if (!p) return null
  const [a, b, c] = p
  const [y, mo, d] = order === 'ymd' ? [a, b, c] : order === 'mdy' ? [c, a, b] : [c, b, a]
  const year = y < 100 ? 2000 + y : y
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null
  return new Date(year, mo - 1, d, Math.floor(minutes / 60), minutes % 60)
}

function mapColumns(header: string[]): Record<Field, number> {
  const map = {} as Record<Field, number>
  const used = new Set<number>()
  header.forEach((h, i) => {
    const name = h.toLowerCase().trim()
    for (const [field, re] of KEYWORDS) {
      if (map[field] === undefined && re.test(name)) {
        map[field] = i
        used.add(i)
        return
      }
    }
  })
  // positional fallback for anything we could not recognise
  ORDER.forEach((f, i) => {
    if (map[f] === undefined && !used.has(i) && i < header.length) map[f] = i
  })
  return map
}

function detectUnits(header: string[], map: Record<Field, number>) {
  const dh = (header[map.distance] ?? '').toLowerCase()
  const ch = (header[map.consumption] ?? '').toLowerCase()
  const distanceUnit: DistanceUnit = /\bmi\b|mile|milj/.test(dh) ? 'mi' : 'km'
  let consumptionUnit: ConsumptionUnit = 'unknown'
  if (/kwh/.test(ch)) consumptionUnit = 'kWh/100km'
  else if (/km\/l/.test(ch)) consumptionUnit = 'km/l'
  else if (/l\/100/.test(ch)) consumptionUnit = 'l/100km'
  else if (/mpg/.test(ch)) consumptionUnit = 'mpg'
  return { distanceUnit, consumptionUnit }
}

const MI = 1.609344
const UK_GALLON = 4.54609
const MIN_VALID_YEAR = 2012

interface RawTrip {
  i: number
  date: Date | null
  startMin: number | null
  duration: number
  km: number
  odo: number | null
  from: LatLon | null
  to: LatLon | null
  /** consumption in the file's unit (null = blank) */
  cons: number | null
  fixed: boolean
}

/** Entry point: accepts the CSV export or the app's JSON / .myp backup export. */
export function parseTripsCsv(text: string): ParseResult {
  const clean = text.replace(/^\uFEFF/, '').trim()
  if (clean.startsWith('{') || clean.startsWith('[')) return parseTripsJson(clean)
  const warnings: string[] = []
  const parsed = Papa.parse<string[]>(clean, { skipEmptyLines: 'greedy', delimiter: '' })
  const rows = parsed.data.filter((r) => r.some((c) => String(c).trim() !== ''))
  if (rows.length < 2) throw new Error('empty')

  const header = rows[0].map((h) => String(h))
  const map = mapColumns(header)
  const { distanceUnit } = detectUnits(header, map)
  let { consumptionUnit } = detectUnits(header, map)
  const body = rows.slice(1)
  const order = detectDateOrder(body.map((r) => String(r[map.date] ?? '')))

  const raw = body
    .map((r, i) => {
      const startMin = parseTime(r[map.start])
      const endMin = parseTime(r[map.end])
      const date = toDate(String(r[map.date] ?? ''), order, startMin ?? 0)
      let km = parseNumber(r[map.distance])
      let odo = parseNumber(r[map.odometer])
      if (distanceUnit === 'mi') {
        if (km !== null) km *= MI
        if (odo !== null) odo *= MI
      }
      let duration = startMin !== null && endMin !== null ? (endMin - startMin + 1440) % 1440 : null
      const durParsed = parseTime(r[map.duration])
      if (duration === null && durParsed !== null) duration = durParsed
      // clock-sync glitches produce absurd durations; drop them
      if (duration !== null && duration > 360 && (km ?? 0) / (duration / 60) < 3) duration = 0
      return {
        i, date, startMin, duration: duration ?? 0, km: km ?? 0, odo,
        from: parseLatLon(r[map.from]), to: parseLatLon(r[map.to]),
        cons: parseNumber(r[map.consumption]),
        fixed: false,
      }
    })
    .filter((r) => r.date && r.km >= 0)

  return finalize(raw, consumptionUnit, distanceUnit, warnings)
}

interface JsonPoint { date?: string; mileage?: number; latitude?: number; longitude?: number }
interface JsonTrip { start?: JsonPoint; end?: JsonPoint; distance?: number; travelTime?: number; fuelConsumption?: number }

/**
 * JSON / .myp export (MyPeugeot, MyCitroën, MyDS, MyOpel backup format):
 * one or more vehicles `{ vin, trips: [...] }`. fuelConsumption is in millionths of a litre.
 */
export function parseTripsJson(text: string): ParseResult {
  const data: unknown = JSON.parse(text)
  const vehicles = (Array.isArray(data) ? data : [data]) as { trips?: JsonTrip[] }[]
  const trips = vehicles.flatMap((v) => (Array.isArray(v?.trips) ? v.trips : []))
  const pos = (p?: JsonPoint): LatLon | null =>
    p && typeof p.latitude === 'number' && typeof p.longitude === 'number' && p.latitude !== -1 && !(p.latitude === 0 && p.longitude === 0) ? { lat: p.latitude, lon: p.longitude } : null
  const raw: RawTrip[] = trips.map((t, i) => {
    const date = t.start?.date ? new Date(t.start.date) : null
    const km = typeof t.distance === 'number' && t.distance >= 0 ? t.distance : 0
    const litres = typeof t.fuelConsumption === 'number' && t.fuelConsumption > 0 ? t.fuelConsumption / 1e6 : 0
    return {
      i, date: date && !isNaN(date.getTime()) ? date : null,
      startMin: date ? date.getHours() * 60 + date.getMinutes() : null,
      duration: typeof t.travelTime === 'number' && t.travelTime > 0 ? Math.round(t.travelTime / 60) : 0,
      km, odo: typeof t.end?.mileage === 'number' && t.end.mileage > 0 ? t.end.mileage : null,
      from: pos(t.start), to: pos(t.end),
      cons: litres > 0 && km > 0 ? km / litres : null,
      fixed: false,
    }
  }).filter((r) => r.date)
  return finalize(raw, 'km/l', 'km', [])
}

function finalize(raw: RawTrip[], consumptionUnit: ConsumptionUnit, distanceUnit: DistanceUnit, warnings: string[]): ParseResult {
  if (!raw.length) throw new Error('no-trips')

  // infer consumption unit from values when the header does not say it
  const consVals = raw.map((r) => r.cons).filter((v): v is number => v !== null && v > 0)
  if (consumptionUnit === 'unknown' && consVals.length) {
    const med = [...consVals].sort((a, b) => a - b)[Math.floor(consVals.length / 2)]
    consumptionUnit = med > 9 ? 'km/l' : 'l/100km'
  }

  // chronological order = odometer order (robust against car clock resets)
  const hasOdo = raw.filter((r) => r.odo !== null).length > raw.length * 0.8
  raw.sort((a, b) => (hasOdo && a.odo !== null && b.odo !== null && a.odo !== b.odo ? a.odo - b.odo : a.i - b.i))

  // --- fix dates from a reset car clock (e.g. 01.01.2007) ---
  const now = Date.now() + 86400000
  const valid = (d: Date) => d.getFullYear() >= MIN_VALID_YEAR && d.getTime() <= now
  let fixedDates = 0
  for (let i = 0; i < raw.length; i++) {
    if (valid(raw[i].date!)) continue
    let j = i
    while (j + 1 < raw.length && !valid(raw[j + 1].date!)) j++
    const block = raw.slice(i, j + 1)
    const prev = i > 0 ? raw[i - 1].date! : null
    const next = j + 1 < raw.length ? raw[j + 1].date! : null
    const day = (d: Date) => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
    const maxDay = Math.max(...block.map((b) => day(b.date!)))
    const minDay = Math.min(...block.map((b) => day(b.date!)))
    let offset: number
    // assume the block ended the day before the next valid trip; fall back to the same day
    if (next && (!prev || day(next) - 1 - maxDay + minDay >= day(prev))) offset = day(next) - 1 - maxDay
    else if (next && (!prev || day(next) - maxDay + minDay >= day(prev))) offset = day(next) - maxDay
    else if (prev) offset = day(prev) - minDay
    else offset = 0
    let last = prev
    for (const b of block) {
      const o = b.date!
      const d = new Date(o.getFullYear(), o.getMonth(), o.getDate() + offset, o.getHours(), o.getMinutes())
      b.date = last && d < last ? new Date(last.getTime() + 60000) : d
      last = b.date
      b.fixed = true
      fixedDates++
    }
    i = j
  }
  if (fixedDates) warnings.push('clock-reset')

  // --- powertrain detection ---
  let powertrain: Powertrain = 'ice'
  const toKmPerL = (c: number) => (consumptionUnit === 'l/100km' ? 100 / c : consumptionUnit === 'mpg' ? (c * MI) / UK_GALLON : c)
  if (consumptionUnit === 'kWh/100km') powertrain = 'ev'
  else {
    const kmpl = consVals.map(toKmPerL)
    const blanks = raw.filter((r) => r.cons === null && r.km > 0)
    const maxBlank = Math.max(0, ...blanks.map((r) => r.km))
    const veryEfficient = kmpl.filter((v) => v > 40).length
    if (veryEfficient >= 3 || (blanks.length > raw.length * 0.15 && maxBlank < 90)) powertrain = 'phev'
  }

  const trips: Trip[] = raw.map((r, idx) => {
    const start = r.date!
    const end = new Date(start.getTime() + r.duration * 60000)
    let litres: number | null = null
    let kwh: number | null = null
    let electricOnly = false
    if (powertrain === 'ev') {
      electricOnly = true
      if (r.cons !== null) kwh = (r.km * r.cons) / 100
    } else if (r.cons !== null && r.cons > 0) {
      litres = r.km / toKmPerL(r.cons)
    } else if (powertrain === 'phev') {
      litres = 0
      electricOnly = true
    }
    return {
      id: idx, start, end, duration: r.duration, from: r.from, to: r.to,
      km: r.km, odometer: r.odo, litres, kwh, electricOnly,
      dateFixed: r.fixed, rawConsumption: r.cons,
    }
  })
  return { trips, powertrain, consumptionUnit, distanceUnit, warnings, fixedDates }
}
