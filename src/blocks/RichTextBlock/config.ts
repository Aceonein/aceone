import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: defaultLexical,
      required: true,
    },
  ],
}
