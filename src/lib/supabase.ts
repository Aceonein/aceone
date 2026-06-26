import { createClient } from '@supabase/supabase-js'

let _client: ReturnType<typeof createClient> | null = null

// Server-side only — uses service role key to bypass RLS for audit log inserts
export function getSupabase() {
  if (!_client) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return null
    _client = createClient(url, key, { auth: { persistSession: false } })
  }
  return _client
}
