import { describe, expect, test } from 'vitest'
import { detectDateOrder, parseLatLon, parseNumber, parseTime, parseTripsCsv } from '../lib/parse'
import { analyze, DEFAULT_SETTINGS, priceAt } from '../lib/analyze'
import { demoCsv } from '../lib/demo'

describe('helpers', () => {
  test('numbers', () => {
    expect(parseNumber('25.0')).toBe(25)
    expect(parseNumber('1.234,5')).toBe(1234.5)
    expect(parseNumber('1,234.5')).toBe(1234.5)
    expect(parseNumber('')).toBeNull()
  })
  test('coords', () => {
    expect(parseLatLon('44.56170 , 18.57640')).toEqual({ lat: 44.5617, lon: 18.5764 })
    expect(parseLatLon('0 , 0')).toBeNull()
  })
  test('time', () => {
    expect(parseTime('10:12')).toBe(612)
    expect(parseTime('1:05 PM')).toBe(785)
  })
  test('date order', () => {
    expect(detectDateOrder(['23.10.2025.', '01.02.2026.'])).toBe('dmy')
    expect(detectDateOrder(['10/23/2025'])).toBe('mdy')
    expect(detectDateOrder(['2025-10-23'])).toBe('ymd')
  })
})

describe('demo export', () => {
  const parsed = parseTripsCsv(demoCsv())
  test('detects plug-in hybrid and fixes reset clock', () => {
    expect(parsed.powertrain).toBe('phev')
    expect(parsed.fixedDates).toBeGreaterThan(10)
    expect(parsed.trips.every((t) => t.start.getFullYear() >= 2025)).toBe(true)
    for (let i = 1; i < parsed.trips.length; i++) expect(parsed.trips[i].start >= parsed.trips[i - 1].start).toBe(true)
  })
  test('analysis finds the odometer gap and electric share', () => {
    const a = analyze(parsed, DEFAULT_SETTINGS)
    expect(a.gaps.list[0].km).toBe(2380)
    expect(a.energy.elShare).toBeGreaterThan(0.3)
    expect(a.energy.elShare).toBeLessThan(0.95)
    expect(a.places.find((p) => p.role === 'home')).toBeTruthy()
    expect(a.places.find((p) => p.role === 'work')).toBeTruthy()
  })
  test('excluding a month removes it from totals', () => {
    const a = analyze(parsed, DEFAULT_SETTINGS)
    const b = analyze(parsed, { ...DEFAULT_SETTINGS, excludedMonths: [a.months[2].key] })
    expect(Math.round(a.totals.km - b.totals.km)).toBe(Math.round(a.months[2].km))
  })
})

test('price interpolation', () => {
  const s = { ...DEFAULT_SETTINGS, pricePoints: [{ date: '2026-01-01', price: 2 }, { date: '2026-01-11', price: 3 }] }
  expect(priceAt(s, new Date('2026-01-06T12:00:00'))).toBeCloseTo(2.5, 2)
  expect(priceAt(s, new Date('2025-01-01'))).toBe(2)
})

test('JSON / .myp export', () => {
  const trip = (d: string, km: number, fuel: number, odo: number) => ({ start: { date: d, mileage: odo - km, latitude: 44.5, longitude: 18.5 }, end: { date: d, mileage: odo, latitude: 44.6, longitude: 18.6 }, distance: km, travelTime: km * 90, fuelConsumption: fuel })
  const json = JSON.stringify({ vin: 'VF3TEST', trips: [trip('2026-01-02T08:00:00Z', 20, 0, 1020), trip('2026-01-03T08:00:00Z', 150, 10_000_000, 1170), trip('2026-01-04T08:00:00Z', 15, 0, 1185), trip('2026-01-05T08:00:00Z', 12, 0, 1197), trip('2026-01-06T08:00:00Z', 30, 0, 1227)] })
  const p = parseTripsCsv(json)
  expect(p.trips).toHaveLength(5)
  expect(p.powertrain).toBe('phev')
  expect(p.trips[1].litres).toBeCloseTo(10, 5)
  expect(p.trips[0].electricOnly).toBe(true)
})
