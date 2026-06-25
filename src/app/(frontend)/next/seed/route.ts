import { seed } from '@/endpoints/seed'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { PayloadRequest } from 'payload'

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  try {
    await seed({ payload, req: {} as PayloadRequest })
    return Response.json({ ok: true, message: 'Seed complete.' })
  } catch (err: any) {
    const detail = err?.data ?? err?.errors ?? err?.stack ?? ''
    return Response.json({ ok: false, error: err.message, detail }, { status: 500 })
  }
}
