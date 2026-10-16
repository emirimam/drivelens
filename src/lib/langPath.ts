import type { Lang } from './i18n'

/** Each language has its own crawlable home URL. */
export const LANG_PATH: Record<Lang, string> = { bs: '/', en: '/en/', de: '/de/', fr: '/fr/' }

export function langFromPath(path: string): Lang | null {
  const m = /^\/(en|de|fr)\/?$/.exec(path)
  if (m) return m[1] as Lang
  return null
}

export const isLangRoot = (path: string) => /^\/((en|de|fr)\/?)?$/.test(path)
