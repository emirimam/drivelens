import { useEffect, useState } from 'react'
import type { Analysis } from '../lib/analyze'
import type { Key } from '../lib/i18n'
import type { makeFmt } from '../lib/i18n'
import { renderShareImage } from '../lib/shareImage'
import { bucket, track } from '../lib/track'
import { Icon } from './ui'

interface Props {
  a: Analysis
  t: (k: Key, v?: Record<string, string | number>) => string
  f: ReturnType<typeof makeFmt>
  cur: string
  onClose: () => void
}

const FILE = 'drivelens-izvjestaj.jpg'

export function ShareDialog({ a, t, f, cur, onClose }: Props) {
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let alive = true
    let made: string | null = null
    renderShareImage({
      a,
      n: f.n,
      date: f.date,
      cur,
      txt: {
        title: t('shTitle'),
        trips: t('trips'),
        days: t('drivingDays'),
        electric: t('shElectric'),
        engine: t('shEngine'),
        saved: t('shSaved'),
        longest: t('shLongest'),
        maxDay: t('shMaxDay'),
        evStreak: t('shEvStreak'),
        per100: t('shPer100'),
        avgSpeed: t('gSpeed'),
        cta: t('shCta'),
      },
    })
      .then((b) => {
        if (!alive) return
        made = URL.createObjectURL(b)
        setBlob(b)
        setUrl(made)
      })
      .catch(() => alive && setErr(true))
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      alive = false
      window.removeEventListener('keydown', onKey)
      if (made) URL.revokeObjectURL(made)
    }
  }, [a, f, t, cur, onClose])

  const props = { pt: a.powertrain, el: bucket(Math.round(a.energy.elShare * 100), [10, 25, 50, 75, 100]) }
  const file = blob ? new File([blob], FILE, { type: 'image/jpeg' }) : null
  const canNative = !!file && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })

  const download = () => {
    if (!url) return
    const el = document.createElement('a')
    el.href = url
    el.download = FILE
    el.click()
    track('share_download', props)
  }
  const share = async () => {
    if (!file) return
    try {
      await navigator.share({ files: [file], title: 'DriveLens', text: t('shShareText'), url: 'https://drivelens-one.vercel.app/' })
      track('share_native', props)
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="fixed inset-0 z-[900] grid place-items-center p-4 no-print" style={{ background: 'rgba(5,5,10,.72)', backdropFilter: 'blur(6px)' }} role="dialog" aria-modal="true" aria-label={t('share')} onClick={onClose}>
      <div className="card w-full max-w-md p-4 sm:p-5 max-h-[94dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-display text-lg font-bold">{t('share')}</h2>
          <button type="button" onClick={onClose} aria-label="Zatvori" className="w-9 h-9 grid place-items-center rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}><Icon name="x" /></button>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '1080 / 1350', background: '#0b0b10' }}>
          {url ? <img src={url} alt={t('shTitle')} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-sm text-white/60">{err ? t('shError') : '…'}</div>}
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--t3)' }}>{t('shPrivacy')}</p>
        <div className={`grid gap-2 mt-3 ${canNative ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {canNative && (
            <button type="button" onClick={share} className="rounded-2xl py-3 font-semibold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: '#15131b' }}>{t('shShare')}</button>
          )}
          <button type="button" onClick={download} disabled={!url} className="rounded-2xl py-3 font-semibold disabled:opacity-50" style={canNative ? { background: 'var(--card)', border: '1px solid var(--line)' } : { background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: '#15131b' }}>{t('shDownload')}</button>
        </div>
      </div>
    </div>
  )
}
