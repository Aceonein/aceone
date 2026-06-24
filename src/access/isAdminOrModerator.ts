import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

export const isAdminOrModerator = ({ req: { user } }: AccessArgs<User>): boolean => {
  return user?.role === 'admin' || user?.role === 'moderator'
}
