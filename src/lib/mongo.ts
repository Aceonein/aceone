import { MongoClient, type Collection } from 'mongodb'

// Lightweight DB access for hot, tiny endpoints (view/upvote counters). Using the driver directly avoids
// booting all of Payload on a cold serverless start (2-19s) — this connects in ~300ms.
// Same DATABASE_URL/db as Payload; the client is cached across invocations of a warm instance.
const globalForMongo = globalThis as unknown as { __aoMongo?: Promise<MongoClient> }

function client(): Promise<MongoClient> {
  globalForMongo.__aoMongo ??= new MongoClient(process.env.DATABASE_URL || '', {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 8000,
  }).connect()
  return globalForMongo.__aoMongo
}

export async function postsCollection(): Promise<Collection> {
  return (await client()).db().collection('posts')
}
