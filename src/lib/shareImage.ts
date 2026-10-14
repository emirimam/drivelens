import type { Analysis } from './analyze'

export interface ShareText {
  title: string
  trips: string
  days: string
  electric: string
  engine: string
  saved: string
  longest: string
  maxDay: string
  evStreak: string
  per100: string
  avgSpeed: string
  cta: string
}

export interface ShareInput {
  a: Analysis
  n: (v: number, d?: number) => string
  date: (d: Date) => string
  cur: string
  txt: ShareText
}

const W = 1080
const H = 1350
const SITE = 'drivelens-one.vercel.app'

const C = {
  bg0: '#0b0b10',
  bg1: '#17141f',
  card: 'rgba(255,255,255,0.06)',
  line: 'rgba(255,255,255,0.12)',
  t1: '#f4f3f8',
  t2: 'rgba(244,243,248,0.66)',
  gold: '#d6b07a',
  gold2: '#f0d3a2',
  el: '#38bdf8',
  el2: '#22d3ee',
  fuel: '#fb923c',
  save: '#34d399',
  dist: '#a78bfa',
}

const DISPLAY = '"Sora", "Plus Jakarta Sans", system-ui, sans-serif'
const BODY = '"Plus Jakarta Sans", system-ui, sans-serif'

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function fit(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, start: number, maxW: number) {
  let px = start
  ctx.font = font(px)
  while (px > 12 && ctx.measureText(text).width > maxW) {
    px -= 2
    ctx.font = font(px)
  }
  return px
}

async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load(`800 120px Sora`),
      document.fonts.load(`700 40px "Plus Jakarta Sans"`),
      document.fonts.load(`500 30px "Plus Jakarta Sans"`),
    ])
  } catch {
    /* fall back to system fonts */
  }
}

export async function renderShareImage({ a, n, date, cur, txt }: ShareInput): Promise<Blob> {
  await ensureFonts()
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const ctx = cv.getContext('2d')
  if (!ctx) throw new Error('canvas')
  const E = a.energy
  const hasEl = a.powertrain !== 'ice'
  const phev = a.powertrain === 'phev'
  const P = 72 // side padding

  // background
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, C.bg1)
  g.addColorStop(1, C.bg0)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  const glow = (x: number, y: number, r: number, col: string) => {
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r)
    rg.addColorStop(0, col)
    rg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = rg
    ctx.fillRect(0, 0, W, H)
  }
  glow(120, -60, 620, 'rgba(214,176,122,0.30)')
  glow(1040, 260, 560, 'rgba(56,189,248,0.22)')

  // header: brand + period
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = C.gold2
  ctx.font = `800 40px ${DISPLAY}`
  ctx.fillText('DriveLens', P, 112)
  ctx.fillStyle = C.t2
  ctx.font = `500 28px ${BODY}`
  ctx.textAlign = 'right'
  ctx.fillText(`${date(a.period.from)} – ${date(a.period.to)}`, W - P, 110)
  ctx.textAlign = 'left'

  // headline: total km
  ctx.fillStyle = C.t2
  ctx.font = `600 30px ${BODY}`
  ctx.fillText(txt.title, P, 200)
  const kmText = `${n(a.totals.km)} km`
  ctx.fillStyle = C.t1
  fit(ctx, kmText, (px) => `800 ${px}px ${DISPLAY}`, 132, W - 2 * P)
  ctx.fillText(kmText, P, 322)
  ctx.fillStyle = C.t2
  ctx.font = `500 30px ${BODY}`
  ctx.fillText(`${n(a.totals.trips)} ${txt.trips} · ${n(a.totals.drivingDays)} ${txt.days}`, P, 372)

  // gauge
  const cx = W / 2
  const cy = 668
  const R = 230
  const start = Math.PI * 0.75
  const sweep = Math.PI * 1.5
  const value = hasEl ? E.elShare : Math.min(1, (E.tripL100 || E.fuelL100) / 14)
  ctx.lineCap = 'round'
  ctx.lineWidth = 46
  ctx.strokeStyle = 'rgba(255,255,255,0.09)'
  ctx.beginPath()
  ctx.arc(cx, cy, R, start, start + sweep)
  ctx.stroke()
  const gg = ctx.createLinearGradient(cx - R, cy, cx + R, cy)
  if (hasEl) {
    gg.addColorStop(0, C.el2)
    gg.addColorStop(1, C.el)
  } else {
    gg.addColorStop(0, C.save)
    gg.addColorStop(1, C.fuel)
  }
  ctx.strokeStyle = gg
  ctx.shadowColor = hasEl ? 'rgba(56,189,248,0.55)' : 'rgba(251,146,60,0.5)'
  ctx.shadowBlur = 30
  ctx.beginPath()
  ctx.arc(cx, cy, R, start, start + sweep * Math.max(0.005, Math.min(1, value)))
  ctx.stroke()
  ctx.shadowBlur = 0
  // ticks
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  for (let i = 1; i <= 9; i++) {
    const ang = start + (sweep * i) / 10
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(ang) * (R - 44), cy + Math.sin(ang) * (R - 44))
    ctx.lineTo(cx + Math.cos(ang) * (R - 60), cy + Math.sin(ang) * (R - 60))
    ctx.stroke()
  }
  ctx.textAlign = 'center'
  ctx.fillStyle = hasEl ? C.el : C.fuel
  const big = hasEl ? `${n(E.elShare * 100, 0)}%` : n(E.tripL100 || E.fuelL100, 1)
  ctx.font = `800 128px ${DISPLAY}`
  ctx.fillText(big, cx, cy + 30)
  ctx.fillStyle = C.t1
  ctx.font = `700 32px ${BODY}`
  ctx.fillText(hasEl ? txt.electric : txt.engine, cx, cy + 86)
  if (hasEl && phev && E.tripL100 > 0) {
    ctx.fillStyle = C.t2
    ctx.font = `500 26px ${BODY}`
    ctx.fillText(`${txt.engine}: ${n(E.tripL100, 1)} l/100 km`, cx, cy + 128)
  }
  ctx.textAlign = 'left'

  // savings banner
  let y = 930
  if (phev && E.saved > 0) {
    rr(ctx, P, y, W - 2 * P, 120, 30)
    const sg = ctx.createLinearGradient(P, 0, W - P, 0)
    sg.addColorStop(0, 'rgba(52,211,153,0.22)')
    sg.addColorStop(1, 'rgba(52,211,153,0.05)')
    ctx.fillStyle = sg
    ctx.fill()
    ctx.strokeStyle = 'rgba(52,211,153,0.45)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = C.save
    ctx.font = `800 60px ${DISPLAY}`
    const sv = `~${n(E.saved, 0)} ${cur}`
    ctx.fillText(sv, P + 36, y + 80)
    const sw = ctx.measureText(sv).width
    ctx.fillStyle = C.t1
    fit(ctx, txt.saved, (px) => `600 ${px}px ${BODY}`, 30, W - 2 * P - sw - 90)
    ctx.fillText(txt.saved, P + 36 + sw + 22, y + 74)
    y += 150
  } else {
    y += 10
  }

  // stat tiles
  const R0 = a.records
  const tiles: { v: string; l: string; c: string }[] = []
  if (R0.longest) tiles.push({ v: `${n(R0.longest.km)} km`, l: txt.longest, c: C.dist })
  if (R0.maxDay) tiles.push({ v: `${n(R0.maxDay.km)} km`, l: txt.maxDay, c: C.gold })
  if (hasEl && R0.evStreakKm > 0) tiles.push({ v: `${n(R0.evStreakKm)} km`, l: txt.evStreak, c: C.el })
  tiles.push({ v: `${n(E.costPer100Mix, 1)} ${cur}`, l: txt.per100, c: C.fuel })
  if (tiles.length < 4) tiles.push({ v: `${n(a.totals.avgSpeed)} km/h`, l: txt.avgSpeed, c: C.el2 })
  const shown = tiles.slice(0, phev && E.saved > 0 ? 2 : 4)
  const cols = 2
  const gap = 20
  const tw = (W - 2 * P - gap) / cols
  const th = 120
  shown.forEach((tile, i) => {
    const x = P + (i % cols) * (tw + gap)
    const ty = y + Math.floor(i / cols) * (th + gap)
    rr(ctx, x, ty, tw, th, 26)
    ctx.fillStyle = C.card
    ctx.fill()
    ctx.strokeStyle = C.line
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = tile.c
    fit(ctx, tile.v, (px) => `800 ${px}px ${DISPLAY}`, 46, tw - 56)
    ctx.fillText(tile.v, x + 28, ty + 62)
    ctx.fillStyle = C.t2
    fit(ctx, tile.l, (px) => `500 ${px}px ${BODY}`, 24, tw - 56)
    ctx.fillText(tile.l, x + 28, ty + 98)
  })

  // footer
  ctx.fillStyle = C.line
  ctx.fillRect(P, H - 118, W - 2 * P, 2)
  ctx.fillStyle = C.t2
  ctx.font = `500 27px ${BODY}`
  ctx.fillText(txt.cta, P, H - 62)
  ctx.textAlign = 'right'
  ctx.fillStyle = C.gold2
  ctx.font = `700 27px ${BODY}`
  ctx.fillText(SITE, W - P, H - 62)
  ctx.textAlign = 'left'

  return await new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('blob'))), 'image/jpeg', 0.92))
}
