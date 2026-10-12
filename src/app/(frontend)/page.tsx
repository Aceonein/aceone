import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { EmiCalculator } from '@/components/EmiCalculator'
import { HeroCanvas } from '@/components/HeroCanvas'
import { NewsletterSection } from '@/components/NewsletterSection'
import { RevealInit } from '@/components/RevealInit'
import { catColor } from '@/utilities/catColor'
import { mediaImage } from '@/utilities/getMediaUrl'

export const revalidate = 60

const TICKER_ITEMS = [
  ['"No-cost" EMI', ' is never free'],
  ['Effective rate on 0% EMI can hit ', '28% p.a.'],
  ['FOIR above 50% = most banks reject your loan', null],
  ['Processing fee + 18% GST: ', '₹472 on average'],
  ['CIBIL ≥ 750 unlocks meaningfully better rates', null],
  ['Reward points expire in ', '2–3 years'],
] as const

function fmtDate(iso?: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const postsRes = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 3,
    sort: '-publishedAt',
    draft: false,
    overrideAccess: false,
    select: {
      title: true, slug: true, excerpt: true, publishedAt: true,
      readTime: true, featuredImage: true, categories: true, author: true,
    },
  })
  const posts = postsRes.docs as any[]

  return (
    <main style={{ background: 'var(--ao-bg)', minHeight: '100vh' }}>
      <RevealInit />

      {/* ── HERO ── */}
      <section className="hp-hero">
        <HeroCanvas />
        <div className="hp-hero-inner">
        <div className="hp-hero-left">
          <div className="hp-hero-eyebrow">
            <span className="hp-eyebrow-line" />
            <span className="hp-eyebrow-text">Beta · Free to use · No account needed</span>
          </div>
          <h1 className="hp-hero-h1">The smart money blog for young India</h1>
          <p className="hp-hero-sub">
            Tools that show what financial products actually cost. Analysis that tells you what banks
            won't. Written for people who never got this in school.
          </p>
          <div className="hp-hero-btns">
            <Link href="/blog" className="hp-btn-primary">Read the blog →</Link>
            <Link href="#tools" className="hp-btn-secondary">Try a tool</Link>
          </div>
        </div>

        <div className="hp-hero-tool-col">
          <div className="hp-htc-panel">
            <div className="hp-htc-bar">
              <div className="hp-htc-dots">
                <div className="hp-htc-dot" style={{ background: '#ef4444', opacity: 0.5 }} />
                <div className="hp-htc-dot" style={{ background: '#f59e0b', opacity: 0.5 }} />
                <div className="hp-htc-dot" style={{ background: '#22c55e', opacity: 0.5 }} />
              </div>
              <div className="hp-htc-title">EMI Exposer</div>
              <div className="hp-htc-live">
                <div className="hp-htc-live-dot" />
                Live
              </div>
            </div>
            <EmiCalculator />
          </div>
        </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="hp-ticker" aria-hidden="true">
        <div className="hp-ticker-track">
          {[0, 1].map(pass =>
            TICKER_ITEMS.map(([text, strong], i) => (
              <span key={`${pass}-${i}`} className="hp-ti">
                <span className="hp-ti-sep" />
                {strong ? (
                  <>
                    {text}
                    <strong>{strong}</strong>
                  </>
                ) : (
                  text
                )}
              </span>
            )),
          )}
        </div>
      </div>

      {/* ── TOOLS ── */}
      <section className="hp-tools-section" id="tools">
        <div className="hp-section-bar">
          <div className="hp-section-bar-inner">
            <div className="hp-sec-label">
              <span className="hp-sec-label-line" />
              <span className="hp-sec-label-text">Tools · Free, no account</span>
            </div>
            <span className="hp-sec-right">1 live · 4 in progress</span>
          </div>
        </div>
        <div className="hp-tools-grid">
          <Link href="/tools/emi" className="hp-tool-card hp-tool-card-feat hp-tc-indigo hp-reveal">
            <span className="hp-tc-badge hp-tc-badge-live">● Live now</span>
            <div className="hp-tc-name">No-Cost EMI Exposer</div>
            <div className="hp-tc-desc">
              Find out what your "0% interest" EMI actually costs — price inflation baked into the
              marked-up price, processing fee, 18% GST on that fee. Enter any price and get the
              effective annual rate in seconds.
            </div>
            <span className="hp-tc-arrow">Try it → aceone.in/tools/emi</span>
          </Link>
          <a href="#tools" className="hp-tool-card hp-tc-amber hp-reveal" data-delay="80">
            <span className="hp-tc-badge hp-tc-badge-soon">Coming soon</span>
            <div className="hp-tc-name">Can You Afford It?</div>
            <div className="hp-tc-desc">
              Salary + existing EMIs + price → honest yes, stretch, or no, with the full reasoning.
            </div>
            <span className="hp-tc-arrow">Notify me →</span>
          </a>
          <a href="#tools" className="hp-tool-card hp-tc-teal hp-reveal" data-delay="160">
            <span className="hp-tc-badge hp-tc-badge-soon">Coming soon</span>
            <div className="hp-tc-name">FOIR Reality Check</div>
            <div className="hp-tc-desc">
              Know your borrowing headroom before your bank does. See exactly where you stand.
            </div>
            <span className="hp-tc-arrow">Notify me →</span>
          </a>
          <a href="#tools" className="hp-tool-card hp-tc-emerald hp-reveal" data-delay="80">
            <span className="hp-tc-badge hp-tc-badge-soon">Coming soon</span>
            <div className="hp-tc-name">Salary Decoder</div>
            <div className="hp-tc-desc">
              CTC → what actually lands in your account. PF, gratuity, professional tax, insurance —
              all of it.
            </div>
            <span className="hp-tc-arrow">Notify me →</span>
          </a>
          <a
            href="#tools"
            className="hp-tool-card hp-tool-card-wide hp-tc-crimson hp-reveal"
            data-delay="160"
          >
            <span className="hp-tc-badge hp-tc-badge-soon">Coming soon</span>
            <div className="hp-tc-name">Credit Card True Cost</div>
            <div className="hp-tc-desc">
              Annual fee vs actual rewards earned per year. Is your card worth keeping?
            </div>
            <span className="hp-tc-arrow">Notify me →</span>
          </a>
        </div>
      </section>

      {/* ── BLOG PREVIEW ── */}
      {posts.length > 0 && (
        <section className="hp-blog-section">
          <div className="hp-section-bar">
            <div className="hp-section-bar-inner">
              <div className="hp-sec-label">
                <span className="hp-sec-label-line" />
                <span className="hp-sec-label-text">From the blog</span>
              </div>
              <Link href="/blog" className="hp-see-all">All articles →</Link>
            </div>
          </div>
          <div className="hp-blog-grid">
            {posts.map((post, i) => {
              const cat =
                typeof post.categories?.[0] === 'object' ? post.categories[0] : null
              const author = typeof post.author === 'object' ? post.author : null
              const img = typeof post.featuredImage === 'object' ? post.featuredImage : null
              const color = catColor(cat?.color)
              const { src, objectPosition } = img ? mediaImage(img) : { src: '', objectPosition: '50% 50%' }
              const date = fmtDate(post.publishedAt)
              const featured = i === 0

              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className={`hp-post-card${featured ? ' hp-post-card-feat' : ''} hp-reveal`}
                  data-delay={i * 80}
                >
                  <div className="hp-pc-img">
                    {src ? (
                      <img src={src} alt={img?.alt ?? post.title} style={{ objectPosition }} />
                    ) : (
                      <span className="hp-pc-img-ph">Cover Image</span>
                    )}
                  </div>
                  {cat?.title && (
                    <div className="hp-pc-cat" style={{ color }}>
                      <span className="hp-pc-dot" style={{ background: color }} />
                      {cat.title}
                    </div>
                  )}
                  <div className="hp-pc-title">{post.title}</div>
                  {post.excerpt && <div className="hp-pc-excerpt">{post.excerpt}</div>}
                  <div className="hp-pc-meta">
                    {author?.name && <span>{author.name}</span>}
                    {author?.name && date && <span className="hp-pc-sep">/</span>}
                    {date && <span>{date}</span>}
                    {post.readTime && (
                      <>
                        <span className="hp-pc-sep">/</span>
                        <span>{post.readTime} min</span>
                      </>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <NewsletterSection />
    </main>
  )
}

export const metadata = {
  title: 'Aceone — The smart money blog for young India',
  description: 'Financial clarity for a generation that never got it in school.',
}
