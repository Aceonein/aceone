import React from 'react'
import type { Page } from '@/payload-types'

type Props = Page['hero'] & { id?: string }

export const TextOnlyHero: React.FC<Props> = ({ headline, subhead }) => {
  return (
    <section
      style={{
        width: '100%',
        padding: '72px 32px 48px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      {headline && (
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: 'var(--ao-t1, #edeae3)',
            margin: '0 0 16px',
            maxWidth: 800,
          }}
        >
          {headline}
        </h1>
      )}
      {subhead && (
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: 'var(--ao-t3, #6b7296)',
            margin: 0,
            maxWidth: 560,
          }}
        >
          {subhead}
        </p>
      )}
    </section>
  )
}
