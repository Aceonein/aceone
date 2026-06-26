import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: isAdmin,
    read: () => true,
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
      type: 'select',
      defaultValue: 'indigo',
      options: [
        { label: 'Indigo (default)', value: 'indigo' },
        { label: 'Cobalt',          value: 'cobalt' },
        { label: 'Teal',            value: 'teal' },
        { label: 'Emerald',         value: 'emerald' },
        { label: 'Amber',           value: 'amber' },
        { label: 'Crimson',         value: 'crimson' },
        { label: 'Violet',          value: 'violet' },
        { label: 'Rose',            value: 'rose' },
        { label: 'Slate',           value: 'slate' },
        { label: 'Chartreuse',      value: 'chartreuse' },
      ],
      admin: { description: 'Highlight color used across the site for this category' },
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
