import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Optional Umami (cookieless) analytics, enabled by setting VITE_UMAMI_ID at build time.
const umamiId = import.meta.env.VITE_UMAMI_ID as string | undefined
if (umamiId) {
  const sc = document.createElement('script')
  sc.defer = true
  sc.src = (import.meta.env.VITE_UMAMI_SRC as string | undefined) || 'https://cloud.umami.is/script.js'
  sc.dataset.websiteId = umamiId
  sc.dataset.doNotTrack = 'true'
  document.head.appendChild(sc)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
