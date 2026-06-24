import type { Access, Where } from 'payload'

export const canEditPost: Access = ({ req: { user } }) => {
  if (!user) return false
  if ((user as any).role === 'admin') return true

  if ((user as any).role === 'moderator') {
    return {
      or: [
        { status: { equals: 'draft' } } as Where,
        { status: { equals: 'review' } } as Where,
        { status: { equals: 'approved' } } as Where,
      ],
    } as Where
  }

  // author: own posts in draft only
  return {
    and: [
      { createdBy: { equals: user.id } } as Where,
      { status: { equals: 'draft' } } as Where,
    ],
  } as Where
}

export const canReadPost: Access = ({ req: { user } }) => {
  if (!user) return { status: { equals: 'published' } } as Where
  if ((user as any).role === 'admin' || (user as any).role === 'moderator') return true
  return {
    or: [
      { status: { equals: 'published' } } as Where,
      { createdBy: { equals: user.id } } as Where,
    ],
  } as Where
}
