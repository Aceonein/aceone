import React from 'react'
import Link from 'next/link'
import RichText from '@/components/RichText'
import type { Post } from '@/payload-types'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ className, docs, introContent }) => {
  if (!docs?.length) return null

  return (
    <div className={className} style={{ marginTop: 60 }}>
      {introContent && <RichText data={introContent} enableGutter={false} />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20, marginTop: 24 }}>
        {docs.map((doc, i) => {
          if (typeof doc === 'string') return null
          return (
            <Link key={i} href={`/posts/${doc.slug}`} style={{ textDecoration: 'none', display: 'block', padding: 20, background: 'var(--ao-card-bg)', border: '1px solid var(--ao-card-bdr)', borderRadius: 12 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 700, color: 'var(--ao-t1)', lineHeight: 1.3 }}>{doc.title}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
