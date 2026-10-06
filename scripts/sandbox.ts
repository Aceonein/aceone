/**
 * Disposable local admin sandbox: in-memory MongoDB + local file storage, seeded with test data.
 * Never touches Atlas, R2, Upstash or OpenAI. Run: npm run dev:sandbox  (http://localhost:3100/admin)
 */
import { spawn, spawnSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { MongoMemoryServer } from 'mongodb-memory-server'

const PORT = '3100'
const realEnv = { ...process.env }
// Next/Payload rewrite these on startup; put them back on exit so the sandbox leaves no diff
const AUTO_EDITED = ['tsconfig.json', 'src/payload-types.ts']
const originals = AUTO_EDITED.map((f) => [f, readFileSync(f, 'utf8')] as const)
const restore = () => originals.forEach(([f, c]) => writeFileSync(f, c))

async function main() {
  rmSync('media', { recursive: true, force: true }) // uploads from a previous sandbox run
  const mongo = await MongoMemoryServer.create({ instance: { dbName: 'aceone-sandbox' } })
  const env = {
    ...process.env,
    NODE_OPTIONS: '--no-deprecation',
    AO_SANDBOX: '1',
    DATABASE_URL: mongo.getUri('aceone-sandbox'),
    PAYLOAD_SECRET: 'sandbox-secret-not-for-production',
    NEXT_PUBLIC_SERVER_URL: `http://localhost:${PORT}`,
    PREVIEW_SECRET: 'sandbox-preview',
    CRON_SECRET: 'sandbox-cron',
    OPENAI_API_KEY: 'sandbox-unused',
    R2_BUCKET: '',
    R2_ACCESS_KEY_ID: '',
    R2_SECRET_ACCESS_KEY: '',
    R2_ENDPOINT: '',
    R2_PUBLIC_URL: '',
    UPSTASH_REDIS_REST_URL: '',
    UPSTASH_REDIS_REST_TOKEN: '',
    SUPABASE_URL: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    RESEND_API_KEY: '',
    CLOUDFLARE_ACCOUNT_ID: '',
    CLOUDFLARE_API_TOKEN: '',
  }

  Object.assign(process.env, env)
  console.log('[sandbox] seeding test data...')
  const { seedSandbox } = await import('./sandbox-seed')
  await seedSandbox()

  console.log(`[sandbox] starting Next on http://localhost:${PORT}`)
  const next = spawn('npx', ['next', 'dev', '-p', PORT], { env, stdio: 'inherit' })
  const stop = async () => {
    next.kill('SIGINT')
    await mongo.stop()
    restore()
    rmSync('media', { recursive: true, force: true })
    // The sandbox runs without R2, which makes Payload rewrite the import map without the storage entries.
    // Regenerate it with the real environment so the committed file stays production-correct.
    spawnSync('npm', ['run', 'generate:importmap'], { env: realEnv, stdio: 'ignore' })
    process.exit(0)
  }
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
  next.on('exit', stop)
}

main()
