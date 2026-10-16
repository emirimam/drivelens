// Rasterizes the DriveLens logo into PNG icons (favicon-48, apple-touch-icon, icon-192, icon-512)
// with no dependencies, so binary files don't need to live in the repo.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public')

const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td))
  return Buffer.concat([len, td, c])
}
function png(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4) }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}

// Logo geometry in a 32×32 box (same as favicon.svg)
const BG = [11, 11, 16], G0 = [240, 211, 162], G1 = [56, 189, 248]
const R = 10, W = 3, DASH = 48 / R, START = (130 * Math.PI) / 180
const mix = (t) => G0.map((a, i) => a + (G1[i] - a) * t)
function sample(x, y, rx) {
  // returns [r,g,b,a] at logo coordinates
  const inRect = (() => { const cx = Math.min(Math.max(x, rx), 32 - rx), cy = Math.min(Math.max(y, rx), 32 - rx); return Math.hypot(x - cx, y - cy) <= rx })()
  if (!inRect) return [0, 0, 0, 0]
  const dx = x - 16, dy = y - 16, d = Math.hypot(dx, dy)
  const grad = [...mix(Math.min(Math.max((x + y) / 64, 0), 1)), 255]
  if (d <= 3.2) return grad
  let a = Math.atan2(dy, dx) - START
  a = ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  if (Math.abs(d - R) <= W / 2 && a <= DASH) return grad
  for (const e of [START, START + DASH]) { const ex = 16 + R * Math.cos(e), ey = 16 + R * Math.sin(e); if (Math.hypot(x - ex, y - ey) <= W / 2) return grad }
  return [...BG, 255]
}
function icon(size, rx) {
  const buf = Buffer.alloc(size * size * 4), S = 4
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    const acc = [0, 0, 0, 0]
    for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
      const c = sample(((px + (sx + 0.5) / S) * 32) / size, ((py + (sy + 0.5) / S) * 32) / size, rx)
      acc[0] += c[0] * c[3]; acc[1] += c[1] * c[3]; acc[2] += c[2] * c[3]; acc[3] += c[3]
    }
    const i = (py * size + px) * 4, a = acc[3]
    buf[i] = a ? acc[0] / a : 0; buf[i + 1] = a ? acc[1] / a : 0; buf[i + 2] = a ? acc[2] / a : 0; buf[i + 3] = a / (S * S)
  }
  return png(size, size, buf)
}

mkdirSync(out, { recursive: true })
for (const [name, size, rx] of [['favicon-48.png', 48, 8], ['apple-touch-icon.png', 180, 0.001], ['icon-192.png', 192, 8], ['icon-512.png', 512, 8]]) writeFileSync(join(out, name), icon(size, rx))
console.log('icons written')
