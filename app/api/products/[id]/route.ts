import { NextRequest, NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const { getCollection } = await import('@/lib/mongodb');
    const { ObjectId } = await import('mongodb');

    const products = await getCollection('products');
    let query = {};
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      // If ID is not a valid ObjectId, try finding by other means or return 404
      // For now, assuming it might be a string ID or failure
      return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }

    const product = await products.findOne(query);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
