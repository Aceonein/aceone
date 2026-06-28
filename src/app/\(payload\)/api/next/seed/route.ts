import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { seed } from '@/endpoints/seed'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    await seed({ payload, req: request as any })
    return NextResponse.json({ success: true, message: 'Seed completed' })
  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: 'Seed failed', detail: err?.message }, { status: 500 })
  }
}
