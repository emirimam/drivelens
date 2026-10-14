// Privacy-friendly, cookieless analytics. Only event names and coarse, non-identifying
// properties are sent (never trip data, locations or file contents).
// Providers: Vercel Web Analytics (script in index.html) and, optionally, Umami
// (enabled when a website id is configured in index.html).

type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    va?: (cmd: 'event', payload: { name: string; data?: Props }) => void
    umami?: { track: (event: string, data?: Props) => void }
  }
}

export function track(event: string, data?: Props) {
  try {
    window.umami?.track(event, data)
  } catch {
    /* analytics must never break the app */
  }
  try {
    window.va?.('event', { name: event, data })
  } catch {
    /* ignore */
  }
}

/** Rounds a number into a coarse bucket so no exact personal values leave the device. */
export function bucket(v: number, steps: number[]): string {
  for (const s of steps) if (v <= s) return `≤${s}`
  return `>${steps[steps.length - 1]}`
}
