import { useRef, useState } from 'react'
import type { Key } from '../lib/i18n'
import { Icon } from './ui'

interface Props {
  t: (k: Key, v?: Record<string, string | number>) => string
  onFile: (text: string, name: string) => void
  onDemo: () => void
  error: string | null
  topBar: React.ReactNode
}

export function Landing({ t, onFile, onDemo, error, topBar }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  const read = (f: File | undefined) => {
    if (!f) return
    const r = new FileReader()
    r.onload = () => onFile(String(r.result ?? ''), f.name)
    r.readAsText(f)
  }

  const feats: { icon: 'bolt' | 'drop' | 'map' | 'spark'; title: Key; text: Key; color: string }[] = [
    { icon: 'bolt', title: 'feat1', text: 'feat1d', color: 'var(--el)' },
    { icon: 'drop', title: 'feat2', text: 'feat2d', color: 'var(--fuel)' },
    { icon: 'map', title: 'feat3', text: 'feat3d', color: 'var(--dist)' },
    { icon: 'spark', title: 'feat4', text: 'feat4d', color: 'var(--gold)' },
  ]

  return (
    <div className="min-h-dvh">
      <header className="grain text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
          {topBar}
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center pt-8 sm:pt-14">
            <div className="fade-in">
              <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'var(--gold2)' }}>{t('tagline')}</p>
              <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] mt-3">
                {t('heroTitle')}
                <br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, var(--gold2), var(--el2))' }}>{t('heroTitle2')}</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-white/75 max-w-xl">{t('heroText')}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/70">
                <Icon name="shield" size={16} /> {t('privacy')}
              </p>
            </div>

            <div className="fade-in" style={{ animationDelay: '.1s' }}>
              <button
                type="button"
                onClick={() => input.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files[0]) }}
                className="w-full rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer outline-none focus-visible:ring-4"
                style={{
                  background: drag ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.06)',
                  border: `2px dashed ${drag ? 'var(--gold2)' : 'rgba(255,255,255,.25)'}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="mx-auto mb-4 grid place-items-center w-16 h-16 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: '#15131b' }}>
                  <Icon name="upload" size={28} />
                </span>
                <span className="block font-display text-xl font-bold">{t('drop')}</span>
                <span className="block text-white/60 mt-1 text-sm">{t('dropOr')}</span>
              </button>
              <input ref={input} type="file" accept=".csv,text/csv,text/plain" className="hidden" onChange={(e) => read(e.target.files?.[0])} />
              {error && <p role="alert" className="mt-3 text-sm rounded-xl px-4 py-3" style={{ background: 'rgba(248,113,113,.15)', color: '#fecaca' }}>{error}</p>}
              <button type="button" onClick={onDemo} className="mt-4 w-full rounded-2xl py-3.5 font-semibold transition hover:brightness-110" style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)' }}>
                {t('demo')} →
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {feats.map((f) => (
            <div key={f.title} className="card p-5 fade-in">
              <span className="grid place-items-center w-10 h-10 rounded-xl mb-3" style={{ background: `color-mix(in oklab, ${f.color} 15%, transparent)`, color: f.color }}>
                <Icon name={f.icon} />
              </span>
              <div className="font-semibold">{t(f.title)}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--t2)' }}>{t(f.text)}</div>
            </div>
          ))}
        </div>

        <div className="card p-6 mt-6">
          <h2 className="font-display text-xl font-bold mb-4">{t('howTitle')}</h2>
          <ol className="grid sm:grid-cols-4 gap-4">
            {(['how1', 'how2', 'how3', 'how4'] as Key[]).map((k, i) => (
              <li key={k} className="flex gap-3">
                <span className="font-display font-extrabold text-2xl" style={{ color: 'var(--gold)' }}>{i + 1}</span>
                <span className="text-sm" style={{ color: 'var(--t2)' }}>{t(k)}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-xs text-center mt-8" style={{ color: 'var(--t3)' }}>{t('disclaimer')}</p>
      </main>
    </div>
  )
}
