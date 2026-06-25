import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const UnorderedList: Block = {
  slug: 'unordered-list',
  labels: { singular: 'Unordered List', plural: 'Unordered Lists' },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'richText',
          editor: defaultLexical,
          required: true,
        },
      ],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'disc',
      options: [
        { label: 'Disc', value: 'disc' },
        { label: 'Circle', value: 'circle' },
        { label: 'Square', value: 'square' },
      ],
    },
  ],
}
