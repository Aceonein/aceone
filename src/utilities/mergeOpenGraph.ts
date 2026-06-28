import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Financial clarity for a generation that never got it in school.',
  images: [
    {
      url: `${getServerSideURL()}/og-default.webp`,
    },
  ],
  siteName: 'Aceone',
  title: 'Aceone — The smart money blog for young India',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
