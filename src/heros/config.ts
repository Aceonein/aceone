import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        { label: 'None',                      value: 'none' },
        { label: 'High Impact',               value: 'highImpact' },
        { label: 'Medium Impact',             value: 'mediumImpact' },
        { label: 'Low Impact',                value: 'lowImpact' },
        { label: 'Cover Story (Blog Home)',   value: 'coverStory' },
        { label: 'Text Only (No Image)',      value: 'textOnly' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    // Cover Story: optional override — if empty, auto-picks top post by views+upvotes
    {
      name: 'coverStoryOverride',
      label: 'Featured Post (override)',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        condition: (_, { type } = {}) => type === 'coverStory',
        description: 'Leave blank to auto-select the top post by views + upvotes',
      },
    },
    // Text Only: headline + subhead
    {
      name: 'headline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'textOnly',
      },
    },
    {
      name: 'subhead',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'textOnly',
      },
    },
  ],
  label: false,
}
