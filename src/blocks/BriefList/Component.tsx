import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import type { BriefListBlock as BriefListBlockProps } from '@/payload-types'

type Props = BriefListBlockProps & {
  searchParams?: { page?: string }
}

export const BriefListBlock: React.FC<Props> = async ({ issuesPerPage = 9, searchParams }) => {
  const payload = await getPayload({ config: configPromise })
  const page = Number(searchParams?.page ?? 1)

  const result = await payload.find({
    collection: 'aceone-briefs',
    depth: 1,
    limit: issuesPerPage ?? 9,
    page,
    sort: '-publishedAt',
    where: { status: { in: ['scheduled', 'sent'] } },
  })

  const issues = result.docs
  const totalPages = result.totalPages

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>
      {issues.length === 0 ? (
        <p style={{ color: 'var(--ao-t3, #6b7296)', fontSize: 15 }}>No issues published yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 28,
            marginBottom: 48,
          }}
        >
          {issues.map((issue) => (
            <BriefCard key={issue.id} issue={issue as any} />
          ))}
        </div>
      )}

      {totalPages > 1 && <Pagination current={page} total={totalPages} />}
    </div>
  )
}

function BriefCard({ issue }: { issue: any }) {
  const image = typeof issue.coverImage === 'object' ? issue.coverImage : null
  const imgUrl = (image as any)?.sizes?.medium?.url ?? (image as any)?.url ?? ''

  return (
    <Link
      href={`/the-brief/${issue.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
    >
      {imgUrl && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden',
            borderRadius: 8,
            marginBottom: 16,
            background: '#1a1d26',
          }}
        >
          <img
            src={imgUrl}
            alt={issue.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        {issue.issueNumber && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#6fa0f8',
            }}
          >
            Issue #{issue.issueNumber}
          </span>
        )}
        {issue.publishedAt && (
          <span style={{ fontSize: 11, color: 'var(--ao-t4, #4c566a)' }}>
            {new Date(issue.publishedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )}
      </div>
      <h3
        style={{
          fontSize: 17,
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'var(--ao-t1, #edeae3)',
          margin: '0 0 8px',
          letterSpacing: '-0.01em',
        }}
      >
        {issue.title}
      </h3>
      {issue.emailPreviewText && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--ao-t3, #6b7296)',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {issue.emailPreviewText}
        </p>
      )}
    </Link>
  )
}

function Pagination({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {current > 1 && (
        <a
          href={`?page=${current - 1}`}
          style={pageBtn()}
        >
          ← Prev
        </a>
      )}
      <span style={{ ...pageBtn(), cursor: 'default', opacity: 0.5 }}>
        {current} / {total}
      </span>
      {current < total && (
        <a href={`?page=${current + 1}`} style={pageBtn()}>
          Next →
        </a>
      )}
    </div>
  )
}

function pageBtn(): React.CSSProperties {
  return {
    display: 'inline-block',
    padding: '8px 20px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--ao-t3, #6b7296)',
    background: 'transparent',
  }
}
