import type { Block } from 'payload'

export const Table: Block = {
  slug: 'table',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'headers',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'cells',
          type: 'array',
          fields: [{ name: 'text', type: 'text' }],
        },
      ],
    },
    {
      name: 'stripedRows',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'compactMode',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
