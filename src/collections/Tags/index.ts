import type { CollectionConfig } from 'payload'
import { isAdmin } from '../../access/isAdmin'
import { anyone } from '../../access/anyone'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
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
