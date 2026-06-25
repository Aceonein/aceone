import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const Accordion: Block = {
  slug: 'accordion',
  labels: { singular: 'Accordion', plural: 'Accordions' },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: defaultLexical,
          required: true,
        },
        {
          name: 'defaultOpen',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'allowMultipleOpen',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
