import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  // Add connection pooling
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      pool: {
        min: 2,
        max: 10
      }
    }
  }
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Cache for frequently accessed data
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const data = await fetchFn()
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
  return data
}

// Clear cache when data is modified
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
} 