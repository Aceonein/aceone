import { seed } from '@/endpoints/seed'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { PayloadRequest } from 'payload'

export async function POST(request: Request): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Seed is disabled in production' }, { status: 403 })
  }

  const authHeader = request.headers.get('authorization')
  if (!process.env.SEED_SECRET || authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })
  try {
    await seed({ payload, req: {} as PayloadRequest })
    return Response.json({ ok: true, message: 'Seed complete.' })
  } catch (err: any) {
    const detail = err?.data ?? err?.errors ?? err?.stack ?? ''
    return Response.json({ ok: false, error: err.message, detail }, { status: 500 })
  }
}
