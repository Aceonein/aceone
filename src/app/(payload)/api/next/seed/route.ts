import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { seed } from '@/endpoints/seed'

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed is disabled in production' }, { status: 403 })
  }

  const authHeader = request.headers.get('authorization')
  if (!process.env.SEED_SECRET || authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    await seed({ payload, req: request as any })
    return NextResponse.json({ success: true, message: 'Seed completed' })
  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: 'Seed failed', detail: err?.message }, { status: 500 })
  }
}
