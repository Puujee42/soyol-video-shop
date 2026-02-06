import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Enable caching for this route (categories rarely change)
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform to match the Category interface
    const transformedCategories = categories.map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      subcategories: c.subcategories.map(s => ({
        id: s.id,
        name: s.name,
      })),
    }));

    // Add cache headers (longer cache since categories change less frequently)
    return NextResponse.json(transformedCategories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
