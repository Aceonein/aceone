'use client'

import { useState } from 'react'

export function AuthorAvatar({ name, url, accent }: { name: string; url?: string | null; accent: string }) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(url) && !failed

  return (
    <div
      className="ao-author-avatar"
      style={{ border: `1px solid ${accent}`, color: accent }}
      aria-hidden={showImage ? undefined : true}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url!} alt={name} width={56} height={56} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  )
}
