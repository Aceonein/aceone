import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { NewsletterSection } from '@/components/NewsletterSection'
import { BriefHeroAnimation } from '@/components/BriefHeroAnimation'
import { BriefClient } from '@/components/BriefClient'

export const revalidate = 300

import { font, type as t } from '@/lib/ds'
const mono = font.mono
const sans = font.sans

export default async function BriefPage() {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'aceone-briefs',
    depth: 1,
    limit: 100,
    sort: '-publishedAt',
    overrideAccess: true,
  })

  const briefs = (res.docs as any[]).map(b => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle ?? null,
    issueNumber: b.issueNumber ?? null,
    publishedAt: b.publishedAt ?? null,
    content: b.content ?? null,
    tags: (b.tags ?? []).map((t: any) => typeof t === 'object' ? (t.title ?? t.name ?? '') : t).filter(Boolean),
  }))

  const totalReaders = 1247 // static until subscriber count API is wired

  return (
    <main style={{ background: 'var(--ao-bg)', minHeight: '100vh', paddingTop: 'var(--ao-nav-h)' }}>

      {/* ── Hero ── */}
      <section className="ao-brief-hero" style={{
        borderBottom: '1px solid var(--ao-border)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animation behind hero content */}
        <BriefHeroAnimation />

        <div className="ao-brief-hero-inner" style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, padding: '56px 48px 0', boxSizing: 'border-box' }}>
          <div style={{ ...t.meta, color: 'var(--ao-t3)', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, height: 1, background: 'var(--ao-border-2)', display: 'block', flexShrink: 0 }} />
            Newsletter Archive
          </div>

          <h1 style={{ ...t.displayLg, color: 'var(--ao-t1)', marginBottom: 20, maxWidth: 580 }}>
            Market intelligence,{' '}
            <span style={{ color: 'var(--ao-accent)' }}>distilled.</span>
          </h1>

          <p style={{ fontSize: 15, lineHeight: 1.72, color: 'var(--ao-t2)', maxWidth: 480, marginBottom: 48 }}>
            Every Sunday — one financial decision explained clearly. No jargon. No agenda. Honest thinking about money from someone building in public.
          </p>

          {/* Stats row + subscribe CTA */}
          <div className="ao-brief-stats" style={{ display: 'flex', alignItems: 'stretch', borderTop: '1px solid var(--ao-border)' }}>
            {[
              { value: `• ${briefs.length}`, label: 'Editions' },
              { value: totalReaders.toLocaleString(), label: 'Readers' },
              { value: 'Every Sunday', label: 'Frequency' },
              { value: 'Free', label: 'Forever' },
            ].map(({ value, label }, i) => (
              <div key={label} className="ao-brief-stat-item" style={{ padding: '20px 24px', borderRight: '1px solid var(--ao-border)' }}>
                <div style={{ fontFamily: mono, fontSize: i === 0 ? 18 : 16, fontWeight: 700, color: 'var(--ao-t1)', lineHeight: 1, marginBottom: 5 }}>{value}</div>
                <div style={{ ...t.label, color: 'var(--ao-t3)' }}>{label}</div>
              </div>
            ))}
            <a
              href="#newsletter"
              className="ao-cta ao-brief-hero-cta"
              style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center',
                padding: '0 24px', flexShrink: 0,
                height: 'var(--ao-nav-h)', alignSelf: 'center',
                textDecoration: 'none', whiteSpace: 'nowrap',
                fontFamily: mono, fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--ao-bg)', background: 'var(--ao-t1)',
              }}
            >
              Subscribe →
            </a>
          </div>
        </div>
      </section>

      {/* ── Archive ── */}
      {briefs.length > 0 ? (
        <BriefClient briefs={briefs} />
      ) : (
        <div style={{ maxWidth: 1280, margin: '80px auto', padding: '0 48px', textAlign: 'center' }}>
          <p style={{ fontFamily: mono, fontSize: 12, color: 'var(--ao-t3)' }}>First issue dropping soon. Subscribe above to be notified.</p>
        </div>
      )}

      <NewsletterSection />
    </main>
  )
}

export const metadata = {
  title: 'The Brief — Aceone',
  description: 'Weekly financial intelligence. One idea, clearly explained. Every Sunday.',
}
