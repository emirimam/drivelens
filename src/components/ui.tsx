import type { ReactNode } from 'react'

export type Tone = 'el' | 'fuel' | 'save' | 'dist' | 'gold' | 'bad' | 'warn' | 'plain'

const toneVar: Record<Tone, string> = {
  el: 'var(--el)', fuel: 'var(--fuel)', save: 'var(--save)', dist: 'var(--dist)', gold: 'var(--gold)', bad: 'var(--bad)', warn: 'var(--warn)', plain: 'var(--t1)',
}

export function Stat({ value, label, tone = 'plain', sub }: { value: ReactNode; label: ReactNode; tone?: Tone; sub?: ReactNode }) {
  const c = toneVar[tone]
  return (
    <div
      className="rounded-2xl p-4 min-w-0"
      style={{ background: tone === 'plain' ? 'var(--card)' : `color-mix(in oklab, ${c} 11%, var(--card))`, border: `1px solid color-mix(in oklab, ${c} ${tone === 'plain' ? 0 : 22}%, var(--line))` }}
    >
      <div className="font-display tnum text-[22px] sm:text-2xl font-extrabold leading-tight truncate" style={{ color: c }}>
        {value}
      </div>
      <div className="text-[13px] mt-0.5" style={{ color: 'var(--t2)' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'var(--t3)' }}>{sub}</div>}
    </div>
  )
}

export function Section({ id, title, accent, children, right }: { id: string; title: string; accent: Tone; children: ReactNode; right?: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 mt-10 fade-in">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-xl sm:text-2xl font-bold flex items-center gap-3">
          <span className="inline-block w-2.5 h-7 rounded-full" style={{ background: toneVar[accent] }} />
          {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  )
}

export function Card({ title, hint, children, className = '' }: { title?: ReactNode; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`card p-4 sm:p-5 min-w-0 ${className}`}>
      {title && <h3 className="font-semibold text-[15px]">{title}</h3>}
      {hint && <p className="text-[13px] mb-2" style={{ color: 'var(--t2)' }}>{hint}</p>}
      {children}
    </div>
  )
}

export function Fact({ kicker, value, sub, tone }: { kicker: string; value: ReactNode; sub?: ReactNode; tone: Tone }) {
  return (
    <div className="card p-4 relative overflow-hidden min-w-0">
      <span className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: toneVar[tone] }} />
      <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: toneVar[tone] }}>{kicker}</div>
      <div className="font-display text-lg font-bold mt-0.5 tnum">{value}</div>
      {sub && <div className="text-[13px]" style={{ color: 'var(--t2)' }}>{sub}</div>}
    </div>
  )
}

export function Icon({ name, size = 18 }: { name: 'upload' | 'gear' | 'print' | 'sun' | 'moon' | 'file' | 'bolt' | 'drop' | 'shield' | 'map' | 'spark' | 'x' | 'home' | 'work'; size?: number }) {
  const p: Record<string, ReactNode> = {
    upload: <><path d="M12 16V4m0 0-4 4m4-4 4 4" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
    print: <><path d="M6 9V3h12v6" /><rect x="6" y="14" width="12" height="7" rx="1" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
    file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    drop: <path d="M12 2.7s-6 6.8-6 11.3a6 6 0 0 0 12 0c0-4.5-6-11.3-6-11.3z" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    map: <><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3z" /><path d="M9 3v15m6-12v15" /></>,
    spark: <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    home: <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
    work: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {p[name]}
    </svg>
  )
}
