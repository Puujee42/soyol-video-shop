import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/** Connection-related errors: return 200 + empty products so UI doesn't break */
function isConnectionError(error: unknown): boolean {
  if (error instanceof Error) {
    if (error.name === 'PrismaClientInitializationError') return true;
    const msg = error.message.toLowerCase();
    return msg.includes("can't reach database") || msg.includes('connection') || msg.includes('econnrefused') || msg.includes('timeout');
  }
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.trim();
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(
      { products, nextCursor: null, hasMore: false },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const isConn = isConnectionError(error);

    if (isConn) {
      console.warn('[Products API] Database unreachable. Returning empty list.', {
        name: err.name,
        message: err.message,
      });
      return NextResponse.json(
        { products: [], nextCursor: null, hasMore: false, connectionError: true },
        { status: 200 }
      );
    }

    console.error('[Products API] Database error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
