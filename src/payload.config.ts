import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { AceoneBriefs } from './collections/AceoneBriefs'
import { Media } from './collections/Media'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [Authors, AceoneBriefs, Categories, Media, NewsletterSubscribers, Pages, Posts, Tags, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    ...(process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_ENDPOINT
      ? [s3Storage({
          collections: {
            media: {
              prefix: 'media',
              generateFileURL: ({ filename, prefix }) =>
                `${process.env.R2_PUBLIC_URL}/${prefix}/${filename}`,
            },
          },
          bucket: process.env.R2_BUCKET,
          config: {
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT,
          },
        })]
      : []),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  routes: [
    {
      method: 'post',
      path: '/next/seed',
      handler: async (req: any, res: any) => {
        try {
          const { seed: seedFn } = await import('@/endpoints/seed')
          await seedFn({ payload: req.payload, req })
          return res.status(200).json({ success: true, message: 'Seed completed' })
        } catch (err: any) {
          console.error('Seed error:', err)
          return res.status(500).json({ error: 'Seed failed', detail: err?.message })
        }
      },
    },
  ] as any,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
