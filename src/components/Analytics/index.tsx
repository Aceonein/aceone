'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ao_cookie_consent'
const CONSENT_EVENT = 'ao:consent-update'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

function isConsentAccepted(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false
    return JSON.parse(stored)?.decision === 'accepted'
  } catch {
    return false
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}

export function Analytics({ measurementId }: { measurementId?: string }) {
  const [consented, setConsented] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setConsented(isConsentAccepted())

    function handleConsentUpdate(e: Event) {
      const accepted = Boolean((e as CustomEvent).detail?.accepted)
      setConsented(accepted)
      if (!accepted && measurementId) {
        ;(window as any)[`ga-disable-${measurementId}`] = true
      }
    }

    window.addEventListener(CONSENT_EVENT, handleConsentUpdate)
    return () => window.removeEventListener(CONSENT_EVENT, handleConsentUpdate)
  }, [measurementId])

  // Send page_view on every route change once consented
  useEffect(() => {
    if (!consented || !measurementId || typeof window.gtag !== 'function') return
    window.gtag('config', measurementId, { page_path: pathname })
  }, [pathname, consented, measurementId])

  if (!consented || !measurementId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${measurementId}',{anonymize_ip:true});
`}</Script>
    </>
  )
}
