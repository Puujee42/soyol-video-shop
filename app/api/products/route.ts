import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.trim();
    const limit = parseInt(searchParams.get('limit') || '50');

    const products = await getCollection('products');
    const filter: Record<string, unknown> = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    const results = await products
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const mappedResults = results.map((product) => ({
      ...product,
      id: product._id.toString(),
    }));

    return NextResponse.json(
      { products: mappedResults, nextCursor: null, hasMore: false },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('[Products API] Error:', err.message);

    return NextResponse.json(
      { products: [], nextCursor: null, hasMore: false },
      { status: 200 }
    );
  }
}
