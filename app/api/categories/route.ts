import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export const revalidate = 300;

export async function GET() {
  try {
    const categories = await getCollection('categories');
    const results = await categories.find({}).toArray();

    if (results.length === 0) {
      // Fallback mock categories if DB is empty
      return NextResponse.json(
        [
          { id: '1', name: 'Electronics', icon: 'laptop', subcategories: [] },
          { id: '2', name: 'Fashion', icon: 'shirt', subcategories: [] },
          { id: '3', name: 'Home', icon: 'home', subcategories: [] },
          { id: '4', name: 'Beauty', icon: 'sparkles', subcategories: [] },
        ],
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    }

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return NextResponse.json(
      [
        { id: '1', name: 'Electronics', icon: 'laptop', subcategories: [] },
        { id: '2', name: 'Fashion', icon: 'shirt', subcategories: [] },
        { id: '3', name: 'Home', icon: 'home', subcategories: [] },
        { id: '4', name: 'Beauty', icon: 'sparkles', subcategories: [] },
      ],
      { status: 200 }
    );
  }
}
