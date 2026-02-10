import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Ensure DATABASE_URL is set (Prisma reads it from env via schema)
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  if (!process.env.DATABASE_URL) {
    console.error('[Prisma] DATABASE_URL is not set. Add it to .env from Supabase Dashboard → Project Settings → Database.');
  }
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
