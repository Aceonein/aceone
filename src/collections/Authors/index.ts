import type { CollectionConfig } from 'payload'
import { isAdmin } from '../../access/isAdmin'
import { anyone } from '../../access/anyone'

export const Authors: CollectionConfig = {
  slug: 'authors',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: ({ req: { user } }) =>
      user?.role === 'admin' || (user as any)?.role === 'moderator',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'designation', 'updatedAt'],
    hidden: ({ user }) => (user as any)?.role === 'author',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'designation',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Senior Financial Analyst' },
    },
    {
      name: 'title',
      type: 'text',
      admin: { description: 'e.g. Dr., CFA (optional)' },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: { description: 'Max 500 characters' },
    },
    {
      name: 'expertise',
      type: 'array',
      fields: [{ name: 'area', type: 'text', required: true }],
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'twitter',
      type: 'text',
      admin: { description: 'Username only (no @)' },
    },
    {
      name: 'linkedin',
      type: 'text',
      admin: { description: 'Full profile URL' },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Linked user account',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (args: any) => {
            const { value, data } = args
            if (data?.name && !value) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
  ],
  timestamps: true,
}
