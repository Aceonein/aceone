import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { SetStepNav } from '@payloadcms/ui'
import React from 'react'

import GenerateImageView from '@/components/GenerateImageView'

// Payload renders custom views bare; wrap in the default template to get the nav, header and theme toggle.
export default function GenerateImagePage({ initPageResult, params, searchParams }: AdminViewServerProps) {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      viewActions={initPageResult.req.payload.config.admin?.components?.actions}
      visibleEntities={initPageResult.visibleEntities}
    >
      <SetStepNav nav={[{ label: 'Generate image' }]} />
      <GenerateImageView />
    </DefaultTemplate>
  )
}
