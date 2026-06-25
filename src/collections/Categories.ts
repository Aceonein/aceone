import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { anyone } from '../access/anyone'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 50,
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
    },
    {
      name: 'color',
      type: 'text',
      defaultValue: '#000000',
      admin: { description: 'Hex color for UI e.g. #00c896' },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional SVG icon' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Sort order on frontend' },
    },
    slugField(),
  ],
}
