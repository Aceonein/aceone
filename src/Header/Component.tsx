import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { HeaderClient } from './Component.client'

function resolveFooterLink(item: any): { href: string; label: string } {
  const l = item?.link ?? {}
  const href =
    l.type === 'custom'
      ? (l.url ?? '#')
      : l.reference?.value?.slug
        ? `/${l.reference.value.slug}`
        : '#'
  return { href, label: l.label ?? '' }
}

const FALLBACK_FOOTER_COLS = [
  {
    heading: 'Content',
    links: [
      { label: 'Personal Finance', href: '/?cat=personal-finance' },
      { label: 'Investing', href: '/?cat=investing' },
      { label: 'Markets', href: '/?cat=markets' },
      { label: 'Policy', href: '/?cat=policy' },
      { label: 'Crypto', href: '/?cat=crypto' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'The Brief', href: '/the-brief' },
      { label: 'Admin', href: '/admin' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

export async function Header() {
  const [headerData, footerData] = await Promise.all([
    getCachedGlobal('header', 1)().catch(() => null),
    getCachedGlobal('footer', 1)().catch(() => null),
  ])

  const navItems = (headerData as any)?.navItems ?? []
  const footer = footerData as any
  const footerCols = footer?.columns?.length
    ? footer.columns.map((col: any) => ({
        heading: col.heading ?? '',
        links: (col.links ?? []).map(resolveFooterLink),
      }))
    : FALLBACK_FOOTER_COLS

  return <HeaderClient navItems={navItems} footerCols={footerCols} />
}
