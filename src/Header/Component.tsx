import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { HeaderClient } from './Component.client'

export async function Header() {
  const data = await getCachedGlobal('header', 1)()
  const navItems = (data as any)?.navItems ?? []
  return <HeaderClient navItems={navItems} />
}
