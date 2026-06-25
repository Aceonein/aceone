import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const Disclaimer: Block = {
  slug: 'disclaimer',
  labels: { singular: 'Disclaimer', plural: 'Disclaimers' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: defaultLexical,
      defaultValue: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The information provided in this article is for educational purposes only and should not be considered financial advice. Please consult with a qualified financial advisor before making any investment decisions.',
                },
              ],
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
}
