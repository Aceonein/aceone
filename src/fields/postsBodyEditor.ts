import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  TextStateFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  defaultColors,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import type { TextFieldSingleValidation } from 'payload'

import { DataBox } from '../blocks/DataBox/config'
import { PullQuote } from '../blocks/PullQuote/config'
import { SectionMarker } from '../blocks/SectionMarker/config'
import { Spacer } from '../blocks/Spacer/config'
import { Disclaimer } from '../blocks/Disclaimer/config'
import { Accordion } from '../blocks/Accordion/config'

export const postsBodyEditor = lexicalEditor({
  features: [
    // ── Layout ───────────────────────────────────────────────
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    AlignFeature(),
    IndentFeature(),

    // ── Inline formatting ─────────────────────────────────────
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    InlineCodeFeature(),

    // ── Text colour + highlight ───────────────────────────────
    TextStateFeature({
      state: {
        color: {
          ...defaultColors.text,
        },
        background: {
          ...defaultColors.background,
        },
      },
    }),

    // ── Lists ─────────────────────────────────────────────────
    UnorderedListFeature(),
    OrderedListFeature(),
    ChecklistFeature(),

    // ── Block elements ────────────────────────────────────────
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    EXPERIMENTAL_TableFeature(),

    // ── Media inline ──────────────────────────────────────────
    UploadFeature({
      collections: {
        media: {
          fields: [
            { name: 'alt', type: 'text', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
      },
    }),

    // ── Links ─────────────────────────────────────────────────
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })
        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data: any, siblingData: any) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }: any) => t('fields:enterURL'),
            required: true,
            validate: ((value: any, options: any) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') return true
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),

    // ── Custom blocks (DataBox, PullQuote, etc.) ───────
    BlocksFeature({
      blocks: [DataBox, PullQuote, SectionMarker, Spacer, Disclaimer, Accordion],
    }),

    // ── Toolbars ──────────────────────────────────────────────
    FixedToolbarFeature({ applyToFocusedEditor: true }),
    InlineToolbarFeature(),
  ],
})
