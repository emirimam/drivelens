/**
 * Generates a realistic, fully synthetic trip export (plug-in hybrid) in the
 * same CSV format the MyDS / MyCitroën apps produce. No real person's data.
 */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

const HOME = [43.8563, 18.4131]
const WORK = [43.8476, 18.3564]
const SPOTS = [
  [43.8601, 18.4282], [43.8402, 18.3401], [43.8711, 18.4011], [43.8299, 18.3005], [43.8622, 18.3874],
]
const TRIPS_FAR = [
  { to: [43.3438, 17.8078], km: 128 },
  { to: [43.5081, 16.4402], km: 262 },
  { to: [44.7722, 17.191], km: 186 },
  { to: [44.8125, 20.4612], km: 296 },
  { to: [44.5384, 18.6763], km: 121 },
]

const pad = (n: number) => String(n).padStart(2, '0')
const fmtCoord = (p: number[], r: () => number) => `${(p[0] + (r() - 0.5) * 0.001).toFixed(5)} , ${(p[1] + (r() - 0.5) * 0.001).toFixed(5)}`

export function demoCsv(): string {
  const r = rng(42)
  const rows: string[] = [
    'datum;vrijeme polaska;vrijeme dolaska;vrijeme (hr:min);adresa polaska;adresa odredišta;udaljenost (km);kilometraža na brojaču (km);Prosječna potrošnja  (km/l);cijena goriva (EUR/l);trošak  (EUR);kategorija',
  ]
  let odo = 42_150
  const start = new Date(2025, 9, 1)
  let battery = 50
  for (let d = 0; d < 350; d++) {
    const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + d)
    // a 3-week gap where the car did not report (holiday abroad)
    if (d >= 255 && d < 276) {
      if (d === 255) odo += 2380
      continue
    }
    const wd = day.getDay()
    const plan: { from: number[]; to: number[]; km: number; h: number }[] = []
    const winter = day.getMonth() >= 10 || day.getMonth() <= 1
    if (wd >= 1 && wd <= 5 && r() > 0.08) {
      const h = 6 + Math.floor(r() * 2)
      plan.push({ from: HOME, to: WORK, km: 9 + Math.round(r() * 2), h })
      if (r() > 0.5) plan.push({ from: WORK, to: SPOTS[Math.floor(r() * SPOTS.length)], km: 3 + Math.round(r() * 6), h: 12 + Math.floor(r() * 2) })
      plan.push({ from: WORK, to: HOME, km: 9 + Math.round(r() * 3), h: 15 + Math.floor(r() * 3) })
    } else {
      const n = 1 + Math.floor(r() * 3)
      for (let i = 0; i < n; i++) {
        const s = SPOTS[Math.floor(r() * SPOTS.length)]
        plan.push({ from: HOME, to: s, km: 2 + Math.round(r() * 12), h: 9 + i * 3 })
        plan.push({ from: s, to: HOME, km: 2 + Math.round(r() * 12), h: 10 + i * 3 })
      }
      if (wd === 6 && r() > 0.7) {
        const t = TRIPS_FAR[Math.floor(r() * TRIPS_FAR.length)]
        plan.push({ from: HOME, to: t.to, km: t.km, h: 6 + Math.floor(r() * 2) })
        plan.push({ from: t.to, to: HOME, km: t.km + Math.round(r() * 6), h: 17 + Math.floor(r() * 2) })
      }
    }
    plan.sort((a, b) => a.h - b.h)
    battery = 50 // charged overnight
    // car clock reset for ~10 days (dates show 2007)
    const clockReset = d >= 160 && d < 170
    const shown = clockReset ? new Date(2007, 0, 1 + (d - 160)) : day
    for (const p of plan) {
      const startMin = p.h * 60 + Math.floor(r() * 50)
      const speed = p.km > 60 ? 85 + r() * 25 : 28 + r() * 18
      const dur = Math.max(2, Math.round((p.km / speed) * 60))
      const endMin = (startMin + dur) % 1440
      odo += p.km
      const range = winter ? 38 : 48
      let cons = ''
      const evKm = Math.min(p.km, battery)
      battery = Math.max(0, battery - p.km * (50 / range))
      if (p.km > evKm || (winter && r() > 0.85)) {
        const fuelKm = Math.max(1, p.km - evKm)
        const l100 = p.km > 60 ? 6.4 + r() * 1.2 : 7.5 + r() * 2
        const litres = (fuelKm * l100) / 100
        cons = (p.km / litres).toFixed(1)
      }
      rows.push([
        `${pad(shown.getDate())}.${pad(shown.getMonth() + 1)}.${shown.getFullYear()}.`,
        `${pad(Math.floor(startMin / 60))}:${pad(startMin % 60)}`,
        `${pad(Math.floor(endMin / 60))}:${pad(endMin % 60)}`,
        `${Math.floor(dur / 60)}:${pad(dur % 60)}`,
        fmtCoord(p.from, r), fmtCoord(p.to, r),
        p.km.toFixed(1), String(odo), cons, '', '', 'Ostalo',
      ].join(';'))
    }
  }
  return rows.join('\n')
}
