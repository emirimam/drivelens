import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS, priceAt } from '../lib/analyze'
import { convert, guessMarket, KM_PER_EUR, MARKET_CODES, MARKETS, marketPoints, withMarket } from '../lib/markets'

describe('markets', () => {
  it('has petrol and diesel history for every market, sorted by date', () => {
    for (const c of MARKET_CODES) {
      for (const f of ['petrol', 'diesel'] as const) {
        const pts = MARKETS[c][f]
        expect(pts.length).toBeGreaterThan(5)
        expect([...pts].sort((a, b) => a[0].localeCompare(b[0]))).toEqual(pts)
        for (const [, p] of pts) expect(p).toBeGreaterThan(1)
      }
    }
  })

  it('converts KM and EUR at the fixed peg', () => {
    expect(convert(1, 'EUR', 'KM')).toBeCloseTo(KM_PER_EUR)
    expect(convert(KM_PER_EUR, 'KM', 'EUR')).toBeCloseTo(1)
    expect(convert(5, 'CHF', 'EUR')).toBe(5)
  })

  it('switching market changes currency, electricity and dated prices', () => {
    const ba = withMarket({ ...DEFAULT_SETTINGS, market: '' }, { market: 'BA' })
    expect(ba.currency).toBe('KM')
    const de = withMarket(ba, { market: 'DE' })
    expect(de.currency).toBe('EUR')
    expect(de.pricePoints).toEqual(marketPoints('DE', 'petrol', 'EUR'))
    expect(priceAt(de, new Date(2025, 6, 7))).toBeCloseTo(1.729, 2)
    const deKm = withMarket(de, { currency: 'KM' })
    expect(priceAt(deKm, new Date(2025, 6, 7))).toBeCloseTo(1.729 * KM_PER_EUR, 2)
    const diesel = withMarket(de, { fuelType: 'diesel' })
    expect(priceAt(diesel, new Date(2025, 6, 7))).toBeCloseTo(1.61, 2)
  })

  it('editing prices switches to custom and keeps them on currency change', () => {
    const own = withMarket(withMarket({ ...DEFAULT_SETTINGS }, { market: 'HR' }), { market: 'custom', pricePoints: [{ date: '2025-01-01', price: 2 }] })
    expect(own.pricePoints).toEqual([{ date: '2025-01-01', price: 2 }])
    const km = withMarket(own, { currency: 'KM' })
    expect(km.pricePoints[0].price).toBeCloseTo(2 * KM_PER_EUR, 2)
  })

  it('guesses a market', () => {
    expect(MARKETS[guessMarket('bs')]).toBeTruthy()
  })
})
