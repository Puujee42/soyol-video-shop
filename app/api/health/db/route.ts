import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/health/db — Diagnostic: test database connection.
 * Returns { ok: true } or { ok: false, error: string }.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const envOk = !!process.env.DATABASE_URL;
  if (!envOk) {
    return NextResponse.json(
      { ok: false, error: 'DATABASE_URL is not set in environment' },
      { status: 503 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Health DB] Connection failed:', message);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 }
    );
  }
}
