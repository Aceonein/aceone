import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const OrderedList: Block = {
  slug: 'ordered-list',
  labels: { singular: 'Ordered List', plural: 'Ordered Lists' },
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
      name: 'startNumber',
      type: 'number',
      defaultValue: 1,
    },
  ],
}
