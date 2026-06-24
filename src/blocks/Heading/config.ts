import type { Block } from 'payload'

export const Heading: Block = {
  slug: 'heading',
  labels: { singular: 'Heading', plural: 'Headings' },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'h2',
      options: [
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'H5', value: 'h5' },
        { label: 'H6', value: 'h6' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'id',
      type: 'text',
      admin: { description: 'Optional anchor ID for TOC links' },
    },
  ],
}
