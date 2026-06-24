import React from 'react'
import type { Post } from '@/payload-types'

// ponytail: placeholder — full post hero built in frontend phase
export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="container py-8">
      <h1>{post.title}</h1>
    </div>
  )
}
