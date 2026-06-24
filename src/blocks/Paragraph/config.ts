import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const Paragraph: Block = {
  slug: 'paragraph',
  labels: { singular: 'Paragraph', plural: 'Paragraphs' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: defaultLexical,
      required: true,
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' },
      ],
    },
  ],
}
