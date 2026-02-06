import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Enable caching for this route
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const cursor = searchParams.get('cursor'); // Cursor-based pagination
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    
    if (category && category !== 'all') {
      where.categoryId = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }

    // Cursor-based pagination (more efficient than offset)
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1, // Fetch one extra to check if there are more
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor
      }),
    });

    // Check if there are more products
    const hasMore = products.length > limit;
    const returnProducts = hasMore ? products.slice(0, -1) : products;
    
    // Transform to match the Product interface
    const transformedProducts = returnProducts.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.price,
      rating: p.rating,
      category: p.categoryId,
      featured: p.featured,
      wholesale: p.wholesale,
    }));

    // Get next cursor (last product's ID)
    const nextCursor = hasMore ? returnProducts[returnProducts.length - 1].id : null;

    // Add cache headers (CDN-friendly)
    return NextResponse.json({
      products: transformedProducts,
      nextCursor,
      hasMore,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
